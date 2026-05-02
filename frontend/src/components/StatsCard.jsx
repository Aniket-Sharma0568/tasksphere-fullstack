import React from "react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  trend,
  loading = false,
}) => {
  const colorConfig = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      icon: "text-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
      gradient: "from-blue-500 to-blue-600",
      light: "text-blue-500",
    },
    green: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      icon: "text-green-600",
      text: "text-green-600",
      border: "border-green-200",
      gradient: "from-green-500 to-green-600",
      light: "text-green-500",
    },
    yellow: {
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      icon: "text-yellow-600",
      text: "text-yellow-600",
      border: "border-yellow-200",
      gradient: "from-yellow-500 to-yellow-600",
      light: "text-yellow-500",
    },
    red: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      icon: "text-red-600",
      text: "text-red-600",
      border: "border-red-200",
      gradient: "from-red-500 to-red-600",
      light: "text-red-500",
    },
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      icon: "text-purple-600",
      text: "text-purple-600",
      border: "border-purple-200",
      gradient: "from-purple-500 to-purple-600",
      light: "text-purple-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      icon: "text-indigo-600",
      text: "text-indigo-600",
      border: "border-indigo-200",
      gradient: "from-indigo-500 to-indigo-600",
      light: "text-indigo-500",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border ${config.border} p-6 animate-pulse`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${config.iconBg} rounded-xl`}></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${config.border} p-6 hover:scale-[1.02] cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`relative overflow-hidden ${config.iconBg} rounded-xl w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`h-6 w-6 ${config.icon} relative z-10`} />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className={`text-xs font-medium ${config.light} mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {trend && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend.value > 0
                ? "text-green-600"
                : trend.value < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {trend.value > 0 ? "↗" : trend.value < 0 ? "↘" : "→"}
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Progress bar for completion-based stats */}
      {(title === "Completed" || title === "Progress") && subtitle && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{subtitle}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500 ease-out`}
              style={{
                width: subtitle.includes("%") ? subtitle : "0%",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      >
        <div
          className={`bg-gradient-to-br ${config.gradient} w-full h-full rounded-bl-full`}
        ></div>
      </div>
    </div>
  );
};

export default StatsCard;
