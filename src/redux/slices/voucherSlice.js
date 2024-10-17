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
