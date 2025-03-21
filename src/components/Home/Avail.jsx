import React from "react";

function Avail({ availability }) {
  const availabilityColor =
    availability.availabilityPercentage >= 50
      ? "bg-green-500"
      : availability.availabilityPercentage >= 20
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
        <span>Availability</span>
        <span>{availability.availabilityPercentage}%</span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-600 h-2 rounded">
        <div
          className={`h-2 rounded ${availabilityColor}`}
          style={{ width: `${availability.availabilityPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Avail;