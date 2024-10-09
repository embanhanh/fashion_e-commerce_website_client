import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUser } from '../../services/UserService'
// import { getCart, addToCart, updateCartItemQuantity, removeCartItem } from '../../services/CartService'

export const fetchUser = createAsyncThunk('user/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await getUser()        
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

// export const addItemToCart = createAsyncThunk('cart/addItemToCart', async (productData, { rejectWithValue }) => {
//     try {
//         const response = await addToCart(productData)
//         return response
//     } catch (error) {
//         return rejectWithValue(error)
//     }
// })

// export const updateItemQuantity = createAsyncThunk('cart/updateItemQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
//     try {
//         const response = await updateCartItemQuantity(itemId, quantity)
//         return response
//     } catch (error) {
//         return rejectWithValue(error)
//     }
// })

// export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (itemId, { rejectWithValue }) => {
//     try {
//         const response = await removeCartItem(itemId)
//         return response
//     } catch (error) {
//         return rejectWithValue(error)
//     }
// })

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
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
            // .addCase(addItemToCart.pending, (state) => {
            //     state.loading = true
            //     state.error = null
            //     state.addToCartSuccess = false
            // })
            // .addCase(addItemToCart.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.cart = action.payload
            //     state.addToCartSuccess = true
            // })
            // .addCase(addItemToCart.rejected, (state, action) => {
            //     state.loading = false
            //     state.error = action.payload
            //     state.addToCartSuccess = false
            // })
            // .addCase(updateItemQuantity.fulfilled, (state, action) => {
            //     state.cart = action.payload
            // })
            // .addCase(removeItemFromCart.fulfilled, (state, action) => {
            //     state.cart = action.payload
            // })
            // .addCase(removeItemFromCart.rejected, (state, action) => {
            //     state.error = action.payload
            // })
    },
})



export default userSlice.reducer
