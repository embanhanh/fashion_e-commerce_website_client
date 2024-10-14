import axios from 'axios'

const API_URL = 'http://localhost:5000/banner/'

export const createBanner = async (bannerData) => {
    try {
        const response = await axios.post(API_URL + 'create', bannerData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getBannerById = async (bannerId) => {
    try {
        const response = await axios.get(`${API_URL}get/${bannerId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getAllBanners = async (params) => {
    try {
        const response = await axios.get(API_URL, { params })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const editBanner = async (bannerId, bannerData) => {
    try {
        const response = await axios.put(`${API_URL}edit/${bannerId}`, bannerData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const removeBanner = async (bannerId) => {
    try {
        const response = await axios.delete(`${API_URL}remove/${bannerId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const removeManyBanners = async (bannerIds) => {
    try {
        const response = await axios.post(
            `${API_URL}remove-many`,
            { bannerIds },
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
