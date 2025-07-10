import React, { useState, useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import type { Job, JobFormData } from "../types/clientpage";
import { jobsApi } from "../api/request";
import JobCard from "../components/ClientComponent/JobCard";
import JobForm from "../components/ClientComponent/JobForm";
import ApplicationsModal from "../components/ClientComponent/ApplicationsModal";

const ClientPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await jobsApi.fetchMyJobs();
      setJobs(jobsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData: JobFormData) => {
    setFormLoading(true);
    try {
      await jobsApi.createJob(jobData);
      await fetchJobs();
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewApplications = (job: Job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };

  const handleJobUpdate = () => {
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchJobs}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">
              Client Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your posted jobs and review applications
          </p>
        </div>

        {/* Post New Job Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No jobs posted yet.</p>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewApplications={handleViewApplications}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <JobForm
          isOpen={showJobForm}
          onClose={() => setShowJobForm(false)}
          onSubmit={handleCreateJob}
          loading={formLoading}
        />

        <ApplicationsModal
          isOpen={showApplications}
          onClose={() => {
            setShowApplications(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onJobUpdate={handleJobUpdate}
        />
      </div>
    </div>
  );
};

export default ClientPage;
