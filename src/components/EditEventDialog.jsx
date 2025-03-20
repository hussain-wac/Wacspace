import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Helper function defined before use
const formatDateTimeLocal = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

const EditEventDialog = ({ open, onOpenChange, selectedEvent, onEdit }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setStart(selectedEvent.start ? formatDateTimeLocal(selectedEvent.start) : "");
      setEnd(selectedEvent.end ? formatDateTimeLocal(selectedEvent.end) : "");
    }
  }, [selectedEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert("Please fill in all fields");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();

    if (startDate < now) {
      alert("Start time cannot be in the past");
      return;
    }

    if (startDate >= endDate) {
      alert("End time must be after start time");
      return;
    }

    const updatedEvent = {
      ...selectedEvent,
      title,
      start: startDate,
      end: endDate,
    };

    onEdit(selectedEvent.id, updatedEvent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                min={formatDateTimeLocal(new Date())} // Prevent past dates
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                min={start} // Ensure end is after start
                required
              />
            </div>
          </div>
          <DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;