import { singleFileUpload } from '../middleware/upload.middleware';
// Middleware flexible qui accepte les fichiers mais ne les rend pas obligatoires
export const optionalFileUpload = (req, res, next) => {
    // Vérifier si c'est du form-data
    const contentType = req.headers['content-type'];
    if (contentType && contentType.includes('multipart/form-data')) {
        // Si c'est du form-data, utiliser multer
        singleFileUpload(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err.message
                });
            }
            next();
        });
    }
    else {
        // Si c'est du JSON, passer directement
        next();
    }
};
