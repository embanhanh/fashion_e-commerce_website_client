import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    getAllProducts,
    getProductByProductName,
    updateProduct,
    deleteProduct,
    deleteManyProducts,
    ratingProduct,
    likeProduct,
} from '../../services/ProductService'
import _ from 'lodash'

// export const fetchAllProducts = createAsyncThunk('product/fetchAllProducts', async (_, { rejectWithValue }) => {
//     try {
//         const response = await getAllProducts({ limit: 1000000 })
//         return response
//     } catch (error) {
//         return rejectWithValue(error.response.data)
//     }
// })

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params, { rejectWithValue }) => {
    try {
        const response = await getAllProducts(params)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchProductByProductName = createAsyncThunk(
    'product/fetchProductByProductName',
    async (product_name, { rejectWithValue }) => {
        try {
            const response = await getProductByProductName(product_name)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateProductAction = createAsyncThunk(
    'product/updateProduct',
    async ({ product_name, productData }, { rejectWithValue }) => {
        try {
            const response = await updateProduct(product_name, productData)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteProductAction = createAsyncThunk(
    'product/deleteProduct',
    async (product_name, { rejectWithValue }) => {
        try {
            const response = await deleteProduct(product_name)
            return { product_name, message: response.message }
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteManyProductsAction = createAsyncThunk(
    'product/deleteManyProducts',
    async (product_names, { rejectWithValue }) => {
        try {
            const response = await deleteManyProducts(product_names)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const ratingProductAction = createAsyncThunk(
    'product/ratingProduct',
    async ({ productId, ratingData }, { rejectWithValue }) => {
        try {
            const response = await ratingProduct(productId, ratingData)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const likeProductAction = createAsyncThunk('product/likeProduct', async (productId, { rejectWithValue }) => {
    try {
        const response = await likeProduct(productId)
        return response
    } catch (error) {
        return rejectWithValue(error)
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
            rating: 0,
            brand: [],
            searchImageLabels: [],
        },
        sortOption: '',
        hasRated: 'false',
        status: 'idle',
        loading: false,
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
            .addCase(updateProductAction.fulfilled, (state, action) => {
                state.currentProduct = action.payload.product
                const index = state.products.findIndex((p) => p._id === action.payload.product._id)
                if (index !== -1) {
                    state.products[index] = action.payload.product
                }
            })
            .addCase(deleteProductAction.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product.slug !== action.payload.product_name)
            })
            .addCase(deleteProductAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(deleteManyProductsAction.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => !action.payload.includes(product.slug))
            })
            .addCase(deleteManyProductsAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(ratingProductAction.rejected, (state, action) => {
                state.error = action.payload
            })
            // .addCase(fetchAllProducts.pending, (state) => {
            //     state.status = 'loading'
            // })
            // .addCase(fetchAllProducts.fulfilled, (state, action) => {
            //     state.status = 'succeeded'
            //     state.products = action.payload.products
            // })
            // .addCase(fetchAllProducts.rejected, (state, action) => {
            //     state.status = 'failed'
            //     state.error = action.error.message
            // })
            .addCase(likeProductAction.fulfilled, (state, action) => {
                state.currentProduct.favoriteProducts = action.payload
            })
            .addCase(likeProductAction.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const { setFilters, setSortOption, setCurrentPage } = productSlice.actions

export default productSlice.reducer
