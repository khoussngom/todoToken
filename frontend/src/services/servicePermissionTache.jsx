import axios from "axios";
import { API_URL } from "../api/ApiUrl";

class ServicePermissionTache {
    

    obtenirToken() {
        const utilisateur = localStorage.getItem("user");
        if (utilisateur) {
            const donneeUtilisateur = JSON.parse(utilisateur);
            return donneeUtilisateur.token?.accessToken || null;
        }
        return null;
    }


    obtenirHeaders() {
        const token = this.obtenirToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }


    async assignerPermission(donneesPermission) {
        try {
            const reponse = await axios.post(
                `${API_URL}/todo-permissions`,
                donneesPermission,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async modifierPermission(idTache, idUtilisateur, donneesPermission) {
        try {
            const reponse = await axios.put(
                `${API_URL}/todo-permissions/${idTache}/${idUtilisateur}`,
                donneesPermission,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async revoquerPermission(idTache, idUtilisateur) {
        try {
            const reponse = await axios.delete(
                `${API_URL}/todo-permissions/${idTache}/${idUtilisateur}`,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async obtenirPermissions(idTache) {
        try {
            const reponse = await axios.get(
                `${API_URL}/todo-permissions/${idTache}`,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }
}

const servicePermissionTache = new ServicePermissionTache();
export default servicePermissionTache;
