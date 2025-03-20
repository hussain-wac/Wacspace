// EventFormDialog.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export const EventFormDialog = ({ open, onOpenChange, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    roomId: initialData?.roomId || "1",
    _id: initialData?._id || null, // Add event ID for updates
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        start: initialData.start ? new Date(initialData.start) : new Date(),
        end: initialData.end ? new Date(initialData.end) : new Date(),
        roomId: initialData.roomId || "1",
        _id: initialData._id || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      start: formData.start.toISOString(),
      end: formData.end.toISOString(),
    };
    onSubmit(submitData);
    onOpenChange(false); // Close dialog after submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formData._id ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                value={formData.start.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                value={formData.end.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                required
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {formData._id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};