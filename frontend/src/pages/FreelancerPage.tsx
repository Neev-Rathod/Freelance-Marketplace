import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase,
  DollarSign,
  User,
  Calendar,
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Import the new components
import Navbar from "../components/FreelancerComponent/Navbar";
import ProfileModal from "../components/FreelancerComponent/ProfileModal";
import ActiveContractsModal from "../components/FreelancerComponent/ActiveContractsModal";
import { adminApi, jobsApi } from "../api/request";
import type { Job } from "../types/clientpage";

interface ApplicationData {
  coverLetter: string;
  bidAmount: string;
  deliveryTimeline: string;
}

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
}

interface ApplicationFormProps {
  job: Job;
  onClose: () => void;
  onSubmit: (jobId: string, data: ApplicationData) => Promise<any>;
}

// Job Card Component
const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div
      onClick={() => onClick(job)}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-750 hover:border-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-300">
          <User className="w-4 h-4 mr-1" />
          <span>{job.client.name}</span>
        </div>
        <div className="flex items-center text-green-400">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">{job.budget}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            job.status === "open"
              ? "bg-green-900/50 text-green-400"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          {job.status}
        </span>
        <span className="text-xs text-gray-500">
          {job.applications?.length} applications
        </span>
      </div>
    </div>
  );
};

// Job Details Modal Component
const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApply,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{job.client.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Description
              </h4>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Category
              </h4>
              <span className="inline-block px-4 py-2 bg-purple-900/30 text-purple-400 rounded-lg">
                {job.category}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Budget</h4>
              <div className="flex items-center text-2xl font-bold text-green-400">
                <DollarSign className="w-6 h-6" />
                <span>{job.budget}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Status</h4>
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  job.status === "open"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {job.status === "open" ? "Open for Applications" : job.status}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onApply(job)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Apply for this Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Application Form Component
const ApplicationForm: React.FC<ApplicationFormProps> = ({
  job,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ApplicationData>({
    coverLetter: "",
    bidAmount: "",
    deliveryTimeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.coverLetter ||
      !formData.bidAmount ||
      !formData.deliveryTimeline
    ) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(job._id, formData);
      setSuccess(true);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to submit application");
      } else {
        setError("Failed to submit application");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Apply for {job.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-800 text-green-400 p-4 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Application submitted successfully!</span>
            </div>
          )}

          <div>
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Explain why you're the perfect fit for this job..."
            />
          </div>

          <div>
            <label
              htmlFor="bidAmount"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Bid Amount ($)
            </label>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              value={formData.bidAmount}
              onChange={handleChange}
              required
              min="1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Enter your bid amount"
            />
          </div>

          <div>
            <label
              htmlFor="deliveryTimeline"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Delivery Timeline
            </label>
            <input
              type="date"
              id="deliveryTimeline"
              name="deliveryTimeline"
              value={formData.deliveryTimeline}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., 2 weeks, 1 month"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Freelancer Page Component
const FreelancerPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] =
    useState<boolean>(false);
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);

  // New state for modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showActiveContractsModal, setShowActiveContractsModal] =
    useState<boolean>(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);
      const jobsData = await adminApi.getAllJobs();
      setJobs(jobsData);
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to load jobs. Please try again later."
        );
      } else {
        setError("Failed to load jobs. Please try again later.");
      }
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: Job): void => {
    setSelectedJob(job);
  };

  const handleApply = (job: Job): void => {
    setSelectedJob(null);
    setApplicationJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (
    jobId: string,
    applicationData: ApplicationData
  ): Promise<any> => {
    return await jobsApi.applyForJob(jobId, applicationData);
  };

  const handleLogout = (): void => {
    // Redirect to login page or handle logout
    window.location.href = "/login"; // Adjust this based on your routing
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <Navbar
        onProfileClick={() => setShowProfileModal(true)}
        onActiveContractsClick={() => setShowActiveContractsModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Available Jobs</h1>
          <p className="text-gray-400">
            Browse and apply for freelance opportunities
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={fetchJobs}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No jobs available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onClick={handleJobClick} />
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}

      {/* Application Form Modal */}
      {showApplicationForm && applicationJob && (
        <ApplicationForm
          job={applicationJob}
          onClose={() => {
            setShowApplicationForm(false);
            setApplicationJob(null);
          }}
          onSubmit={handleApplicationSubmit}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Active Contracts Modal */}
      <ActiveContractsModal
        isOpen={showActiveContractsModal}
        onClose={() => setShowActiveContractsModal(false)}
      />
    </div>
  );
};

export default FreelancerPage;
