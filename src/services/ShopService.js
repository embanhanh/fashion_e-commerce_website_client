import axios from 'axios'

const API_URL = 'http://localhost:5000/shop/'

const axiosInstance = axios.create({
    baseURL: API_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export const getShop = async () => {
    try {
        const response = await axiosInstance.get('')
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateShop = async (shopData) => {
    try {
        const formData = new FormData()
        for (const key in shopData) {
            if (key === 'logo' && shopData[key] instanceof File) {
                formData.append('logo', shopData[key])
            } else {
                formData.append(key, shopData[key])
            }
        }
        const response = await axiosInstance.put('/edit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}
