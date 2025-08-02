import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { contractsApi } from "../../api/request";
import type { Job } from "../../types/clientpage";

import type { Client } from "../../types/freelancePage";

interface Freelancer {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
}

interface Contract {
  _id: string;
  job: Job;
  client: Client;
  freelancer: Freelancer;
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  amount: number;
  createdAt: string;
}

interface ActiveContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActiveContractsModal: React.FC<ActiveContractsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchActiveContracts();
    }
  }, [isOpen]);

  const fetchActiveContracts = async () => {
    try {
      setLoading(true);
      setError("");
      const contractsData = await contractsApi.getActiveContracts();
      setContracts(contractsData);
    } catch (error) {
      setError("Failed to load active contracts");
      console.error("Error fetching active contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Active Contracts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchActiveContracts}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No active contracts</p>
              <p className="text-gray-500 text-sm mt-2">
                Start applying for jobs to see your contracts here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {contracts.map((contract) => {
                const daysRemaining = getDaysRemaining(contract.job.deadline);
                const isUrgent = daysRemaining <= 3;

                return (
                  <div
                    key={contract._id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-600 transition-all duration-300"
                  >
                    {/* Contract Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                        {contract.job.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                          Active
                        </span>
                        {isUrgent && (
                          <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {contract.job.description}
                    </p>

                    {/* Contract Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Amount */}
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            Contract Amount
                          </p>
                          <p className="text-green-400 font-semibold">
                            {formatCurrency(contract.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Start Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Start Date</p>
                          <p className="text-white">
                            {formatDate(contract.startDate)}
                          </p>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-400">Deadline</p>
                          <p
                            className={`font-medium ${
                              isUrgent ? "text-red-400" : "text-white"
                            }`}
                          >
                            {formatDate(contract.job.deadline)}
                          </p>
                          <p
                            className={`text-xs ${
                              isUrgent ? "text-red-400" : "text-gray-400"
                            }`}
                          >
                            {daysRemaining > 0
                              ? `${daysRemaining} days remaining`
                              : daysRemaining === 0
                              ? "Due today"
                              : `${Math.abs(daysRemaining)} days overdue`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Client/Freelancer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      {/* Client Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">
                            Client
                          </span>
                        </div>
                        <div className="pl-6">
                          <p className="text-white font-medium">
                            {contract.client.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {contract.client.email}
                          </p>
                          {contract.client.company && (
                            <p className="text-gray-400 text-sm">
                              {contract.client.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Freelancer Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">
                            Freelancer
                          </span>
                        </div>
                        <div className="pl-6">
                          <p className="text-white font-medium">
                            {contract.freelancer.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {contract.freelancer.email}
                          </p>
                          {contract.freelancer.skills &&
                            contract.freelancer.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contract.freelancer.skills
                                  .slice(0, 3)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {contract.freelancer.skills.length > 3 && (
                                  <span className="text-xs text-gray-400 px-2 py-1">
                                    +{contract.freelancer.skills.length - 3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveContractsModal;
