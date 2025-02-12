import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email!");
      setError("");
    } catch (err: any) {
      setMessage("");
      setError(err.message || "Error sending reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#fff9ee] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-500">
              Enter your email to reset your password
            </p>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center text-red-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 p-3 rounded-lg flex items-center text-green-600 text-sm">
              <FaCheckCircle className="h-5 w-5 mr-2" />
              {message}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] focus:border-[#F4B860] outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#F4B860] hover:text-[#e3a24f]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
