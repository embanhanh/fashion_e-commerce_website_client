import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllCategories, createCategory } from '../../services/CategoryService'

export const fetchCategories = createAsyncThunk('category/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllCategories()
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const addNewCategory = createAsyncThunk('category/addNewCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const response = await createCategory(categoryData)
        return response.category
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
        return rejectWithValue(errorMessage)
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.categories = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewCategory.fulfilled, (state, action) => {
                const newCategory = action.payload
                console.log(newCategory)
                if (newCategory.parentCategory) {
                    const parentIndex = state.categories.findIndex((category) => category._id === newCategory.parentCategory._id)
                    if (parentIndex === -1) {
                        state.categories.push(newCategory.parentCategory)
                    }
                }
                state.categories.push(newCategory)
            })
            .addCase(addNewCategory.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export default categorySlice.reducer
