import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import dayjs from "dayjs";
import useCalendar from "../hooks/useCalendar";
import { z } from "zod";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";

const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    organizer: z.string().min(3, "Organizer and members must be at least 3 characters"),
    meetingType: z.string().nonempty("Please select a meeting type"),
    otherMeetingType: z.string().optional(),
    start: z.string().nonempty("Start time is required"),
    end: z.string().nonempty("End time is required"),
    email: z.string().email("Invalid email address"),
  })
  .refine((data) => dayjs(data.end).isAfter(dayjs(data.start)), {
    message: "End time must be after start time",
    path: ["end"],
  })
  .refine((data) => dayjs(data.start).isSame(dayjs(data.end), "day"), {
    message: "Start and end times must be on the same day",
    path: ["end"],
  })
  .refine((data) => data.meetingType !== "other" || (data.meetingType === "other" && data.otherMeetingType && data.otherMeetingType.length > 0), {
    message: "Please specify the meeting type when 'Other' is selected",
    path: ["otherMeetingType"],
  });

const useEventForm = ({ initialStart, initialEnd, onClose, roomId }) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const user = useAtomValue(globalState);

  // Set initial start time to current time + 1 hour, and end time to start time + 1 hour
  const now = moment();
  const defaultStart = now.add(1, "hour").format("YYYY-MM-DDTHH:mm");
  const defaultEnd = moment(defaultStart, "YYYY-MM-DDTHH:mm")
    .add(1, "hour")
    .format("YYYY-MM-DDTHH:mm");

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      organizer: user.name || "Muhammad Hussain N", // Single string input
      meetingType: "",
      otherMeetingType: "",
      start: initialStart
        ? moment(initialStart).format("YYYY-MM-DDTHH:mm")
        : defaultStart,
      end: initialEnd
        ? moment(initialEnd).format("YYYY-MM-DDTHH:mm")
        : defaultEnd,
      email: user.email || "hussain.n@webandcrafts.in",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // Split organizer string into organizer and members
    const [organizer, ...members] = data.organizer
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const eventData = {
      title: data.title,
      organizer: organizer || "",
      members: members.length > 0 ? members : [],
      meetingType: data.meetingType,
      start: dayjs(data.start).format("YYYY-MM-DDTHH:mm"), // Adjusted to match your format
      end: dayjs(data.end).format("YYYY-MM-DDTHH:mm"), // Adjusted to match your format
      email: data.email,
      ...(data.meetingType === "other" && { otherMeetingType: data.otherMeetingType || "" }),
    };

    try {
      console.log("Event Data to Submit:", eventData); // For debugging
      await handleAddEvent(eventData);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, onSubmit };
};

export default useEventForm;