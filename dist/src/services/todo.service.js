import { TodoRepository } from '../repository/todo.repository.js';
import { ErrorMessages } from '../enums/errorEnum.js';
import { SuccessMessages } from '../enums/successEnums.js';
// import type { CreateTodoInput as ValidatedCreateInput, UpdateTodoInput as ValidatedUpdateInput } from '../schemaValidator/todo.validator.js';
export class TodoService {
    todoRepository;
    constructor() {
        this.todoRepository = new TodoRepository();
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
            console.error(ErrorMessages.Error_Recuperation, error);
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
            const where = options?.completed !== undefined
                ? { completed: options.completed }
                : undefined;
            const todos = await this.todoRepository.findAll({ where });
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
    async updateTodo(id, data) {
        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                return {
                    success: false,
                    error: ErrorMessages.TODO_NOT_FOUND
                };
            }
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.completed !== undefined)
                updateData.completed = data.completed;
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
    async deleteTodo(id) {
        try {
            const existingTodo = await this.todoRepository.findById(id);
            if (!existingTodo) {
                return {
                    success: false,
                    error: ErrorMessages.TODO_NOT_FOUND
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
