import React from "react";
import { Eye, Edit, Calendar, DollarSign, Users } from "lucide-react";
import type { Job } from "../../types/clientpage";
import { formatDate, formatBudget, getStatusColor } from "../../utils/helpers";

interface JobCardProps {
  job: Job;
  onViewApplications: (job: Job) => void;
  onEdit?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewApplications,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
          {job.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-medium text-gray-900">
            {formatBudget(job.budget)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(job.deadline)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span>{job.applications?.length || 0} applications</span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">{job.category}</span>
        </div>
      </div>

      {job.hiredFreelancer && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Hired:</strong> {job.hiredFreelancer.name}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {(job.applications?.length || 0) > 0 && (
          <button
            onClick={() => onViewApplications(job)}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Applications ({job.applications?.length})
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(job)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
