import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // You'll need to install lucide-react: npm install lucide-react

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.role === "client") {
            navigate("/client");
          } else if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/freelancer");
          }
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle,_#03182d,_#080d14)]">
      <div className="w-[300px] md:w-[400px]">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-[#050e17] backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-gray-700/50 shadow-2xl">
          <div className="text-left mb-4">
            <p className="text-white font-semibold text-3xl">Sign in</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Email
              </label>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none   transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium ">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white focus:border-gray-500 focus:outline-none   transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-gray-300 transition-colors duration-200 text-sm"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f5f6fa] p-2 rounded-lg cursor-pointer font-semibold hover:bg-[#dedfe3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed  focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
            <Link
              to="/register"
              className="text-gray-300 transition-colors duration-200"
            >
              Don't have an account?{" "}
              <span className="underline hover:text-gray-200">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
