import React from 'react';
import Skeleton from '../common/Skeleton';

export default function SpecialistCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col">
      <Skeleton className="w-full h-64 rounded-lg mb-4" />
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-4" />
      <Skeleton className="w-full h-16 mb-4" />
      <div className="space-y-2">
        <Skeleton className="w-2/3 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    </div>
  );
}