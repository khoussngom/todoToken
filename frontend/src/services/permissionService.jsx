import axios from "axios";
import { API_URL } from "../api/ApiUrl";

const permissionService = {

    assignerPermission: async (donneesPermission) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.post(`${API_URL}/todo-permissions`, donneesPermission, {
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


    modifierPermission: async (tacheId, utilisateurId, donneesPermission) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.put(`${API_URL}/todo-permissions/${tacheId}/${utilisateurId}`, donneesPermission, {
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


    revoquerPermission: async (tacheId, utilisateurId) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.delete(`${API_URL}/todo-permissions/${tacheId}/${utilisateurId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    },


    obtenirPermissionsTache: async (tacheId) => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) throw new Error("Token d'authentification manquant");

            const response = await axios.get(`${API_URL}/todo-permissions/${tacheId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }
};

export default permissionService;
