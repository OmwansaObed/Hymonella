import React from "react";
import { Music } from "lucide-react";

const LoadingSpinner = ({ size = "medium", fullPage = false }) => {
  // Size configurations
  const sizeClasses = {
    small: {
      outer: "w-6 h-6",
      inner: "w-4 h-4",
      icon: 12,
    },
    medium: {
      outer: "w-10 h-10",
      inner: "w-8 h-8",
      icon: 20,
    },
    large: {
      outer: "w-16 h-16",
      inner: "w-12 h-12",
      icon: 32,
    },
  };

  const { outer, inner, icon } = sizeClasses[size] || sizeClasses.medium;

  // Container styles based on whether it's fullPage or inline
  const containerClasses = fullPage
    ? "flex flex-col justify-center items-center h-full min-h-32"
    : "flex flex-col justify-center items-center py-4";

  return (
    <div className={containerClasses}>
      {/* Spinner with gradient border */}
      <div className="relative">
        {/* Outer spinner with gradient */}
        <div
          className={`${outer} rounded-full animate-spin-slow bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500`}
        >
          <div className="absolute inset-0.5 bg-white rounded-full"></div>
        </div>

        {/* Inner spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${inner} border-2 border-transparent border-t-indigo-600 border-r-purple-500 rounded-full animate-spin`}
          >
            {/* Optional musical note in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Music size={icon} className="text-indigo-400 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Optional loading text */}
      <p className="mt-3 text-sm font-medium text-indigo-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;
