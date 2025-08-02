import React, { useState, useEffect } from "react";
import { User, FileText, LogOut, Briefcase } from "lucide-react";
// import { profileAPI, authAPI } from "../utils/request";
import { userApi } from "../../api/request";
import type { UserProfile } from "../../types/freelancePage";

interface NavbarProps {
  onProfileClick: () => void;
  onActiveContractsClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onProfileClick,
  onActiveContractsClick,
  onLogout,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profileData = await userApi.getProfile();
      setUser(profileData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      onLogout();
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-purple-500" />
          <h1 className="text-xl font-bold text-white">FreelanceHub</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Active Contracts Button */}
          <button
            onClick={onActiveContractsClick}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Active Contracts</span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-400 capitalize">
                    {user?.role}
                  </div>
                </div>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
