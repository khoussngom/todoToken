import React, { useState, useEffect, useRef } from "react";
import { Bell, Clock, AlertCircle, CalendarCheck } from "lucide-react";
import serviceHistorique from "../services/serviceHistorique";
import authService from "../services/authService";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const LIMIT_NOTIFICATIONS = 10;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const reponse = await serviceHistorique.obtenirLogsRecents(LIMIT_NOTIFICATIONS);
            console.log("Réponse complète:", reponse);
            
            if (reponse?.success) {
                const logs = reponse.data || [];
                
                // Filtrer et transformer les logs pour avoir le bon format
                const logsImportants = logs.filter(log => 
                    log.action === 'TODO_COMPLETE' || 
                    log.action === 'TODO_INCOMPLETE' ||
                    log.action === 'TODO_UPDATE' ||
                    log.action === 'TASK_DUE'
                ).map(log => ({
                    ...log,
                    // S'assurer que nous avons toujours un titre
                    title: log.todo?.title || log.todoTitle || log.title || "Tâche sans titre"
                }));

                setNotifications(logsImportants);
            }
        } catch (error) {
            console.error("Erreur de notification:", error);
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const checkAuthAndFetch = async () => {
        const token = await authService.getValidToken();
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            window.location.href = '/login';
        }
    };
    
    checkAuthAndFetch();
    }, []);

  // Ajoutez un useEffect pour surveiller les changements de notifications
    useEffect(() => {
    console.log("État notifications:", notifications);
  }, [notifications]);

    // Ajoutez ce useEffect pour voir la structure des notifications
    useEffect(() => {
        if (notifications.length > 0) {
            console.log("Structure d'une notification:", notifications[0]);
        }
    }, [notifications]);

    const formatDate = (date) => {
        const maintenant = new Date();
        const dateNotif = new Date(date);
        const differenceMinutes = Math.floor((maintenant - dateNotif) / 60000);

        if (differenceMinutes < 1) return "À l'instant";
        if (differenceMinutes < 60) return `Il y a ${differenceMinutes} min`;
        if (differenceMinutes < 1440) {
            const heures = Math.floor(differenceMinutes / 60);
            return `Il y a ${heures} h`;
        }
        const jours = Math.floor(differenceMinutes / 1440);
        return `Il y a ${jours} j`;
    };

    const getNotificationIcon = (action) => {
        switch (action) {
            case "TODO_COMPLETE":
                return <CalendarCheck className="w-5 h-5 text-green-500" />;
            case "TODO_INCOMPLETE":
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case "TASK_DUE":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Bell className="w-5 h-5 text-blue-500" />;
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

      {showDetails && notifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-lg border z-50">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800">
                            Notifications ({notifications.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                    ) : notifications.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start p-4 hover:bg-gray-50 border-b"
                                >
                                    {getNotificationIcon(log.action)}
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {serviceHistorique.formaterAction(log.action)}
                                        </p>
                                        <p className="text-sm font-medium text-blue-600">
                                            {log.title} {/* Utiliser directement log.title car nous l'avons déjà traité dans fetchNotifications */}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {log.description || 'Pas de description'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(log.createdAt)}
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
                </div>
            )}
        </div>
    );
}

export default Notification;
