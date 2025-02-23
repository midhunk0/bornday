/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Notification{
    _id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

type Notifications=Notification[];

interface NotificationContextProps{
    notifications: Notification[];
    notificationsCount: number;
    fetchNotifications: ()=>void;
    readNotification: (notificationId: string)=>void;
}

const NotificationContext=createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications]=useState<Notifications>([]);
    const [notificationsCount, setNotificationsCount]=useState(0);

    const apiUrl = import.meta.env.MODE === "development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    async function fetchNotifications() {
        try {
            const response = await fetch(`${apiUrl}/fetchNotifications`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setNotifications(result.notifications);
                setNotificationsCount(result.count);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error while fetching notifications:", error);
        }
    }

    async function readNotification(notificationId: string) {
        try {
            const response = await fetch(`${apiUrl}/readNotification/${notificationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                // setNotifications(prev =>
                //     prev.map(notification =>
                //         notification._id === notificationId ? { ...notification, isRead: true } : notification
                //     )
                // );
                fetchNotifications();
                setNotificationsCount(prev => Math.max(0, prev - 1));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error while reading notification:", error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, notificationsCount, fetchNotifications, readNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
