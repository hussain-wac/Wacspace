import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"; // Shadcn tooltip components


const CustomEvent = ({ event, isDarkMode }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <span>{event.title}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="bg-black text-white p-3 rounded-lg relative after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-black"
          >
            <div className="flex flex-col">
              <p className="font-medium text-sm">{event.title}</p>
              <p className="text-xs text-gray-300 mt-0.5">
                Members:{" "}
                {event.members?.length > 0 ? event.members.join(", ") : "N/A"}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };


  export default CustomEvent;