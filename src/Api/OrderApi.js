import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const getOrdersCount = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-order-count`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchAllOrders = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-orders`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchOrdersById = async (id) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const saveOrder = async (orderDetails) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/save-order`, orderDetails);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};