"""
Claude Desktop Integration for Preferences Management
This FastMCP server provides tools for Claude to interact with the preferences API.
"""

from fastmcp import FastMCP, Context
import httpx
import os
from typing import Optional, Literal
from pydantic import BaseModel

# Create a FastMCP server
mcp = FastMCP("Preferences Assistant")

# API settings
API_URL = os.getenv("API_URL", "http://localhost:8000")
HEADERS = {"Content-Type": "application/json"}

# Auth token storage (Note: In production, use a more secure method)
# This is a simple way to maintain token between calls in the same session
AUTH_TOKEN = None


class PreferencesUpdate(BaseModel):
    """Model for updating user preferences"""
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications: Optional[bool] = None


@mcp.tool()
async def login(username: str, password: str) -> dict:
    """
    Login to the preferences system with username and password.
    Returns authentication status and message.
    """
    global AUTH_TOKEN
    
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
                return {
                    "status": "success",
                    "message": "Login successful. You can now check or update your preferences."
                }
            else:
                return {
                    "status": "error",
                    "message": "Login failed. Please check your username and password."
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }


@mcp.tool()
async def get_preferences(ctx: Context) -> dict:
    """
    Get the current user preferences.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
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
                await ctx.error(f"Failed to fetch preferences: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to fetch preferences. Your session might have expired."
                }
        except Exception as e:
            await ctx.error(f"Exception when fetching preferences: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }


@mcp.tool()
async def update_theme(theme: Literal["light", "dark"], ctx: Context) -> dict:
    """
    Update the user's theme preference.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
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
                return {
                    "status": "success",
                    "message": f"Theme updated to '{theme}'."
                }
            else:
                await ctx.error(f"Failed to update theme: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update theme. Your session might have expired."
                }
        except Exception as e:
            await ctx.error(f"Exception when updating theme: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }


@mcp.tool()
async def update_language(language: str, ctx: Context) -> dict:
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
                return {
                    "status": "success",
                    "message": f"Language updated to '{language}'."
                }
            else:
                await ctx.error(f"Failed to update language: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update language. Your session might have expired."
                }
        except Exception as e:
            await ctx.error(f"Exception when updating language: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }


@mcp.tool()
async def toggle_notifications(enabled: bool, ctx: Context) -> dict:
    """
    Enable or disable notifications.
    User must be logged in first.
    """
    if not AUTH_TOKEN:
        return {
            "status": "error",
            "message": "You need to login first. Please use the login tool."
        }
    
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
                return {
                    "status": "success",
                    "message": f"Notifications {status}."
                }
            else:
                await ctx.error(f"Failed to update notifications: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update notifications. Your session might have expired."
                }
        except Exception as e:
            await ctx.error(f"Exception when updating notifications: {str(e)}")
            return {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }


@mcp.tool()
async def update_all_preferences(
    theme: Optional[Literal["light", "dark"]] = None,
    language: Optional[str] = None,
    notifications: Optional[bool] = None,
    ctx: Context = Context()
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
                
                return {
                    "status": "success",
                    "message": f"Updated {update_text}.",
                    "updated_preferences": response.json()
                }
            else:
                await ctx.error(f"Failed to update preferences: {response.text}")
                return {
                    "status": "error",
                    "message": "Failed to update preferences. Your session might have expired."
                }
        except Exception as e:
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


if __name__ == "__main__":
    # This will make the server available for Claude Desktop
    mcp.run()