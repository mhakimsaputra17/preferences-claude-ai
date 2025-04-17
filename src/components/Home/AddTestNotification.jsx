import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/notificationsSlice";
import { showToast } from "../../store/toastSlice";
import { Bell } from "lucide-react";

function AddTestNotification() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAddNotification = () => {
    const notification = {
      id: Date.now().toString(),
      title: t("notifications.welcomeTitle"),
      message: t("notifications.welcomeMessage"),
      time: new Date().toISOString(),
      read: false,
    };

    dispatch(addNotification(notification));
    dispatch(
      showToast({
        type: "success",
        title: t("toast.successTitle"),
        message: t("toast.notificationAdded"),
      })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t("home.addTestNotification")}
        </h2>
        <Bell className="text-teal-500" size={24} />
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {t("home.createSampleNotification")}
      </p>
      <button
        onClick={handleAddNotification}
        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
      >
        <Bell size={18} />
        <span>{t("home.addTestNotification")}</span>
      </button>
    </div>
  );
}

export default AddTestNotification;
