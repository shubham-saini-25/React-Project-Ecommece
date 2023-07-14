import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_URL;

export const getUsersCount = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-user-count`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/get-users`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/register`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/update-user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/api/delete-user/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};