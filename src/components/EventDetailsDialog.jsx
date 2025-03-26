import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import moment from "moment";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export const EventDetailsDialog = ({ open, onOpenChange, selectedEvent, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const user = useAtomValue(globalState);


  console.log(selectedEvent?.members);

  if (!selectedEvent) return null;

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(selectedEvent._id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
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
                <p className="text-gray-900 dark:text-gray-100">{selectedEvent.organizer || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meeting Type</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedEvent.meetingType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedEvent.members?.length > 0
                    ? selectedEvent.members.map((member, index) => (
                        <span key={index}>
                          {member.name}
                          {index < selectedEvent.members.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "N/A"}
                </p>
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
                <p className="text-gray-900 dark:text-gray-100">{selectedEvent.email || "N/A"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>

              {user.email === selectedEvent.email && selectedEvent.status !== "completed" && selectedEvent.status !== "running" ? (
                <>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button onClick={() => onEdit(selectedEvent)}>
                    Edit
                  </Button>
                </>
              ) : null}
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedEvent.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </Dialog>
    </>
  );
};