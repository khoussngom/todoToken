import { PrismaClient } from '../generated/prisma';
export class UserRepository {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findAll() {
        return this.prisma.user.findMany({
            orderBy: { id: 'desc' }
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return this.prisma.user.delete({
            where: { id }
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
