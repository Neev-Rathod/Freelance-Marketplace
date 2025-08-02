import React, { useState, useEffect } from "react";
import { adminApi } from "../api/request";
import type { Job } from "../types/clientpage";
import type { Dispute, User } from "../types/adminPage";
import { useNavigate } from "react-router-dom";

const DisputesSection: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllDisputes(); // ✅ Using Axios
      setDisputes(data);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (
    disputeId: string,
    resolution: string,
    status: "resolved" | "rejected"
  ) => {
    try {
      setResolving(disputeId);
      const updatedDispute = await adminApi.resolveDispute(
        disputeId,
        resolution,
        status
      );
      setDisputes((prev) =>
        prev.map((d) => (d._id === disputeId ? updatedDispute : d))
      );
    } catch (error) {
      console.error("Error resolving dispute:", error);
    } finally {
      setResolving(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-300">Loading disputes...</div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Disputes Management</h2>

      {disputes.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No disputes found.</p>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <DisputeCard
              key={dispute._id}
              dispute={dispute}
              onResolve={resolveDispute}
              isResolving={resolving === dispute._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual Dispute Card Component
const DisputeCard: React.FC<{
  dispute: Dispute;
  onResolve: (
    id: string,
    resolution: string,
    status: "resolved" | "rejected"
  ) => void;
  isResolving: boolean;
}> = ({ dispute, onResolve, isResolving }) => {
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolution, setResolution] = useState("");

  const handleResolve = (status: "resolved" | "rejected") => {
    if (!resolution.trim()) {
      alert("Please provide a resolution message");
      return;
    }
    onResolve(dispute._id, resolution, status);
    setShowResolveForm(false);
    setResolution("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-900 text-yellow-200";
      case "resolved":
        return "bg-green-900 text-green-200";
      case "rejected":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {dispute.job.title}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            {dispute.job.description}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            dispute.status
          )}`}
        >
          {dispute.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Raised By:</p>
          <p className="font-medium text-white">{dispute.raisedBy.name}</p>
          <p className="text-sm text-gray-300">{dispute.raisedBy.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Against:</p>
          <p className="font-medium text-white">{dispute.against.name}</p>
          <p className="text-sm text-gray-300">{dispute.against.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400">Reason:</p>
        <p className="text-white">{dispute.reason}</p>
      </div>

      {dispute.resolution && (
        <div className="mb-4 p-3 bg-gray-700 rounded">
          <p className="text-sm text-gray-400">Resolution:</p>
          <p className="text-white">{dispute.resolution}</p>
          {dispute.admin && (
            <p className="text-xs text-gray-400 mt-1">
              Resolved by: {dispute.admin.name}
            </p>
          )}
        </div>
      )}

      {dispute.status === "open" && (
        <div className="mt-4">
          {!showResolveForm ? (
            <button
              onClick={() => setShowResolveForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isResolving}
            >
              {isResolving ? "Processing..." : "Resolve Dispute"}
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter your resolution message..."
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleResolve("resolved")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={isResolving}
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleResolve("rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  disabled={isResolving}
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowResolveForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Created: {new Date(dispute.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

// Users Management Component
const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      setDeactivating(userId);
      const updatedUser = await adminApi.deactivateUser(userId);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
    } catch (error) {
      console.error("Error deactivating user:", error);
    } finally {
      setDeactivating(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-300">Loading users...</div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Users Management</h2>

      <div className="bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-900 text-purple-200"
                        : user.role === "client"
                        ? "bg-blue-900 text-blue-200"
                        : "bg-green-900 text-green-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-900 text-green-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.isActive && user.role !== "admin" && (
                    <button
                      onClick={() => deactivateUser(user._id)}
                      disabled={deactivating === user._id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deactivating === user._id
                        ? "Deactivating..."
                        : "Deactivate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Jobs Moderation Component (you might need to add the getAllJobs endpoint)
const JobsSection: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // You might need to implement this endpoint
      const data = await adminApi.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const moderateJob = async (
    jobId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setModerating(jobId);
      const updatedJob = await adminApi.moderateJob(jobId, status);
      if (status === "rejected") {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } else {
        setJobs((prev) => prev.map((j) => (j._id === jobId ? updatedJob : j)));
      }
    } catch (error) {
      console.error("Error moderating job:", error);
    } finally {
      setModerating(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-300">Loading jobs...</div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Jobs Moderation</h2>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-300 mt-1">{job.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === "completed"
                    ? "bg-green-900 text-green-200"
                    : job.status === "cancelled"
                    ? "bg-red-900 text-red-200"
                    : job.status === "open"
                    ? "bg-yellow-900 text-yellow-200"
                    : job.status === "in progress"
                    ? "bg-blue-900 text-blue-200"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400">Client:</p>
              <p className="font-medium text-white">{job.client.name}</p>
              <p className="text-sm text-gray-300">{job.client.email}</p>
            </div>

            {job.status === "open" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => moderateJob(job._id, "approved")}
                  disabled={moderating === job._id}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {moderating === job._id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => moderateJob(job._id, "rejected")}
                  disabled={moderating === job._id}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Created: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Admin Page Component
const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"disputes" | "users" | "jobs">(
    "disputes"
  );
  const navigate = useNavigate();

  const tabs = [
    { id: "disputes" as const, label: "Disputes", component: DisputesSection },
    { id: "users" as const, label: "Users", component: UsersSection },
    { id: "jobs" as const, label: "Jobs", component: JobsSection },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || DisputesSection;

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>

          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminPage;
