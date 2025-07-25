import React from "react";
import { User, FileText, Plus, Briefcase } from "lucide-react";

interface NavbarProps {
  onShowProfile: () => void;
  onShowContracts: () => void;
  onPostJob: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onShowProfile,
  onShowContracts,
  onPostJob,
}) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">
              FreelanceHub
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPostJob}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </button>

            <button
              onClick={onShowContracts}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Active Contracts
            </button>

            <button
              onClick={onShowProfile}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
