import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { tasksAPI } from "../services/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import SearchFilter from "../components/SearchFilter";
import StatsCard from "../components/StatsCard";
import {
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
} from "lucide-react";

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Show notification helper
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 5000);
  }, []);

  // Task fetching with error handling
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(filters);

      const tasksData = response.data.data?.tasks || [];
      const paginationData = response.data.data?.pagination || {};

      setTasks(tasksData);
      setPagination(paginationData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setTasks([]);
      showNotification(`Failed to load tasks: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  // Auto-refresh when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchTasks();
    }
  }, [debouncedSearch, fetchTasks]);

  // Initial load and filter changes
  useEffect(() => {
    fetchTasks();
  }, [
    filters.status,
    filters.priority,
    filters.page,
    filters.limit,
    fetchTasks,
  ]);

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      setShowTaskForm(false);
      showNotification("Task created successfully!");
      await fetchTasks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      showNotification(`Failed to create task: ${errorMessage}`, "error");
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    let previousTasks = [];

    try {
      // Optimistic update
      previousTasks = [...tasks];
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, ...taskData } : task
      );
      setTasks(updatedTasks);

      await tasksAPI.update(taskId, taskData);

      setEditingTask(null);
      setShowTaskForm(false);
      showNotification("Task updated successfully!");

      await fetchTasks(); // Ensure sync with server
    } catch (error) {
      // Revert optimistic update
      if (previousTasks.length > 0) {
        setTasks(previousTasks);
      }
      const errorMessage = error.response?.data?.message || error.message;
      showNotification(`Failed to update task: ${errorMessage}`, "error");
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    let previousTasks = [];

    try {
      // Optimistic update
      previousTasks = [...tasks];
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);

      await tasksAPI.delete(taskId);
      showNotification("Task deleted successfully!");
    } catch (error) {
      // Revert optimistic update
      if (previousTasks.length > 0) {
        setTasks(previousTasks);
      }
      const errorMessage = error.response?.data?.message || error.message;
      showNotification(`Failed to delete task: ${errorMessage}`, "error");
    }
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedTasks.size} tasks?`
      )
    ) {
      return;
    }

    let previousTasks = [];

    try {
      // Optimistic update
      previousTasks = [...tasks];
      const updatedTasks = tasks.filter((task) => !selectedTasks.has(task._id));
      setTasks(updatedTasks);

      await Promise.all(
        Array.from(selectedTasks).map((taskId) => tasksAPI.delete(taskId))
      );

      setSelectedTasks(new Set());
      showNotification(`Successfully deleted ${selectedTasks.size} tasks!`);
    } catch (error) {
      // Revert optimistic update
      if (previousTasks.length > 0) {
        setTasks(previousTasks);
      }
      const errorMessage = error.response?.data?.message || error.message;
      showNotification(`Failed to delete tasks: ${errorMessage}`, "error");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedTasks.size === 0) return;

    let previousTasks = [];

    try {
      // Optimistic update
      previousTasks = [...tasks];
      const updatedTasks = tasks.map((task) =>
        selectedTasks.has(task._id) ? { ...task, status } : task
      );
      setTasks(updatedTasks);

      await Promise.all(
        Array.from(selectedTasks).map((taskId) =>
          tasksAPI.update(taskId, { status })
        )
      );

      setSelectedTasks(new Set());
      showNotification(`Successfully updated ${selectedTasks.size} tasks!`);
    } catch (error) {
      // Revert optimistic update
      if (previousTasks.length > 0) {
        setTasks(previousTasks);
      }
      const errorMessage = error.response?.data?.message || error.message;
      showNotification(`Failed to update tasks: ${errorMessage}`, "error");
    }
  };

  // Task selection handlers
  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map((task) => task._id)));
    }
  };

  // Filter handling
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    setSelectedTasks(new Set());
    fetchTasks();
  };

  // Export functionality
  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tasks-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification("Tasks exported successfully!");
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Memoized stats calculation
  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "completed").length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      overdue: tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          task.status !== "completed"
      ).length,
    }),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification System */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Task Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || user?.email}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportTasks}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 px-4 sm:px-0">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={Calendar}
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="green"
            subtitle={`${
              stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0
            }%`}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={AlertCircle}
            color="orange"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertCircle}
            color="red"
          />
        </div>

        <div className="px-4 sm:px-0">
          {/* Enhanced Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Task Management
              </h2>
              <p className="text-sm text-gray-600">
                {tasks.length > 0
                  ? `Managing ${tasks.length} tasks${
                      selectedTasks.size > 0
                        ? ` (${selectedTasks.size} selected)`
                        : ""
                    }`
                  : "No tasks found. Create your first task to get started!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Bulk Actions */}
              {selectedTasks.size > 0 && (
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusUpdate(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    <option value="">Update Status...</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={handleBulkDelete} className="btn btn-danger">
                    Delete Selected ({selectedTasks.size})
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                  className="btn btn-primary flex items-center gap-2 justify-center"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="card">
            <TaskList
              tasks={tasks}
              loading={loading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              pagination={pagination}
              onPageChange={handlePageChange}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={
            editingTask
              ? (data) => handleUpdateTask(editingTask._id, data)
              : handleCreateTask
          }
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading tasks...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
