import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Video, 
  PenSquare, 
  Coffee, 
  Monitor,
  Mic, 
  Tv ,
  Loader2

} from "lucide-react";
import { motion } from "framer-motion";
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

const featureTooltips = {
  Video: "High-quality video conferencing",
  Whiteboard: "Interactive digital whiteboard",
  Catering: "Food and beverage service",
  Projector: "Presentation projector",
  Audio: "Premium audio system",
  Television: "Large screen television",
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
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-neutral-800 dark:text-neutral-100"
      >
        Select a Room
      </motion.h2>

      <div className="max-w-5xl w-full">
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
          Availability for {now.toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room.roomId}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoomSelect(room.roomId)}
              className="relative p-6 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 
                shadow-lg cursor-pointer transition-all duration-300 flex flex-col items-center text-center 
                text-neutral-700 dark:text-neutral-200 group"
            >
              <div className="absolute inset-0 rounded-xl bg-neutral-100 dark:bg-neutral-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              <h3 className="text-xl font-semibold mb-4 z-10">
                {room.name || `Room ${room.roomId}`}
              </h3>

              <div className="flex items-center mb-4 z-10">
                <Users className="w-5 h-5 mr-2 text-neutral-500 dark:text-neutral-400" />
                <span className="text-base font-medium">{room.capacity || "N/A"} seats</span>
              </div>

              <div className="flex gap-3 mb-4 z-10">
                {room.features.map((feature) => (
                  featureIcons[feature] && (
                    <motion.div
                      key={feature}
                      whileHover={{ scale: 1.1 }}
                      className="relative p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full text-neutral-600 dark:text-neutral-300 tooltip"
                      data-tooltip={featureTooltips[feature]}
                    >
                      {featureIcons[feature]}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 dark:bg-neutral-600 text-white dark:text-neutral-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {featureTooltips[feature]}
                      </span>
                    </motion.div>
                  )
                ))}
              </div>

              <Avail
                roomId={room.roomId}
                availability={{
                  totalAvailableMinutes: room.totalAvailableMinutes,
                  availabilityPercentage: room.availabilityPercentage,
                  availableSlots: room.availableSlots,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomSelect;