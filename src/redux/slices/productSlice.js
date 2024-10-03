import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllProducts, getProductByProductName } from '../../services/ProductService'
import _ from 'lodash'

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params, { rejectWithValue }) => {
    try {
        console.log(params)
        const response = await getAllProducts(params)
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const fetchProductByProductName = createAsyncThunk('product/fetchProductByProductName', async (product_name, { rejectWithValue }) => {
    try {
        const response = await getProductByProductName(product_name)
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        currentProduct: null,
        products: [],
        totalPages: 0,
        currentPage: 1,
        filters: {
            category: [],
            priceRange: { min: 0, max: Infinity },
            color: [],
            size: [],
            stockQuantity: { min: 0, max: Infinity },
            soldQuantity: { min: 0, max: Infinity },
            search: '',
        },
        sortOption: '',
        status: 'idle',
        error: null,
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            state.currentPage = 1
        },
        setSortOption: (state, action) => {
            state.sortOption = action.payload
            state.currentPage = 1
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.products = action.payload.products
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(fetchProductByProductName.fulfilled, (state, action) => {
                state.currentProduct = action.payload
            })
        // .addCase(updateProduct.fulfilled, (state, action) => {
        //     const index = state.products.findIndex(p => p._id === action.payload._id)
        //     if (index !== -1) {
        //         state.products[index] = action.payload
        //     }
        // })
    },
})

export const { setFilters, setSortOption, setCurrentPage } = productSlice.actions

export default productSlice.reducer
