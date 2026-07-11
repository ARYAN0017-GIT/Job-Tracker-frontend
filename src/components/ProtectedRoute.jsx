// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "./SkeletonCard";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  console.log(
    "🛡️ GUARD RENDERING: authLoading =",
    authLoading,
    "| isAuthenticated =",
    isAuthenticated,
  );
  if (authLoading) {
    return (
      <div className="card-grid" style={{ padding: "24px" }}>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
