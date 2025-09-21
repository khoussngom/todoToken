import { v2 as cloudinary } from 'cloudinary';
export class PhotoUploadService {
    constructor() {
        // Configuration de Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbfhej7xk',
            api_key: process.env.CLOUDINARY_API_KEY || '873141682942693',
            api_secret: process.env.CLOUDINARY_API_SECRET || 'plaYnfEB8JSoRUbophOGAHNK4n0',
            secure: true
        });
    }
    /**
     * Upload une photo vers Cloudinary
     * @param photoData Base64 string de l'image
     * @param folder Dossier de destination sur Cloudinary
     * @returns URL de l'image uploadée
     */
    async uploadPhoto(photoData, folder = 'todos') {
        try {
            // Vérifier si la configuration existe
            if (!process.env.CLOUDINARY_CLOUD_NAME && !cloudinary.config().cloud_name) {
                return {
                    success: false,
                    error: 'Configuration Cloudinary manquante. Vérifiez vos variables d\'environnement CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.'
                };
            }
            // Valider le format de l'image
            if (!photoData.startsWith('data:image/')) {
                return {
                    success: false,
                    error: 'Format d\'image invalide. L\'image doit être en base64 avec le préfixe data:image/'
                };
            }
            // Upload vers Cloudinary
            const result = await cloudinary.uploader.upload(photoData, {
                folder: folder,
                resource_type: 'auto',
                quality: 'auto:good',
                fetch_format: 'auto'
            });
            return {
                success: true,
                url: result.secure_url
            };
        }
        catch (error) {
            console.error('Erreur lors de l\'upload de la photo:', error);
            // Messages d'erreur spécifiques
            if (error.error && error.error.message) {
                return {
                    success: false,
                    error: `Erreur Cloudinary: ${error.error.message}`
                };
            }
            if (error.message) {
                return {
                    success: false,
                    error: `Erreur: ${error.message}`
                };
            }
            return {
                success: false,
                error: 'Erreur inconnue lors de l\'upload de la photo'
            };
        }
    }
    /**
     * Supprime une photo de Cloudinary
     * @param photoUrl URL de la photo à supprimer
     * @returns Résultat de la suppression
     */
    async deletePhoto(photoUrl) {
        try {
            if (!photoUrl || !photoUrl.includes('cloudinary.com')) {
                return {
                    success: false,
                    error: 'URL de photo Cloudinary invalide'
                };
            }
            // Extraire le public_id de l'URL
            const publicId = this.extractPublicId(photoUrl);
            if (!publicId) {
                return {
                    success: false,
                    error: 'Impossible d\'extraire l\'ID public de l\'URL'
                };
            }
            // Supprimer de Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === 'ok') {
                return {
                    success: true
                };
            }
            else {
                return {
                    success: false,
                    error: `Échec de la suppression: ${result.result}`
                };
            }
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la photo:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression de la photo'
            };
        }
    }
    /**
     * Extrait le public_id d'une URL Cloudinary
     * @param url URL Cloudinary
     * @returns Public ID ou null
     */
    extractPublicId(url) {
        try {
            // Format typique: https://res.cloudinary.com/cloud/image/upload/v123456/folder/filename.ext
            const matches = url.match(/\/v\d+\/(.+)$/);
            if (matches && matches[1]) {
                // Retirer l'extension
                return matches[1].replace(/\.[^/.]+$/, '');
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lors de l\'extraction du public_id:', error);
            return null;
        }
    }
    /**
     * Test de la configuration Cloudinary
     * @returns Status de la configuration
     */
    async testConfiguration() {
        try {
            // Test avec une petite image de test
            const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
            const result = await this.uploadPhoto(testImage, 'test');
            if (result.success && result.url) {
                // Supprimer l'image de test
                await this.deletePhoto(result.url);
                return {
                    success: true,
                    url: 'Configuration Cloudinary OK'
                };
            }
            return result;
        }
        catch (error) {
            return {
                success: false,
                error: `Test de configuration échoué: ${error.message}`
            };
        }
    }
}
