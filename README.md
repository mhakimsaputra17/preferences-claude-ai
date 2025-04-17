# 🎛️ Claude AI Preferences Manager

<div align="center">
  
![Claude AI Preferences Manager](https://img.shields.io/badge/Claude%20AI-Preferences%20Manager-5A67D8?style=for-the-badge)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Claude](https://img.shields.io/badge/Claude-Integration-5A67D8?logo=anthropic)](https://claude.ai)

A comprehensive user preferences manager with Claude AI integration, enabling both web UI and AI assistant control over user preferences.

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Claude Desktop Setup](#claude-desktop-setup)
- [Usage Guide](#-usage-guide)
  - [Web Interface](#web-interface)
  - [API Endpoints](#api-endpoints)
  - [Claude Integration](#claude-integration)
- [Testing Preferences Features](#-testing-preferences-features)
- [Limitations and Assumptions](#-limitations-and-assumptions)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview

The Claude AI Preferences Manager is a full-stack application that allows users to manage their preferences (theme, language, notifications) through both a modern web interface and natural language commands with Claude AI.

Key features include:

- 🔐 User authentication system
- 🌙 Light/dark/system theme preferences
- 🌐 Multi-language support (English, Spanish, French, German)
- 🔔 Notification toggles
- 🤖 Claude AI integration for conversational preference management
- ⚠️ ~~Real-time updates via WebSockets~~ (Coming soon)

> **Note**: Real-time synchronization between Claude Desktop and the web interface is currently under development and not fully functional in this version.

This application demonstrates how web applications can be enhanced with AI assistants that manipulate the same underlying data as the traditional UI, creating a seamless dual-interface experience.

## 🏛 Architecture

The application follows a modern, layered architecture:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│  FastAPI Backend│◄────►│  SQLite Database│
│                 │      │                 │      │                 │
└────────┬────────┘      └────────┬────────┘      └─────────────────┘
         │                        │
         │                        │
         │                ┌───────▼──────┐
         │                │              │
         └───────────────►│  Claude MCP  │
                          │  Integration │
                          │              │
                          └──────────────┘
```

- **Frontend**: React-based SPA with Redux for state management
- **Backend**: FastAPI Python server exposing REST endpoints and WebSocket connections
- **Database**: SQLite for data persistence
- **Claude Integration**: FastMCP server that connects Claude Desktop to the API

The system uses WebSockets to ensure real-time updates across all interfaces, meaning changes made through Claude are immediately reflected in the web UI and vice versa.

## 🛠 Technology Stack

### Frontend

- ⚛️ **React 18** - UI library
- 🚀 **Vite** - Build tool
- 📊 **Redux Toolkit** - State management
- 🧩 **React Router** - Navigation
- 💅 **Tailwind CSS** - Styling
- 🌐 **i18next** - Internationalization
- 🔄 **WebSockets** - Real-time updates

### Backend

- 🐍 **Python 3.9+** - Programming language
- 🚀 **FastAPI** - Web framework
- 🔐 **JWT** - Authentication
- 🗃️ **SQLAlchemy** - ORM
- 📊 **Pydantic** - Data validation
- 🌐 **WebSockets** - Real-time communication

### Claude Integration

- 🧠 **Claude AI** - Large language model assistant
- 🔌 **FastMCP** - Claude Model Control Protocol implementation
- 🌐 **httpx** - HTTP client for API calls

## 🚀 Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- Claude Desktop (for AI integration)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/preferences-claude-ai.git
   cd preferences-claude-ai
   ```

2. Set up a Python virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
   then
   ```bash
   pip install -r requirements_claude.txt
   ```

5. Create and configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

6. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:

   ```bash
   cd ../
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

### Claude Desktop Setup

1. Install Claude Desktop from [claude.ai/desktop](https://claude.ai/download)

2. **Log in to your Claude account** in the desktop application

3. **Enable Developer Mode**:

   - Open Claude Desktop
   - Navigate to Settings (gear icon)
   - Enable the Developer Mode option

4. **Configure the MCP connection**:

   - Go to Settings > Developer tab
   - Locate the `claude_desktop_config.json` file reference
   - Click "Edit Config" to see the configuration file location

5. **Install the MCP server configuration**:

   ```bash
   cd backend
   # This command will automatically generate the necessary config in claude_desktop_config.json
   fastmcp install mcp_server.py
   ```

6. **Run the MCP server**:

   ```bash
   # Development mode with auto-reload
   fastmcp dev mcp_server.py

   # OR Production mode
   fastmcp run mcp_server.py
   ```

7. **Restart Claude Desktop**:

   - On Windows: End the task via Task Manager
   - On macOS: Force quit the application
   - Then restart Claude Desktop

8. Claude will now be connected to the preferences system and can respond to preference-related requests


## 📖 Usage Guide

### Web Interface

The web interface provides a user-friendly way to manage preferences:

1. Register or login to your account
2. Navigate to the Settings page
3. Adjust theme, language, and notification preferences
4. Changes are automatically saved and applied

### API Endpoints

The backend exposes the following key endpoints:

#### Authentication

- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Authenticate and receive a JWT token
- `GET /auth/validate-token` - Verify if a token is valid

#### Preferences

- `GET /preferences` - Retrieve user preferences
- `POST /preferences` - Update user preferences

#### WebSocket

- `WebSocket /ws/preferences/{client_id}` - Connect for real-time updates

Full API documentation is available at `http://localhost:8000/docs` when the backend is running.

### Claude Integration

Claude can be used to manage preferences through natural language:

1. Ensure the MCP server is running (`fastmcp run mcp_server.py`)
2. Connect Claude Desktop to the server
3. Ask Claude to perform actions like:

   - "Login to my account with username 'user123' and password 'password123'"
   - "What are my current preferences?"
   - "Change my theme to dark mode"
   - "Switch my language to Spanish"
   - "Turn off notifications"

   <!-- Claude Interaction Examples - Will be added by user -->

  

https://github.com/user-attachments/assets/1e829469-4d2e-425b-8af7-ba53b83e3cff



## 🧪 Testing Preferences Features

To thoroughly test the preference system:

1. **Web UI Testing**:

   - Log in to the web application
   - Navigate to Settings
   - Try changing the theme between light, dark, and system
   - Switch between different languages
   - Toggle notifications on and off
   - Verify changes persist between sessions

2. **Claude Integration Testing**:

   - Connect Claude Desktop to the MCP server
   - Ask Claude to login with your credentials
   - Request Claude to change your theme
   - Verify the web UI updates after refreshing
   - Ask Claude to change your language
   - Verify the web UI reflects the language change after refreshing
   - Request Claude to toggle notifications
   - Verify the setting changes in the web UI after refreshing

  

3. **Multi-Client Testing**:
   > **Note**: Real-time synchronization between clients is under development. Currently, changes made in one client require the other client to refresh to see updates.

## ⚠️ Limitations and Assumptions

### Limitations

- 🔒 **Security**: The current implementation uses a simple JWT approach without refresh tokens
- 💾 **Database**: SQLite is used for simplicity; production would need a more robust database
- 🔐 **Claude Authentication**: The MCP server stores authentication tokens in memory, which are lost on restart
- 🌐 **Internationalization**: Only four languages are currently supported
- 📱 **Mobile Support**: The UI is responsive but not fully optimized for mobile devices
- 🔄 **Real-time Updates**: WebSocket-based real-time updates between Claude and the web UI are currently not fully functional

### Assumptions

- 🧪 **Development Environment**: The application assumes a development environment setup
- 👥 **Single User**: The Claude integration supports one user at a time
- 🖥️ **Local Deployment**: The system is designed to run locally, not in production
- 🔌 **Network**: The application assumes all components can communicate on localhost

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  Made with ❤️ and powered by Claude AI
</div>
