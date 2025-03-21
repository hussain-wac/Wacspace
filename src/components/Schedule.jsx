// Schedule.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MyCalendar from "./MyCalendar";
import Instructions from "./Instructions";
import useRoomDetails from "../hooks/useRoomDetails";

function Schedule() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const navigate = useNavigate();
  const { room} = useRoomDetails(roomId);
  return (
    <div>
      <div className="p-4 mx-auto">
        {room && (
          <>
            <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {room.name}
            </h2>
            <p className="text-center text-gray-600 dark:text-white-200">
              <span className="font-medium dark:text-gray-300">
                {room.features?.join(", ") || "None"}
              </span>
            </p>
          </>
        )}

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <div className="">
          <div>
            <MyCalendar roomId={roomId} />
          </div>
          <div className="w-full mx-auto">
            <Instructions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
