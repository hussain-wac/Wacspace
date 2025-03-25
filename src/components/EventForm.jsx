import React from "react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import useEventForm from "../hooks/useEventForm";

// Meeting type options
const meetingTypeOptions = [
  { value: "planning", label: "Planning" },
  { value: "review", label: "Review" },
  { value: "brainstorming", label: "Brainstorming" },
  { value: "other", label: "Other" },
];

const EventForm = ({ initialStart, initialEnd, onClose, roomId }) => {
  const { form, loading, onSubmit } = useEventForm({
    initialStart,
    initialEnd,
    onClose,
    roomId,
  });

  // Watch the meetingType field for conditional rendering
  const meetingType = form.watch("meetingType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter event title"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer and Members</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., John Doe, Jane Smith, Alice"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.organizer?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meeting type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {meetingTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>
                {form.formState.errors.meetingType?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        {meetingType === "other" && (
          <FormField
            control={form.control}
            name="otherMeetingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Meeting Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meeting type"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.otherMeetingType?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} disabled={loading} />
              </FormControl>
              <FormMessage>{form.formState.errors.start?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} disabled={loading} />
              </FormControl>
              <FormMessage>{form.formState.errors.end?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Add Event"}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;