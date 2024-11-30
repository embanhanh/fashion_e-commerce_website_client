import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    createOrder,
    getOrders,
    getAdminOrders,
    updateOrderStatusMany,
    getOrderById,
    createOrderFromGuest,
    getOrdersByUserId,
} from '../../services/OrderService'

export const createOrderAction = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
    try {
        const response = await createOrder(orderData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getOrdersAction = createAsyncThunk('order/getOrders', async (_, { rejectWithValue }) => {
    try {
        const response = await getOrders()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getOrderByIdAction = createAsyncThunk('order/getOrderById', async (orderId, { rejectWithValue }) => {
    try {
        const response = await getOrderById(orderId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getAdminOrdersAction = createAsyncThunk('order/getAdminOrders', async (filters, { rejectWithValue }) => {
    try {
        const response = await getAdminOrders(filters)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateOrderStatusManyAction = createAsyncThunk(
    'order/updateOrderStatusMany',
    async ({ orderIds, status }, { rejectWithValue }) => {
        try {
            const response = await updateOrderStatusMany(orderIds, status)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const createOrderFromGuestAction = createAsyncThunk(
    'order/createOrderFromGuest',
    async ({ orderData, address }, { rejectWithValue }) => {
        try {
            const response = await createOrderFromGuest(orderData, address)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const getOrdersByUserIdAction = createAsyncThunk(
    'order/getOrdersByUserId',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getOrdersByUserId(userId)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        currentOrder: null,
        filters: {
            status: '',
            productName: '',
            paymentMethod: '',
            shippingMethod: '',
            orderStartDate: '',
            orderEndDate: '',
        },
        ordersByUserId: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminOrdersAction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getAdminOrdersAction.fulfilled, (state, action) => {
                state.orders = action.payload
                state.status = 'succeeded'
            })
            .addCase(getAdminOrdersAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(getOrdersAction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getOrdersAction.fulfilled, (state, action) => {
                state.orders = action.payload
                state.status = 'succeeded'
            })
            .addCase(getOrdersAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createOrderAction.pending, (state) => {
                state.error = null
            })
            .addCase(createOrderAction.fulfilled, (state, action) => {
                state.orders.push(action.payload)
            })
            .addCase(createOrderAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateOrderStatusManyAction.pending, (state) => {
                state.error = null
            })
            .addCase(updateOrderStatusManyAction.fulfilled, (state, action) => {
                state.orders = state.orders.map((order) =>
                    action.payload.orderIds.includes(order._id) ? { ...order, status: action.payload.status } : order
                )
            })
            .addCase(updateOrderStatusManyAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getOrderByIdAction.pending, (state) => {
                state.error = null
            })
            .addCase(getOrderByIdAction.fulfilled, (state, action) => {
                state.currentOrder = action.payload
            })
            .addCase(getOrderByIdAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(createOrderFromGuestAction.pending, (state) => {
                state.error = null
            })
            .addCase(createOrderFromGuestAction.fulfilled, (state, action) => {
                state.orders.push(action.payload)
            })
            .addCase(createOrderFromGuestAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getOrdersByUserIdAction.pending, (state) => {
                state.error = null
            })
            .addCase(getOrdersByUserIdAction.fulfilled, (state, action) => {
                state.ordersByUserId = action.payload
            })
            .addCase(getOrdersByUserIdAction.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const { setFilters } = orderSlice.actions
export default orderSlice.reducer
