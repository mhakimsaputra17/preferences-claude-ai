import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { fetchPreferences } from "../store/preferencesSlice";
import { Link } from "react-router";
import { Settings as SettingsIcon } from "lucide-react";

function Home() {
  const { user, logout } = useAuth();
  const { preferences } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 dark:from-gray-800 dark:to-gray-900 p-4 transition-all duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-10 transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome to Your Dashboard
          </h1>
          <div className="flex space-x-3">
            <Link
              to="/settings"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
            >
              <SettingsIcon size={18} className="mr-1" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {user && (
          <div className="bg-teal-50 dark:bg-teal-900/30 p-6 rounded-lg border border-teal-100 dark:border-teal-800 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
              Your Profile
            </h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                  Username:
                </span>
                <span className="dark:text-white">{user.username}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                  User ID:
                </span>
                <span className="dark:text-white">{user.user_id}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`${
                    user.is_active
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
            Your Preferences
          </h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                Theme:
              </span>
              <span className="capitalize dark:text-white">
                {preferences.theme}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                Language:
              </span>
              <span className="capitalize dark:text-white">
                {preferences.language}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-600 dark:text-gray-400">
                Notifications:
              </span>
              <span className="dark:text-white">
                {preferences.notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
            Protected Content
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This page is protected and can only be accessed by authenticated
            users. You have successfully logged in and can view this content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
