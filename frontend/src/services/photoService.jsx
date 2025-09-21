import axios from "axios";
import { API_URL } from "../api/ApiUrl";

const photoService = {

    uploaderFichier: async (fichier, dossier = "todos") => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const formData = new FormData();
            formData.append('file', fichier);
            formData.append('folder', dossier);

            const response = await axios.post(`${API_URL}/upload-file`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },


    uploaderPhotoBase64: async (donneesPhoto, dossier = "todos") => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.post(`${API_URL}/upload-photo`, {
                photoData: donneesPhoto,
                folder: dossier
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },


    supprimerPhoto: async (urlPhoto) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.delete(`${API_URL}/delete-photo`, {
                data: { photoUrl: urlPhoto },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }
};

export default photoService;
