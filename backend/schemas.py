from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    username: Optional[str] = None

# Preferences schemas
class PreferencesBase(BaseModel):
    theme: str = "light"
    language: str = "english"
    notifications: bool = True

class PreferencesCreate(PreferencesBase):
    pass

class PreferencesUpdate(PreferencesBase):
    pass

class Preferences(PreferencesBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

# Extend User schema to include preferences
class UserWithPreferences(User):
    preferences: Optional[Preferences] = None
    
    class Config:
        orm_mode = True