import axios from 'axios'

const API_URL = 'http://localhost:5000/voucher/'

export const createVoucher = async (voucherData) => {
    try {
        const response = await axios.post(API_URL + 'create', voucherData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getVouchers = async () => {
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

export const updateVoucher = async (voucherId, voucherData) => {
    try {
        const response = await axios.put(API_URL + 'edit/' + voucherId, voucherData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteVoucher = async (voucherId) => {
    try {
        const response = await axios.delete(API_URL + 'delete/' + voucherId)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getVoucherById = async (voucherId) => {
    try {
        const response = await axios.get(API_URL + 'get/' + voucherId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteManyVoucher = async (voucherIds) => {
    try {
        const response = await axios.post(
            API_URL + 'delete-many',
            { voucherIds },
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

export const giveVoucher = async (userId, voucherIds, message) => {
    try {
        const response = await axios.put(
            API_URL + 'give/' + userId,
            { voucherIds, message },
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
