import { Router } from 'express';
import { NotificationController } from '../controller/notification.controller';
import { AuthMiddleware } from '../middleware.ts/auth';
import { AuthService } from '../services/auth.service';

const { authenticate } = new AuthMiddleware(new AuthService());

const router = Router();
const notificationController = new NotificationController();

router.get('/notifications', authenticate, notificationController.getUserNotifications);
router.put('/notifications/:id/read', authenticate, notificationController.markAsRead);
router.put('/notifications/read-all', authenticate, notificationController.markAllAsRead);

export default router;