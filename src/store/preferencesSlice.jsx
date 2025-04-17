import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// WebSocket connection for real-time updates
let socket = null;
let reconnectTimer = null;

// Create WebSocket connection
const setupWebSocket = (userId, dispatch) => {
  if (socket) {
    socket.close();
  }

  const clientId = `user_${userId}_${Date.now()}`;
  socket = new WebSocket(`ws://localhost:8000/ws/preferences/${clientId}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
    // Clear any reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "preferences_updated") {
        // Update Redux store with new preferences
        dispatch(updatePreferencesFromWs(data.data));

        // Apply the theme immediately
        if (data.data.theme) {
          dispatch(applyTheme(data.data.theme));
        }

        // Apply the language immediately
        if (data.data.language) {
          dispatch(applyLanguageChange(data.data.language));
        }
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    // Attempt to reconnect after 5 seconds
    reconnectTimer = setTimeout(() => {
      setupWebSocket(userId, dispatch);
    }, 5000);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Disconnect WebSocket
const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

// Existing thunks for fetching and updating preferences
export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await fetch("http://localhost:8000/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to fetch preferences");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePreferences = createAsyncThunk(
  "preferences/updatePreferences",
  async (updatedPreferences, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await fetch("http://localhost:8000/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPreferences),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to update preferences");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Theme application function
export const applyTheme = (theme) => (dispatch) => {
  // Apply theme to localStorage
  localStorage.setItem("userTheme", theme);

  // Remove dark class first
  document.documentElement.classList.remove("dark");

  // Apply the theme
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "system") {
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }

  // Update state to reflect current theme
  dispatch(preferencesSlice.actions.setTheme(theme));
};

// Language application function
export const applyLanguageChange = (language) => (dispatch) => {
  // Apply language to localStorage
  localStorage.setItem("userLanguage", language);

  // Update state to reflect current language
  dispatch(preferencesSlice.actions.setLanguage(language));
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    preferences: {
      theme: localStorage.getItem("userTheme") || "light",
      language: localStorage.getItem("userLanguage") || "english",
      notifications: true,
    },
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    wsConnected: false,
  },
  reducers: {
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    setWebSocketConnected: (state, action) => {
      state.wsConnected = action.payload;
    },
    updatePreferencesFromWs: (state, action) => {
      state.preferences = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchPreferences
    builder.addCase(fetchPreferences.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchPreferences.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.preferences = action.payload;
      // Connect to WebSocket when preferences are loaded
      if (action.payload && action.payload.user_id) {
        setupWebSocket(action.payload.user_id, action.asyncDispatch);
        state.wsConnected = true;
      }
    });
    builder.addCase(fetchPreferences.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Handle updatePreferences
    builder.addCase(updatePreferences.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updatePreferences.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.preferences = action.payload;
    });
    builder.addCase(updatePreferences.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const {
  setTheme,
  setLanguage,
  setWebSocketConnected,
  updatePreferencesFromWs,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
