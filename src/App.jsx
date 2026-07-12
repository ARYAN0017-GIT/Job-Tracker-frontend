import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import { JobProvider } from "./context/JobContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("JobTrackerTheme") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
    localStorage.setItem("JobTrackerTheme", theme);
  }, [theme]);

  const ToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <Header ToggleTheme={ToggleTheme} theme={theme} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <JobProvider>
                <Dashboard />
              </JobProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
