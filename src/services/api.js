import axios from 'axios'

const API_URL = 'http://localhost:5000/'

const axiosInstance = axios.create({
    baseURL: API_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response && error.response.status === 401 && !originalRequest._retry && error.response.status === 403) {
            originalRequest._retry = true
            try {
                const refreshToken = localStorage.getItem('refreshToken')
                const response = await axios.post(API_URL + 'user/refresh-token', { refreshToken })
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
        return Promise.reject(error)
    }
)

export default axiosInstance
