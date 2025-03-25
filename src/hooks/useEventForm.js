import { useState, useRef } from "react";
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
import useSWR from "swr";

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
  .refine(
    (data) => data.meetingType !== "other" || data.otherMeetingType?.trim(),
    {
      message: "Please specify the meeting type when 'Other' is selected",
      path: ["otherMeetingType"],
    }
  );

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useEventForm = ({
  initialStart,
  initialEnd,
  onClose,
  roomId,
  isMonthView,
}) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
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

  // Initial members setup
  const initialMembers = [user.name];
  const [allMembers, setAllMembers] = useState([
    {
      value: user.name,
      label: user.name,
      email: user.email || "unknown@example.com",
    },
  ]);

  const [employeeQuery, setEmployeeQuery] = useState("");

  const { data: employeeData } = useSWR(
    employeeQuery.length >= 3
      ? `${
          import.meta.env.VITE_BASE_URL
        }/api/users/search?query=${employeeQuery}`
      : null,
    fetcher,
    {
      onSuccess: (data) => {
        setEmployeeOptions(data);
        setAllMembers((prev) => [
          ...prev,
          ...data.filter((m) => !prev.some((p) => p.value === m.value)),
        ]);
      },
    }
  );

  const debouncedSetQueryRef = useRef(
    debounce((query) => {
      setEmployeeQuery(query);
    }, 500)
  );

  // Function to update query when input changes
  const fetchEmployees = (query) => {
    debouncedSetQueryRef.current(query);
  };

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      members: initialMembers,
      meetingType: "",
      otherMeetingType: "",
      start: defaultStartUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      end: defaultEndUtc.tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm"),
      email: user.email,
    },
  });

  // Form submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    const { title, members, meetingType, start, end, email, otherMeetingType } =
      data;
    const eventData = {
      title,
      organizer: members[0],
      members: members.slice(1),
      meetingType,
      start: dayjs.tz(start, dayjs.tz.guess()).utc().toISOString(),
      end: dayjs.tz(end, dayjs.tz.guess()).utc().toISOString(),
      email,
      roomId,
      ...(meetingType === "other" && {
        otherMeetingType: otherMeetingType || "",
      }),
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

  return {
    form,
    loading,
    onSubmit,
    employeeOptions,
    fetchEmployees,
    allMembers,
  };
};

export default useEventForm;
