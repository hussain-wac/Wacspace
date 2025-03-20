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
    fetcher,
    { keepPreviousData: true }
  );

  const events =
    data?.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })) || [];

  const [view, setView] = useState("day");
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
      mutate(
        `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
        undefined,
        { revalidate: true }
      );
    } catch (err) {
      console.error(
        "Error adding event:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleUpdateEvent = async (eventId, updatedEvent) => {
    try {
      const formattedEvent = {
        title: updatedEvent.title,
        start: new Date(updatedEvent.start).toISOString(),
        end: new Date(updatedEvent.end).toISOString(),
        roomId: effectiveRoomId,
      };

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/meetings/${eventId}`,
        formattedEvent,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Event updated successfully");

      mutate(
        `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
        undefined,
        { revalidate: true }
      );
    } catch (err) {
      console.error(
        "Error updating event:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/meetings/${eventId}`
      );
      mutate(
        `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
        undefined,
        { revalidate: true }
      );
    } catch (err) {
      console.error(
        "Error deleting event:",
        err.response ? err.response.data : err.message
      );
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
    loading: isValidating,
  };
};

export default useCalendar;