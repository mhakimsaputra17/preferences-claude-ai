import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../store/toastSlice";
import { updatePreferences } from "../store/preferencesSlice";
import { useTranslation } from "react-i18next";

/**
 * Hook to handle Claude AI integration
 * Listens for Claude's actions and updates the UI accordingly
 */
const useClaudeIntegration = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [claudeActive, setClaudeActive] = useState(false);

  // Setup listener for messages from Claude (via window event)
  useEffect(() => {
    const handleClaudeAction = (event) => {
      // Only process events from Claude
      if (!event.data || event.data.source !== "claude-desktop") {
        return;
      }

      setClaudeActive(true);

      const { action, data } = event.data;

      // Handle different Claude actions
      switch (action) {
        case "preferences-updated":
          handlePreferencesUpdate(data);
          break;
        case "login-success":
          handleLoginSuccess();
          break;
        default:
          console.log("Unknown Claude action:", action);
      }
    };

    // Add event listener for messages from Claude
    window.addEventListener("message", handleClaudeAction);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("message", handleClaudeAction);
    };
  }, [dispatch, t]);

  // Handle preferences update from Claude
  const handlePreferencesUpdate = (preferencesData) => {
    if (!preferencesData) return;

    // Update the Redux store with new preferences from Claude
    dispatch(updatePreferences(preferencesData));

    // Show toast notification
    dispatch(
      showToast({
        type: "info",
        title: t("claude.preferences.updated"),
        message: t("claude.preferences.updatedBy"),
        duration: 4000,
      })
    );
  };

  // Handle login success from Claude
  const handleLoginSuccess = () => {
    dispatch(
      showToast({
        type: "success",
        title: t("claude.auth.loginSuccess"),
        message: t("claude.auth.loginByAssistant"),
        duration: 3000,
      })
    );
  };

  return { claudeActive };
};

export default useClaudeIntegration;
