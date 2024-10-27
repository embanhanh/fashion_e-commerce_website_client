import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCart, addToCart, updateCartItemQuantity, removeCartItem } from '../../services/CartService'

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

export const updateItemQuantity = createAsyncThunk('cart/updateItemQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await updateCartItemQuantity(itemId, quantity)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (itemId, { rejectWithValue }) => {
    try {
        const response = await removeCartItem(itemId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        status: 'idle',
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
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload
                state.status = 'succeeded'
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(addItemToCart.pending, (state) => {
                state.error = null
                state.addToCartSuccess = false
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.cart = action.payload
                state.addToCartSuccess = true
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.error = action.payload
                state.addToCartSuccess = false
            })
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                state.cart = action.payload
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cart = action.payload
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const { resetAddToCartSuccess } = cartSlice.actions

export default cartSlice.reducer
