import React, { useState } from "react";
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
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import useEventForm from "../hooks/useEventForm";

const meetingTypeOptions = [
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
  { value: "other", label: "Other" },
];

const EventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { form, onSubmit } = useEventForm({
    initialStart,
    initialEnd,
    onClose,
    roomId,
    isMonthView,
  });
  const meetingType = form.watch("meetingType");
  const loading = form.formState.isSubmitting;

  // State for handling the tag input for members
  const [tagInput, setTagInput] = useState("");
  const [memberTags, setMemberTags] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !memberTags.includes(value)) {
        const newTags = [...memberTags, value];
        setMemberTags(newTags);
        form.setValue("members", newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    const newTags = memberTags.filter((_, i) => i !== index);
    setMemberTags(newTags);
    form.setValue("members", newTags);
  };

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
                <Input placeholder="Enter event title" {...field} disabled={loading} />
              </FormControl>
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Organizer field (now editable) */}
        <FormField
          control={form.control}
          name="organizer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter organizer name" disabled={loading} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Custom tag input for members */}
        <FormField
          control={form.control}
          name="members"
          render={() => (
            <FormItem>
              <FormLabel>Members</FormLabel>
              <div className="flex flex-wrap items-center gap-2 p-2 border rounded">
                {memberTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a member and press Enter or comma"
                  className="outline-none flex-1 min-w-[100px]"
                  disabled={loading}
                />
              </div>
              <FormMessage>{form.formState.errors.members?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Type</FormLabel>
              <FormControl>
                <UISelect onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UISelect>
              </FormControl>
              <FormMessage>{form.formState.errors.meetingType?.message}</FormMessage>
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
                  <Input placeholder="Enter meeting type" {...field} disabled={loading} />
                </FormControl>
                <FormMessage>{form.formState.errors.otherMeetingType?.message}</FormMessage>
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Add Event"}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
