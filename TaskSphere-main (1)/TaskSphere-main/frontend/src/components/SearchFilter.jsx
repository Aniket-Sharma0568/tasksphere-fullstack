import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Flag,
  Clock,
} from "lucide-react";

const SearchFilter = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (value) => {
    onFilterChange({ search: value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      status: "",
      priority: "",
      page: 1,
    });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority;

  const getFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.search) count++;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <div className="space-y-4">
      {/* Main Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 transition-opacity duration-300 ${
              isSearchFocused ? "opacity-10" : ""
            }`}
          ></div>
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                isSearchFocused ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search tasks by title, description, or tags..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-900 shadow-sm hover:shadow-md"
            />
            {filters.search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 border shadow-sm hover:shadow-md ${
              hasActiveFilters
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent transform hover:scale-105"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {filterCount > 0 && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  hasActiveFilters
                    ? "bg-white text-blue-600"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {filterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <X className="h-5 w-5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Filter Panel */}
      {showFilters && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 animate-slideDown">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Tasks
                </h3>
                <p className="text-sm text-gray-600">Refine your task view</p>
              </div>
            </div>
            {filterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4 text-blue-500" />
                Status
              </label>
              <div className="space-y-2">
                {[
                  { value: "", label: "All Statuses", color: "bg-gray-100" },
                  {
                    value: "pending",
                    label: "Pending",
                    color: "bg-orange-100 text-orange-700",
                  },
                  {
                    value: "in-progress",
                    label: "In Progress",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    value: "completed",
                    label: "Completed",
                    color: "bg-green-100 text-green-700",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange("status", option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      filters.status === option.value
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                        : `${option.color} hover:scale-105 hover:shadow-md`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Flag className="h-4 w-4 text-red-500" />
                Priority
              </label>
              <div className="space-y-2">
                {[
                  { value: "", label: "All Priorities", color: "bg-gray-100" },
                  {
                    value: "low",
                    label: "Low",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    value: "medium",
                    label: "Medium",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    value: "high",
                    label: "High",
                    color: "bg-red-100 text-red-700",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange("priority", option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      filters.priority === option.value
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                        : `${option.color} hover:scale-105 hover:shadow-md`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-purple-500" />
                Quick Views
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleFilterChange("status", "pending");
                    handleFilterChange("priority", "high");
                  }}
                  className="w-full text-left px-4 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all duration-200 font-medium hover:scale-105 hover:shadow-md"
                >
                  🔥 Urgent Tasks
                </button>
                <button
                  onClick={() => handleFilterChange("status", "completed")}
                  className="w-full text-left px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium hover:scale-105 hover:shadow-md"
                >
                  ✅ Completed Tasks
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleSearchChange("")}
                      className="hover:text-blue-900 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterChange("status", "")}
                      className="hover:text-orange-900 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.priority && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                    Priority: {filters.priority}
                    <button
                      onClick={() => handleFilterChange("priority", "")}
                      className="hover:text-red-900 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchFilter;
