import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bell, X, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  markNotificationRead,
  clearNotifications,
} from "../../store/notificationsSlice";

function NotificationsMenu({ isMobile = false }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  const unreadCount = notifications.filter((note) => !note.read).length;

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
    setIsOpen(false);
  };

  // Format notification time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return t("notifications.justNow");
    if (diffMinutes < 60)
      return `${diffMinutes}${t("notifications.minutesAgo")}`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}${t("notifications.hoursAgo")}`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}${t("notifications.daysAgo")}`;

    return date.toLocaleDateString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <Check
            size={16}
            className="text-green-500 transform transition-transform hover:scale-110"
          />
        );
      case "warning":
        return (
          <Bell
            size={16}
            className="text-yellow-500 transform transition-transform hover:scale-110"
          />
        );
      case "error":
        return (
          <X
            size={16}
            className="text-red-500 transform transition-transform hover:scale-110"
          />
        );
      default:
        return (
          <Bell
            size={16}
            className="text-blue-500 transform transition-transform hover:scale-110"
          />
        );
    }
  };

  // Render notification with translation support
  const renderNotificationContent = (notification) => {
    // Use translation key if available, otherwise use stored text
    const title = notification.titleKey
      ? t(notification.titleKey)
      : notification.title;
    const message = notification.messageKey
      ? t(notification.messageKey)
      : notification.message;

    return (
      <>
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          {message}
        </p>
      </>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell */}
      <button
        onClick={handleToggleMenu}
        className="text-gray-600 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400 focus:outline-none"
      >
        <span className="sr-only">{t("notifications.view")}</span>
        <div className="relative">
          <Bell
            size={isMobile ? 20 : 18}
            className="transform transition-transform hover:scale-110"
          />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("notifications.title")}
            </h3>

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 focus:outline-none"
              >
                {t("notifications.clearAll")}
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("notifications.noNotifications")}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    !notification.read ? "bg-teal-50 dark:bg-teal-900/20" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      {renderNotificationContent(notification)}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>

                        {!notification.read && (
                          <button
                            className="text-xs text-teal-600 hover:text-teal-800 dark:text-teal-400 focus:outline-none"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            {t("notifications.markAsRead")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
