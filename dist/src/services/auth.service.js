import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/user.repository';
import { NotFoundError, ValidationError } from '../errors/AppError';
export class AuthService {
    userRepository;
    accessTokenSecret;
    refreshTokenSecret;
    accessTokenExpiry;
    refreshTokenExpiry;
    constructor() {
        this.userRepository = new UserRepository();
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'Marakhib';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'Marakhib';
        this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '1h';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    }
    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError('Email ou mot de passe incorrect');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ValidationError('Email ou mot de passe incorrect');
        }
        const accessToken = this.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const refreshToken = this.generateRefreshToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }
    async refreshToken({ refreshToken }) {
        try {
            const decoded = jwt.verify(refreshToken, this.refreshTokenSecret);
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) {
                throw new NotFoundError('Utilisateur non trouvé');
            }
            const accessToken = this.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            return { accessToken };
        }
        catch (error) {
            throw new ValidationError('Token de rafraîchissement invalide');
        }
    }
    generateAccessToken(payload) {
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry
        });
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        }
        catch (error) {
            throw new ValidationError('Token d\'accès invalide');
        }
    }
}
