import React from "react";
import useAuth from "../hooks/useAuth";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Your Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">
              Your Profile
            </h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">
                  Username:
                </span>
                <span>{user.username}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">User ID:</span>
                <span>{user.user_id}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">Status:</span>
                <span
                  className={`${
                    user.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Protected Content
          </h2>
          <p className="text-gray-700">
            This page is protected and can only be accessed by authenticated
            users. You have successfully logged in and can view this content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
