import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const processPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/process-payment`, paymentData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const returnOrder = async (id) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/return-item`, id);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

