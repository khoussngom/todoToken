import { PrismaClient } from '../generated/prisma';
import { Notification, CreateNotificationInput } from '../interfaces/INotification';

export class NotificationRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateNotificationInput): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                ...data,
                isRead: false
            }
        });
    }

    async findByUserId(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { isRead: false })
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Notification | null> {
        return this.prisma.notification.findUnique({
            where: { id }
        });
    }

    async markAsRead(notificationId: number, userId: number): Promise<Notification | null> {
        try {
            return await this.prisma.notification.update({
                where: {
                    id: notificationId,
                    userId
                },
                data: {
                    isRead: true
                }
            });
        } catch (error) {
            return null;
        }
    }

    async markAllAsRead(userId: number): Promise<void> {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    }

    async deleteNotification(id: number, userId: number): Promise<boolean> {
        try {
            await this.prisma.notification.delete({
                where: {
                    id,
                    userId
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getUnreadCount(userId: number): Promise<number> {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
    }
}