import { Request, Response } from 'express';
import { PhotoUploadService } from '../services/photoUpload.service';
import { uploadPhotoSchema, deletePhotoSchema } from '../schemaValidator/photo.validator';

export class PhotoUploadController {
    private photoUploadService: PhotoUploadService;

    constructor() {
        this.photoUploadService = new PhotoUploadService();
    }

    uploadPhoto = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
                return;
            }

            let photoData: string;
            let folder: string = 'todos';

            if (req.file) {

                photoData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                folder = req.body.folder || 'todos';
            } else if (req.body.photoData) {

                const validatedData = uploadPhotoSchema.parse(req.body);
                photoData = validatedData.photoData;
                folder = validatedData.folder;
            } else {

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
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error: any) {
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

    deletePhoto = async (req: Request, res: Response): Promise<void> => {
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
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error: any) {
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


    uploadFile = async (req: Request, res: Response): Promise<void> => {
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


            const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            

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
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error: any) {
            console.error('Erreur dans uploadFile:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur'
            });
        }
    };

}
