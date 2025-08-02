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
    <nav className="bg-gray-900 shadow-sm ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">FreelanceHub</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPostJob}
              className=" text-white hover:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </button>

            <button
              onClick={onShowContracts}
              className="text-white hover:text-gray-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Active Contracts
            </button>

            <button
              onClick={onShowProfile}
              className="text-white hover:text-gray-300 p-2 rounded-lg transition-colors"
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
