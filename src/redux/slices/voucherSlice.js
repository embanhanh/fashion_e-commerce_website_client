import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createVoucher, getVouchers, updateVoucher, deleteVoucher, deleteManyVoucher, getVoucherById } from '../../services/VoucherService'

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
    },
})

export default voucherSlice.reducer
