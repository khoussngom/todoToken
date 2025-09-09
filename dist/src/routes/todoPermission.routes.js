import { Router } from 'express';
import { TodoPermissionController } from '../controller/todoPermission.controller';
import { AuthMiddleware } from '../middleware.ts/auth';
import { AuthService } from '../services/auth.service';
const { authenticate, writeAccess } = new AuthMiddleware(new AuthService());
const router = Router();
const todoPermissionController = new TodoPermissionController();
// Toutes les routes de permissions nécessitent une authentification
router.use(authenticate);
// Attribuer une permission sur une tâche
router.post('/todo-permissions', writeAccess, todoPermissionController.assignPermission);
// Modifier une permission existante
router.put('/todo-permissions/:todoId/:userId', writeAccess, todoPermissionController.updatePermission);
// Révoquer une permission
router.delete('/todo-permissions/:todoId/:userId', writeAccess, todoPermissionController.revokePermission);
// Obtenir toutes les permissions d'une tâche
router.get('/todo-permissions/:todoId', todoPermissionController.getPermissions);
export default router;
