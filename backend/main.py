from fastapi import FastAPI, Depends, HTTPException, status, Body, WebSocket
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth
from database import engine, get_db
from datetime import timedelta
import json

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

# Clients connected to WebSocket
connected_clients = {}

# WebSocket endpoint for real-time updates
@app.websocket("/ws/preferences/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    connected_clients[client_id] = websocket
    try:
        while True:
            # Keep connection alive, waiting for messages
            data = await websocket.receive_text()
            # We could process incoming messages here if needed
    except Exception:
        if client_id in connected_clients:
            del connected_clients[client_id]

# Helper function to notify clients of preference changes
async def notify_clients(user_id: int, preferences: dict):
    """Notify all connected clients about preference changes"""
    user_clients = [cid for cid, _ in connected_clients.items() if cid.startswith(f"user_{user_id}_")]
    for client_id in user_clients:
        websocket = connected_clients.get(client_id)
        if websocket:
            try:
                await websocket.send_json({
                    "type": "preferences_updated",
                    "data": preferences
                })
            except Exception:
                # Client disconnect handling
                if client_id in connected_clients:
                    del connected_clients[client_id]

# Modify the update_preferences function to notify clients
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
        if value is not None:  # Only update non-None values
            setattr(user_preferences, key, value)
    
    db.commit()
    db.refresh(user_preferences)
    
    # Notify connected clients about the changes
    # Convert to dict for JSON serialization
    prefs_dict = {
        "id": user_preferences.id,
        "user_id": user_preferences.user_id,
        "theme": user_preferences.theme,
        "language": user_preferences.language,
        "notifications": user_preferences.notifications
    }
    
    # This runs in the background without blocking the response
    try:
        await notify_clients(current_user.id, prefs_dict)
    except Exception as e:
        # Log the error but don't fail the request
        print(f"Error notifying clients: {str(e)}")
        
    return user_preferences

# Add notification endpoint
@app.post("/notify", tags=["Notifications"],
          summary="Send notification to connected clients")
async def send_notification(
    notification: dict = Body(...),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    Send a notification to all connected clients for a specific user.
    Requires user_id and message in the request body.
    """
    user_id = notification.get("user_id")
    message = notification.get("message")
    
    if not user_id or not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both user_id and message are required"
        )
    
    # Ensure only authorized users can send notifications
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to send notifications to this user"
        )
        
    try:
        await notify_clients(user_id, message)
        return {"status": "success", "message": "Notification sent"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send notification: {str(e)}"
        )