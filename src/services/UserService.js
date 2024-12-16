import axios from 'axios'
const API_URL = 'http://localhost:5000/user/'

const axiosInstance = axios.create({
    baseURL: API_URL,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response) {
            console.error('Lỗi phản hồi:', error.response.data)
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                try {
                    const refreshToken = localStorage.getItem('refreshToken')
                    const response = await axios.post(API_URL + 'refresh-token', { refreshToken })
                    const { accessToken } = response.data
                    localStorage.setItem('token', accessToken)
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    console.error('Lỗi làm mới token:', refreshError.response?.data || refreshError.message)
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    window.location.href = '/user/login'
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(new Error(error.response.data.message || 'Có lỗi xảy ra'))
        }
        return Promise.reject(error)
    }
)

export const login = async (user) => {
    try {
        const response = await axiosInstance.post('login', user)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        return response.data
    } catch (error) {
        throw error
    }
}

export const register = async (user) => {
    try {
        const response = await axiosInstance.post('register', user)
        return response.data
    } catch (error) {
        throw error
    }
}

export const loginWithFirebase = async (token, type) => {
    try {
        const response = await axiosInstance.post(`login/${type}`, token)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getUser = async () => {
    try {
        const response = await axiosInstance.get(API_URL + 'account/profile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_URL + 'account/profile/edit', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token vào headers
                'Content-Type': 'application/json', // Đảm bảo định dạng JSON
            },
        })

        return response.data // Trả về dữ liệu từ response
    } catch (error) {
        throw error
    }
}

export const getAddressesUser = async () => {
    try {
        const response = await axiosInstance.get(API_URL + 'account/address', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createAddress = async (addresData) => {
    try {
        const response = await axiosInstance.post('account/address/create', addresData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data // Trả về dữ liệu từ response
    } catch (error) {
        throw error
    }
}

export const updateAddressUser = async (address_id, addressData) => {
    try {
        const response = await axiosInstance.put(`account/address/update/${address_id}`, addressData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteAddressUser = async (address_id) => {
    try {
        const response = await axiosInstance.delete(`account/address/delete/${address_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
            },
        })
        return response
    } catch (error) {
        throw error
    }
}

export const getVouchersUser = async () => {
    try {
        const response = await axiosInstance.get(API_URL + 'account/voucher', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getClients = async (clientFilters) => {
    try {
        const response = await axios.get(API_URL + 'clients', {
            params: clientFilters,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const blockClient = async (userId, reasons) => {
    try {
        const response = await axiosInstance.put(
            `clients/block/${userId}`,
            { reasons },
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

export const blockManyClient = async (userIds, reasons) => {
    try {
        const response = await axiosInstance.patch(
            'clients/block-many',
            { userIds, reasons },
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

export const unblockClient = async (userId) => {
    try {
        const response = await axiosInstance.put(`clients/unblock/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const unblockManyClient = async (userIds) => {
    try {
        const response = await axiosInstance.patch(
            'clients/unblock-many',
            { userIds },
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

export const updateClientType = async (userId, clientType) => {
    try {
        const response = await axios.put(
            API_URL + 'clients/update-client-type/' + userId,
            { clientType },
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

export const updateManyClientType = async (userIds, clientType) => {
    try {
        const response = await axiosInstance.patch(
            'clients/update-client-type-many',
            { userIds, clientType },
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

export const setDefaultAddressUser = async (address_id) => {
    try {
        const response = await axiosInstance.put(
            `account/address/setdefault/${address_id}`,
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

export const getOrderUser = async (status) => {
    try {
        const response = await axiosInstance.get('purchase', {
            params: { filterStatus: status },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getFavoriteProducts = async () => {
    try {
        const response = await axiosInstance.get('account/favorite-products', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getOrderDetail = async (orderId) => {
    try {
        const response = await axiosInstance.get(`purchase/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await axiosInstance.put(
            'purchase/cancel/' + orderId,
            { reason },
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
