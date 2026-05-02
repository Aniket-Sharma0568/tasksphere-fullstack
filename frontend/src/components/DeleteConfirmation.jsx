import React from "react";
import {
  AlertTriangle,
  X,
  Trash2,
  Shield,
  Sparkles,
  Archive,
} from "lucide-react";

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  type = "task",
}) => {
  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case "task":
        return {
          icon: Trash2,
          title: "Delete Task",
          description: `Are you sure you want to delete "${taskTitle}"?`,
          warning:
            "This action cannot be undone. The task will be permanently removed from your workspace.",
          confirmText: "Delete Task",
          gradient: "from-red-500 to-pink-600",
          bgGradient: "from-red-50 to-pink-50",
          borderColor: "border-red-200",
        };
      case "bulk":
        return {
          icon: Archive,
          title: "Delete Multiple Tasks",
          description: `Are you sure you want to delete ${taskTitle} tasks?`,
          warning:
            "This action cannot be undone. All selected tasks will be permanently removed.",
          confirmText: "Delete All",
          gradient: "from-orange-500 to-red-600",
          bgGradient: "from-orange-50 to-red-50",
          borderColor: "border-orange-200",
        };
      default:
        return {
          icon: Trash2,
          title: "Confirm Deletion",
          description: `Are you sure you want to delete "${taskTitle}"?`,
          warning:
            "This action cannot be undone. The item will be permanently removed.",
          confirmText: "Delete",
          gradient: "from-red-500 to-pink-600",
          bgGradient: "from-red-50 to-pink-50",
          borderColor: "border-red-200",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl shadow-2xl max-w-md w-full transform animate-scaleIn overflow-hidden border ${config.borderColor}`}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${config.gradient} p-6 relative overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {config.title}
                  </h2>
                  <p className="text-red-100 text-sm mt-1">
                    Permanent action required
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 transform hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-200">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
              {config.description}
            </h3>
            <p className="text-gray-600 leading-relaxed">{config.warning}</p>
          </div>

          {/* Security Note */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Security Notice</p>
                <p className="text-gray-600 mt-1">
                  This action is irreversible. Please ensure you have backed up
                  any important information.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md`}
            >
              <Icon className="h-5 w-5" />
              {config.confirmText}
            </button>
          </div>

          {/* Additional Warning */}
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              This action cannot be reversed
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-200 to-transparent opacity-50"></div>
      </div>

      {/* Backdrop Click Handler */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmation;
