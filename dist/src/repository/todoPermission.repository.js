import { PrismaClient } from '../generated/prisma';
export class TodoPermissionRepository {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async create(data) {
        return this.prisma.todoPermission.create({ data });
    }
    async findByTodoAndUser(todoId, userId) {
        return this.prisma.todoPermission.findUnique({
            where: {
                todoId_userId: {
                    todoId,
                    userId
                }
            }
        });
    }
    async findByTodo(todoId) {
        return this.prisma.todoPermission.findMany({
            where: { todoId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }
    async update(todoId, userId, data) {
        return this.prisma.todoPermission.update({
            where: {
                todoId_userId: {
                    todoId,
                    userId
                }
            },
            data
        });
    }
    async delete(todoId, userId) {
        return this.prisma.todoPermission.delete({
            where: {
                todoId_userId: {
                    todoId,
                    userId
                }
            }
        });
    }
    async hasPermission(todoId, userId, permission) {
        const todoPermission = await this.findByTodoAndUser(todoId, userId);
        if (!todoPermission)
            return false;
        return todoPermission[permission];
    }
}
