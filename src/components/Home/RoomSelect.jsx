import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Video, PenSquare, Coffee, Monitor, Mic, Tv, Loader2 } from "lucide-react";
import Avail from "./Avail";
import useRooms from "../../hooks/useRooms";

const featureIcons = {
  Video: <Video className="w-5 h-5" />,
  Whiteboard: <PenSquare className="w-5 h-5" />,
  Catering: <Coffee className="w-5 h-5" />,
  Projector: <Monitor className="w-5 h-5" />,
  Audio: <Mic className="w-5 h-5" />,
  Television: <Tv className="w-5 h-5" />,
};

function RoomSelect() {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const { rooms, isLoading, isError } = useRooms(formattedDate);

  const handleRoomSelect = (roomId) => {
    navigate(`/schedule?roomId=${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-800 dark:text-neutral-100" />
        <p className="text-neutral-800 dark:text-neutral-100">Loading rooms...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">Error loading rooms: {isError.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-6 flex flex-col items-center transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-8 text-neutral-800 dark:text-neutral-100">
        Select a Room
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
        Availability for {now.toLocaleDateString()}
      </p>
      <div className="max-w-5xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => handleRoomSelect(room.roomId)}
              className="p-4 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-100">
                {room.name || `Room ${room.roomId}`}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Capacity: {room.capacity || "N/A"}
              </p>
              <div className="flex gap-2 mb-4">
                {room.features.map((feature) =>
                  featureIcons[feature] ? (
                    <div key={feature} className="text-neutral-600 dark:text-neutral-300">
                      {featureIcons[feature]}
                    </div>
                  ) : null
                )}
              </div>
              <Avail
                availability={{
                  availabilityPercentage: room.availabilityPercentage,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomSelect;