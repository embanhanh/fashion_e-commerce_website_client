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

export const getPromotionalComboById = async (combo_id) => {
    try {
        const response = await axios.get(API_URL + combo_id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const updatePromotionalCombo = async (combo_id, promotionalComboData) => {
    try {
        const response = await axios.put(API_URL + 'edit/' + combo_id, promotionalComboData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteManyPromotionalCombos = async (comboIds) => {
    try {
        const response = await axios.post(
            API_URL + 'delete-many',
            { comboIds },
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
