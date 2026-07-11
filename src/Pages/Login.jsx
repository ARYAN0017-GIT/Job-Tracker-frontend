import react, { useState } from "react";

import { loginAPI } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const ValidForms = () => {
    const errors = {};
    console.log("hello1");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("hello2");

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
    console.log("hello3");
    setFormErrors(errors);

    console.log("hello4");
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!ValidForms()) return;

    try {
      setIsSubmitting(true);
      const userData = await loginAPI(email, password);
      login(userData);

      alert(
        `Welcome back, ${userData.name}! Token successfully secured inside browser storage.`,
      );

      navigate("/");
    } catch (error) {
      let safeErrorMessage = "An unexpected network error occurred.";
      if (typeof err === "string") safeErrorMessage = err;
      else if (err && err.message) safeErrorMessage = err.message;
      else safeErrorMessage = JSON.stringify(err);

      setServerError(safeErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Account Authorization</h2>
          <p className="auth-subtitle">
            Log in to coordinate your career tracking pipeline
          </p>
        </div>

        {serverError && <div className="error-banner">❌ {serverError}</div>}

        <form onSubmit={handleLoginSubmit}>
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
            <label>Security Password</label>
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
            {isSubmitting ? "Verifying Matrix..." : "Authorize Access"}
          </button>
        </form>

        <p className="auth-link-text">
          New to the ecosystem?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
