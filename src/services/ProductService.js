import axios from 'axios'

const API_URL = 'http://localhost:5000/product/'

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_URL + 'create', productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getAllProducts = async (params) => {
    try {
        const response = await axios.get(API_URL, { params, timeout: 30000 })
        console.log('response', response)
        return response.data
    } catch (error) {
        console.error('Lỗi khi gọi API:', error)
        throw error
    }
}

export const getProductByProductName = async (product_name) => {
    try {
        const response = await axios.get(API_URL + product_name)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProduct = async (product_name, productData) => {
    try {
        const response = await axios.put(`${API_URL}edit/${product_name}`, productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteProduct = async (product_name) => {
    try {
        const response = await axios.delete(`${API_URL}delete/${product_name}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteManyProducts = async (product_names) => {
    try {
        const response = await axios.post(
            `${API_URL}delete-many`,
            { productSlugs: product_names },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const ratingProduct = async (productId, ratingData) => {
    try {
        const response = await axios.post(`${API_URL}rating/${productId}`, ratingData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const likeProduct = async (productId) => {
    try {
        const response = await axios.post(
            `${API_URL}like/${productId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getProductOutOfStock = async () => {
    try {
        const response = await axios.get(API_URL + 'out-of-stock', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const checkUserRating = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}check-rating/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const searchByImage = async (imageFile) => {
    try {
        const formData = new FormData()
        formData.append('image', imageFile)

        const response = await axios.post(`${API_URL}search-by-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const recommendContentBased = async (product_slug) => {
    try {
        const response = await axios.get(`${API_URL}recommend-content-based/${product_slug}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const recommendCollaborative = async () => {
    try {
        const response = await axios.get(`${API_URL}recommend-collaborative`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const recommendHybrid = async (data) => {
    try {
        const response = await axios.post(`${API_URL}recommend-hybrid`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

