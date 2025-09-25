import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../interfaces/IAuth';

export class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    getUserNotifications = async (req: Request, res: Response): Promise<void> => {
        try {
            const authorise = req.headers.authorization;
            const token = authorise?.split(' ')[1];
            const verifier = jwt.verify(token!, 'Marakhib') as JWTPayload;
            const userId = verifier.userId;

            const unreadOnly = req.query.unreadOnly === 'true';

            const result = await this.notificationService.getUserNotifications(userId, unreadOnly);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Erreur dans getUserNotifications:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };

    markAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const authorise = req.headers.authorization;
            const token = authorise?.split(' ')[1];
            const verifier = jwt.verify(token!, 'Marakhib') as JWTPayload;
            const userId = verifier.userId;

            const notificationId = parseInt(req.params.id);

            if (isNaN(notificationId)) {
                res.status(400).json({
                    success: false,
                    error: 'ID de notification invalide'
                });
                return;
            }

            const result = await this.notificationService.markAsRead(notificationId, userId);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            console.error('Erreur dans markAsRead:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };

    markAllAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const authorise = req.headers.authorization;
            const token = authorise?.split(' ')[1];
            const verifier = jwt.verify(token!, 'Marakhib') as JWTPayload;
            const userId = verifier.userId;

            const result = await this.notificationService.markAllAsRead(userId);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Erreur dans markAllAsRead:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };
}