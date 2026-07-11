import { createContext, useState, useEffect, useContext } from "react";
import React from "react";
import API from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem("token");
      const cachedUser = localStorage.getItem("user");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (error) {
          console.error(
            "Session profile corruption detected. Purging credentials.",
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setAuthLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ name: userData.name, email: userData.email }),
    );
    setUser({ name: userData.name, email: userData.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
