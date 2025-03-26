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
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#d1e8ff",
    margin: "2px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#000",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#ff4d4d",
      color: "white",
    },
  }),
};

const EventForm = ({ initialStart, initialEnd, onClose, roomId, isMonthView }) => {
  const { 
    form, 
    loading, 
    onSubmit, 
    employeeOptions, 
    fetchEmployees, 
    allMembers,
    isEmployeeLoading 
  } = useEventForm({
    initialStart,
    initialEnd,
    onClose,
    roomId,
    isMonthView,
  });

  const meetingType = form.watch("meetingType");
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchQuery(inputValue);
      fetchEmployees(inputValue);
    }
  };

  const handleSelectChange = (selected, { action }) => {
    if (action === "select-option" || action === "remove-value" || action === "clear") {
      const newMembers = selected ? selected.map((option) => option.value) : [];
      form.setValue("members", newMembers);
      setSearchQuery(""); // Clear search input after selection
    }
  };

  // Define options based on loading state
  const selectOptions = isEmployeeLoading
    ? [{ value: "loading", label: "Loading employees...", isDisabled: true }]
    : employeeOptions.length > 0
    ? employeeOptions
    : allMembers;

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

        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Members (First is Organizer)</FormLabel>
              <ReactSelect
                isMulti
                options={selectOptions}
                value={field.value.map((member) =>
                  allMembers.find((option) => option.value === member) || 
                  ({ value: member, label: member })
                )}
                onChange={handleSelectChange}
                onInputChange={handleInputChange}
                inputValue={searchQuery}
                placeholder="Search members (min 3 chars)..."
                isDisabled={loading}
                styles={customStyles}
                isClearable={true}
                isLoading={isEmployeeLoading} // Optional: adds a loading spinner to the select
              />
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