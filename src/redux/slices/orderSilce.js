import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders } from '../../services/OrderService'

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

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        currentOrder: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
    },
})

export default orderSlice.reducer
