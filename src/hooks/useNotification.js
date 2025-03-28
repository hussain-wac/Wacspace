import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAtom, useAtomValue } from "jotai";
import {
  globalState,
  notificationsAtom,
  unreadCountAtom,
} from "../jotai/globalState";
import { toast } from "sonner";

const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const user = useAtomValue(globalState);

  useEffect(() => {
    // Request permission for browser notifications
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }

    const socket = io(`${import.meta.env.VITE_BASE_URL}`);
    const userEmail = user?.email;

    if (!userEmail) return;

    socket.emit("register", userEmail);
    console.log(`Registered ${userEmail} with socket`);

    socket.on("meetingNotification", (data) => {
      toast(data.message);

      const newNotification = {
        message: data.message,
        id: Date.now(),
        isRead: false,
      };

      setNotifications((prev) => {
        const updatedNotifications = [...prev, newNotification];
        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });

      setUnreadCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("unreadCount", newCount);
        return newCount;
      });

      // Show browser notification if permission is granted
      if (Notification.permission === "granted") {
        const browserNotification = new Notification("New Meeting Notification", {
          body: data.message,
          icon: "/notification-icon.png", // Change this to your app's icon
        });

        // Handle click on notification (optional)
        browserNotification.onclick = () => {
          window.focus(); // Bring the app to the front
        };
      }
    });

    return () => socket.disconnect();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notif) => ({
        ...notif,
        isRead: true,
      }));
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
    setUnreadCount(0);
    localStorage.setItem("unreadCount", 0);
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("notifications");
    localStorage.removeItem("unreadCount");
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((notif) => notif.id !== id);
      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });

    setUnreadCount((prev) => {
      const newCount = prev > 0 ? prev - 1 : 0;
      localStorage.setItem("unreadCount", newCount);
      return newCount;
    });
  };

  return {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    markAllRead,
    deleteAllNotifications,
    deleteNotification,
  };
};

export default useNotification;
