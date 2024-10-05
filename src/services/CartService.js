import axios from 'axios'

const API_URL = 'http://localhost:5000/cart/'

export const getCart = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const addToCart = async (productData) => {
    try {
        const response = await axios.post(API_URL + 'add', productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}
