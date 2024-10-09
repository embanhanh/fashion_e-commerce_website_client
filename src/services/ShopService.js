import axios from 'axios'
import { storage } from '../firebase.config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
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
        let logoUrl = shopData.logo

        if (shopData.logo instanceof File) {
            if (shopData.oldLogoUrl) {
                const oldLogoRef = ref(storage, shopData.oldLogoUrl)
                await deleteObject(oldLogoRef)
            }

            const logoRef = ref(storage, `shop_logos/${Date.now()}_${shopData.logo.name}`)
            await uploadBytes(logoRef, shopData.logo)
            logoUrl = await getDownloadURL(logoRef)
        }

        const updatedShopData = {
            ...shopData,
            logo: logoUrl,
        }

        const response = await axiosInstance.put('edit', updatedShopData)
        return response.data
    } catch (error) {
        throw error
    }
}
