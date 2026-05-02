import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Shield, Loader, Lock, Sparkles } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center space-y-6">
          {/* Animated Loading Container */}
          <div className="relative">
            {/* Outer Spinner */}
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>

            {/* Main Spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-indigo-400 rounded-full animate-ping opacity-75"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Securing Your Content
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              We're verifying your access permissions. This will just take a
              moment...
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-48 mx-auto bg-gray-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full animate-pulse"></div>
          </div>

          {/* Security Tips */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Your data is protected with encryption</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please sign in to access this page",
          type: "warning",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
