import axios from 'axios'

const API_URL = 'http://localhost:5000/product/'

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_URL + 'create', productData)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getAllProducts = async (params) => {
    try {
        const response = await axios.get(API_URL, { params })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getProductByProductName = async (product_name) => {
    try {
        const response = await axios.get(API_URL + product_name)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const updateProduct = async (product_name, productData) => {
    try {
        const response = await axios.put(`${API_URL}edit/${product_name}`, productData)
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error')
    }
}

export const deleteProduct = async (product_name) => {
    try {
        const response = await axios.delete(`${API_URL}delete/${product_name}`)
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error')
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
        throw error.response ? error.response.data : new Error('Network Error')
    }
}
