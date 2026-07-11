import API from "./client";

export const getJobs = async () => {
  try {
    const response = await API.get("/jobs");
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await API.post("/jobs", jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const updateJob = async (id, newStatus) => {
  try {
    const response = await API.put(`/jobs/${id}`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};

export const deletedJob = async (id) => {
  try {
    const response = await API.delete(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

export const syncGmailJobs = async (email) => {
  try {
    const response = await API.get(`/auth/gmail/sync?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error syncing Gmail:", error);
    throw error;
  }
};
