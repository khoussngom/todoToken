import { TodoPermissionRepository } from '../repository/todoPermission.repository';
import { TodoRepository } from '../repository/todo.repository';
import { CreateTodoPermissionInput, UpdateTodoPermissionInput, TodoPermissionResponse } from '../interfaces/TodoPermission.interface';
import { ApiResponse } from '../interface/todo.interface';

export class TodoPermissionService {
    private todoPermissionRepository: TodoPermissionRepository;
    private todoRepository: TodoRepository;

    constructor() {
        this.todoPermissionRepository = new TodoPermissionRepository();
        this.todoRepository = new TodoRepository();
    }

    async assignPermission(data: CreateTodoPermissionInput, ownerId: number): Promise<TodoPermissionResponse> {
        try {
            const todo = await this.todoRepository.findById(data.todoId);
            if (!todo) {
                return {
                    success: false,
                    error: 'Tâche non trouvée'
                };
            }

            if (todo.userId !== ownerId) {
                return {
                    success: false,
                    error: 'Vous n\'avez pas la permission d\'attribuer des rôles sur cette tâche'
                };
            }

            const existingPermission = await this.todoPermissionRepository.findByTodoAndUser(data.todoId, data.userId);
            if (existingPermission) {
                return {
                    success: false,
                    error: 'Une permission existe déjà pour cet utilisateur sur cette tâche'
                };
            }

            const permission = await this.todoPermissionRepository.create(data);
            return {
                success: true,
                data: permission,
                message: 'Permission attribuée avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de l\'attribution de permission:', error);
            return {
                success: false,
                error: 'Erreur interne du serveur'
            };
        }
    }

    async updatePermission(todoId: number, userId: number, data: UpdateTodoPermissionInput, ownerId: number): Promise<TodoPermissionResponse> {
        try {
            const todo = await this.todoRepository.findById(todoId);
            if (!todo) {
                return {
                    success: false,
                    error: 'Tâche non trouvée'
                };
            }

            if (todo.userId !== ownerId) {
                return {
                    success: false,
                    error: 'Vous n\'avez pas la permission de modifier les rôles sur cette tâche'
                };
            }

            const permission = await this.todoPermissionRepository.update(todoId, userId, data);
            return {
                success: true,
                data: permission,
                message: 'Permission mise à jour avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de permission:', error);
            return {
                success: false,
                error: 'Erreur interne du serveur'
            };
        }
    }

    async revokePermission(todoId: number, userId: number, ownerId: number): Promise<ApiResponse<any>> {
        try {
            const todo = await this.todoRepository.findById(todoId);
            if (!todo) {
                return {
                    success: false,
                    error: 'Tâche non trouvée'
                };
            }

            if (todo.userId !== ownerId) {
                return {
                    success: false,
                    error: 'Vous n\'avez pas la permission de révoquer les rôles sur cette tâche'
                };
            }

            await this.todoPermissionRepository.delete(todoId, userId);
            return {
                success: true,
                message: 'Permission révoquée avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la révocation de permission:', error);
            return {
                success: false,
                error: 'Erreur interne du serveur'
            };
        }
    }

    async getPermissions(todoId: number, ownerId: number): Promise<ApiResponse<any[]>> {
        try {
            const todo = await this.todoRepository.findById(todoId);
            if (!todo) {
                return {
                    success: false,
                    error: 'Tâche non trouvée'
                };
            }

            if (todo.userId !== ownerId) {
                return {
                    success: false,
                    error: 'Vous n\'avez pas la permission de voir les rôles sur cette tâche'
                };
            }

            const permissions = await this.todoPermissionRepository.findByTodo(todoId);
            return {
                success: true,
                data: permissions,
                message: 'Permissions récupérées avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
            return {
                success: false,
                error: 'Erreur interne du serveur'
            };
        }
    }

    async checkPermission(todoId: number, userId: number, permission: 'canEdit' | 'canDelete'): Promise<boolean> {
        try {
            return await this.todoPermissionRepository.hasPermission(todoId, userId, permission);
        } catch (error) {
            console.error('Erreur lors de la vérification de permission:', error);
            return false;
        }
    }
}
