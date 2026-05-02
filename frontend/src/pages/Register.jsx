import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { testBackendReachable } from "../services/api";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateDateOfBirth,
} from "../utils/validation";
import {
  Eye,
  EyeOff,
  UserPlus,
  Calendar,
  AlertCircle,
  Wifi,
  WifiOff,
  Loader,
  User,
  Mail,
  Lock,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // 'checking', 'online', 'offline'

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }

    checkBackendStatus();
  }, [isAuthenticated, navigate]);

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

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.toLowerCase().trim(),
        formData.password,
        formData.dateOfBirth
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
          result.message.includes("409") ||
          result.message.includes("already exists")
        ) {
          errorMessage =
            "An account with this email already exists. Please use a different email or try logging in.";
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

  const getBackendStatusIcon = () => {
    switch (backendStatus) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "checking":
        return <Loader className="h-4 w-4 text-gray-500 animate-spin" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-gray-600">Join us today and get started</p>
          </div>


          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <strong className="font-semibold">
                      Registration Failed
                    </strong>
                    <p className="mt-1">{errors.submit}</p>
                    {backendStatus === "offline" && (
                      <p className="mt-2 text-xs">
                        The server appears to be offline. Please try again
                        later.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Date of Birth Field */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.dateOfBirth
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Password Field */}
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    disabled={isSubmitting}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>

              {backendStatus === "offline" && (
                <p className="text-xs text-red-600 text-center">
                  Registration is temporarily unavailable. Please check your
                  connection.
                </p>
              )}
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
