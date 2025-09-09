import * as bcrypt from 'bcrypt';
import { UserRepository } from "../repository/user.repository";
export class UserService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async createUser(data) {
        const hashPassword = bcrypt.hashSync(data.password, 10);
        const { password, ...userDataWithoutPassword } = data;
        const user = await this.userRepository.create({ ...userDataWithoutPassword, password: hashPassword });
        return user;
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    async updateUser(id, data) {
        return this.userRepository.update(id, data);
    }
    async deleteUser(id) {
        return this.userRepository.delete(id);
    }
}
