import React from "react";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <span className="material-symbols-outlined error-icon">cloud_off</span>

      <h3>Network Disruption</h3>
      <p>
        {message ||
          "Failed to retrieve applications from the cloud network. Please verify your connection matrix."}
      </p>

      {/* Renders a retry button using your custom M3 secondary button class if a function is passed */}
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Attempt Reconnection
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
