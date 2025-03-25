import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useCalendar from "../hooks/useCalendar";
import { z } from "zod";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  .refine((data) => dayjs.utc(data.end).isAfter(dayjs.utc(data.start)), {
    message: "End time must be after start time",
    path: ["end"],
  })
  .refine((data) => dayjs.utc(data.start).isSame(dayjs.utc(data.end), "day"), {
    message: "Start and end times must be on the same day (UTC)",
    path: ["end"],
  })
  .refine((data) => data.meetingType !== "other" || (data.meetingType === "other" && data.otherMeetingType?.trim()), {
    message: "Please specify the meeting type when 'Other' is selected",
    path: ["otherMeetingType"],
  });

const useEventForm = ({ initialStart, initialEnd, onClose, roomId , isMonthView}) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const user = useAtomValue(globalState);

  const defaultStartUtc = isMonthView
  ? dayjs.utc().startOf("day").hour(4).minute(0) // 9:00 AM UTC
  : initialStart
  ? dayjs(initialStart).utc()
  : dayjs.utc().startOf("hour").add(1, "hour");

const defaultEndUtc = isMonthView
  ? defaultStartUtc.add(30, "minute") // 9:30 AM UTC
  : initialEnd
  ? dayjs(initialEnd).utc()
  : defaultStartUtc.add(1, "hour");


  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      organizer: user.name || "Muhammad Hussain N",
      meetingType: "",
      otherMeetingType: "",
      start: defaultStartUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      end: defaultEndUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      email: user.email || "hussain.n@webandcrafts.in",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const [organizer, ...members] = data.organizer
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const eventData = {
      title: data.title,
      organizer: organizer || "",
      members: members.length > 0 ? members : [],
      meetingType: data.meetingType,
      start: dayjs.tz(data.start, dayjs.tz.guess()).utc().toISOString(),
      end: dayjs.tz(data.end, dayjs.tz.guess()).utc().toISOString(),
      email: data.email,
      ...(data.meetingType === "other" && { otherMeetingType: data.otherMeetingType || "" }),
    };

    try {
      console.log("Event Data to Submit:", eventData);
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
