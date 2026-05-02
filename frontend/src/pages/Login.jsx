import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { testBackendReachable } from "../services/api";
import { validateEmail, validatePassword } from "../utils/validation";
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Wifi,
  WifiOff,
  Loader,
  Shield,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // 'checking', 'online', 'offline'

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    checkBackendStatus();
  }, [isAuthenticated, navigate, from]);

  const checkBackendStatus = async () => {
    setBackendStatus("checking");
    try {
      const result = await testBackendReachable();
      setBackendStatus(result.success ? "online" : "offline");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(
        formData.email.toLowerCase().trim(),
        formData.password
      );

      if (!result.success) {
        let errorMessage = result.message;

        if (
          result.message.includes("Network Error") ||
          result.message.includes("CORS")
        ) {
          errorMessage =
            "Cannot connect to server. Please check your internet connection and try again.";
        } else if (result.message.includes("timeout")) {
          errorMessage =
            "Server is taking too long to respond. Please try again in a moment.";
        } else if (
          result.message.includes("401") ||
          result.message.includes("Invalid credentials")
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (
          result.message.includes("404") ||
          result.message.includes("not found")
        ) {
          errorMessage =
            "Account not found. Please check your email or register for a new account.";
        } else if (
          result.message.includes("400") ||
          result.message.includes("validation")
        ) {
          errorMessage = "Please check your information and try again.";
        }

        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      setErrors({
        submit: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@example.com",
      password: "demopassword123",
    });

    setTimeout(() => {
      document
        .querySelector("form")
        .dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
    }, 500);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <strong className="font-semibold">Login Failed</strong>
                    <p className="mt-1">{errors.submit}</p>
                    {backendStatus === "offline" && (
                      <p className="mt-2 text-xs">
                        The server appears to be offline. Please try again
                        later.
                      </p>
                    )}
                    {errors.submit?.includes("Invalid email or password") && (
                      <p className="mt-2 text-xs">
                        Forgot your password?{" "}
                        <Link
                          to="/forgot-password"
                          className="underline hover:no-underline font-medium"
                        >
                          Reset it here
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || backendStatus === "offline"}
                className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>

              {backendStatus === "offline" && (
                <p className="text-xs text-red-600 text-center">
                  Login is temporarily unavailable. Please check your
                  connection.
                </p>
              )}
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
