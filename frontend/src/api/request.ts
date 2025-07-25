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

  // Close a job
  closeJob: async (jobId: string) => {
    const response = await axios.put(
      `${API_BASE_URL}/jobs/${jobId}/close`,
      {},
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

export const userApi = {
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

// Contracts API
export const contractsApi = {
  getActiveContracts: async () => {
    const response = await axios.get(`${API_BASE_URL}/contracts/active`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  completeContract: async (contractId: string) => {
    const response = await axios.put(
      `${API_BASE_URL}/contracts/${contractId}/complete`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

// Ratings API
export const ratingsApi = {
  submitRating: async (ratingData: {
    jobId: string;
    toUserId: string;
    rating: number;
    review: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/ratings/`, ratingData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export const disputeApi = {
  raiseDispute: async (disputeData: {
    jobId: string;
    againstUserId: string;
    reason: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/disputes`, disputeData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  resolveDispute: async (
    disputeId: string,
    resolveData: {
      resolution: string;
      status: "open" | "resolved" | "rejected";
    }
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/admin/disputes/${disputeId}/resolve`,
      resolveData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
  getDispute: async () => {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/admin/disputes`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};
