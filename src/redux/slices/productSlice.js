import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllProducts } from '../../services/ProductService'
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

const productSlice = createSlice({
    name: 'product',
    initialState: {
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
    },
})

const applyFilters = (products, filters) => {
    return products.filter((product) => {
        const categoryMatch = filters.category.length === 0 || product.categories.some((cat) => filters.category.includes(cat._id) || filters.category.includes(cat.parentCategory))
        const priceMatch =
            product.originalPrice - (product.originalPrice * product.discount) / 100 >= filters.priceRange.min &&
            product.originalPrice - (product.originalPrice * product.discount) / 100 <= filters.priceRange.max
        const colorMatch = filters.color.length === 0 || product.variants.some((variant) => filters.color.some((color) => variant.color.toLowerCase().trim().includes(color.toLowerCase().trim())))
        const sizeMatch = filters.size.length === 0 || filters.size.some((size) => product.variants.some((v) => v.size.toLowerCase().trim() === size.toLowerCase().trim()))

        return categoryMatch && priceMatch && colorMatch && sizeMatch
    })
}

const applySorting = (products, sortOption) => {
    switch (sortOption) {
        case 'priceAsc':
            return _.orderBy(products, ['originalPrice'], ['asc'])
        case 'priceDesc':
            return _.orderBy(products, ['originalPrice'], ['desc'])
        case 'newest':
            return _.orderBy(products, ['createdAt'], ['desc'])
        case 'popular':
            return _.orderBy(products, ['rating'], ['desc'])
        default:
            return products
    }
}

export const { setFilters, setSortOption, setCurrentPage } = productSlice.actions

export default productSlice.reducer
