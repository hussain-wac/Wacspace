import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useCalendar from "../hooks/useCalendar";
import { z } from "zod";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";
import axios from "axios";
import debounce from "lodash/debounce";

dayjs.extend(utc);
dayjs.extend(timezone);

const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    members: z.array(z.string()).min(1, "At least one member required"),
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
  .refine((data) => data.meetingType !== "other" || (data.otherMeetingType?.trim()), {
    message: "Please specify the meeting type when 'Other' is selected",
    path: ["otherMeetingType"],
  });

const fetchEmployees = debounce(async (query, setEmployeeOptions, setAllMembers) => {
  if (query.length < 3) {
    setEmployeeOptions([]);
    return;
  }
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/search`, { params: { query } });
    setEmployeeOptions(response.data);
    setAllMembers((prev) => [...prev, ...response.data.filter((m) => !prev.some((p) => p.value === m.value))]);
  } catch (error) {
    console.error("Error fetching employees:", error);
    setEmployeeOptions([]);
  }
}, 300);

const useEventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const user = useAtomValue(globalState);

  const defaultStartUtc = useMemo(() => (
    isMonthView
      ? dayjs.utc().startOf("day").hour(4).minute(0)
      : initialStart ? dayjs(initialStart).utc() : dayjs.utc().startOf("hour").add(1, "hour")
  ), [initialStart, isMonthView]);

  const defaultEndUtc = useMemo(() => (
    isMonthView ? defaultStartUtc.add(30, "minute") : initialEnd ? dayjs(initialEnd).utc() : defaultStartUtc.add(1, "hour")
  ), [initialEnd, isMonthView, defaultStartUtc]);

  const initialMembers = useMemo(() => [user.name || "Muhammad Hussain N"], [user.name]);
  const [allMembers, setAllMembers] = useState([{ value: user.name, label: user.name, email: user.email || "unknown@example.com" }]);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      members: initialMembers,
      meetingType: "",
      otherMeetingType: "",
      start: defaultStartUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      end: defaultEndUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      email: user.email || "hussain.n@webandcrafts.in",
    },
  });

  const handleFetchEmployees = useCallback((query) => fetchEmployees(query, setEmployeeOptions, setAllMembers), []);

  const onSubmit = async (data) => {
    setLoading(true);
    const { title, members, meetingType, start, end, email, otherMeetingType } = data;
    const eventData = {
      title,
      organizer: members[0],
      members: members.slice(1),
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
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, onSubmit, employeeOptions, fetchEmployees: handleFetchEmployees, allMembers };
};

export default useEventForm;