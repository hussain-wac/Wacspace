import React from "react";
// Import the shadcn Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col gap-4">
      {/* Title (e.g. Room Name) */}
      <Skeleton className="h-5 w-3/4" />

      {/* Subtitle (e.g. Capacity) */}
      <Skeleton className="h-4 w-1/2" />

      {/* Divider */}
      <div className="border-b border-neutral-200 dark:border-neutral-700" />

      {/* Section title (e.g. Room Meetings) */}
      <Skeleton className="h-5 w-1/2" />

      {/* Simulate a list of upcoming meetings */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default SkeletonCard;
