import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login, register, loginWithFirebase } from '../../services/UserService'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await login(credentials)
        return response.user
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await register(userData)
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const loginWithFirebaseAction = createAsyncThunk('auth/loginWithFirebase', async ({ token, provider }, { rejectWithValue }) => {
    try {
        const response = await loginWithFirebase({ token }, provider)
        localStorage.setItem('token', response.token)
        return response.user
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.isLoggedIn = false
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = true
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(loginWithFirebaseAction.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginWithFirebaseAction.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = true
                state.user = action.payload
            })
            .addCase(loginWithFirebaseAction.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
