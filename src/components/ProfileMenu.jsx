import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // The exact same "Click Outside" logic you used in JobCard!
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout(); // This triggers your context function and kicks them to the login screen
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "??";
    const names = user.name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="profile-menu-wrapper" ref={dropdownRef}>
      {/* The Premium Pill Wrapper Button */}
      <button
        className="profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Account Menu"
      >
        {/* The clean, un-corrupted avatar circle */}
        <div className="user-avatar">{getUserInitials()}</div>

        {/* The Dropdown Chevron */}
        <span className="material-symbols-outlined chevron">expand_more</span>
      </button>

      {/* The Dropdown Panel */}
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-name">{user?.name || "User"}</div>
            <div className="profile-email">{user?.email || ""}</div>
          </div>

          <div className="profile-actions">
            <button className="profile-logout-btn" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
