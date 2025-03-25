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
import ReactSelect from "react-select";
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

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "38px",
    borderRadius: "4px",
  }),
  multiValue: (provided, { data }) => ({
    ...provided,
    backgroundColor: data.isFixed ? "#e0e0e0" : "#d1e8ff",
    margin: "2px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#000",
  }),
  multiValueRemove: (provided, { data }) => ({
    ...provided,
    display: data.isFixed ? "none" : "flex",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#ff4d4d",
      color: "white",
    },
  }),
};

const EventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { form, loading, onSubmit, employeeOptions, organizer } = useEventForm({
    initialStart,
    initialEnd,
    onClose,
    roomId,
    isMonthView,
  });

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
                <Input placeholder="Enter event title" {...field} disabled={loading} />
              </FormControl>
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Organizer & Members Field (like Gmail To field) */}
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer & Participants</FormLabel>
              <ReactSelect
                isMulti
                options={employeeOptions}
                value={[
                  { value: organizer, label: organizer, isFixed: true },
                  ...employeeOptions.filter((option) => field.value.includes(option.value)),
                ]}
                onChange={(selected) => {
                  const members = selected
                    .filter((option) => option.value !== organizer)
                    .map((option) => option.value);
                  field.onChange(members);
                }}
                placeholder="Add participants..."
                isDisabled={loading}
                styles={customStyles}
                isOptionDisabled={(option) => option.value === organizer}
              />
              <FormMessage>{form.formState.errors.participants?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Meeting Type Field */}
        <FormField
          control={form.control}
          name="meetingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Type</FormLabel>
              <FormControl>
                <UISelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
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
