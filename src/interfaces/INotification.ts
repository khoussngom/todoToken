export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    todoId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum NotificationType {
    TODO_COMPLETED = 'TODO_COMPLETED',
    TODO_DEADLINE = 'TODO_DEADLINE',
    TODO_OVERDUE = 'TODO_OVERDUE',
    TODO_REMINDER = 'TODO_REMINDER'
}

export interface CreateNotificationInput {
    userId: number;
    title: string;
    message: string;
    type: NotificationType;
    todoId?: number;
}

export interface NotificationResponse {
    success: boolean;
    data?: Notification | Notification[];
    message?: string;
    error?: string;
}