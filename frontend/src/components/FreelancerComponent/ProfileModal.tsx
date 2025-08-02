import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Star,
  Calendar,
  Building,
  Code,
  Edit,
  Save,
  Loader2,
} from "lucide-react";
import { userApi } from "../../api/request";
import type { UserProfile } from "../../types/freelancePage";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    skills: "",
    company: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userApi.getProfile();
      setUser(profileData);
      setEditData({
        name: profileData.name || "",
        bio: profileData.bio || "",
        skills: profileData.skills?.join(", ") || "",
        company: profileData.company || "",
      });
    } catch (error) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      const updateData: any = {
        name: editData.name,
        bio: editData.bio,
      };

      if (user?.role === "freelancer") {
        updateData.skills = editData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      if (user?.role === "client") {
        updateData.company = editData.company;
      }

      const updatedProfile = await userApi.updateProfile(updateData);
      setUser(updatedProfile.user);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        company: user.company || "",
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Profile</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : error && !user ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchProfile}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="text-2xl font-bold bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-white">
                      {user?.name}
                    </h3>
                  )}
                  <p className="text-purple-400 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-300 mb-2">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="text-white pl-6">{user?.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Member Since</span>
                    </div>
                    <p className="text-white pl-6">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {user?.role === "client" && (
                    <div>
                      <div className="flex items-center space-x-2 text-gray-300 mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">Company</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.company}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ml-6"
                          placeholder="Enter company name"
                        />
                      ) : (
                        <p className="text-white pl-6">
                          {user?.company || "Not specified"}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-300 mb-2">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">Rating</span>
                    </div>
                    <div className="flex items-center space-x-2 pl-6">
                      <span className="text-yellow-400 text-lg font-bold">
                        {user?.rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(user?.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        ({user?.ratingsCount} reviews)
                      </span>
                    </div>
                  </div>

                  {user?.role === "freelancer" && (
                    <div>
                      <div className="flex items-center space-x-2 text-gray-300 mb-2">
                        <Code className="w-4 h-4" />
                        <span className="font-medium">Skills</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          value={editData.skills}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              skills: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white ml-6"
                          placeholder="Enter skills separated by commas"
                          rows={3}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 pl-6">
                          {user?.skills?.length ? (
                            user.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-400">No skills added</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <div className="flex items-center space-x-2 text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Bio</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">
                    {user?.bio || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
