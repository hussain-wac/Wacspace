// useCalendar.jsx
import { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
};

const useCalendar = (roomId) => {
  const [searchParams] = useSearchParams();
  const effectiveRoomId = roomId || searchParams.get("roomId");
  const { data, error, isValidating } = useSWR(
    `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
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
        roomId: effectiveRoomId,
      };
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/meetings`,
        newEventWithRoomId,
        { headers: { "Content-Type": "application/json" } }
      );
      mutate(`${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`, undefined, { revalidate: true });
    } catch (err) {
      console.error("Error adding event:", err.response ? err.response.data : err.message);
    }
  };

  const handleUpdateEvent = async (eventId, updatedEvent) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/meetings/${eventId}`,
        updatedEvent,
        { headers: { "Content-Type": "application/json" } }
      );
      mutate(`${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`, undefined, { revalidate: true });
    } catch (err) {
      console.error("Error updating event:", err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/meetings/${eventId}`
      );
      mutate(`${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`, undefined, { revalidate: true });
    } catch (err) {
      console.error("Error deleting event:", err.response ? err.response.data : err.message);
    }
  };

  return {
    error,
    view,
    events,
    onView,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    loading: !data && !error && isValidating,
  };
};

export default useCalendar;