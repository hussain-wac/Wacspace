import React from "react";
// Import the shadcn Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

function UpcomingMeetingsSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
      {/* Card Header */}
      <div className="p-4 border-b dark:border-neutral-800 flex justify-between items-center">
        {/* Title */}
        <Skeleton className="h-5 w-32" />
        {/* Icon */}
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>

      <div className="p-4 space-y-6">
        {/* Running Meetings Section (Skeleton) */}
        <div>
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8 ml-2 rounded-full" />
          </div>

          <div className="space-y-2">
            {/* Simulate a few running meetings */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-md" />
                  <div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings Section (Skeleton) */}
        <div>
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-8 ml-2 rounded-full" />
          </div>

          <div className="space-y-2">
            {/* Simulate a few upcoming meetings */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-800"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-md" />
                  <div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingMeetingsSkeleton;
