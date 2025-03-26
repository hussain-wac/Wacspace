import { toast } from "sonner";
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
      mutate(
        `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
        undefined,
        { revalidate: true }
      );
  
      toast.success("Meeting created", {
        description: `${new Date(newEvent.start).toLocaleString()}`,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo meeting creation"),
        },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      
      if (errorMessage === "Members must be a non-empty array.") {
        toast.error("Meeting creation failed!", {
          description: "Please add at least one member to the meeting.",
        });
      } else {
        console.error(
          "Error adding event:",
          err.response ? err.response.data : err.message
        );
        toast.error("Failed to create meeting.");
      }
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
  
      mutate(
        `${import.meta.env.VITE_BASE_URL}/api/meetings?roomId=${effectiveRoomId}`,
        undefined,
        { revalidate: true }
      );
  
      toast.success("Meeting updated successfully!", {
        description: `New time: ${new Date(updatedEvent.start).toLocaleString()}`,
      });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Meeting time conflict!", {
          description: "This meeting overlaps with another scheduled meeting.",
        });
      } else {
        console.error(
          "Error updating event:",
          err.response ? err.response.data : err.message
        );
        toast.error("Failed to update meeting.");
      }
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

      toast.success("Meeting deleted successfully!");
    } catch (err) {
      console.error(
        "Error deleting event:",
        err.response ? err.response.data : err.message
      );
      toast.error("Failed to delete meeting.");
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
