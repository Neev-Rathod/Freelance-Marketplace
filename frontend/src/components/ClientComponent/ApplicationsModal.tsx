import React, { useState, useEffect } from "react";
import { X, Star, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import type { Job, Application } from "../../types/clientpage";
import { jobsApi, applicationsApi } from "../../api/request";
import {
  formatDate,
  formatBudget,
  getStatusColor,
  getRatingStars,
} from "../../utils/helpers";
import PaymentGateway from "./PayementGateway";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onJobUpdate: () => void;
}

const ApplicationsModal: React.FC<ApplicationsModalProps> = ({
  isOpen,
  onClose,
  job,
  onJobUpdate,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    if (isOpen && job) {
      fetchApplications();
    }
  }, [isOpen, job]);

  const fetchApplications = async () => {
    if (!job) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedApplications = await jobsApi.fetchJobApplications(job._id);
      setApplications(fetchedApplications);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (application: Application) => {
    try {
      try {
        await applicationsApi.acceptApplication(application._id);
      } catch (err) {
        throw new Error(
          "Error in acceptApplication API: " +
            (err instanceof Error ? err.message : err)
        );
      }

      try {
        setSelectedApplication(application);
        setShowPayment(true);

        await fetchApplications();
        onJobUpdate();
      } catch (err) {
        throw new Error(
          "Error in post-API calls: " +
            (err instanceof Error ? err.message : err)
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept application"
      );
    }
  };

  const handleRejectApplication = async (application: Application) => {
    try {
      await applicationsApi.rejectApplication(application._id);
      await fetchApplications();
      onJobUpdate();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject application"
      );
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedApplication) return;
    try {
      await applicationsApi.acceptApplication(selectedApplication._id);
      await fetchApplications();
      onJobUpdate();
      setShowPayment(false);
      setSelectedApplication(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept application"
      );
    }
  };

  if (!isOpen || !job) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Applications for "{job.title}"
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No applications yet.
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {application.freelancer?.name || "Anonymous"}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {application.freelancer?.email}
                        </p>
                        {application.freelancer?.rating && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">
                              {getRatingStars(application.freelancer.rating)}
                            </span>
                            <span className="text-gray-600">
                              {application.freelancer.rating.toFixed(1)} (
                              {application.freelancer.ratingsCount} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-semibold text-lg mb-1">
                          <DollarSign className="w-4 h-4" />
                          {formatBudget(application.bidAmount)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-3 h-3" />
                          {application.deliveryTimeline}
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Applied {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Cover Letter:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>

                    {application.freelancer?.skills &&
                      application.freelancer.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Skills:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {application.freelancer.skills.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {job.status === "open" &&
                      application.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowPayment(true);
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept & Hire
                          </button>

                          <button
                            onClick={() => handleRejectApplication(application)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedApplication?.bidAmount || 0}
        freelancerName={selectedApplication?.freelancer?.name || ""}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default ApplicationsModal;
