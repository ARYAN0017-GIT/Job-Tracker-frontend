import React, { useState } from "react";
import { loginAPI, registerAPI } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      errors.name = "Name field cannot be left blank";
    }

    if (!email) {
      errors.email = "Email field cannot be empty";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please input a valid email address structure";
    }

    if (!password) {
      errors.password = "Password field cannot be empty";
    } else if (password.length < 6) {
      errors.password =
        "Security credentials must be at least 6 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // 1. Send registration payload to our Express backend
      const userData = await registerAPI(name, email, password);

      // 2. Lock the newly issued JWT token passport into browser storage
      login(userData);

      alert(`Account created successfully! Welcome, ${userData.name}.`);

      navigate("/");
    } catch (err) {
      console.error("RAW BACKEND REJECTION:", err);

      // Forces the object into a guaranteed text string before React touches it
      let safeErrorMessage = "An unexpected network error occurred.";
      if (typeof err === "string") {
        safeErrorMessage = err;
      } else if (err && err.message) {
        safeErrorMessage = err.message;
      } else {
        safeErrorMessage = JSON.stringify(err);
      }

      setServerError(safeErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Workspace</h2>
          <p className="auth-subtitle">
            Sign up to begin organizing your professional tracking ecosystem
          </p>
        </div>

        {serverError && <div className="error-banner">❌ {serverError}</div>}

        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aryan Agarwal"
            />
            {formErrors.name && (
              <span
                style={{
                  color: "#ef5350",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {formErrors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {formErrors.email && (
              <span
                style={{
                  color: "#ef5350",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {formErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {formErrors.password && (
              <span
                style={{
                  color: "#ef5350",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {formErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering Core..." : "Establish Account"}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
