import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, AlertCircle, Calendar } from "lucide-react";
import notificationService from "../services/notificationServices";
import getNotifications from "../services/notificationServices";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();

        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDetails(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
        setLoading(true);
        const response = await getNotifications();
        alert(response)
        setNotifications(response.data);
        } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        } finally {
        setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
        await notificationService.markAsRead(notificationId);
        fetchNotifications();
        } catch (error) {
        console.error("Erreur lors du marquage de la notification:", error);
        }
    };

    const clearNotifications = async () => {
        try {
        await notificationService.clearAll();
        setNotifications([]);
        setShowDetails(false);
        } catch (error) {
        console.error("Erreur lors de la suppression des notifications:", error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
        case "TASK_DUE":
            return <Calendar className="w-5 h-5 text-yellow-500" />;
        case "TASK_COMPLETED":
            return <Check className="w-5 h-5 text-green-500" />;
        default:
            return <AlertCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
        <div
            className="relative cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition"
            onClick={() => setShowDetails(!showDetails)}
        >
            <Bell className="w-6 h-6 text-white" />
            {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                {notifications.length > 9 ? "9+" : notifications.length}
            </div>
            )}
        </div>

        {showDetails && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border z-50">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">
                Notifications ({notifications.length})
                </h3>
            </div>

            {loading ? (
                <div className="p-4 text-center text-gray-500">Chargement...</div>
            ) : notifications.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                    <div
                    key={notification.id}
                    className={`flex items-start p-3 cursor-pointer hover:bg-gray-50 ${
                        notification.isRead ? "opacity-60" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    >
                    {getNotificationIcon(notification.type)}
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                        </p>
                        <p className="text-sm text-gray-600">
                        {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" }
                        )}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                Aucune notification
                </div>
            )}

            {notifications.length > 0 && (
                <div className="border-t p-2">
                <button
                    onClick={clearNotifications}
                    className="w-full py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                >
                    Effacer toutes les notifications
                </button>
                </div>
            )}
            </div>
        )}
        </div>
    );
}

export default Notification;
