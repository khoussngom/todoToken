import { ValidationError } from '../errors/AppError';
export class AuthMiddleware {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    authenticate = (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new ValidationError('Token d\'authentification requis');
            }
            const token = authHeader.substring(7);
            const decoded = this.authService.verifyAccessToken(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token d\'authentification invalide',
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            });
        }
    };
    authorize = (allowedRoles) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    throw new ValidationError('Utilisateur non authentifié');
                }
                if (!allowedRoles.includes(req.user.role)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Accès refusé. Permissions insuffisantes.'
                    });
                }
                next();
            }
            catch (error) {
                res.status(403).json({
                    success: false,
                    message: 'Accès refusé',
                    error: error instanceof Error ? error.message : 'Erreur inconnue'
                });
            }
        };
    };
    adminOnly = this.authorize(['ADMIN']);
    writeAccess = this.authorize(['ADMIN', 'USER']);
}
