import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bell, Check, Trash2 } from "lucide-react"; // Added Trash2 icon
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAtomValue } from "jotai";
import { globalState } from "../../jotai/globalState";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAtomValue(globalState);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BASE_URL}`);
    const userEmail = user.email;

    socket.emit("register", userEmail);
    console.log(`Registered ${userEmail} with socket`);

    socket.on("meetingNotification", (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [
        ...prev,
        {
          message: data.message,
          id: Date.now(),
          isRead: false,
        },
      ]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    setUnreadCount(0);
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-lg border border-neutral-500 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:bg-neutral-900"
        >
          <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center p-0 dark:bg-red-600">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[400px] overflow-y-auto p-0 bg-white dark:bg-neutral-900 border dark:border-neutral-800"
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              Notifications
            </span>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
                  onClick={markAllRead}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-800"
                  onClick={deleteAllNotifications}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {/* Clear All */}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex justify-between items-center p-4 ${
                  !notif.isRead
                    ? "bg-neutral-50 dark:bg-neutral-800"
                    : "bg-white dark:bg-neutral-900"
                } hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800`}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      !notif.isRead
                        ? "font-medium text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {notif.message}
                  </span>
                  <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-500">
                    {new Date(notif.id).toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  onClick={() => deleteNotification(notif.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationComponent;