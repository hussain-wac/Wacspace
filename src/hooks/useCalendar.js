import { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { useSearchParams } from 'react-router-dom'
const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
};
const useCalendar = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const { data, error, isValidating } = useSWR(
    `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${roomId}`, // Pass roomId in the URL
    fetcher
  );
  const events = data?.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  })) || [];

  const [view, setView] = useState("month");
  const onView = (newView) => setView(newView);

  const handleAddEvent = async (newEvent) => {
    try {
      const newEventWithRoomId = {
        ...newEvent,
        roomId: roomId,  // Ensure roomId is included if required
      };
  
      // Make the POST request to add the new event
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/meetings`,
        newEventWithRoomId,
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Use mutate to re-fetch the data and reflect the new event
      mutate(`${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${roomId}`, undefined, { revalidate: true });
    } catch (err) {
      console.error("Error adding event:", err.response ? err.response.data : err.message);
    }
  };
  
  return { 
    view, 
    events, 
    onView, 
    handleAddEvent, 
    loading: !data && !error && isValidating 
  };
};

export default useCalendar;
