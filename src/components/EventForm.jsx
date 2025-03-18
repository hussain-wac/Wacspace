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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useEventForm from "../hooks/useEventForm";
import useProjects from "../hooks/useProjects";

const EventForm = ({ initialStart, initialEnd, onClose }) => {
  const { form, loading, onSubmit } = useEventForm({
    initialStart,
    initialEnd,
    onClose,
  });

  const { projectOptions, taskOptions, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState("");

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
              <FormLabel>Organizer Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter organizer name"
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
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedProject(value);
                }}
                defaultValue={field.value}
                disabled={loading || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{form.formState.errors.project?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading || isLoading || !selectedProject}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taskOptions(selectedProject).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{form.formState.errors.task?.message}</FormMessage>
            </FormItem>
          )}
        />

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
          {loading ? "Adding..." : "Add Event"}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
