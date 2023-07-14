import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const sendContactEmail = async (data) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/send-mail`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const sendInvoice = async (customerInfo) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/send-invoice`, customerInfo);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
