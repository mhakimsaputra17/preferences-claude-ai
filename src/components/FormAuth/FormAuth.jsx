import React, { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

function FormAuth({
  title,
  fields = ["username", "password"],
  buttonText = "Submit",
  onSubmit,
  showNameField = false,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit?.(username, password);
    } finally {
      setTimeout(() => setIsLoading(false), 600); // Simulate API call
    }
  };

  return (
    <div className="md:w-1/2 p-10 flex flex-col justify-center">
      <div className="mb-8 text-center">
        <div className="bg-teal-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
          <User size={32} className="text-teal-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {fields.includes("username") && (
          <div className="transition-all duration-300 transform">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
            >
              Username
            </label>
            <div className="relative">
              <User
                className="absolute top-3.5 left-3.5 text-gray-400"
                size={18}
              />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        )}

        {fields.includes("password") && (
          <div className="transition-all duration-300 transform">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute top-3.5 left-3.5 text-gray-400"
                size={18}
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  showNameField ? "new-password" : "current-password"
                }
                required
                className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${
              isLoading ? "opacity-90" : "transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? "Processing..." : buttonText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormAuth;
