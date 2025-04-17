"""
Claude Desktop Integration for Preferences Management
This MCP server provides tools for Claude to interact with the preferences API.
"""

from fastmcp import FastMCP, Context
import httpx
import os
import json
import asyncio
from typing import Optional, Literal, Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Create an MCP server
mcp = FastMCP("Preferences Assistant")

# API settings
API_URL = os.getenv("API_URL", "http://localhost:8000")
HEADERS = {"Content-Type": "application/json"}

# Auth token storage (Note: In production, use a more secure method)
# This is a simple way to maintain token between calls in the same session
AUTH_TOKEN = None
USER_ID = None

class PreferencesUpdate(BaseModel):
    """Model for updating user preferences"""
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications: Optional[bool] = None

# Helper function to notify frontend via WebSocket
async def notify_frontend(action: str, data: Dict[str, Any] = None):
    """Send notification to frontend through the WebSocket connection"""
    if USER_ID is None:
        return
    
    async with httpx.AsyncClient() as client:
        try:
            # Format message for frontend
            message = {
                "type": action,
                "data": data or {},
                "source": "claude-desktop"
            }
            
            # Send to WebSocket endpoint
            client_id = f"claude_bot_{USER_ID}"
            ws_url = f"ws://{API_URL.replace('http://', '')}/ws/preferences/{client_id}"
            
            # Since httpx doesn't support WebSockets directly, use it to call the API
            # This API call will forward the message to all connected clients
            response = await client.post(
                f"{API_URL}/notify",
                json={"user_id": USER_ID, "message": message},
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to notify frontend: {str(e)}")
            return False

@mcp.tool()
async def login(username: str, password: str) -> dict:
    """
    Login to the preferences system with username and password.
    Returns authentication status and message.
    """
    global AUTH_TOKEN, USER_ID
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the login API endpoint
            response = await client.post(
                f"{API_URL}/auth/login",
                data={"username": username, "password": password}
            )
            
            if response.status_code == 200:
                data = response.json()
                AUTH_TOKEN = data["access_token"]
                
                # Get user ID from token validation
                user_response = await client.get(
                    f"{API_URL}/auth/validate-token",
                    headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
                )
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    USER_ID = user_data.get("data", {}).get("user_id")
                    
                    # Notify frontend about login
                    await notify_frontend("login-success")
                
                return {
                    "status": "success",
                    "message": "Login successful. You can now check or update your preferences."
                }
            else:
                return {
                    "status": "error",
                    "message": f"Login failed: {response.json().get('detail', 'Incorrect username or password')}"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def get_preferences(ctx: Context = None) -> dict:
    """
    Get the current user preferences.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
    if ctx:
        await ctx.info("Fetching user preferences...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the preferences API endpoint with auth token
            response = await client.get(
                f"{API_URL}/preferences",
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                preferences = response.json()
                return {
                    "status": "success",
                    "preferences": {
                        "theme": preferences["theme"],
                        "language": preferences["language"],
                        "notifications": preferences["notifications"]
                    },
                    "message": "Here are your current preferences."
                }
            else:
                if ctx:
                    await ctx.error(f"Failed to fetch preferences: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to fetch preferences. Your session might have expired."
                }
        except Exception as e:
            if ctx:
                await ctx.error(f"Exception when fetching preferences: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def update_theme(theme: Literal["light", "dark", "system"], ctx: Context = None) -> dict:
    """
    Update the user's theme preference.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
    if ctx:
        await ctx.info(f"Updating theme to {theme}...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the preferences API endpoint with auth token
            response = await client.post(
                f"{API_URL}/preferences",
                json={"theme": theme},
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                # Notify frontend about theme change
                preferences_data = response.json()
                await notify_frontend("preferences-updated", preferences_data)
                
                return {
                    "status": "success",
                    "message": f"Theme updated to '{theme}'."
                }
            else:
                if ctx:
                    await ctx.error(f"Failed to update theme: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update theme. Your session might have expired."
                }
        except Exception as e:
            if ctx:
                await ctx.error(f"Exception when updating theme: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def update_language(language: str, ctx: Context = None) -> dict:
    """
    Update the user's language preference.
    Common languages: english, spanish, french, german, etc.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
    if ctx:
        await ctx.info(f"Updating language to {language}...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the preferences API endpoint with auth token
            response = await client.post(
                f"{API_URL}/preferences",
                json={"language": language.lower()},
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                # Notify frontend about language change
                preferences_data = response.json()
                await notify_frontend("preferences-updated", preferences_data)
                
                return {
                    "status": "success",
                    "message": f"Language updated to '{language}'."
                }
            else:
                if ctx:
                    await ctx.error(f"Failed to update language: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update language. Your session might have expired."
                }
        except Exception as e:
            if ctx:
                await ctx.error(f"Exception when updating language: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def toggle_notifications(enabled: bool, ctx: Context = None) -> dict:
    """
    Enable or disable notifications.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
    if ctx:
        await ctx.info(f"{'Enabling' if enabled else 'Disabling'} notifications...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the preferences API endpoint with auth token
            response = await client.post(
                f"{API_URL}/preferences",
                json={"notifications": enabled},
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                status = "enabled" if enabled else "disabled"
                # Notify frontend about notifications change
                preferences_data = response.json()
                await notify_frontend("preferences-updated", preferences_data)
                
                return {
                    "status": "success",
                    "message": f"Notifications {status}."
                }
            else:
                if ctx:
                    await ctx.error(f"Failed to update notifications: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update notifications. Your session might have expired."
                }
        except Exception as e:
            if ctx:
                await ctx.error(f"Exception when updating notifications: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def update_all_preferences(
    theme: Optional[Literal["light", "dark", "system"]] = None,
    language: Optional[str] = None,
    notifications: Optional[bool] = None,
    ctx: Context = None
) -> dict:
    """
    Update multiple preferences at once.
    Set any preference to None to keep its current value.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
    if ctx:
        await ctx.info("Updating multiple preferences...")
    
    # Create update payload with only non-None values
    update_data = {}
    if theme is not None:
        update_data["theme"] = theme
    if language is not None:
        update_data["language"] = language
    if notifications is not None:
        update_data["notifications"] = notifications
    
    if not update_data:
        return {
            "status": "error",
            "message": "No preferences specified to update."
        }
    
    async with httpx.AsyncClient() as client:
        try:
            # Call the preferences API endpoint with auth token
            response = await client.post(
                f"{API_URL}/preferences",
                json=update_data,
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                # Build response message
                updates = []
                if theme is not None:
                    updates.append(f"theme to '{theme}'")
                if language is not None:
                    updates.append(f"language to '{language}'")
                if notifications is not None:
                    updates.append(f"notifications to {'enabled' if notifications else 'disabled'}")
                
                update_text = ", ".join(updates)
                
                # Notify frontend about multiple preferences update
                preferences_data = response.json()
                await notify_frontend("preferences-updated", preferences_data)
                
                return {
                    "status": "success",
                    "message": f"Updated {update_text}.",
                    "updated_preferences": preferences_data
                }
            else:
                if ctx:
                    await ctx.error(f"Failed to update preferences: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update preferences. Your session might have expired."
                }
        except Exception as e:
            if ctx:
                await ctx.error(f"Exception when updating preferences: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.tool()
async def validate_token() -> dict:
    """
    Check if the current auth token is valid.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "No authentication token available. Please login first."
        }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{API_URL}/auth/validate-token",
                headers={**HEADERS, "Authorization": f"Bearer {AUTH_TOKEN}"}
            )
            
            if response.status_code == 200:
                return {
                    "status": "success",
                    "message": "Your session is active.",
                    "data": response.json()
                }
            else:
                return {
                    "status": "error",
                    "message": "Your session has expired. Please login again."
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }

@mcp.prompt()
def help_prompt() -> str:
    """Provides help information about the preferences system"""
    return """
    I can help you manage your preferences in the application. Here's what you can do:
    
    1. Login to your account:
       Example: "Login to my account" or "I need to sign in"
    
    2. View your current preferences:
       Example: "Show my preferences" or "What are my current settings?"
    
    3. Change your theme:
       Example: "Change my theme to dark mode" or "I want to use light theme"
    
    4. Change your language:
       Example: "Switch language to Spanish" or "Change my language to French"
    
    5. Manage notifications:
       Example: "Turn off notifications" or "Enable notifications"
    
    6. Update multiple settings at once:
       Example: "Set my theme to dark and language to German"
    
    7. Check if your session is valid:
       Example: "Is my session still active?"
    
    How can I help you with your preferences today?
    """

if __name__ == "__main__":
    # This will make the server available for Claude Desktop
    mcp.run()