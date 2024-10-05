import axios from 'axios'
const API_URL = 'http://localhost:5000/user/'

const axiosInstance = axios.create({
    baseURL: API_URL,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
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
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.location.href = '/user/login'
                return Promise.reject(refreshError)
            }
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
