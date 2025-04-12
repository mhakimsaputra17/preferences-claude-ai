import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API_BASE_URL = "http://localhost:8000";

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (username, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Registration failed");
        return false;
      }
      navigate("/login");
      return true;
    } catch (error) {
      setError("Registration error. Please try again.");
      return false;
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed");
        return false;
      }

      localStorage.setItem("token", data.access_token);
      setIsAuthenticated(true);
      navigate("/home");
      return true;
    } catch (error) {
      setError("Login error. Please try again.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return {
    register,
    login,
    logout,
    error,
    isAuthenticated,
    isLoading,
    user,
  };
}

export default useAuth;
