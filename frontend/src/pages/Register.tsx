import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, User } from "lucide-react"; // You'll need to install lucide-react: npm install lucide-react
import MultiSelectDropdown from "../components/MultiSelectDropdown";

const SKILLS = [
  "Graphics & Design",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "Fiverr Logo Maker",
  "Programming & Tech",
  "Data",
  "Business",
  "Personal Growth & Hobbies",
  "Photography",
  "Finance",
  "End-to-End Projects",
  "Sitemap",
];
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  company?: string;
  skills?: string[];
}
export default function Register() {
  const [userType, setUserType] = useState<"client" | "freelancer" | "">("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    company: "",
    skills: [] as string[],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType,
          skills: userType === "freelancer" ? formData.skills : undefined,
          company: userType === "client" ? formData.company : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate(userType === "client" ? "/client" : "/freelancer");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (userType) {
      setUserType("");
    } else {
      navigate(-1);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle,_#03182d,_#080d14)]">
        <div className="w-[400px] max-w-md">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="bg-[#050e17] backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-white font-semibold text-3xl mb-2">
                Join Our Platform
              </h1>
              <p className="text-gray-300 text-sm">
                Choose how you'd like to get started
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setUserType("client")}
                className="w-full p-6 bg-[#05070a] border border-gray-600/50 text-white rounded-xl font-medium hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 text-left"
              >
                <div className="flex items-center gap-4">
                  <User size={24} className="text-gray-300" />
                  <div>
                    <h3 className="font-semibold mb-1">I'm a Client</h3>
                    <p className="text-gray-300 text-sm">
                      Looking to hire talented freelancers for your projects
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType("freelancer")}
                className="w-full p-6 bg-[#05070a] border border-gray-600/50 text-white rounded-xl font-medium hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 text-left"
              >
                <div className="flex items-center gap-4">
                  <Briefcase size={24} className="text-gray-300" />
                  <div>
                    <h3 className="font-semibold mb-1">I'm a Freelancer</h3>
                    <p className="text-gray-300 text-sm">
                      Ready to showcase your skills and find amazing
                      opportunities
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
              <Link
                to="/login"
                className="text-gray-300 transition-colors duration-200"
              >
                Already have an account?{" "}
                <span className="underline hover:text-gray-200">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[radial-gradient(circle,_#03182d,_#080d14)]">
      <div className="w-[512px] max-w-lg">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-[#050e17] backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-white font-semibold text-3xl mb-2">
              Create {userType === "client" ? "Client" : "Freelancer"} Account
            </h1>
            <p className="text-gray-300 text-sm">
              {userType === "client"
                ? "Set up your account to start hiring freelancers"
                : "Set up your profile to showcase your skills"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            {/* User Type Specific Fields */}
            {userType === "freelancer" && (
              <>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Skills & Expertise
                  </label>
                  <MultiSelectDropdown
                    options={SKILLS}
                    selectedOptions={formData.skills || []}
                    onSelectionChange={(skills) =>
                      setFormData({ ...formData, skills })
                    }
                    placeholder="Select your skills..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200 h-24 resize-none"
                    placeholder="Tell us about your experience and expertise..."
                  />
                </div>
              </>
            )}

            {userType === "client" && (
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-200"
                  placeholder="Enter your company name (optional)"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f5f6fa] p-2 rounded-lg cursor-pointer font-semibold hover:bg-[#dedfe3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-gray-700/50">
            <Link
              to="/login"
              className="text-gray-300 transition-colors duration-200"
            >
              Already have an account?{" "}
              <span className="underline hover:text-gray-200">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
