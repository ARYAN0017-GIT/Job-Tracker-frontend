import React, { useEffect } from "react";
import { useState } from "react";

export default function AddJobModal({ isOpen, onClose, onSave, jobToEdit }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("applied");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (jobToEdit) {
        setCompany(jobToEdit.company || "");
        setRole(jobToEdit.role || "");
        setStatus(jobToEdit.status || "");
        setLocation(jobToEdit.location || "");
      } else {
        setCompany("");
        setLocation("");
        setRole("");
        setStatus("applied");
      }
    }
  }, [isOpen, jobToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now(),
      company: company,
      role: role,
      status: status,
      location: location,
      source: "manual",
      createdAt: Date.now(),
    };

    onSave(newJob, jobToEdit);

    onClose();
  };

  return (
    <div className={`side-panel ${!isOpen ? "hidden" : ""}`}>
      <div className="side-panel-content">
        <div className="modal-header">
          <h2>{jobToEdit ? "Update Application" : "Add New Job"}</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-job-form">
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {jobToEdit ? "Save Changes" : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
