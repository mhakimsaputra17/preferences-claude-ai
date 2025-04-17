import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreferences } from "../../store/preferencesSlice";
import Toast from "../Toast/Toast";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import useClaudeIntegration from "../../hooks/useClaudeIntegration";
import { Info } from "lucide-react";

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { preferences } = useSelector((state) => state.preferences);
  const { user } = useAuth();
  const { claudeActive } = useClaudeIntegration();

  useEffect(() => {
    // Fetch preferences when the component mounts
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    // This ensures the i18n language matches the preference language
    if (preferences?.language && i18n.language !== preferences.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences?.language, i18n]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      {claudeActive && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 px-4 py-2 flex items-center justify-center text-sm text-blue-700 dark:text-blue-300">
          <Info className="h-5 w-5 mr-2" />
          Claude Assistant is managing your preferences
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toast />
    </div>
  );
};

export default AppLayout;
