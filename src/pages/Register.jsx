import React, { useState } from "react";
import { Link } from "react-router";
import FormAuth from "../components/FormAuth/FormAuth";
import useAuth from "../hooks/useAuth";

function Register() {
  const { register, error } = useAuth();
  const [registrationError, setRegistrationError] = useState(null);

  const handleSubmit = async (username, password) => {
    const success = await register(username, password);
    if (!success && error) {
      setRegistrationError(error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600 p-4 transition-all duration-500">
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-600 p-8 text-white flex flex-col justify-center items-center">
            <div className="text-6xl mb-6 transform transition-all duration-300 hover:scale-110">
              👋
            </div>
            <h2 className="text-3xl font-bold mb-3 text-center tracking-wide">
              Welcome!
            </h2>
            <p className="text-center mb-8 text-gray-100">
              Create your account to get started.
            </p>
            <div className="w-24 h-1 bg-white rounded-full mb-8"></div>
            <p className="text-sm text-center text-gray-100">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="mt-3 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-teal-500 transition-all duration-300 font-medium"
            >
              Login
            </Link>
          </div>

          <FormAuth
            title="Create an Account"
            fields={["username", "password"]}
            buttonText="Sign Up"
            onSubmit={handleSubmit}
            showNameField={true}
          />
        </div>
      </div>

      {registrationError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-lg rounded">
          <p>{registrationError}</p>
        </div>
      )}
    </div>
  );
}

export default Register;
