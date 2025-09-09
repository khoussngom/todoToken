import { TodoRepository } from '../repository/todo.repository.js';
import { TodoPermissionRepository } from '../repository/todoPermission.repository';
import { ErrorMessages } from '../enums/errorEnum.js';
import { SuccessMessages } from '../enums/successEnums.js';
export class TodoService {
    todoRepository;
    todoPermissionRepository;
    constructor() {
        this.todoRepository = new TodoRepository();
        this.todoPermissionRepository = new TodoPermissionRepository();
    }
    async createTodo(data) {
        try {
            const todo = await this.todoRepository.create(data);
            return {
                success: true,
                data: todo,
                message: SuccessMessages.TODO_CREATED
            };
        }
        catch (error) {
            console.error('Erreur lors de la création du todo:', error);
            return {
                success: false,
                error: ErrorMessages.TODO_CREATION_FAILED
            };
        }
    }
    async getTodoById(id) {
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
        }
        catch (error) {
            console.error(ErrorMessages.Error_Recuperation, error);
            return {
                success: false,
                error: ErrorMessages.DATABASE_ERROR
            };
        }
    }
    async getAllTodos(options) {
        try {
            const where = {};
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
        }
        catch (error) {
            console.error(ErrorMessages.Error_Recuperation, error);
            return {
                success: false,
                error: ErrorMessages.DATABASE_ERROR
            };
        }
    }
    async updateTodo(id, idUser, data) {
        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                return {
                    success: false,
                    error: ErrorMessages.TODO_NOT_FOUND
                };
            }
            const isOwner = idUser === existingTodo.userId;
            const hasEditPermission = await this.todoPermissionRepository.hasPermission(id, idUser, 'canEdit');
            if (!isOwner && !hasEditPermission) {
                return {
                    success: false,
                    error: "Vous n'avez pas la permission de modifier ce todo"
                };
            }
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.completed !== undefined)
                updateData.completed = data.completed;
            if (data.photoUrl !== undefined)
                updateData.photoUrl = data.photoUrl;
            const updatedTodo = await this.todoRepository.update(id, updateData);
            return {
                success: true,
                data: updatedTodo,
                message: SuccessMessages.TODO_UPDATED
            };
        }
        catch (error) {
            console.error(ErrorMessages.Error_Recuperation, error);
            return {
                success: false,
                error: ErrorMessages.TODO_UPDATE_FAILED
            };
        }
    }
    async deleteTodo(id, idUser) {
        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                return {
                    success: false,
                    error: ErrorMessages.TODO_NOT_FOUND
                };
            }
            const isOwner = idUser === existingTodo.userId;
            const hasDeletePermission = await this.todoPermissionRepository.hasPermission(id, idUser, 'canDelete');
            if (!isOwner && !hasDeletePermission) {
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
        }
        catch (error) {
            console.error(ErrorMessages.Error_Recuperation, error);
            return {
                success: false,
                error: ErrorMessages.TODO_DELETE_FAILED
            };
        }
    }
}
