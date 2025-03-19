import React from 'react';

function Avail({ roomId, availability }) {
    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
  
    return (
      <div className="w-full p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Available Time</p>
            <p className="text-sm font-semibold">{availability.totalAvailableMinutes} min</p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Availability</p>
            <p className="text-sm font-semibold">{availability.availabilityPercentage}</p>
          </div>
        </div>
  
        {/* Available Slots */}
        {/* <div className="space-y-2">
          {availability.availableSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-sm"
            >
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {index + 1}
                </span>
                <p>
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </p>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {Math.round(slot.duration)} min
              </p>
            </div>
          ))}
        </div> */}
      </div>
    );
  }
  
  export default Avail;