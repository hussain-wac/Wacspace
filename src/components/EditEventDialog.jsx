import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

dayjs.extend(utc);
dayjs.extend(timezone);

const eventSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    start: z.string().min(1, { message: "Start time is required" }),
    end: z.string().min(1, { message: "End time is required" }),
  })
  .refine((data) => dayjs(data.start).isAfter(dayjs()), {
    message: "Start time must be in the future",
    path: ["start"],
  })
  .refine((data) => dayjs(data.end).isAfter(dayjs(data.start)), {
    message: "End time must be after start time",
    path: ["end"],
  });

// Function to format date to "YYYY-MM-DDTHH:mm" in local timezone
const formatDateTimeLocal = (date) => {
  if (!date) return "";
  return dayjs(date).tz(dayjs.tz.guess()).format("YYYY-MM-DDTHH:mm");
};

const EditEventDialog = ({ open, onOpenChange, selectedEvent, onEdit }) => {
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: selectedEvent?.title || "",
      start: selectedEvent?.start
        ? formatDateTimeLocal(selectedEvent.start)
        : "",
      end: selectedEvent?.end ? formatDateTimeLocal(selectedEvent.end) : "",
    },
    mode: "onChange",
  });

  // Set values directly instead of using useEffect
  if (selectedEvent) {
    form.setValue("title", selectedEvent.title || "");
    form.setValue(
      "start",
      selectedEvent.start ? formatDateTimeLocal(selectedEvent.start) : ""
    );
    form.setValue(
      "end",
      selectedEvent.end ? formatDateTimeLocal(selectedEvent.end) : ""
    );
  }

  const { handleSubmit } = form;

  const onSubmit = (data) => {
    const updatedEvent = {
      ...selectedEvent,
      title: data.title,
      start: dayjs.tz(data.start, dayjs.tz.guess()).utc().toISOString(),
      end: dayjs.tz(data.end, dayjs.tz.guess()).utc().toISOString(),
    };

    onEdit(selectedEvent._id, updatedEvent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <Form {...form} key={selectedEvent?._id || "new-event"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time */}
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={formatDateTimeLocal(new Date())}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
