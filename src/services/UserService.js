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
        const response = await fetch(API_URL + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        return response.json()
    } catch (error) {
        throw error
    }
}

export const loginWithFirebase = async (token, type) => {
    try {
        const response = await fetch(API_URL + `login/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token),
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        return response.json()
    } catch (error) {
        throw error
    }
}

export const getUser = async () => {
    try {
        const response = await axios.get(API_URL + 'account/profile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const updateProfile = async (userData) => {
    try {
        const response = await axios.put(API_URL + 'account/profile/edit', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,  // Thêm token vào headers
                'Content-Type': 'application/json', // Đảm bảo định dạng JSON
            },
        })

        return response.data  // Trả về dữ liệu từ response
    } catch (error) {
        throw error.response.data
    }
}

export const getAddressesUser = async () => {
    const response = await axios.get(API_URL + 'account/address', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    console.log(response.data) // Kiểm tra dữ liệu nhận được
    return response.data
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
        throw new Error(error.response?.data?.message || error.message)
    }
}

export const updateAddressUser = async (address_id, addressData) => {
    try {
        const response = await axiosInstance.put(`account/address/update/${address_id}`, addressData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const deleteAddressUser = async (address_id) => {
    try {
        const response = await axiosInstance.delete(`account/address/delete/${address_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token trong header
            },
        });
        return response;
    } catch (error) {
        console.error('Error delete address:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
}

export const setDefaultAddressUser = async (address_id) => {
    try {
        const response = await axiosInstance.put(
            `account/address/setdefault/${address_id}`,
            {}, // Assuming you don't need to send any data in the request body
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token in header
                },
            }
        );
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message); // Fix typo 'respone' to 'response'
    }
};
