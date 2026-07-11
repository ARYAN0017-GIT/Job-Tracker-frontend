import React from "react";
import { useState, useRef, useEffect } from "react";
import { useJobs } from "../context/JobContext";

const STATUS = {
  applied: { label: "Applied", colorClass: "status-applied" },
  interview: { label: "Interview", colorClass: "status-interview" },
  offer: { label: "Offer", colorClass: "status-offer" },
  rejected: { label: "Rejected", colorClass: "status-rejected" },
};

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default function JobCard({
  job,
  onDelete,
  onStatusChange,
  onEditClick,
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const companyInitial = job.company.charAt(0).toUpperCase();
  const isGmail = job.source === "gmail";

  const { editJobDetails } = useJobs();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = (newStatus) => {
    onStatusChange(job._id, newStatus);
    setIsDropdownOpen(false);
  };
  return (
    <>
      <section className="card" data-source={job.source}>
        <div className="card-header">
          <div className="company-logo">{companyInitial}</div>

          <div className="header-actions">
            {/* 🔓 UNLOCKED: Edit Button */}
            <button
              className="icon-btn delete-btn"
              title="Edit job"
              onClick={() => onEditClick(job)}
              style={{
                background: "none",
                border: "none",
                color: "var(--md-sys-color-on-surface-variant)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-528q12-12 28-12t28 12l51 51q12 12 12 28t-12 28L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </button>

            {/* 🔓 UNLOCKED: Delete Button */}
            <button
              className="delete-btn"
              title="Delete job"
              onClick={() => onDelete(job._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </button>

            {isGmail ? (
              <button
                className={`status-badge ${STATUS[job.status].colorClass} locked`}
                title="Status auto-synced from Gmail"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "12px",
                    marginRight: "4px",
                    verticalAlign: "middle",
                  }}
                >
                  lock
                </span>
                {STATUS[job.status].label}
              </button>
            ) : (
              <div className="status-wrapper" ref={dropdownRef}>
                <button
                  className={`status-badge ${STATUS[job.status].colorClass}`}
                  onClick={() => setIsDropdownOpen(!isDropDownOpen)}
                >
                  {STATUS[job.status].label}
                  <span
                    className="material-symbols-outlined chevron"
                    style={{
                      marginLeft: "4px",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className={`status-dropdown ${!isDropDownOpen ? "hidden" : ""}`}
                >
                  {Object.keys(STATUS).map((statusKey) => (
                    <div
                      key={statusKey}
                      className={`status-option ${job.status === statusKey ? "active" : ""}`}
                      onClick={() => handleStatusSelect(statusKey)}
                    >
                      {STATUS[statusKey].label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card-body">
          <h3 className="job-title">{job.role}</h3>
          <p className="company-name">{job.company}</p>
        </div>

        <div className="card-footer">
          <div className="meta-item">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l-5 5-3-3-4 4" />
              <circle cx="7" cy="7" r="6" />
            </svg>
            <span
              style={{
                display: "inline-block",
                maxWidth: "110px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "bottom",
              }}
            >
              {job.location}
            </span>
          </div>
          <div
            className="meta-item"
            title={new Date(job.dateApplied || job.createdAt).toLocaleString()}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="10" height="10" rx="2" />
              <path d="M8 2v4M3 8h10" />
            </svg>
            <span>
              {new Date(job.dateApplied || job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
