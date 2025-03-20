// useEventHandle.js
import  { useState } from "react";
import { toast } from "sonner";

const useEventHandle = (events, handleAddEvent) => {
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

  const handleSelectSlot = (slotInfo) => {
    const now = new Date();

    if (slotInfo.start < now) {
      toast("You cannot add events in the past!", {
        description: "Please select a future time slot.",
        variant: "destructive",
      });
      return;
    }

    const overlapping = events.some((ev) => {
      const eventStart = new Date(ev.start);
      const eventEnd = new Date(ev.end);
      return slotInfo.start < eventEnd && slotInfo.end > eventStart;
    });
    if (overlapping) {
      toast("Selected time overlaps with an existing event!", {
        description: "Please choose a different time slot.",
        variant: "destructive",
      });
      return;
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
