import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCart, addToCart } from '../../services/CartService'

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await getCart()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async (productData, { rejectWithValue }) => {
    try {
        const response = await addToCart(productData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        loading: false,
        error: null,
        addToCartSuccess: false,
    },
    reducers: {
        resetAddToCartSuccess: (state) => {
            state.addToCartSuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true
                state.error = null
                state.addToCartSuccess = false
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                state.addToCartSuccess = true
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.addToCartSuccess = false
            })
    },
})

export const { resetAddToCartSuccess } = cartSlice.actions

export default cartSlice.reducer
