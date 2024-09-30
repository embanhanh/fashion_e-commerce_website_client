import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllProducts } from '../../services/ProductService'
import _ from 'lodash'

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllProducts()
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        allProducts: [],
        filteredProducts: [],
        filters: {
            category: [],
            priceRange: { min: 0, max: Infinity },
            color: [],
            size: [],
        },
        sortOption: '',
        status: 'idle',
        error: null,
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            state.filteredProducts = applyFilters(state.allProducts, state.filters)
        },
        setSortOption: (state, action) => {
            state.sortOption = action.payload
            state.filteredProducts = applySorting(state.filteredProducts, action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.allProducts = action.payload
                state.filteredProducts = action.payload
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
        const priceMatch = (product.originalPrice * product.discount) / 100 >= filters.priceRange.min && (product.originalPrice * product.discount) / 100 <= filters.priceRange.max
        const colorMatch = filters.color.length === 0 || filters.color.some((color) => product.variants.some((v) => v.color === color))
        const sizeMatch = filters.size.length === 0 || filters.size.some((size) => product.variants.some((v) => v.size === size))

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

export const { setFilters, setSortOption } = productSlice.actions

export default productSlice.reducer
