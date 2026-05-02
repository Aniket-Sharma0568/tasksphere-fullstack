import React from "react";
import TaskItem from "./TaskItem";
import { Loader, FileText, Search, Filter, Calendar } from "lucide-react";

const TaskList = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onUpdate,
  pagination,
  onPageChange,
  selectedTasks = new Set(),
  onSelectTask,
  onSelectAll,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <Loader className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-10 animate-pulse"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Tasks
          </h3>
          <p className="text-gray-600 max-w-sm">
            We're gathering your tasks. This will just take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Tasks Found
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {selectedTasks.size > 0
              ? "No tasks match your current selection. Try adjusting your filters."
              : "It looks like you don't have any tasks yet. Create your first task to get started!"}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>Try adjusting your search or filters</span>
          </div>
        </div>
      </div>
    );
  }

  const allSelected = selectedTasks.size === tasks.length && tasks.length > 0;
  const someSelected =
    selectedTasks.size > 0 && selectedTasks.size < tasks.length;

  return (
    <div className="space-y-1">
      {/* Selection Header */}
      {onSelectAll && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={onSelectAll}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {selectedTasks.size > 0
                ? `${selectedTasks.size} task${
                    selectedTasks.size !== 1 ? "s" : ""
                  } selected`
                : "Select all tasks"}
            </span>
          </div>

          {selectedTasks.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                Bulk actions available
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tasks Grid */}
      <div className="space-y-4 p-4">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            className="transform transition-all duration-300 hover:scale-[1.01]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <TaskItem
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isSelected={selectedTasks.has(task._id)}
              onSelect={() => onSelectTask?.(task._id)}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">
                  Showing{" "}
                  <span className="text-blue-600">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-blue-600">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="text-blue-600">{pagination.total}</span>{" "}
                  tasks
                </span>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Page Info */}
              <div className="text-sm text-gray-600 mr-4 hidden sm:block">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalPages}
                </span>
              </div>

              {/* Pagination Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden md:flex items-center gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, index) => {
                      const pageNum =
                        Math.max(
                          1,
                          Math.min(
                            pagination.totalPages - 4,
                            pagination.page - 2
                          )
                        ) + index;
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => onPageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                            pageNum === pagination.page
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {pagination.totalPages > 5 &&
                    pagination.page < pagination.totalPages - 2 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <button
                          onClick={() => onPageChange(pagination.totalPages)}
                          className="w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                </div>

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Page Info */}
          <div className="text-center text-sm text-gray-600 mt-4 sm:hidden">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
