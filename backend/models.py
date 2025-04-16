from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationship with preferences
    preferences = relationship("Preferences", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Preferences(Base):
    __tablename__ = "preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    theme = Column(String, default="light")
    language = Column(String, default="english")
    notifications = Column(Boolean, default=True)
    
    # Relationship with user
    user = relationship("User", back_populates="preferences")