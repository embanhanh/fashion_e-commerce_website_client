import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    getAddressesUser,
    getUser,
    updateProfile,
    createAddress,
    updateAddressUser,
    deleteAddressUser,
    getVouchersUser,
    getClients,
    blockClient,
    unblockClient,
    updateClientType,
    blockManyClient,
    unblockManyClient,
    updateManyClientType,
} from '../../services/UserService'

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await getUser()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

// Định nghĩa createAsyncThunk cho updateUserProfile
export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (userData, { rejectWithValue }) => {
    try {
        const response = await updateProfile(userData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchAddresses = createAsyncThunk('user/fetchAddresses', async (_, { rejectWithValue }) => {
    try {
        const response = await getAddressesUser()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addNewAddress = createAsyncThunk('user/createAddress', async (addressData, { rejectWithValue }) => {
    try {
        const response = await createAddress(addressData) // Đảm bảo trả về response.data đúng cách
        return response // Không cần return response.data.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateAddress = createAsyncThunk('user/updateAddress', async ({ address_id, addressData }, { rejectWithValue }) => {
    try {
        const respone = await updateAddressUser(address_id, addressData)
        return respone
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteAddress = createAsyncThunk('user/deleteAddress', async ({ address_id }) => {
    try {
        const respone = await deleteAddressUser(address_id)
        return respone
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchVouchers = createAsyncThunk('user/fetchVouchers', async (_, { rejectWithValue }) => {
    try {
        const response = await getVouchersUser()
        return response
    } catch (error) {
        return rejectWithValue(error.message || 'Có lỗi xảy ra')
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        addresses: [],
        loading: false,
        error: null,
        success: false,
        vouchers: [],
        clients: [],
        clientsLoading: false,
        clientFilters: {
            name: '',
            phone: '',
            totalSpent: '',
            orderCount: '',
            clientType: '',
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.success = true
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.success = false
            })
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false
                state.addresses = action.payload
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addNewAddress.pending, (state) => {
                state.loading = true
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.loading = false
                state.addresses.push(action.payload) // Thêm địa chỉ mới vào danh sách
            })
            .addCase(addNewAddress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Lưu lỗi vào state
                console.error('Error adding address:', action.payload) // Ghi lại lỗi
            })
            .addCase(updateAddress.pending, (state) => {
                state.loading = true
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false
                const index = state.addresses.findIndex((address) => address.id === action.payload.id) // Tìm chỉ số địa chỉ cần cập nhật
                if (index !== -1) {
                    state.addresses[index] = action.payload // Cập nhật địa chỉ trong danh sách
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload // Lưu lỗi vào state
                console.error('Error updating address:', action.payload) // Ghi lại lỗi
            })
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false
                // Remove the address from the addresses array using the address_id
                state.addresses = state.addresses.filter((address) => address.id !== action.payload.id)
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                console.error('Error deleting address:', action.payload) // Log the error
            })
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false
                const index = state.addresses.findIndex((address) => address.id === action.payload.id) // Tìm chỉ số địa chỉ cần cập nhật
                if (index !== -1) {
                    state.addresses[index] = action.payload // Cập nhật địa chỉ trong danh sách
                }
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(fetchVouchers.pending, (state) => {
                state.error = null
            })
            .addCase(fetchVouchers.fulfilled, (state, action) => {
                state.vouchers = action.payload
            })
            .addCase(fetchVouchers.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(fetchClients.pending, (state) => {
                state.clientsLoading = true
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.clientsLoading = false
                state.clients = action.payload
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.clientsLoading = false
                state.error = action.payload
            })
            .addCase(blockClientAction.pending, (state) => {
                state.error = null
            })
            .addCase(blockClientAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (client._id === action.payload._id ? action.payload : client))
            })
            .addCase(blockClientAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(unblockClientAction.pending, (state) => {
                state.error = null
            })
            .addCase(unblockClientAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (client._id === action.payload._id ? action.payload : client))
            })
            .addCase(unblockClientAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateClientTypeAction.pending, (state) => {
                state.error = null
            })
            .addCase(updateClientTypeAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (client._id === action.payload._id ? action.payload : client))
            })
            .addCase(updateClientTypeAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateManyClientTypeAction.pending, (state) => {
                state.error = null
            })
            .addCase(updateManyClientTypeAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (action.payload.find((user) => user._id === client._id) ? action.payload.find((user) => user._id === client._id) : client))
            })
            .addCase(updateManyClientTypeAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(blockManyClientAction.pending, (state) => {
                state.error = null
            })
            .addCase(blockManyClientAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (action.payload.find((user) => user._id === client._id) ? action.payload.find((user) => user._id === client._id) : client))
            })
            .addCase(blockManyClientAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(unblockManyClientAction.pending, (state) => {
                state.error = null
            })
            .addCase(unblockManyClientAction.fulfilled, (state, action) => {
                state.error = null
                state.clients = state.clients.map((client) => (action.payload.find((user) => user._id === client._id) ? action.payload.find((user) => user._id === client._id) : client))
            })
            .addCase(unblockManyClientAction.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export default userSlice.reducer
