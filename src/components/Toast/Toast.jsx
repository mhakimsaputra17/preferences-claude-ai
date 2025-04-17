import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../../store/toastSlice";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return (
        <CheckCircle className="h-5 w-5 text-green-400 transform transition-transform hover:scale-110" />
      );
    case "error":
      return (
        <AlertCircle className="h-5 w-5 text-red-400 transform transition-transform hover:scale-110" />
      );
    case "warning":
      return (
        <AlertTriangle className="h-5 w-5 text-yellow-400 transform transition-transform hover:scale-110" />
      );
    default:
      return (
        <Info className="h-5 w-5 text-blue-400 transform transition-transform hover:scale-110" />
      );
  }
};

const Toast = () => {
  const { toasts } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full sm:max-w-sm z-50 pointer-events-none">
      <div className="flex flex-col space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-full transform transition-all duration-300 ease-in-out ${
              toast.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ToastIcon type={toast.type} />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {toast.title || t(`toast.${toast.type}Title`)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    {toast.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    onClick={() => {
                      dispatch(removeToast(toast.id));
                    }}
                  >
                    <span className="sr-only">{t("toast.close")}</span>
                    <X className="h-5 w-5 transform transition-transform hover:scale-110" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
