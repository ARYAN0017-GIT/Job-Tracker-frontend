// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // 🚀 Added useNavigate hook
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "../context/AuthContext";

export default function Header({ ToggleTheme, theme }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="m3-app-bar">
      <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
        <h1>Job Tracker</h1>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          id="themeToggle"
          className="theme-toggle-btn"
          aria-label="Toggle Theme"
          onClick={ToggleTheme}
        >
          <span className="material-symbols-outlined" id="themeIcon">
            {theme === "light" ? "light_mode" : "dark_mode"}
          </span>
        </button>
        {isAuthenticated && <ProfileMenu />}
      </div>
    </header>
  );
}
