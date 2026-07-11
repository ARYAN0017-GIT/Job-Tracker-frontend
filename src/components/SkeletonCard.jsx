import React from "react";

const SkeletonCard = () => {
  return (
    <div className="card" style={{ pointerEvents: "none" }}>
      <div className="card-header">
        <div className="skeleton skeleton-logo"></div>
        <div className="skeleton skeleton-badge"></div>
      </div>

      <div className="card-body">
        <div className="skeleton skeleton-text skeleton-title"></div>
        <div className="skeleton skeleton-text skeleton-subtitle"></div>
      </div>

      <div className="card-footer" style={{ borderTop: "none", paddingTop: 0 }}>
        <div
          className="skeleton skeleton-text"
          style={{ width: "30%", marginRight: "16px" }}
        ></div>
        <div className="skeleton skeleton-text" style={{ width: "25%" }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
