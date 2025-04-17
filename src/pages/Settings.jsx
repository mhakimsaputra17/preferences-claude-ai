import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPreferences,
  updatePreferences,
  applyTheme,
  applyLanguageChange,
} from "../store/preferencesSlice";
import { Sun, Moon, Bell, BellOff, Globe, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/Layout/AppLayout";
import { showToast } from "../store/toastSlice";
import { addNotification } from "../store/notificationsSlice";

function Settings() {
  const { preferences, status } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const isLoading = status === "loading";
  const { t } = useTranslation();

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
      dispatch(applyTheme(value));
    }

    // For language changes, apply immediately
    if (key === "language") {
      console.log("Language change clicked:", value);
      dispatch(applyLanguageChange(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting preferences:", formPreferences);
      dispatch(updatePreferences(formPreferences))
        .unwrap()
        .then(() => {
          dispatch(
            showToast({
              type: "success",
              message: t("settings.successMessage"),
              duration: 3000,
            })
          );

          dispatch(
            addNotification({
              title: t("settings.notification.updateTitle"),
              message: t("settings.notification.updateSuccess"),
              titleKey: "settings.notification.updateTitle",
              messageKey: "settings.notification.updateSuccess",
              type: "success",
            })
          );
        })
        .catch(() => {
          dispatch(
            showToast({
              type: "error",
              message: t("settings.errorMessage"),
              duration: 4000,
            })
          );
        });
    } catch (error) {
      dispatch(
        showToast({
          type: "error",
          message: t("settings.errorMessage"),
          duration: 4000,
        })
      );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t("settings.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your application preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t("settings.theme.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleChange("theme", "light")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.theme === "light"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Sun size={24} className="text-yellow-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.theme.light")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("theme", "dark")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.theme === "dark"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Moon size={24} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.theme.dark")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("theme", "system")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.theme === "system"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Monitor
                  size={24}
                  className="text-gray-600 dark:text-gray-400"
                />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.theme.system")}
                </span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t("settings.language.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => handleChange("language", "english")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.language === "english"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Globe size={24} className="text-blue-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.language.english")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("language", "spanish")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.language === "spanish"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Globe size={24} className="text-green-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.language.spanish")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("language", "french")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.language === "french"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Globe size={24} className="text-red-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.language.french")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleChange("language", "german")}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg border transition-all duration-200 ${
                  formPreferences.language === "german"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Globe size={24} className="text-yellow-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {t("settings.language.german")}
                </span>
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t("settings.notifications.title")}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() =>
                  handleChange("notifications", !formPreferences.notifications)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formPreferences.notifications
                    ? "bg-teal-500"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
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
                    ? t("settings.notifications.enabled")
                    : t("settings.notifications.disabled")}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${
                isLoading
                  ? "opacity-90 cursor-not-allowed"
                  : "transform hover:-translate-y-0.5"
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
                  {t("settings.saving")}
                </>
              ) : (
                t("settings.saveButton")
              )}
            </button>
          </div>

          {/* Debug Information - only in development
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <details>
                <summary className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Debug Information
                </summary>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Current theme (form): {formPreferences.theme}</p>
                  <p>Current theme (redux): {preferences.theme}</p>
                  <p>Current language (form): {formPreferences.language}</p>
                  <p>Current language (redux): {preferences.language}</p>
                  <p>Redux state status: {status}</p>
                  <p>
                    localStorage theme:{" "}
                    {localStorage.getItem("userTheme") || "not set"}
                  </p>
                  <p>
                    localStorage language:{" "}
                    {localStorage.getItem("userLanguage") || "not set"}
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
                </div>
              </details>
            </div>
          )} */}
        </form>
      </div>
    </AppLayout>
  );
}

export default Settings;
