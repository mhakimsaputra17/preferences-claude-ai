from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth
from database import engine, get_db
from datetime import timedelta

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Authentication API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=schemas.User, tags=["Authentication"], 
          summary="Register a new user")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token, tags=["Authentication"],
          summary="Login to obtain access token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "expires_in": auth.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.get("/users/profile", response_model=schemas.User, tags=["Users"],
         summary="Get current user profile")
async def get_user_profile(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.get("/auth/validate-token", tags=["Authentication"],
         summary="Validate if the current token is valid")
async def validate_token(current_user: models.User = Depends(auth.get_current_active_user)):
    return {
        "status": "success",
        "message": "Token is valid",
        "data": {
            "user_id": current_user.id,
            "username": current_user.username,
            "is_active": current_user.is_active
        }
    }

@app.get("/preferences", response_model=schemas.Preferences, tags=["Preferences"],
         summary="Get user preferences")
async def get_preferences(current_user: models.User = Depends(auth.get_current_active_user),
                         db: Session = Depends(get_db)):
    """
    Retrieve the preferences for the current logged-in user.
    """
    # Check if user has preferences already
    user_preferences = db.query(models.Preferences).filter(
        models.Preferences.user_id == current_user.id
    ).first()
    
    # If not, create default preferences
    if not user_preferences:
        user_preferences = models.Preferences(user_id=current_user.id)
        db.add(user_preferences)
        db.commit()
        db.refresh(user_preferences)
        
    return user_preferences

@app.post("/preferences", response_model=schemas.Preferences, tags=["Preferences"],
          summary="Update user preferences")
async def update_preferences(
    preferences: schemas.PreferencesUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update preferences for the current logged-in user.
    """
    # Get current preferences
    user_preferences = db.query(models.Preferences).filter(
        models.Preferences.user_id == current_user.id
    ).first()
    
    # If no preferences exist yet, create them
    if not user_preferences:
        user_preferences = models.Preferences(user_id=current_user.id)
        db.add(user_preferences)
    
    # Update preferences with new values
    for key, value in preferences.dict().items():
        setattr(user_preferences, key, value)
    
    db.commit()
    db.refresh(user_preferences)
    return user_preferences