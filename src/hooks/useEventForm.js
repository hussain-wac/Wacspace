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
    organizer: z.string().min(3, "Organizer name must be at least 3 characters"),
    project: z.string().nonempty("Please select a project"),
    task: z.string().nonempty("Please select a task"),
    start: z.string().nonempty("Start time is required"),
    end: z.string().nonempty("End time is required"),
  })
  .refine((data) => dayjs(data.end).isAfter(dayjs(data.start)), {
    message: "End time must be after start time",
    path: ["end"],
  });

const useEventForm = ({ initialStart, initialEnd, onClose, roomId }) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const user = useAtomValue(globalState);

 const form = useForm({
  resolver: zodResolver(eventSchema),
  defaultValues: {
    title: "Team meeting",
    organizer: user.name,
    project: "",
    task: "",
    start: initialStart 
      ? moment(initialStart).format("YYYY-MM-DDTHH:mm") 
      : moment().set({ hour: 9, minute: 0, second: 0 }).format("YYYY-MM-DDTHH:mm"),
    end: initialEnd 
      ? moment(initialEnd).format("YYYY-MM-DDTHH:mm") 
      : moment().set({ hour: 10, minute: 0, second: 0 }).format("YYYY-MM-DDTHH:mm"), // Default end at 10 AM
    roomId: roomId,
    email: user.email,
  },
});


  const onSubmit = async (data) => {
    setLoading(true);
    const eventData = {
      title: data.title,
      organizer: data.organizer,
      project: data.project,
      task: data.task,
      start: dayjs(data.start).toISOString(),
      end: dayjs(data.end).toISOString(),
      roomId: roomId,
      email: user.email,
    };
    // console.log(eventData)
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

  return { form, loading, onSubmit };
};

export default useEventForm;
