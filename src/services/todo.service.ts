import { TodoRepository } from '../repository/todo.repository.js';
import { ErrorMessages } from '../enums/errorEnum.js';
import { SuccessMessages } from '../enums/successEnums.js';
import { NotificationService } from './notification.service';
import { SchedulerService } from './scheduler.service';
import type { Todo, ApiResponse } from '../interface/todo.interface';
import { Prisma } from '../generated/prisma/index.js';

export class TodoService {
    private todoRepository: TodoRepository;
    private notificationService: NotificationService;
    private schedulerService: SchedulerService;

    constructor() {
        this.todoRepository = new TodoRepository();
        this.notificationService = new NotificationService();
        this.schedulerService = new SchedulerService();
    }

    async createTodo(data: Prisma.TodoCreateInput): Promise<ApiResponse<Todo>> {
        try {
        // Convertir les dates string en objets Date si nécessaire
        const processedData = { ...data };
        if (typeof data.startTime === 'string') {
            processedData.startTime = new Date(data.startTime);
        }
        if (typeof data.endTime === 'string') {
            processedData.endTime = new Date(data.endTime);
        }

        const todo = await this.todoRepository.create(data);

        return {
            success: true,
            data: todo,
            message: SuccessMessages.TODO_CREATED
        };
        } catch (error) {
        console.error(ErrorMessages.Error_Recuperation, error);
        return {
            success: false,
            error: ErrorMessages.TODO_CREATION_FAILED
        };
        }
    }

    async getTodoById(id: number): Promise<ApiResponse<Todo>> {
        try {
        const todo = await this.todoRepository.findById(id);
        
        if (!todo) {
            return {
            success: false,
            error: ErrorMessages.TODO_NOT_FOUND
            };
        }

        return {
            success: true,
            data: todo,
            message: SuccessMessages.TODO_FOUND
        };
        } catch (error) {
        console.error(ErrorMessages.Error_Recuperation, error);
        return {
            success: false,
            error: ErrorMessages.DATABASE_ERROR
        };
        }
    }

    async getAllTodos(options?: {
        completed?: boolean;
        userId?: number;
    }): Promise<ApiResponse<Todo[]>> {
        try {
        const where: any = {};
        
        if (options?.completed !== undefined) {
            where.completed = options.completed;
        }
        
        if (options?.userId !== undefined) {
            where.userId = options.userId;
        }

        const whereClause = Object.keys(where).length > 0 ? where : undefined;
        const todos = await this.todoRepository.findAll({ where: whereClause });

        return {
            success: true,
            data: todos,
            message: SuccessMessages.TODOS_FOUND
        };
        } catch (error) {
        console.error(ErrorMessages.Error_Recuperation, error);
        return {
            success: false,
            error: ErrorMessages.DATABASE_ERROR
        };
        }
    }

    async updateTodo(id: number, idUser: number, data: Prisma.TodoUpdateInput): Promise<ApiResponse<Todo>> {
        try {

        const existingTodo = await this.todoRepository.findById(id);
        if (!existingTodo) {
            return {
            success: false,
            error: ErrorMessages.TODO_NOT_FOUND
            };
        }

        if(idUser !== existingTodo.userId){
            return {
                success: false,
                error: "Vous n'avez pas la permission de modifier ce todo"
            };
        }

        // Convertir les dates string en objets Date si nécessaire
        const processedData = { ...data };
        if (typeof data.startTime === 'string') {
            processedData.startTime = new Date(data.startTime);
        }
        if (typeof data.endTime === 'string') {
            processedData.endTime = new Date(data.endTime);
        }

        const updateData: any = {};
        if (processedData.title !== undefined) updateData.title = processedData.title;
        if (processedData.description !== undefined) updateData.description = processedData.description;
        if (processedData.completed !== undefined) updateData.completed = processedData.completed;
        if (processedData.startTime !== undefined) updateData.startTime = processedData.startTime;
        if (processedData.endTime !== undefined) updateData.endTime = processedData.endTime;

        const updatedTodo = await this.todoRepository.update(id, updateData);

        // Si la tâche est marquée comme terminée, envoyer une notification
        if (processedData.completed === true && !existingTodo.completed) {
            await this.notificationService.notifyTodoCompleted(
                updatedTodo.id,
                updatedTodo.userId,
                updatedTodo.title
            );
        }
        return {
            success: true,
            data: updatedTodo,
            message: SuccessMessages.TODO_UPDATED
        };
        } catch (error) {
        console.error(ErrorMessages.Error_Recuperation, error);
        return {
            success: false,
            error: ErrorMessages.TODO_UPDATE_FAILED
        };
        }
    }

    async deleteTodo(id: number, idUser: number): Promise<ApiResponse<Todo>> {
        try {

        const existingTodo = await this.todoRepository.findById(id);
        if (!existingTodo) {
            return {
            success: false,
            error: ErrorMessages.TODO_NOT_FOUND
            };
        }
        if (existingTodo.userId !== idUser) {
            return {
                success: false,
                error: "Vous n'avez pas la permission de supprimer ce todo"
            };
        }
        const deletedTodo = await this.todoRepository.delete(id);

        return {
            success: true,
            data: deletedTodo,
            message: SuccessMessages.TODO_DELETED
        };
        } catch (error) {
        console.error(ErrorMessages.Error_Recuperation, error);
        return {
            success: false,
            error: ErrorMessages.TODO_DELETE_FAILED
        };
        }
    }
}