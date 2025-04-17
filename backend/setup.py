"""
Setup script to install dependencies for the backend
This will fix the bcrypt and passlib compatibility issue
"""

import subprocess
import sys

def setup_environment():
    """Install the correct dependencies"""
    print("Installing dependencies...")
    
    # List of packages with specific versions
    packages = [
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "sqlalchemy==2.0.23",
        "pydantic==2.4.2",
        "python-jose[cryptography]==3.3.0",
        "python-dotenv==1.0.0",
        "python-multipart==0.0.6",
        "httpx==0.25.1",
        "fastmcp==0.1.0",
        "passlib==1.7.4",
        "bcrypt==4.0.1",  # Use this specific version to fix compatibility
    ]
    
    # Install packages
    for package in packages:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    
    print("\nAll dependencies installed successfully.")
    print("\nIf you still see the bcrypt error, try reinstalling bcrypt only:")
    print("pip uninstall -y bcrypt")
    print("pip install bcrypt==4.0.1")

if __name__ == "__main__":
    setup_environment()
