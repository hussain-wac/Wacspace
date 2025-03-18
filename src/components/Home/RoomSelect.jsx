import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Check, Monitor, Wifi, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const rooms = [
  {
    id: 1,
    name: "Conference A",
    capacity: 8,
    features: ["Video", "Whiteboard"],
  },
  {
    id: 2,
    name: "Huddle B",
    capacity: 4,
    features: ["Video"],
  },
  {
    id: 3,
    name: "Board Room",
    capacity: 12,
    features: ["Video", "Whiteboard", "Catering"],
  },
];

const featureIcons = {
  Video: <Monitor className="w-5 h-5" />,
  Whiteboard: <Wifi className="w-5 h-5" />,
  Catering: <Coffee className="w-5 h-5" />,
};

const featureTooltips = {
  Video: "High-quality video conferencing",
  Whiteboard: "Interactive digital whiteboard",
  Catering: "Food and beverage service",
};

function RoomSelect() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRoom) {
      navigate(`/schedule?roomId=${selectedRoom}`);
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRoom(room.id)}
              className={`relative p-6 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 
                shadow-lg cursor-pointer transition-all duration-300 flex flex-col items-center text-center 
                text-neutral-700 dark:text-neutral-200 group ${
                selectedRoom === room.id ? "ring-2 ring-neutral-400 dark:ring-neutral-500" : ""
              }`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl bg-neutral-100 dark:bg-neutral-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              {selectedRoom === room.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-neutral-700 dark:bg-neutral-500 rounded-full flex items-center justify-center text-white"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}

              <h3 className="text-xl font-semibold mb-4 z-10">{room.name}</h3>

              <div className="flex items-center mb-4 z-10">
                <Users className="w-5 h-5 mr-2 text-neutral-500 dark:text-neutral-400" />
                <span className="text-base font-medium">{room.capacity} seats</span>
              </div>

              <div className="flex gap-3 z-10">
                {room.features.map((feature) => (
                  <motion.div
                    key={feature}
                    whileHover={{ scale: 1.1 }}
                    className="relative p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full text-neutral-600 dark:text-neutral-300 tooltip"
                    data-tooltip={featureTooltips[feature]}
                  >
                    {featureIcons[feature]}
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 dark:bg-neutral-600 text-white dark:text-neutral-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {featureTooltips[feature]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedRoom}
              className={`px-8 py-3 rounded-full font-semibold text-base shadow-md transition-all duration-300
                ${
                  selectedRoom
                    ? "bg-neutral-800 dark:bg-neutral-600 text-white hover:bg-neutral-900 dark:hover:bg-neutral-700"
                    : "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                }`}
            >
              Proceed to Booking
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RoomSelect;