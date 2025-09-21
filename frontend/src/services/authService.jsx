import axios from "axios";
import { API_URL } from "../api/ApiUrl";

const authService = {
    login: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, userData);
            response && localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network Error");
        }
    },

    inscription: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network Error");
        }
    }
};

export default authService;