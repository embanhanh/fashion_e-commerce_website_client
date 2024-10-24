import axios from 'axios'

const API_URL = 'http://localhost:5000/promotional-combo/'

export const createPromotionalCombo = async (promotionalComboData) => {
    try {
        const response = await axios.post(API_URL + 'create', promotionalComboData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getPromotionalCombos = async () => {
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
