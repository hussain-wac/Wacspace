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
    participants: z.array(z.string()).min(1, "At least one participant required"),
    meetingType: z.string().nonempty("Please select a meeting type"),
    otherMeetingType: z.string().optional(),
    start: z.string().nonempty("Start time is required"),
    end: z.string().nonempty("End time is required"),
  })
  .refine((data) => dayjs.utc(data.end).isAfter(dayjs.utc(data.start)), {
    message: "End time must be after start time",
    path: ["end"],
  });

const useEventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { handleAddEvent } = useCalendar();
  const [loading, setLoading] = useState(false);
  const user = useAtomValue(globalState);

  // Hardcoded employee names for now
  const employeeOptions = [
    { value: "Aarav Sharma", label: "Aarav Sharma" },
    { value: "Aditi Verma", label: "Aditi Verma" },
    { value: "Akhil Reddy", label: "Akhil Reddy" },
    { value: "Ananya Iyer", label: "Ananya Iyer" },
    { value: "Arjun Patel", label: "Arjun Patel" },
    { value: "Bhavya Nair", label: "Bhavya Nair" },
    { value: "Chetan Mehta", label: "Chetan Mehta" },
    { value: "Deepika Malhotra", label: "Deepika Malhotra" },
    { value: "Devansh Sinha", label: "Devansh Sinha" },
    { value: "Esha Kulkarni", label: "Esha Kulkarni" },
    { value: "Farhan Khan", label: "Farhan Khan" },
    { value: "Gaurav Saxena", label: "Gaurav Saxena" },
    { value: "Himani Joshi", label: "Himani Joshi" },
    { value: "Ishaan Deshmukh", label: "Ishaan Deshmukh" },
    { value: "Jahnavi Rao", label: "Jahnavi Rao" },
    { value: "Karthik Menon", label: "Karthik Menon" },
    { value: "Lavanya Pillai", label: "Lavanya Pillai" },
    { value: "Manish Gupta", label: "Manish Gupta" },
    { value: "Neha Thakur", label: "Neha Thakur" },
    { value: "Om Prasad", label: "Om Prasad" },
    { value: "Pooja Agarwal", label: "Pooja Agarwal" },
    { value: "Qasim Sheikh", label: "Qasim Sheikh" },
    { value: "Ravi Choudhary", label: "Ravi Choudhary" },
    { value: "Sakshi Kapoor", label: "Sakshi Kapoor" },
    { value: "Tanmay Ranganathan", label: "Tanmay Ranganathan" },
    { value: "Ujjwal Tiwari", label: "Ujjwal Tiwari" },
    { value: "Vineet Das", label: "Vineet Das" },
    { value: "Waseem Ansari", label: "Waseem Ansari" },
    { value: "Xavier D'Souza", label: "Xavier D'Souza" },
    { value: "Yash Khandelwal", label: "Yash Khandelwal" },
    { value: "Zoya Mirza", label: "Zoya Mirza" },
    { value: "Abhinav Bhatia", label: "Abhinav Bhatia" },
    { value: "Barkha Seth", label: "Barkha Seth" },
    { value: "Chirag Mathur", label: "Chirag Mathur" },
    { value: "Divya Narayan", label: "Divya Narayan" },
    { value: "Eklavya Trivedi", label: "Eklavya Trivedi" },
    { value: "Falguni Ghosh", label: "Falguni Ghosh" },
    { value: "Girish Banerjee", label: "Girish Banerjee" },
    { value: "Hina Desai", label: "Hina Desai" },
    { value: "Indrajit Mishra", label: "Indrajit Mishra" },
    { value: "Jasleen Arora", label: "Jasleen Arora" },
    { value: "Krishna Mohan", label: "Krishna Mohan" },
    { value: "Lalit Venkatesh", label: "Lalit Venkatesh" },
    { value: "Meera Swaminathan", label: "Meera Swaminathan" },
    { value: "Nitin Kaur", label: "Nitin Kaur" },
    { value: "Omkara Vishwanathan", label: "Omkara Vishwanathan" },
    { value: "Parvati Krishnan", label: "Parvati Krishnan" },
    { value: "Rajeshwar Iyengar", label: "Rajeshwar Iyengar" }
];


  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "Team meeting",
      participants: ["Muhammad Hussain N"], // Default organizer
      meetingType: "",
      otherMeetingType: "",
      start: dayjs.utc(initialStart || dayjs()).format("YYYY-MM-DDTHH:mm"),
      end: dayjs.utc(initialEnd || dayjs().add(1, "hour")).format("YYYY-MM-DDTHH:mm"),
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // The first participant is the organizer
    const organizer = data.participants.length > 0 ? data.participants[0] : "Muhammad Hussain N";
    const members = data.participants.slice(1); // All other participants are members

    const eventData = {
      title: data.title,
      organizer,
      members,
      meetingType: data.meetingType,
      start: dayjs.utc(data.start).toISOString(),
      end: dayjs.utc(data.end).toISOString(),
      email: user.email || "hussain.n@webandcrafts.in",
      roomId,
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

  return { form, loading, onSubmit, employeeOptions };
};

export default useEventForm;
