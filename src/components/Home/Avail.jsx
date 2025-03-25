import React from "react";
import useSWR from "swr";
import axios from "axios";
import { Clock, Video } from "lucide-react";
import moment from "moment";
import UpcomingMeetingsSkeleton from "../Skeltons/UpcomingMeetingsSkeleton"; // <-- import the skeleton

const fetcher = (url) => axios.get(url).then((res) => res.data);

function UpcomingMeetings({ roomId }) {
  const {
    data: meetings,
    error,
    isLoading,
  } = useSWR(
    `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${roomId}`,
    fetcher
  );

  // Separate meetings into running and upcoming
  const runningMeetings =
    meetings?.filter((meeting) => meeting.status === "running") || [];
  const upcomingMeetings =
    meetings?.filter((meeting) => meeting.status === "upcoming") || [];

  // Render loading state
  if (isLoading) {
    return <UpcomingMeetingsSkeleton />;
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full p-4 text-red-500">
        Error loading meetings: {error.message}
      </div>
    );
  }

  // Render meetings
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
      <div className="p-4 border-b dark:border-neutral-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Room Meetings
        </h2>
        <Clock className="w-5 h-5 text-neutral-500" />
      </div>

      <div className="p-4">
        {/* Running Meetings Section */}
        {runningMeetings.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-3">
              <h3 className="text-sm font-semibold mr-2">Active Meetings</h3>
              <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs px-2 py-0.5 rounded-full">
                {runningMeetings.length}
              </span>
            </div>
            <div className="space-y-2">
              {runningMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900"
                >
                  <div className="flex items-center space-x-3">
                    <Video className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{meeting.title}</div>
                      <div className="text-xs text-neutral-500">
                        {moment(meeting.start).format("MMM D, h:mm A")}
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings Section */}
        <div>
          <div className="flex items-center mb-3">
            <h3 className="text-sm font-semibold mr-2">Upcoming Meetings</h3>
            <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs px-2 py-0.5 rounded-full">
              {upcomingMeetings.length}
            </span>
          </div>
          {upcomingMeetings.length > 0 ? (
            <div className="space-y-2">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-800"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="font-medium text-sm">{meeting.title}</div>
                      <div className="text-xs text-neutral-500">
                        {moment(meeting.start).format("MMM D, h:mm A")}
                      </div>
                    </div>
                  </div>
                  <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-500 text-center py-4">
              No upcoming meetings
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingMeetings;
