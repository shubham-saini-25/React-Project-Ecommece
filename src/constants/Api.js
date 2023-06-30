import axios from 'axios';

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-category`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-products`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
