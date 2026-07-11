// src/context/JobContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { defaultJobs } from "../data";
import {
  getJobs,
  updateJob,
  deletedJob,
  createJob,
  syncGmailJobs,
} from "../api/Jobs.js";
import API from "../api/client.js";

export const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save to LocalStorage whenever jobs change
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setIsLoading(true);
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        setError(
          "Failed to retrieve applications from the cloud network." || error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialJobs();
  }, []);

  // The Action Functions
  const addJob = async (newJob) => {
    try {
      const JobData = { ...newJob };
      const savedJob = await createJob(JobData);

      setJobs((prev) => [savedJob, ...prev]);
    } catch (error) {
      console.error("Error adding job card:", error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await deletedJob(id);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Error purging job card:", error);
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    try {
      await updateJob(id, newStatus);
      setJobs((prevJobs) =>
        prevJobs.map(
          (
            job, // return prevJob to setJob automatically
          ) => (job._id === id ? { ...job, status: newStatus } : job), // return to the prevJobs automatically
        ),
      );
    } catch (error) {
      console.error("Error modifying job status:", error);
    }
  };

  const editJobDetails = async (id, updatedData) => {
    try {
      await API.put(`/jobs/${id}`, updatedData);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === id ? { ...job, ...updatedData } : job,
        ),
      );
    } catch (error) {
      console.error("Error modifying job details:", error);
    }
  };

  const triggerGmailSync = async (email) => {
    try {
      // 1. Fire the loading spinner at the start line
      setIsSyncing(true);
      const data = await syncGmailJobs(email);

      console.log("RAW BACKEND SYNC DATA:", data);

      if (
        data &&
        data.trackedApplications &&
        data.trackedApplications.length > 0
      ) {
        const newlySyncedJobs = [];

        for (const aiJob of data.trackedApplications) {
          // 2. Strict formatting to prevent database mismatch rejections
          const rawStatus = String(aiJob.status || "applied")
            .toLowerCase()
            .trim();
          const validStatuses = ["applied", "interview", "offer", "rejected"];
          const safeStatus = validStatuses.includes(rawStatus)
            ? rawStatus
            : "applied";

          let historicalDate = Date.now();
          if (aiJob.date && aiJob.date !== "Unknown Date") {
            const parsedTime = new Date(aiJob.date).getTime();
            if (!isNaN(parsedTime)) {
              historicalDate = parsedTime;
            }
          }

          const formattedJob = {
            company: String(aiJob.companyName || "Unknown").trim(),
            role: String(aiJob.jobRole || "Not Specified").trim(),
            status: safeStatus,
            location: String(aiJob.location || "Not Specified").trim(),
            source: "gmail",
            dateApplied: historicalDate,
          };

          // 3. Safe check avoiding undefined property reference crashes
          const existingJob = jobs.find(
            (j) =>
              j.company &&
              j.company.toLowerCase().trim() ===
                formattedJob.company.toLowerCase(),
          );

          // 4. THE INNER BLAST SHIELD: Loops continue if one payload fails
          try {
            if (!existingJob) {
              const savedJob = await createJob(formattedJob);
              newlySyncedJobs.push(savedJob);
            } else if (
              existingJob.status !== formattedJob.status &&
              existingJob.source === "gmail"
            ) {
              const updatedData = {
                status: formattedJob.status,
                dateApplied: formattedJob.dateApplied,
              };
              await editJobDetails(existingJob._id, updatedData);
            }
          } catch (jobError) {
            console.error(
              `❌ Backend rejected job from ${formattedJob.company}:`,
              jobError,
            );
          }
        } // 💡 The loop safely ends here

        console.log("NEWLY SYNCED JOBS PUSHING TO STATE:", newlySyncedJobs);

        if (newlySyncedJobs.length > 0) {
          setJobs((prev) => [...newlySyncedJobs, ...prev]);
        }

        alert(
          `Sync Complete! Found ${data.jobsFound || newlySyncedJobs.length} unique applications.`,
        );
      } else {
        alert(
          "Sync Complete! No new job applications discovered in your inbox.",
        );
      }
    } catch (globalError) {
      if (globalError.response && globalError.response.status === 403) {
        console.warn(
          "Google Auth missing. Dropping breadcrumb and redirecting...",
        );

        // 1. Droping the breadcrumb so the app remembers what to do when it comes back
        localStorage.setItem("pendingGmailSync", email);

        // 2. Send them to your Node.js backend to log in with Google
        window.location.href = "http://localhost:5000/api/auth/google";
        return; // Stop execution here!
      }

      // If it's a normal error (500, network drop, etc), do the usual alert
      console.error("❌ Global Gmail Sync Failure:", globalError);
      alert("Failed to synchronize with your Gmail network pipeline.");
    } finally {
      // 6. MASTER BOUNDARY: Shuts off the loading screen no matter what happens above!
      setIsSyncing(false);
    }
  };
  // Package everything up and provide it to the rest of the app
  const value = {
    jobs,
    isLoading,
    error,
    addJob,
    deleteJob,
    updateJobStatus,
    editJobDetails,
    triggerGmailSync,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export const useJobs = () => useContext(JobContext);
