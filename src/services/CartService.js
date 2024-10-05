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

export const updateCartItemQuantity = async (itemId, quantity) => {
    try {
        const response = await axios.put(
            `${API_URL}update/${itemId}`,
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const removeCartItem = async (itemId) => {
    try {
        const response = await axios.delete(`${API_URL}remove/${itemId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}
