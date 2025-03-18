import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import moment from "moment";
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export const EventDetailsDialog = ({ open, onOpenChange, selectedEvent }) => {
  if (!selectedEvent) return null;

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
            <DialogTitle>{selectedEvent.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizer</p>
              <p className="text-gray-900 dark:text-gray-100">{selectedEvent.organizer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</p>
              <p className="text-gray-900 dark:text-gray-100">{selectedEvent.project}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Time</p>
              <p className="text-gray-900 dark:text-gray-100">
                {moment(selectedEvent.start).format("MMMM D, YYYY h:mm A")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</p>
              <p className="text-gray-900 dark:text-gray-100">
                {moment(selectedEvent.end).format("MMMM D, YYYY h:mm A")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-gray-100">{selectedEvent.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};