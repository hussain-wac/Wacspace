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
    organizer: z.string(),
    members: z.array(z.string()).min(1, "At least one member is required"),
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
  .refine(
    (data) => data.meetingType !== "other" || data.otherMeetingType?.trim(),
    {
      message: "Please specify the meeting type when 'Other' is selected",
      path: ["otherMeetingType"],
    }
  );

const useEventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { handleAddEvent } = useCalendar();
  const user = useAtomValue(globalState);

  const defaultStartUtc = isMonthView
    ? dayjs.utc().startOf("day").hour(4).minute(0)
    : initialStart
    ? dayjs(initialStart).utc()
    : dayjs.utc().startOf("hour").add(1, "hour");

  const defaultEndUtc = isMonthView
    ? defaultStartUtc.add(30, "minute")
    : initialEnd
    ? dayjs(initialEnd).utc()
    : defaultStartUtc.add(1, "hour");

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      organizer: user.name, // organizer is set to user.name by default
      members: [], // members will be added via the tag input
      meetingType: "",
      otherMeetingType: "",
      start: defaultStartUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      end: defaultEndUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      email: user.email,
    },
  });

  // Form submit handler
  const onSubmit = async (data) => {
    const { title, organizer, members, meetingType, start, end, email, otherMeetingType } = data;
    const eventData = {
      title,
      organizer,
      members,
      meetingType,
      start: dayjs.tz(start, dayjs.tz.guess()).utc().toISOString(),
      end: dayjs.tz(end, dayjs.tz.guess()).utc().toISOString(),
      email,
      roomId,
      ...(meetingType === "other" && { otherMeetingType: otherMeetingType || "" }),
    };
    try {
      await handleAddEvent(eventData);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return {
    form,
    onSubmit,
  };
};

export default useEventForm;
