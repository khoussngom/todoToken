import axios from "axios";
import { API_URL } from "../api/ApiUrl";

class ServiceTache {
    

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


    async creerTache(donneesToche) {
        try {
            const reponse = await axios.post(
                `${API_URL}/todo`,
                donneesToche,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async obtenirToutesLesTaches(filtres = {}) {
        try {
            const params = new URLSearchParams();
            if (filtres.completed !== undefined) {
                params.append('completed', filtres.completed.toString());
            }
            if (filtres.userId !== undefined) {
                params.append('userId', filtres.userId.toString());
            }

            const reponse = await axios.get(
                `${API_URL}/todo?${params.toString()}`,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async obtenirTacheParId(id) {
        try {
            const reponse = await axios.get(
                `${API_URL}/todo/${id}`,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async modifierTache(id, donneesToche) {
        try {
            const reponse = await axios.put(
                `${API_URL}/todo/${id}`,
                donneesToche,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async supprimerTache(id) {
        try {
            const reponse = await axios.delete(
                `${API_URL}/todo/${id}`,
                { headers: this.obtenirHeaders() }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }


    async uploaderPhoto(fichierPhoto, dossier = 'todos') {
        try {
            const formData = new FormData();
            formData.append('file', fichierPhoto);
            formData.append('folder', dossier);

            const reponse = await axios.post(
                `${API_URL}/upload-file`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.obtenirToken()}`
                    }
                }
            );
            return reponse.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Erreur réseau");
        }
    }
}

const serviceTache = new ServiceTache();
export default serviceTache;
