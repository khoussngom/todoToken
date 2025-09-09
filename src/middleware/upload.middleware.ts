import multer from 'multer';
import { Request } from 'express';

// Configuration de multer pour l'upload de fichiers en mémoire
const storage = multer.memoryStorage();

// Filtre pour accepter seulement les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accepter seulement les fichiers image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        const error = new Error('Seuls les fichiers image sont acceptés') as any;
        cb(error, false);
    }
};

// Configuration multer
export const uploadMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB maximum
        files: 1 // Un seul fichier
    }
});

// Middleware pour un seul fichier avec le nom 'file'
export const singleFileUpload = uploadMiddleware.single('file');
