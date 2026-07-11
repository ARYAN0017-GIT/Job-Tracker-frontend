import API from "./client";

const API_URI = "http://localhost:5000/api/auth";

export const loginAPI = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Authentication network failure";
  }
};

export const registerAPI = async (name, email, password) => {
  try {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Registration network failure";
  }
};
