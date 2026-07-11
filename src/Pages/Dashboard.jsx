// src/pages/Dashboard.jsx
import { useState, useMemo, useEffect, useContext } from "react";
import { useJobs } from "../context/JobContext.jsx";
import Controls from "../components/Controls.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import JobCard from "../components/JobCard.jsx";
import AddJobModal from "../components/AddJobModal";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import ProfileMenu from "../components/ProfileMenu.jsx";
export default function Dashboard() {
  const {
    jobs,
    isLoading,
    error,
    addJob,
    isSyncing,
    deleteJob,
    updateJobStatus,
    editJobDetails,
    triggerGmailSync,
  } = useJobs();

  const { user } = useAuth();

  // Local Page UI States
  const [activeSort, setActiveSort] = useState("newest first");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobToEdit, setJobToEdit] = useState(null);
  const itemPerPage = 6;

  const ADMIN_WHITELIST = ["aryanagarwal858@gmail.com", "arun128@gmail.com"];
  const isUserAdmin = user && ADMIN_WHITELIST.includes(user?.email);

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, activeStatus, activeSort]);

  useEffect(() => {
    // 1. the breadcrumb that i dropped before redirecting
    const pendingEmail = localStorage.getItem("pendingGmailSync");

    if (pendingEmail) {
      console.log(`Breadcrumb found! Auto-syncing for ${pendingEmail}`);

      // 2. Instantly delete the breadcrumb so it doesn't run again if they refresh
      localStorage.removeItem("pendingGmailSync");

      // 3. Fire the sync process automatically!
      triggerGmailSync(pendingEmail);
    }
  }, []);

  // The Math (Filtering & Counting)
  const searchFilteredJobs = useMemo(() => {
    const safeJobs = jobs || [];
    if (searchText === "") return safeJobs;
    return safeJobs.filter(
      (job) =>
        job.company.toLowerCase().includes(searchText.toLowerCase()) ||
        job.role.toLowerCase().includes(searchText.toLowerCase()) ||
        job.status.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [jobs, searchText]);

  const handleModalSave = (jobData, existingJob) => {
    if (existingJob) {
      editJobDetails(existingJob._id, jobData);
    } else {
      addJob({ ...jobData, source: "manual", createdAt: Date.now() });
    }
  };

  const handleOpenEdit = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
    setIsFabMenuOpen(false);
  };

  const handleGmailSync = () => {
    setIsFabMenuOpen(false);

    if (!isUserAdmin) return;

    const email = prompt(
      "👑 Admin Override: Enter the whitelisted Gmail address to sync into this dashboard:",
      user.email,
    );
    if (email) {
      triggerGmailSync(email.trim());
    }
  };

  const count = useMemo(() => {
    return {
      all: searchFilteredJobs?.length,
      applied: searchFilteredJobs.filter(
        (j) => j.status.toLowerCase() === "applied",
      ).length,
      rejected: searchFilteredJobs.filter(
        (j) => j.status.toLowerCase() === "rejected",
      ).length,
      interview: searchFilteredJobs.filter(
        (j) => j.status.toLowerCase() === "interview",
      ).length,
      offer: searchFilteredJobs.filter(
        (j) => j.status.toLowerCase() === "offer",
      ).length,
    };
  }, [searchFilteredJobs]);

  const filteredandSortedJobs = useMemo(() => {
    let result = searchFilteredJobs;
    if (activeStatus !== "all") {
      result = result.filter(
        (job) => job.status.toLowerCase() === activeStatus.toLowerCase(),
      );
    }
    return [...result].sort((a, b) => {
      if (activeSort === "newest first")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (activeSort === "oldest first")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (activeSort === "company a-z")
        return a.company.localeCompare(b.company);
      return 0;
    });
  }, [searchFilteredJobs, activeSort, activeStatus]);

  const totalPages = Math.ceil(filteredandSortedJobs.length / itemPerPage);

  const PaginationJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return filteredandSortedJobs.slice(startIndex, endIndex);
  }, [filteredandSortedJobs, currentPage]);

  // Render the Dashboard
  return (
    <div style={{ paddingBottom: "100px" }}>
      <Controls
        searchText={searchText}
        setSearchText={setSearchText}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        count={count}
      />

      <main className="card-grid">
        {isLoading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : PaginationJobs.length === 0 ? (
          <div className="empty-state">
            <h3>No Jobs Found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          PaginationJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={deleteJob}
              onStatusChange={updateJobStatus}
              onEditClick={handleOpenEdit}
            />
          ))
        )}
      </main>
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      <div className={`fab-menu ${!isFabMenuOpen ? "hidden" : ""}`}>
        <div className="fab-item" onClick={handleOpenAdd}>
          <span className="material-symbols-outlined">edit_document</span> Add
          Manually
        </div>
        <div
          className="fab-item"
          onClick={!isUserAdmin || isSyncing ? undefined : handleGmailSync}
          title={
            !isUserAdmin
              ? "🔒 Admin-Only Feature: You do not have clearance to use AI Sync."
              : "👑 Admin-Level AI Synchronization active."
          }
          style={{
            opacity: !isUserAdmin || isSyncing ? 0.5 : 1,
            cursor: !isUserAdmin || isSyncing ? "not-allowed" : "pointer",
          }}
        >
          <span
            className={`material-symbols-outlined ${isSyncing ? "spin-animation" : ""}`}
          >
            {isSyncing ? "sync" : "mail"}
          </span>

          {/* 🚀 FIXED: Switched to inline-flex so the container expands to fit the badge */}
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <span>
              {isSyncing ? "AI is scanning emails..." : "Sync from Gmail"}
            </span>

            {/* 💎 THE PREMIUM BADGE */}
            {!isSyncing && (
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #a8c7fa, #6991d6)", // Sleek UI Blue Gradient
                  color: "#0a192f", // Deep contrast text
                  padding: "2px 6px",
                  borderRadius: "10px", // Perfect pill shape
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)", // Softer, premium shadow
                  transform: "translateY(-1px)", // Subtle lift to keep that "floating" superscript feel
                }}
              >
                Beta
              </span>
            )}
          </span>
        </div>
      </div>
      <button
        className="fab-extended"
        onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
      >
        <span className="material-symbols-outlined">add</span> New
      </button>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobToEdit(null);
        }}
        onSave={handleModalSave}
        jobToEdit={jobToEdit}
      />
    </div>
  );
}
