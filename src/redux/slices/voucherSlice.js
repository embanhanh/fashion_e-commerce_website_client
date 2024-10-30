import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createVoucher, getVouchers, updateVoucher, deleteVoucher, deleteManyVoucher, getVoucherById, giveVoucher, giveVoucherMany } from '../../services/VoucherService'

export const createVoucherAction = createAsyncThunk('voucher/createVoucher', async (voucherData, { rejectWithValue }) => {
    try {
        const response = await createVoucher(voucherData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getVouchersAction = createAsyncThunk('voucher/getVouchers', async (_, { rejectWithValue }) => {
    try {
        const response = await getVouchers()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getVoucherByIdAction = createAsyncThunk('voucher/getVoucherById', async (voucherId, { rejectWithValue }) => {
    try {
        const response = await getVoucherById(voucherId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateVoucherAction = createAsyncThunk('voucher/updateVoucher', async ({ voucherId, voucherData }, { rejectWithValue }) => {
    try {
        const response = await updateVoucher(voucherId, voucherData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteManyVoucherAction = createAsyncThunk('voucher/deleteManyVoucher', async (voucherIds, { rejectWithValue }) => {
    try {
        const response = await deleteManyVoucher(voucherIds)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const giveVoucherAction = createAsyncThunk('voucher/giveVoucher', async ({ userId, voucherIds, message }, { rejectWithValue }) => {
    try {
        const response = await giveVoucher(userId, voucherIds, message)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const giveVoucherManyAction = createAsyncThunk('voucher/giveVoucherMany', async ({ userIds, voucherIds, message }, { rejectWithValue }) => {
    try {
        const response = await giveVoucherMany(userIds, voucherIds, message)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {
        vouchers: [],
        currentVoucher: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVouchersAction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getVouchersAction.fulfilled, (state, action) => {
                state.vouchers = action.payload
                state.status = 'succeeded'
            })
            .addCase(getVouchersAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createVoucherAction.pending, (state) => {
                state.error = null
            })
            .addCase(createVoucherAction.fulfilled, (state, action) => {
                state.vouchers.push(action.payload)
            })
            .addCase(createVoucherAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getVoucherByIdAction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getVoucherByIdAction.fulfilled, (state, action) => {
                state.currentVoucher = action.payload
                state.status = 'succeeded'
            })
            .addCase(getVoucherByIdAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(updateVoucherAction.pending, (state) => {
                state.error = null
            })
            .addCase(updateVoucherAction.fulfilled, (state, action) => {
                state.vouchers = state.vouchers.map((voucher) => (voucher._id === action.payload._id ? action.payload : voucher))
            })
            .addCase(updateVoucherAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(deleteManyVoucherAction.pending, (state) => {
                state.error = null
            })
            .addCase(deleteManyVoucherAction.fulfilled, (state, action) => {
                state.vouchers = state.vouchers.filter((voucher) => !action.payload.includes(voucher._id))
            })
            .addCase(deleteManyVoucherAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(giveVoucherAction.pending, (state) => {
                state.error = null
            })
            .addCase(giveVoucherAction.fulfilled, (state, action) => {
                state.error = null
            })
            .addCase(giveVoucherAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(giveVoucherManyAction.pending, (state) => {
                state.error = null
            })
            .addCase(giveVoucherManyAction.fulfilled, (state, action) => {
                state.error = null
            })
            .addCase(giveVoucherManyAction.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export default voucherSlice.reducer
