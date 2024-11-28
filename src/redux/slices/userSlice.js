import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    getAddressesUser,
    getUser,
    updateProfile,
    createAddress,
    updateAddressUser,
    deleteAddressUser,
    setDefaultAddressUser,
    getVouchersUser,
    getClients,
    blockClient,
    unblockClient,
    updateClientType,
    blockManyClient,
    unblockManyClient,
    updateManyClientType,
    getOrderUser,
    getOrdersByUserId,
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

export const setDefaultAddress = createAsyncThunk('user/setDefaultAddress', async ({ address_id }, { rejectWithValue }) => {
    try {
        const response = await setDefaultAddressUser(address_id)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchOrderUser = createAsyncThunk('user/fetchOrderUser', async (_, { getState, rejectWithValue }) => {
    try {
        const { user } = getState()
        const response = await getOrderUser(user.orderFilters.status)
        return response
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

export const fetchClients = createAsyncThunk('user/fetchClients', async (clientFilters, { rejectWithValue }) => {
    try {
        const response = await getClients(clientFilters)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const blockClientAction = createAsyncThunk('user/blockClient', async ({ userId, reasons }, { rejectWithValue }) => {
    try {
        const response = await blockClient(userId, reasons)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const unblockClientAction = createAsyncThunk('user/unblockClient', async ({ userId }, { rejectWithValue }) => {
    try {
        const response = await unblockClient(userId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateClientTypeAction = createAsyncThunk('user/updateClientType', async ({ userId, clientType }, { rejectWithValue }) => {
    try {
        const response = await updateClientType(userId, clientType)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateManyClientTypeAction = createAsyncThunk('user/updateManyClientType', async ({ userIds, clientType }, { rejectWithValue }) => {
    try {
        const response = await updateManyClientType(userIds, clientType)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const blockManyClientAction = createAsyncThunk('user/blockManyClient', async ({ userIds, reasons }, { rejectWithValue }) => {
    try {
        const response = await blockManyClient(userIds, reasons)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const unblockManyClientAction = createAsyncThunk('user/unblockManyClient', async ({ userIds }, { rejectWithValue }) => {
    try {
        const response = await unblockManyClient(userIds)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchOrdersByUserId = createAsyncThunk(
    'user/fetchOrdersByUserId',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getOrdersByUserId(userId)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        addresses: [],
        loading: false,
        error: null,
        success: false,
        vouchers: [],
        orders: [],
        orderFilters: {
            status: '',
        },
        clients: [],
        clientsLoading: false,
        clientFilters: {
            name: '',
            phone: '',
            totalSpent: '',
            orderCount: '',
            clientType: '',
        },
        userOrders: [],
    },
    reducers: {
        setOrderFilters: (state, action) => {
            state.orderFilters = action.payload
        },
    },
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
                state.loading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.loading = false;

                // Reset all addresses to not default
                state.addresses.forEach(address => {
                    address.default = false;
                });

                // Add the new address as default and place it at the top
                const newAddress = { ...action.payload, default: true }; // Đảm bảo địa chỉ mới là default
                state.addresses.unshift(newAddress); // Thêm vào đầu danh sách
            })
            .addCase(addNewAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lưu lỗi vào state
                console.error('Error adding address:', action.payload); // Ghi lại lỗi
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
            .addCase(fetchOrderUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrderUser.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
                console.log('Fetched orders:', action.payload) // Kiểm tra dữ liệu
            })
            .addCase(fetchOrderUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                console.error('Error fetching orders:', action.payload) // Log lỗi
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
            .addCase(fetchOrdersByUserId.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
                state.loading = false
                state.userOrders = action.payload
            })
            .addCase(fetchOrdersByUserId.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                console.error('Error fetching user orders:', action.payload)
            })
    },
})

export const { setOrderFilters } = userSlice.actions
export default userSlice.reducer
