import React from 'react';

export const NoteSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 animate-pulse">
      {/* Title skeleton */}
      <div className="h-5 bg-gray-200 rounded mb-2" />
      
      {/* Body skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex gap-1 mb-3">
        <div className="h-6 bg-gray-200 rounded-lg w-16" />
        <div className="h-6 bg-gray-200 rounded-lg w-12" />
      </div>
      
      {/* Date skeleton */}
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  );
};