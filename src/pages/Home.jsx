import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { fetchPreferences } from "../store/preferencesSlice";
import { useTranslation } from "react-i18next";
import {
  User,
  Bell,
  Moon,
  Settings as SettingsIcon,
  Check,
} from "lucide-react";
import AppLayout from "../components/Layout/AppLayout";
import { addNotification } from "../store/notificationsSlice";
import { showToast } from "../store/toastSlice";

function Home() {
  const { user } = useAuth();
  const { preferences } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // useEffect(() => {
  //   dispatch(
  //     showToast({
  //       type: "success",
  //       message: "Successfully logged in to your dashboard",
  //       duration: 4000,
  //     })
  //   );
  // }, [dispatch]);

  // Function to add a test notification
  const addTestNotification = () => {
    dispatch(
      addNotification({
        title: t("notifications.newFeatureTitle"),
        message: t("notifications.newFeatureMessage"),
        titleKey: "notifications.newFeatureTitle",
        messageKey: "notifications.newFeatureMessage",
        type: "info",
      })
    );

    dispatch(
      showToast({
        type: "info",
        message: t("toast.notificationAdded"),
        duration: 3000,
      })
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t("home.welcome")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's an overview of your account and preferences.
          </p>
        </div>

        {/* User Profile */}
        {user && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-full p-1 mr-3">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t("home.profile.title")}
              </h2>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("home.profile.username")}
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white text-sm">
                    {user.username}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("home.profile.userId")}
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white text-sm">
                    {user.user_id}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("home.profile.status")}
                  </dt>
                  <dd className="mt-1 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <Check size={12} className="mr-1" />
                          {t("home.profile.active")}
                        </>
                      ) : (
                        t("home.profile.inactive")
                      )}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full p-1 mr-3">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {t("home.preferences.title")}
            </h2>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("home.preferences.theme")}
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        preferences.theme === "light"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          : preferences.theme === "dark"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {preferences.theme}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("home.preferences.language")}
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {t(`settings.language.${preferences.language}`)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("home.preferences.notifications")}
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      preferences.notifications
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {preferences.notifications
                      ? t("home.preferences.enabled")
                      : t("home.preferences.disabled")}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Home;
