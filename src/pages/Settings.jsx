import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPreferences,
  updatePreferences,
  applyTheme,
} from "../store/preferencesSlice";
import { Sun, Moon, Bell, BellOff, Globe, Monitor } from "lucide-react";

function Settings() {
  const { preferences, status } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ type: "", text: "" });
  const isLoading = status === "loading";

  // Fetch preferences when component mounts
  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  // Copy preferences to local state to track form changes
  const [formPreferences, setFormPreferences] = useState({ ...preferences });

  // Make sure formPreferences are updated when preferences change
  useEffect(() => {
    setFormPreferences({ ...preferences });
  }, [preferences]);

  const handleChange = (key, value) => {
    setFormPreferences((prev) => ({ ...prev, [key]: value }));

    // For theme changes, apply immediately for better user feedback
    if (key === "theme") {
      console.log("Theme change clicked:", value);
      applyThemePreview(value);
    }
  };

  // Function to apply theme preview
  const applyThemePreview = (theme) => {
    console.log("Previewing theme:", theme);
    dispatch(applyTheme(theme));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting preferences:", formPreferences);
      dispatch(updatePreferences(formPreferences))
        .unwrap()
        .then(() => {
          setMessage({
            type: "success",
            text: "Preferences updated successfully!",
          });
        })
        .catch(() => {
          setMessage({
            type: "error",
            text: "Failed to update preferences.",
          });
        });
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating preferences.",
      });
    } finally {
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 p-4 dark:from-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-10 transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Theme Selection */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Theme
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => handleChange("theme", "light")}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formPreferences.theme === "light"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-200`}
              >
                <Sun size={24} className="text-yellow-500" />
                <span className="font-medium dark:text-white">Light</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("theme", "dark")}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formPreferences.theme === "dark"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-200`}
              >
                <Moon size={24} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium dark:text-white">Dark</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("theme", "system")}
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formPreferences.theme === "system"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-200`}
              >
                <Monitor
                  size={24}
                  className="text-gray-600 dark:text-gray-400"
                />
                <span className="font-medium dark:text-white">System</span>
              </button>
            </div>

            {/* Direct theme test buttons */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Theme Directly
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  onClick={() => {
                    document.documentElement.classList.add("dark");
                    console.log("Forced dark mode");
                  }}
                >
                  Force Dark
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  onClick={() => {
                    document.documentElement.classList.remove("dark");
                    console.log("Forced light mode");
                  }}
                >
                  Force Light
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  onClick={() => {
                    console.log(
                      "Current HTML classes:",
                      document.documentElement.className
                    );
                    console.log(
                      "Dark class present:",
                      document.documentElement.classList.contains("dark")
                    );
                    console.log(
                      "System prefers dark:",
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                    );
                  }}
                >
                  Log State
                </button>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Language
            </h2>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Globe size={20} className="text-gray-500 mr-2" />
                <select
                  value={formPreferences.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 block w-full max-w-xs focus:ring-teal-500 focus:border-teal-500 dark:text-white transition-colors duration-200"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Notifications
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() =>
                  handleChange("notifications", !formPreferences.notifications)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  formPreferences.notifications
                    ? "bg-teal-500"
                    : "bg-gray-300 dark:bg-gray-700"
                } transition-colors duration-300`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formPreferences.notifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <div className="flex items-center">
                {formPreferences.notifications ? (
                  <Bell size={20} className="text-teal-500 mr-2" />
                ) : (
                  <BellOff size={20} className="text-gray-500 mr-2" />
                )}
                <span className="text-gray-700 dark:text-gray-200">
                  {formPreferences.notifications
                    ? "Notifications enabled"
                    : "Notifications disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${
                isLoading ? "opacity-90" : "transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>

          {/* Status Message */}
          {message.text && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              } transition-all duration-300`}
            >
              {message.text}
            </div>
          )}

          {/* Debug Information */}
          <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Debug Information
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Current theme (form): {formPreferences.theme}</p>
              <p>Current theme (redux): {preferences.theme}</p>
              <p>Redux state status: {status}</p>
              <p>
                localStorage theme:{" "}
                {localStorage.getItem("userTheme") || "not set"}
              </p>
              <p>
                Dark class present:{" "}
                {document.documentElement.classList.contains("dark")
                  ? "Yes"
                  : "No"}
              </p>
              <p>
                System prefers dark:{" "}
                {window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "Yes"
                  : "No"}
              </p>
              <p>
                HTML classes:{" "}
                <span className="text-xs">
                  {document.documentElement.className}
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
