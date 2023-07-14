import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const userLogin = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/login`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUserPassword = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/update-password`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
