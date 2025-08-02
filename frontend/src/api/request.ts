import axios from "axios";
import type { Job, JobFormData, Application } from "../types/clientpage";
import type { Dispute, User } from "./../types/adminPage";

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
  applyForJob: async (jobId: string, applicationData: any) => {
    const response = await axios.post(
      `${API_BASE_URL}/applications/${jobId}/applications`,
      applicationData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

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
  updateProfile: async (profileData: Partial<User>) => {
    const response = await axios.put(
      `${API_BASE_URL}/users/profile`,
      profileData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

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

export const adminApi = {
  // --- Disputes ---
  getAllDisputes: async (): Promise<Dispute[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/disputes/admin/disputes`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  resolveDispute: async (
    disputeId: string,
    resolution: string,
    status: "resolved" | "rejected"
  ): Promise<Dispute> => {
    const response = await axios.put(
      `${API_BASE_URL}/disputes/admin/disputes/${disputeId}/resolve`,
      { resolution, status },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.dispute;
  },

  // --- Users ---
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  deactivateUser: async (userId: string): Promise<User> => {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.user;
  },

  // --- Jobs ---
  getAllJobs: async (): Promise<Job[]> => {
    const response = await axios.get(`${API_BASE_URL}/jobs`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  moderateJob: async (
    jobId: string,
    status: "approved" | "rejected"
  ): Promise<Job> => {
    const response = await axios.put(
      `${API_BASE_URL}/jobs/${jobId}/moderate`,
      { status },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.job;
  },
};
