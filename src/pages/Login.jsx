import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import FormAuth from "../components/FormAuth/FormAuth";
import useAuth from "../hooks/useAuth";
import { X } from "lucide-react";

function Login() {
  const { login, error } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      setLoginError(error);
      const timer = setTimeout(() => {
        setLoginError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (username, password) => {
    const success = await login(username, password);
    if (!success && error) {
      setLoginError(error);
    }
  };

  const dismissError = () => {
    setLoginError(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600 p-4 transition-all duration-500">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      {/* Main card */}
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col md:flex-row">
          {/* Left panel */}
          <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-600 p-8 text-white flex flex-col justify-center items-center">
            <div className="text-6xl mb-6 transform transition-all duration-300 hover:scale-110">
              🔐
            </div>
            <h2 className="text-3xl font-bold mb-3 text-center tracking-wide">
              {t("auth.login.welcomeBack")}
            </h2>
            <p className="text-center mb-8 text-gray-100">
              {t("auth.login.signInAccess")}
            </p>
            <div className="w-24 h-1 bg-white rounded-full mb-8 opacity-70"></div>
            <p className="text-sm text-center text-gray-100 mb-2">
              {t("auth.login.noAccount")}
            </p>
            <Link
              to="/register"
              className="mt-2 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-teal-500 transition-all duration-300 font-medium"
            >
              {t("auth.login.register")}
            </Link>
          </div>

          {/* Form */}
          <FormAuth
            title="auth.login.title"
            fields={["username", "password"]}
            buttonText="auth.login.signIn"
            onSubmit={handleSubmit}
            showNameField={false}
          />
        </div>
      </div>

      {/* Error toast */}
      {loginError && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border-l-4 border-red-500 transition-all duration-300 animate-fade-in-up">
          <div className="flex p-4">
            <div className="flex-shrink-0 text-red-500">
              <svg
                className="h-5 w-5 transition-transform hover:scale-110"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("auth.login.error")}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {loginError}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={dismissError}
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <X size={16} className="transition-transform hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
