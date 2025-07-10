import axios from "axios";
import type { Job, JobFormData, Application } from "../types/clientpage";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const jobsApi = {
  // Fetch all jobs for the client
  fetchMyJobs: async (): Promise<Job[]> => {
    const response = await axios.get(`${API_BASE_URL}/jobs/my-jobs`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Create a new job
  createJob: async (jobData: JobFormData): Promise<Job> => {
    const response = await axios.post(`${API_BASE_URL}/jobs`, jobData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Update job status
  updateJob: async (jobId: string, updates: Partial<Job>): Promise<Job> => {
    const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, updates, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Fetch applications for a specific job
  fetchJobApplications: async (jobId: string): Promise<Application[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/applications/${jobId}/applications`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

export const applicationsApi = {
  // Accept an application
  acceptApplication: async (applicationId: string): Promise<void> => {
    await axios.put(
      `${API_BASE_URL}/applications/${applicationId}/accept`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  },

  // Reject an application
  rejectApplication: async (applicationId: string): Promise<void> => {
    await axios.put(
      `${API_BASE_URL}/applications/${applicationId}/reject`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  },
};
