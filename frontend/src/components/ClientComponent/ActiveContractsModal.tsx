import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
} from "lucide-react";
import { contractsApi } from "../../api/request";
import { formatDate, formatBudget } from "../../utils/helpers";
import RatingModal from "./RatingModal";
import type { Contract } from "../../types/clientpage";

interface ActiveContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActiveContractsModal: React.FC<ActiveContractsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      fetchContracts();
    }
  }, [isOpen]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const contractsData = await contractsApi.getActiveContracts();
      setContracts(contractsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch contracts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteContract = async (contract: Contract) => {
    setSelectedContract(contract);
    setShowRatingModal(true);
  };

  const handleContractCompleted = async () => {
    await fetchContracts();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Active Contracts
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
                <p className="text-gray-600">Loading contracts...</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active contracts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-100 text-lg mb-2">
                          {contract.job.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {contract.job.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-200">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium ">
                              {formatBudget(contract.job.budget)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-200">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(contract.job.deadline)}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-xs font-medium">
                        {contract.status}
                      </span>
                    </div>

                    <div className="mb-4 p-3 bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-100">
                          Freelancer: {contract.freelancer.name}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {contract.freelancer.email}
                      </p>
                      {contract.freelancer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {contract.freelancer.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-100 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">
                        Started {formatDate(contract.createdAt)}
                      </p>
                      <button
                        onClick={() => handleCompleteContract(contract)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
        onComplete={handleContractCompleted}
      />
    </>
  );
};

export default ActiveContractsModal;
