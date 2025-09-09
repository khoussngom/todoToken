import { PrismaClient } from '../generated/prisma/index.js';
export class TodoRepository {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async create(data) {
        return await this.prisma.todo.create({ data });
    }
    async findById(id) {
        return await this.prisma.todo.findUnique({ where: { id } });
    }
    async findAll(options) {
        return await this.prisma.todo.findMany({
            where: options?.where,
            orderBy: { createdAt: 'desc' }
        });
    }
    async count(where) {
        return await this.prisma.todo.count({ where });
    }
    async update(id, data) {
        return await this.prisma.todo.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return await this.prisma.todo.delete({
            where: { id }
        });
    }
}
