import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import i18n from "../i18n/i18n";

const API_BASE_URL = "http://localhost:8000";

// Default preferences with light theme explicitly set
const defaultPreferences = {
  theme: "light",
  language: "english",
  notifications: true,
};

// This function applies theme according to Tailwind CSS guidelines
export const applyThemeClass = (theme) => {
  // For Tailwind, we only need to toggle the 'dark' class
  // Light mode doesn't need a class, it's the default
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Save to localStorage for persistence
  localStorage.setItem("userTheme", theme);

  console.log(
    "Theme applied:",
    theme,
    "- Dark class present:",
    document.documentElement.classList.contains("dark")
  );
};

// This function changes the language using i18next
export const applyLanguage = (language) => {
  i18n.changeLanguage(language);
  // Save to localStorage for persistence
  localStorage.setItem("userLanguage", language);
  console.log("Language applied:", language);
};

// Async thunks
export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Apply default theme (light) and language if no token exists
      applyThemeClass(defaultPreferences.theme);
      applyLanguage(defaultPreferences.language);
      return defaultPreferences;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        applyThemeClass(data.theme);
        applyLanguage(data.language);
        return data;
      } else {
        // If preferences don't exist yet, use defaults
        applyThemeClass(defaultPreferences.theme);
        applyLanguage(defaultPreferences.language);
        return defaultPreferences;
      }
    } catch (error) {
      console.error("Failed to fetch preferences", error);
      applyThemeClass(defaultPreferences.theme);
      applyLanguage(defaultPreferences.language);
      return rejectWithValue("Failed to fetch preferences");
    }
  }
);

export const updatePreferences = createAsyncThunk(
  "preferences/updatePreferences",
  async (newPreferences, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        const data = await response.json();
        applyThemeClass(data.theme);
        applyLanguage(data.language);
        return data;
      }
      return rejectWithValue("Failed to update preferences");
    } catch (error) {
      console.error("Failed to update preferences", error);
      return rejectWithValue("Failed to update preferences");
    }
  }
);

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    preferences: defaultPreferences,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    claudeActive: false, // New state to track Claude activity
  },
  reducers: {
    applyTheme: (state, action) => {
      applyThemeClass(action.payload);
    },
    applyLanguageChange: (state, action) => {
      applyLanguage(action.payload);
      state.preferences.language = action.payload;
    },
    // Track Claude activity
    setClaudeActive: (state, action) => {
      state.claudeActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  applyTheme,
  applyLanguageChange,
  setClaudeActive, // Export new action
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
