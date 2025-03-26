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
          sideOffset={5} // Adjust this offset as needed
          className="bg-black text-white p-3 rounded-lg"
        >
          <div className="flex flex-col">
            <p className="font-medium text-sm">{event.title}</p>
            <p className="">
                  {event.members?.length > 0
                    ? event.members.map((member, index) => (
                        <span key={index}>
                          {member.name}
                          {index <event.members.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "N/A"}
                </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomEvent;
