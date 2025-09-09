export class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
}
