import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Check, Monitor, Wifi, Coffee } from "lucide-react";

const rooms = [
  { id: 1, name: "Conference A", capacity: 8, features: ["Video", "Whiteboard"] },
  { id: 2, name: "Huddle B", capacity: 4, features: ["Video"] },
  { id: 3, name: "Board Room", capacity: 12, features: ["Video", "Whiteboard", "Catering"] },
];

const featureIcons = {
  Video: <Monitor className="w-5 h-5" />,
  Whiteboard: <Wifi className="w-5 h-5" />,
  Catering: <Coffee className="w-5 h-5" />,
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-stone-900 dark:to-stone-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900 dark:text-indigo-200 animate-fade-in">
          Pick Your Room
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`relative p-6 rounded-xl bg-white dark:bg-stone-800 shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selectedRoom === room.id 
                  ? "ring-2 ring-indigo-500 scale-105" 
                  : "hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-700"
              }`}
            >
              {selectedRoom === room.id && (
                <Check className="absolute top-2 right-2 w-6 h-6 text-indigo-500 animate-bounce" />
              )}

              <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
                {room.name}
              </h3>

              <div className="flex items-center text-stone-600 dark:text-stone-300 mb-4">
                <Users className="w-5 h-5 mr-2" />
                <span>{room.capacity} seats</span>
              </div>

              <div className="flex gap-3">
                {room.features.map((feature) => (
                  <div
                    key={feature}
                    className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 tooltip"
                    data-tip={feature}
                  >
                    {featureIcons[feature]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRoom}
          className={`mt-10 mx-auto block px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
            selectedRoom
              ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          Got to room
        </button>

        <style>{`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in;
          }

          .animate-bounce {
            animation: bounce 0.5s infinite alternate;
          }

          .tooltip {
            position: relative;
          }

          .tooltip:hover:after {
            content: attr(data-tip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default RoomSelect;