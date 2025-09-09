import { PhotoUploadService } from '../services/photoUpload.service';
import { uploadPhotoSchema, deletePhotoSchema } from '../schemaValidator/photo.validator';
export class PhotoUploadController {
    photoUploadService;
    constructor() {
        this.photoUploadService = new PhotoUploadService();
    }
    uploadPhoto = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
                return;
            }
            let photoData;
            let folder = 'todos';
            // Détecter si c'est un fichier (form-data) ou JSON (base64)
            if (req.file) {
                // Format form-data avec fichier
                photoData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                folder = req.body.folder || 'todos';
            }
            else if (req.body.photoData) {
                // Format JSON avec base64
                const validatedData = uploadPhotoSchema.parse(req.body);
                photoData = validatedData.photoData;
                folder = validatedData.folder;
            }
            else {
                // Aucune donnée fournie
                res.status(400).json({
                    success: false,
                    error: 'Aucune photo fournie. Utilisez soit "photoData" (JSON) soit "file" (form-data)'
                });
                return;
            }
            const result = await this.photoUploadService.uploadPhoto(photoData, folder);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Photo uploadée avec succès',
                    data: {
                        url: result.url
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        }
        catch (error) {
            if (error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: 'Données de validation invalides',
                    details: error.issues
                });
                return;
            }
            console.error('Erreur dans uploadPhoto:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };
    deletePhoto = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
                return;
            }
            const validatedData = deletePhotoSchema.parse(req.body);
            const result = await this.photoUploadService.deletePhoto(validatedData.photoUrl);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Photo supprimée avec succès'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        }
        catch (error) {
            if (error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: 'Données de validation invalides',
                    details: error.issues
                });
                return;
            }
            console.error('Erreur dans deletePhoto:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };
    // Nouvelle méthode pour l'upload de fichiers via form-data
    uploadFile = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
                return;
            }
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: 'Aucun fichier fourni'
                });
                return;
            }
            // Convertir le buffer en base64
            const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            // Récupérer le dossier depuis les paramètres de formulaire
            const folder = req.body.folder || 'todos';
            const result = await this.photoUploadService.uploadPhoto(base64String, folder);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Photo uploadée avec succès',
                    data: {
                        url: result.url
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        }
        catch (error) {
            console.error('Erreur dans uploadFile:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };
    // Méthode de test pour vérifier la configuration Cloudinary
    testCloudinary = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
                return;
            }
            const result = await this.photoUploadService.testConfiguration();
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Configuration Cloudinary OK',
                    data: {
                        status: 'Configuration valide',
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Configuration par défaut'
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: result.error,
                    help: 'Vérifiez vos variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans le fichier .env'
                });
            }
        }
        catch (error) {
            console.error('Erreur dans testCloudinary:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors du test de configuration'
            });
        }
    };
}
