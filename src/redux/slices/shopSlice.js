import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getShop, updateShop } from '../../services/ShopService'

export const getShopInfo = createAsyncThunk('shop/getInfo', async (_, { rejectWithValue }) => {
    try {
        const response = await getShop()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateShopInfo = createAsyncThunk('shop/updateInfo', async (shopData, { rejectWithValue }) => {
    try {
        const response = await updateShop(shopData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        shopInfo: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getShopInfo.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getShopInfo.fulfilled, (state, action) => {
                state.loading = false
                state.shopInfo = action.payload
            })
            .addCase(getShopInfo.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateShopInfo.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateShopInfo.fulfilled, (state, action) => {
                state.loading = false
                state.shopInfo = action.payload
            })
            .addCase(updateShopInfo.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export default shopSlice.reducer
