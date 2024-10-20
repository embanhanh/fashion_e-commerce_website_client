import axios from 'axios'

const API_URL_CLIENT = 'http://localhost:5000/purchase/'
const API_URL = 'http://localhost:5000/order/'

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(API_URL + 'create', orderData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getOrders = async () => {
    try {
        const response = await axios.get(API_URL_CLIENT, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getAdminOrders = async (filters) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: filters,
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const updateOrderStatusMany = async (orderIds, status) => {
    try {
        const response = await axios.put(
            API_URL + 'update-status-many',
            { orderIds, status },
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
