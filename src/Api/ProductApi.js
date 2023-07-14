import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const getProductsCount = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-product-count`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-products`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addProduct = async (formData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/add-products`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/update-product/${id}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/api/delete-product/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
