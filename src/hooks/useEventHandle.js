import { useState } from "react";
import { toast } from "sonner";

const useEventHandle = (events, handleAddEvent, isMonthView) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditEvent, setOpenEditEvent] = useState(false);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [openEventDetails, setOpenEventDetails] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setOpenEditEvent(true);
  };

  const closeAddEventModal = () => {
    setOpenAddEvent(false);
    setSelectedSlot(null);
  };

  console.log("Month View:", isMonthView);

  const handleSelectSlot = (slotInfo) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (slotInfo.start < today) {
      toast("You cannot add events in the past!", {
        description: "Please select today or a future date.",
        variant: "destructive",
      });
      return;
    }

    // Apply overlap validation only when not in month view
    if (!isMonthView) {
      const selectedStart = new Date(slotInfo.start);
      const selectedEnd = new Date(slotInfo.end);

      const isOverlap = events.some(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        return (
          (selectedStart >= eventStart && selectedStart < eventEnd) || // Starts inside an existing event
          (selectedEnd > eventStart && selectedEnd <= eventEnd) || // Ends inside an existing event
          (selectedStart <= eventStart && selectedEnd >= eventEnd) // Fully contains an existing event
        );
      });

      if (isOverlap) {
        toast("Event overlaps with an existing one!", {
          description: "Please select a different time slot.",
          variant: "destructive",
        });
        return;
      }
    }

    setSelectedSlot(slotInfo);
    setOpenAddEvent(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenEventDetails(true);
  };

  const handleEventSubmit = async (eventData) => {
    await handleAddEvent({ ...eventData });
    closeAddEventModal();
  };

  return {
    handleEditEvent,
    selectedEvent,
    setOpenEditEvent,
    openEditEvent,
    setSelectedEvent,
    openAddEvent,
    setOpenAddEvent,
    openEventDetails,
    setOpenEventDetails,
    selectedSlot,
    handleSelectSlot,
    handleSelectEvent,
    handleEventSubmit,
  };
};

export default useEventHandle;
