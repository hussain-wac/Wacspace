import { useState, useEffect } from "react";
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
  .refine((data) => data.meetingType !== "other" || (data.meetingType === "other" && data.otherMeetingType?.trim()), {
    message: "Please specify the meeting type when 'Other' is selected",
    path: ["otherMeetingType"],
  });

const useEventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]); // Options from search
  const [allMembers, setAllMembers] = useState([]); // All known members
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

  const initialMembers = user.name ? [user.name] : ["Muhammad Hussain N"];

  // Initialize allMembers with the initial member
  useEffect(() => {
    if (user.name && !allMembers.some((m) => m.value === user.name)) {
      setAllMembers([{ value: user.name, label: user.name, email: user.email || "unknown@example.com" }]);
    }
  }, [user.name, user.email]);

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

  const fetchEmployees = debounce(async (query) => {
    if (query.length < 3) {
      setEmployeeOptions([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/users/search`, {
        params: { query },
      });
      setEmployeeOptions(response.data);
      // Update allMembers with new search results if not already present
      setAllMembers((prev) => {
        const newMembers = response.data.filter(
          (newOption) => !prev.some((m) => m.value === newOption.value)
        );
        return [...prev, ...newMembers];
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployeeOptions([]);
    }
  }, 300);

  const onSubmit = async (data) => {
    setLoading(true);

    const organizer = data.members[0];
    const remainingMembers = data.members.slice(1);

    const eventData = {
      title: data.title,
      organizer,
      members: remainingMembers,
      meetingType: data.meetingType,
      start: dayjs.tz(data.start, dayjs.tz.guess()).utc().toISOString(),
      end: dayjs.tz(data.end, dayjs.tz.guess()).utc().toISOString(),
      email: data.email,
      roomId,
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

  useEffect(() => {
    return () => {
      fetchEmployees.cancel();
    };
  }, []);

  return { form, loading, onSubmit, employeeOptions, fetchEmployees, allMembers };
};

export default useEventForm;