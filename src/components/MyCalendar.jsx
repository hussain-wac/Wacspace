import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "../hooks/useCalendar";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../hooks/useDarkMode";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { AddEventDialog } from "./AddEventDialog";
import EditEventDialog from "./EditEventDialog";
import "../styles/calendarStyles.css";
import useEventHandle from "../hooks/useEventHandle";
import CustomEvent from "./CustomEvent";
const localizer = momentLocalizer(moment);
const MyCalendar = ({ roomId }) => {
  const {
    view,
    events,
    onView,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    loading,
  } = useCalendar(roomId);


  const isMonthView = view === "month";
  const {
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
  } = useEventHandle(events, handleAddEvent,isMonthView);

  const isDarkMode = useDarkMode(handleAddEvent);

  const handleUpdateEventSubmit = async (eventId, updatedEvent) => {
    await handleUpdateEvent(eventId, updatedEvent);
    setOpenEditEvent(false);
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.status) {
      case "running":
        backgroundColor = isDarkMode ? "#10B981" : "#34D399"; // Green shades
        break;
      case "upcoming":
        backgroundColor = isDarkMode ? "#3B82F6" : "#60A5FA"; // Blue shades
        break;
      case "completed":
        backgroundColor = isDarkMode ? "#EF4444" : "#F87171"; // Red shades
        break;
      default:
        backgroundColor = isDarkMode ? "#6B7280" : "#9CA3AF"; // Default gray
    }

    const isPastEvent = moment(event.end).isBefore(moment());
    return {
      style: {
        backgroundColor,
        color: isPastEvent ? (isDarkMode ? "#E5E7EB" : "#1F2937") : "#fff",
        borderRadius: "4px",
        border: "none",
        opacity: isPastEvent ? 0.6 : 1,
        padding: "4px 8px",
        fontWeight: "500",
      },
    };
  };

  const dayPropGetter = (date) => {
    const today = moment().startOf("day").toDate();
    const isToday = moment(date).isSame(today, "day");
    const isPast = moment(date).isBefore(today, "day");
  
    if (isToday) {
      return {
        style: {
          backgroundColor: isDarkMode ? "#2C2C2C" : "#EFF6FF",
          borderRadius: "4px",
          cursor: "pointer",
        },
        className: "today-cell",
        onClick: () => onView("month"), // Keep today clickable
      };
    } else if (isPast && view !== "month") { 
      // Block past days except in month view
      return {
        style: {
          backgroundColor: isDarkMode ? "#3A3A3A" : "#B0B0B0",
          color: isDarkMode ? "#D1D5DB" : "#374151",
          opacity: 0.8,
          pointerEvents: "none", // Disable clicks on past days (except today in month view)
        },
      };
    }
    return {};
  };
  

  const filteredEvents =
    view === "day"
      ? events.filter((event) => !moment(event.end).isBefore(moment()))
      : events;

  const injectCalendarStyles = () => ({
    "--border-color": isDarkMode ? "#3A3A3A" : "#E5E7EB",
    "--text-color": isDarkMode ? "#F9FAFB" : "#1F2937",
    "--muted-text-color": isDarkMode ? "#9CA3AF" : "#6B7280",
    "--bg-color": isDarkMode ? "#1A1A1A" : "#FFFFFF",
    "--off-range-bg-color": isDarkMode ? "#242424" : "#F3F4F6",
    "--header-bg-color": isDarkMode ? "#242424" : "#F9FAFB",
    "--active-button-bg": isDarkMode ? "#333333" : "#E5E7EB",
    "--today-bg-color": isDarkMode ? "#2C2C2C" : "#EFF6FF",
    "--today-text-color": isDarkMode ? "#FFFFFF" : "#1F2937",
  });

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const isDisplayedDayToday = moment(currentCalendarDate).isSame(
    moment(),
    "day"
  );
  const minTime = view === "day" && isDisplayedDayToday ? new Date() : dayStart;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };




  return (
    <motion.div
      className="h-[90vh] p-8 bg-white dark:bg-[#1A1A1A]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        <React.Fragment key="add-event-dialog">
          <AddEventDialog
            open={openAddEvent}
            onOpenChange={setOpenAddEvent}
            selectedSlot={selectedSlot}
            onAddEvent={handleEventSubmit}
            isMonthView={isMonthView}
          />
        </React.Fragment>
        <React.Fragment key="event-details-dialog">
          <EventDetailsDialog
            open={openEventDetails}
            onOpenChange={setOpenEventDetails}
            selectedEvent={selectedEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        </React.Fragment>
        <React.Fragment key="edit-event-dialog">
          <EditEventDialog
            open={openEditEvent}
            onOpenChange={setOpenEditEvent}
            selectedEvent={selectedEvent}
            onEdit={handleUpdateEventSubmit}
          
          />
        </React.Fragment>
      </AnimatePresence>

      <motion.div
        className="h-full rounded-lg overflow-hidden relative"
        style={injectCalendarStyles()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full"
          animate={{ filter: loading ? "blur(0px)" : "blur(0px)" }}
          transition={{ duration: 0.3 }}
        >
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            views={["month", "week", "day", "agenda"]}
            view={view}
            defaultView="day"
            onView={onView}
            onNavigate={(date) => setCurrentCalendarDate(date)}
            startAccessor="start"
            endAccessor="end"
            className="h-full"
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            min={minTime}
            components={{
              event: (props) => (
                <CustomEvent {...props} isDarkMode={isDarkMode} />
              ), // Pass isDarkMode to CustomEvent
            }}
          />
        </motion.div>

        {loading && (
          <motion.div
            className="absolute inset-0 flex justify-center items-center z-50"
            variants={loaderVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col items-center py-4 bg-gray-100 dark:bg-neutral-800 bg-opacity-90 rounded-lg p-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.span
                className="mt-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading events...
              </motion.span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyCalendar;
