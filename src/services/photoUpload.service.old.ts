import { Request } from 'express';

export interface CloudinaryResponse {
    success: boolean;
    url?: string;
    error?: string;
}

export class PhotoUploadService {
    private cloudinaryUrl: string;
    private cloudName: string;
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dbfhej7xk';
        this.apiKey = process.env.CLOUDINARY_API_KEY || '873141682942693';
        this.apiSecret = process.env.CLOUDINARY_API_SECRET || 'plaYnfEB8JSoRUbophOGAHNK4n0';
        this.cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    }


    async uploadPhoto(photoData: string, folder: string = 'todos'): Promise<CloudinaryResponse> {
        try {
            if (!this.cloudName || !this.apiKey || !this.apiSecret) {
                return {
                    success: false,
                    error: 'Configuration Cloudinary manquante. Vérifiez vos variables d\'environnement.'
                };
            }

            if (!photoData.startsWith('data:image/')) {
                return {
                    success: false,
                    error: 'Format d\'image invalide. Seules les images sont acceptées.'
                };
            }

            const formData = new FormData();
            formData.append('file', photoData);
            formData.append('upload_preset', 'todo_photos');
            formData.append('folder', folder);
            formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

            const response = await fetch(this.cloudinaryUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    error: `Erreur Cloudinary: ${data.error.message}`
                };
            }

            return {
                success: true,
                url: data.secure_url
            };

        } catch (error) {
            console.error('Erreur lors de l\'upload de la photo:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'upload de la photo'
            };
        }
    }


    async deletePhoto(photoUrl: string): Promise<CloudinaryResponse> {
        try {
            if (!photoUrl || !photoUrl.includes('cloudinary.com')) {
                return {
                    success: false,
                    error: 'URL de photo invalide'
                };
            }

            const publicId = this.extractPublicId(photoUrl);
            if (!publicId) {
                return {
                    success: false,
                    error: 'Impossible d\'extraire l\'ID public de l\'URL'
                };
            }

            const deleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
            const formData = new FormData();
            formData.append('public_id', publicId);
            formData.append('api_key', this.apiKey);
            formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

            const signature = this.generateSignature(publicId, Math.floor(Date.now() / 1000));
            formData.append('signature', signature);

            const response = await fetch(deleteUrl, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.result === 'ok') {
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    error: 'Erreur lors de la suppression de la photo'
                };
            }

        } catch (error) {
            console.error('Erreur lors de la suppression de la photo:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression de la photo'
            };
        }
    }


    private extractPublicId(url: string): string | null {
        try {
            const urlParts = url.split('/');
            const uploadIndex = urlParts.findIndex(part => part === 'upload');
            if (uploadIndex === -1) return null;
            
            const filenamePart = urlParts[uploadIndex + 2];
            return filenamePart.split('.')[0];
        } catch (error) {
            return null;
        }
    }


    private generateSignature(publicId: string, timestamp: number): string {

        const crypto = require('crypto');
        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
        return crypto.createHash('sha1').update(stringToSign).digest('hex');
    }


    isValidCloudinaryUrl(url: string): boolean {
        return url.includes('cloudinary.com') && url.startsWith('https://');
    }
}
