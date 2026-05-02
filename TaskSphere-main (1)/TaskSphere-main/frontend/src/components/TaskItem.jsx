import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  Flag,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Tag,
  User,
  Archive,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          color:
            "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          text: "Completed",
          gradient: "from-green-400 to-emerald-500",
          badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        };
      case "in-progress":
        return {
          color:
            "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border-blue-200",
          icon: <Clock className="h-4 w-4 text-blue-600" />,
          text: "In Progress",
          gradient: "from-blue-400 to-cyan-500",
          badge: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
        };
      default:
        return {
          color:
            "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border-orange-200",
          icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
          text: "Pending",
          gradient: "from-orange-400 to-amber-500",
          badge: "bg-gradient-to-r from-orange-500 to-amber-600 text-white",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "text-red-600",
          icon: <Flag className="h-4 w-4 text-red-500 fill-red-500" />,
          text: "High Priority",
          badge:
            "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200",
        };
      case "medium":
        return {
          color: "text-yellow-600",
          icon: <Flag className="h-4 w-4 text-yellow-500 fill-yellow-500" />,
          text: "Medium Priority",
          badge:
            "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200",
        };
      default:
        return {
          color: "text-emerald-600",
          icon: <Flag className="h-4 w-4 text-emerald-500 fill-emerald-500" />,
          text: "Low Priority",
          badge:
            "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200",
        };
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      await onUpdate(task._id, { status: newStatus });
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(task._id);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(task._id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";
  const isDueSoon =
    task.dueDate &&
    !isOverdue &&
    new Date(task.dueDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) &&
    task.status !== "completed";

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 p-6 mb-4 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
      ></div>

      {/* Animated Border */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      >
        <div className="absolute inset-[1px] rounded-2xl bg-white"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Title and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Status Icon with Animation */}
                <div
                  className={`p-3 rounded-xl ${statusConfig.color} border transition-all duration-300 group-hover:scale-110`}
                >
                  {statusConfig.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-xl font-bold truncate transition-all duration-300 ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : "text-gray-900 group-hover:text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Status and Priority Badges */}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.badge} border transition-all duration-300 group-hover:scale-105`}
                    >
                      {statusConfig.icon}
                      <span className="ml-2">{statusConfig.text}</span>
                    </span>

                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${priorityConfig.badge} border transition-all duration-300 group-hover:scale-105`}
                    >
                      {priorityConfig.icon}
                      <span className="ml-2 capitalize">
                        {task.priority} Priority
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed text-lg">
                {task.description}
              </p>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    isOverdue
                      ? "bg-red-50 border-red-200 text-red-700"
                      : isDueSoon
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                >
                  <Calendar
                    className={`h-5 w-5 ${
                      isOverdue
                        ? "text-red-500"
                        : isDueSoon
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">
                      {formatDate(task.dueDate)}
                    </div>
                    {isOverdue && (
                      <div className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full mt-1">
                        ⚠️ Overdue
                      </div>
                    )}
                    {isDueSoon && !isOverdue && (
                      <div className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full mt-1">
                        🔥 Due Soon
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <Tag className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {task.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-300 shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="text-xs text-blue-600 font-semibold px-2 py-1">
                        +{task.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                <User className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-semibold">Created</div>
                  <div className="text-sm">{formatDate(task.createdAt)}</div>
                </div>
              </div>

              {/* Quick Actions Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <Zap className="h-5 w-5 text-gray-500" />
                <div className="text-sm font-semibold text-gray-700">
                  Quick Actions
                </div>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative ml-6">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 text-gray-400 hover:text-gray-600 transition-all duration-300 rounded-xl hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-110"
              disabled={isDeleting || isUpdating}
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />

                {/* Enhanced Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3">
                    {/* Status Section */}
                    <div className="mb-3">
                      <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-50 rounded-lg">
                        Change Status
                      </div>
                      {[
                        {
                          value: "pending",
                          label: "Mark as Pending",
                          icon: AlertCircle,
                          color: "text-orange-600",
                        },
                        {
                          value: "in-progress",
                          label: "Mark as In Progress",
                          icon: Clock,
                          color: "text-blue-600",
                        },
                        {
                          value: "completed",
                          label: "Mark as Completed",
                          icon: CheckCircle,
                          color: "text-green-600",
                        },
                      ].map(({ value, label, icon: Icon, color }) => (
                        <button
                          key={value}
                          onClick={() => handleStatusChange(value)}
                          disabled={isUpdating || task.status === value}
                          className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:translate-x-1"
                        >
                          <Icon className={`h-4 w-4 ${color}`} />
                          <span className="font-medium">{label}</span>
                          {task.status === value && (
                            <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Actions Section */}
                    <div>
                      <button
                        onClick={() => {
                          onEdit(task);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:translate-x-1"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Edit Task</span>
                      </button>

                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:translate-x-1"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {isDeleting ? "Deleting..." : "Delete Task"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Quick Actions Footer */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          {/* Status Quick Actions */}
          <div className="flex flex-wrap gap-2 flex-1">
            {task.status !== "pending" && (
              <button
                onClick={() => handleStatusChange("pending")}
                disabled={isUpdating}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-300 font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <AlertCircle className="h-4 w-4" />
                {isUpdating ? "Updating..." : "Mark Pending"}
              </button>
            )}
            {task.status !== "in-progress" && (
              <button
                onClick={() => handleStatusChange("in-progress")}
                disabled={isUpdating}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Clock className="h-4 w-4" />
                {isUpdating ? "Updating..." : "In Progress"}
              </button>
            )}
            {task.status !== "completed" && (
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={isUpdating}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all duration-300 font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <CheckCircle className="h-4 w-4" />
                {isUpdating ? "Updating..." : "Complete Task"}
              </button>
            )}
          </div>

          {/* Enhanced Delete Quick Action */}
          <button
            onClick={handleQuickDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-300 font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Enhanced Loading Overlay */}
      {(isDeleting || isUpdating) && (
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <div className="flex items-center gap-3 text-lg font-semibold text-gray-700">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            {isDeleting ? "Deleting task..." : "Updating task..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
