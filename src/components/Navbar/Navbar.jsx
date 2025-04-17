import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import NotificationsMenu from "../NotificationsMenu/NotificationsMenu";
import { Home, Settings, User, LogOut, Menu, X } from "lucide-react";

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = useSelector((state) => state.preferences);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-teal-400 to-blue-500 w-8 h-8 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="ml-2 text-gray-800 dark:text-white font-semibold text-lg">
                  Claude AI
                </span>
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/home"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                  ${
                    isActive("/home")
                      ? "bg-teal-500 text-white"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <Home
                  size={18}
                  className="transform transition-transform hover:scale-110"
                />
                <span>{t("navigation.home")}</span>
              </Link>

              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
                  ${
                    isActive("/settings")
                      ? "bg-teal-500 text-white"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <Settings
                  size={18}
                  className="transform transition-transform hover:scale-110"
                />
                <span>{t("navigation.settings")}</span>
              </Link>
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language indicator */}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t(`settings.language.${preferences.language}`)}
            </div>

            {/* Notifications */}
            <NotificationsMenu />

            {/* User menu */}
            <div className="relative group">
              <div className="flex items-center justify-center cursor-pointer">
                <User
                  size={18}
                  className="text-gray-600 dark:text-gray-300 transform transition-transform hover:scale-110"
                />
              </div>

              {/* Dropdown */}
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.username}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <LogOut
                    size={16}
                    className="transform transition-transform group-hover:scale-110"
                  />
                  <span>{t("navigation.logout")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className="transform transition-transform hover:scale-110"
                />
              ) : (
                <Menu
                  size={24}
                  className="transform transition-transform hover:scale-110"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/home"
            className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2
              ${
                isActive("/home")
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home
              size={18}
              className="transform transition-transform hover:scale-110"
            />
            <span>{t("navigation.home")}</span>
          </Link>

          <Link
            to="/settings"
            className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2
              ${
                isActive("/settings")
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings
              size={18}
              className="transform transition-transform hover:scale-110"
            />
            <span>{t("navigation.settings")}</span>
          </Link>

          {/* Mobile language indicator */}
          <div className="px-3 py-2 text-gray-600 dark:text-gray-300 flex items-center">
            <span className="text-sm font-medium">
              {t("navigation.currentLanguage")}:{" "}
              {t(`settings.language.${preferences.language}`)}
            </span>
          </div>
        </div>

        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <User size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800 dark:text-white">
                {user?.username}
              </div>
            </div>
            <div className="ml-auto flex items-center">
              {/* Mobile Notifications */}
              <NotificationsMenu isMobile={true} />
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 hover:text-teal-600 flex items-center space-x-2"
            >
              <LogOut
                size={18}
                className="transform transition-transform hover:scale-110"
              />
              <span>{t("navigation.logout")}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
