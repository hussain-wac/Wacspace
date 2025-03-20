import React, { useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const eventSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    start: z.string().min(1, { message: "Start time is required" }),
    end: z.string().min(1, { message: "End time is required" }),
  })
  .refine((data) => new Date(data.start) > new Date(), {
    message: "Start time must be in the future",
    path: ["start"],
  })
  .refine((data) => new Date(data.end) > new Date(data.start), {
    message: "End time must be after start time",
    path: ["end"],
  });

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const localDateTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000); // Convert to local time
    return localDateTime.toISOString().slice(0, 16);
  };

const EditEventDialog = ({ open, onOpenChange, selectedEvent, onEdit }) => {

  
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: selectedEvent?.title,
      start: selectedEvent?.start,
      end: selectedEvent?.end,
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (selectedEvent) {
      reset({
        title: selectedEvent.title || "",
        start: selectedEvent.start ? formatDateTimeLocal(selectedEvent.start) : "",
        end: selectedEvent.end ? formatDateTimeLocal(selectedEvent.end) : "",
      });
    }
  }, [selectedEvent, reset]);
  

  const onSubmit = (data) => {
    const updatedEvent = {
      ...selectedEvent,
      title: data.title,
      start: new Date(data.start), // Convert back to Date object
      end: new Date(data.end),
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
