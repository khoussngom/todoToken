import axios from "axios";
import { API_URL } from "../api/ApiUrl";

const tacheService = {

    obtenirToutesLesTaches: async (filtre = {}) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            const params = new URLSearchParams();
            
            if (filtre.termine !== undefined) {
                params.append("completed", filtre.termine);
            }
            if (filtre.utilisateurId !== undefined) {
                params.append("userId", filtre.utilisateurId);
            }

            const response = await axios.get(`${API_URL}/todo${params.toString() ? '?' + params.toString() : ''}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },

    obtenirTacheParId: async (id) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            const response = await axios.get(`${API_URL}/todo/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },

    creerTache: async (donneesToche) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.post(`${API_URL}/todo`, donneesToche, {
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

    modifierTache: async (id, donneesToche) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.put(`${API_URL}/todo/${id}`, donneesToche, {
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

    supprimerTache: async (id) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.delete(`${API_URL}/todo/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },

    // Uploader une photo
    uploaderPhoto: async (fichierPhoto) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const formData = new FormData();
            formData.append('photo', fichierPhoto);

            const response = await axios.post(`${API_URL}/photo/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }
};

export default tacheService;