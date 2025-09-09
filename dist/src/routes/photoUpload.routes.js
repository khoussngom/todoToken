import { Router } from 'express';
import { PhotoUploadController } from '../controller/photoUpload.controller';
import { AuthMiddleware } from '../middleware.ts/auth';
import { AuthService } from '../services/auth.service';
import { singleFileUpload } from '../middleware/upload.middleware';
const { authenticate, writeAccess } = new AuthMiddleware(new AuthService());
const router = Router();
const photoUploadController = new PhotoUploadController();
// Toutes les routes d'upload nécessitent une authentification
router.use(authenticate);
// Uploader une photo (JSON base64)
router.post('/upload-photo', writeAccess, photoUploadController.uploadPhoto);
// Uploader un fichier (form-data)
router.post('/upload-file', writeAccess, singleFileUpload, photoUploadController.uploadFile);
// Supprimer une photo
router.delete('/delete-photo', writeAccess, photoUploadController.deletePhoto);
// Test de configuration Cloudinary (pour débugger)
router.get('/test-cloudinary', photoUploadController.testCloudinary);
export default router;
