import { Router } from 'express';
import { TodoController } from '../controller/todo.controller';
import { AuthMiddleware } from '../middleware.ts/auth';
import { AuthService } from '../services/auth.service';

const { authenticate, writeAccess } = new AuthMiddleware(new AuthService());


const router = Router();
const todoController = new TodoController();

router.get('/todo', todoController.getAllTodos);
router.get('/todo/:id', todoController.getTodoById);

router.post('/todo', authenticate, writeAccess, todoController.createTodo);
router.put('/todo/:id', authenticate, writeAccess, todoController.updateTodo);
router.delete('/todo/:id', authenticate, writeAccess, todoController.deleteTodo);

export default router;
