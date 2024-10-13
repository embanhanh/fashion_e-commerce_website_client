import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUser, updateProfile } from '../../services/UserService'
// import { getCart, addToCart, updateCartItemQuantity, removeCartItem } from '../../services/CartService'

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await getUser()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

// Định nghĩa createAsyncThunk cho updateUserProfile
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateProfile(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
        success: false,
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
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.success = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
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