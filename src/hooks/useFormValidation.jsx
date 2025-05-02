import React, { useState } from "react";

function useFormValidation() {
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validateUsername = (username) => {
    if (username.trim() === "") {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      return false;
    } else if (username.length < 3 || username.length > 20) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be between 3 and 20 characters",
      }));
      return false;
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username can only contain letters and numbers",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
      return true;
    }
  };

  const validatePassword = (password) => {
    if (password.trim() === "") {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    } else if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    }
  };

  const validateForm = (data) => {
    const isUsernameValid = validateUsername(data.username);
    const isPasswordValid = validatePassword(data.password);
    return isUsernameValid && isPasswordValid;
  };

  return {
    errors,
    validateUsername,
    validatePassword,
    validateForm,
  };
}

export default useFormValidation;
