import React from "react";

function Avail({ availability }) {
  return (
    <div className="w-full p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 flex flex-col items-center">
      {/* Availability Traffic Light */}
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
        Availability
      </p>
      <div className="flex flex-row items-center space-x-2">
        <div className={`w-6 h-6 rounded-full bg-red-500 ${availability.availabilityPercentage < 20 ? "opacity-100" : "opacity-30"}`}></div>
        <div className={`w-6 h-6 rounded-full bg-yellow-500 ${availability.availabilityPercentage >= 20 && availability.availabilityPercentage < 30 ? "opacity-100" : "opacity-30"}`}></div>
        <div className={`w-6 h-6 rounded-full bg-green-500 ${availability.availabilityPercentage >= 30 ? "opacity-100" : "opacity-30"}`}></div>
      </div>
      <p className="mt-2 text-lg font-semibold">
        {availability.availabilityPercentage}%
      </p>
    </div>
  );
}

export default Avail;
