import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const getCategoriesCount = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-category-count`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-category`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addCategory = async (formData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/add-category`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateCategory = async (id, formData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/update-category/${id}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/api/delete-category/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};