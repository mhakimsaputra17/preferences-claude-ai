import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreferences } from "../../store/preferencesSlice";
import Toast from "../Toast/Toast";
import { useTranslation } from "react-i18next";

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { preferences } = useSelector((state) => state.preferences);

  useEffect(() => {
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
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toast />
    </div>
  );
};

export default AppLayout;
