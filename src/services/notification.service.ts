import { NotificationRepository } from '../repository/notification.repository';
import { CreateNotificationInput, Notification, NotificationResponse, NotificationType } from '../interfaces/INotification';

export class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async createNotification(data: CreateNotificationInput): Promise<NotificationResponse> {
        try {
            const notification = await this.notificationRepository.create(data);
            return {
                success: true,
                data: notification,
                message: 'Notification créée avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
            return {
                success: false,
                error: 'Erreur lors de la création de la notification'
            };
        }
    }

    async getUserNotifications(userId: number, unreadOnly: boolean = false): Promise<NotificationResponse> {
        try {
            const notifications = await this.notificationRepository.findByUserId(userId, unreadOnly);
            return {
                success: true,
                data: notifications,
                message: 'Notifications récupérées avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des notifications'
            };
        }
    }

    async markAsRead(notificationId: number, userId: number): Promise<NotificationResponse> {
        try {
            const notification = await this.notificationRepository.markAsRead(notificationId, userId);
            if (!notification) {
                return {
                    success: false,
                    error: 'Notification non trouvée'
                };
            }
            return {
                success: true,
                data: notification,
                message: 'Notification marquée comme lue'
            };
        } catch (error) {
            console.error('Erreur lors du marquage de la notification:', error);
            return {
                success: false,
                error: 'Erreur lors du marquage de la notification'
            };
        }
    }

    async markAllAsRead(userId: number): Promise<NotificationResponse> {
        try {
            await this.notificationRepository.markAllAsRead(userId);
            return {
                success: true,
                message: 'Toutes les notifications ont été marquées comme lues'
            };
        } catch (error) {
            console.error('Erreur lors du marquage des notifications:', error);
            return {
                success: false,
                error: 'Erreur lors du marquage des notifications'
            };
        }
    }

    async notifyTodoCompleted(todoId: number, userId: number, todoTitle: string): Promise<void> {
        await this.createNotification({
            userId,
            title: 'Tâche terminée !',
            message: `Félicitations ! Vous avez terminé la tâche "${todoTitle}"`,
            type: NotificationType.TODO_COMPLETED,
            todoId
        });
    }

    async notifyTodoDeadline(todoId: number, userId: number, todoTitle: string): Promise<void> {
        await this.createNotification({
            userId,
            title: 'Échéance approche',
            message: `La tâche "${todoTitle}" arrive à échéance bientôt`,
            type: NotificationType.TODO_DEADLINE,
            todoId
        });
    }

    async notifyTodoOverdue(todoId: number, userId: number, todoTitle: string): Promise<void> {
        await this.createNotification({
            userId,
            title: 'Tâche en retard',
            message: `La tâche "${todoTitle}" est en retard`,
            type: NotificationType.TODO_OVERDUE,
            todoId
        });
    }
}