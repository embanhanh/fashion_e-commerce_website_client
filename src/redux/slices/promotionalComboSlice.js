import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    createPromotionalCombo,
    getPromotionalCombos,
    getPromotionalComboById,
    updatePromotionalCombo,
    deleteManyPromotionalCombos,
    getPromotionalComboByProductId,
} from '../../services/PromotionalComboService'

export const createPromotionalComboAction = createAsyncThunk('promotionalCombo/createPromotionalCombo', async (promotionalComboData, { rejectWithValue }) => {
    try {
        const response = await createPromotionalCombo(promotionalComboData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getPromotionalCombosAction = createAsyncThunk('promotionalCombo/getPromotionalCombos', async (_, { rejectWithValue }) => {
    try {
        const response = await getPromotionalCombos()
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getPromotionalComboByIdAction = createAsyncThunk('promotionalCombo/getPromotionalComboById', async (combo_id, { rejectWithValue }) => {
    try {
        const response = await getPromotionalComboById(combo_id)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updatePromotionalComboAction = createAsyncThunk('promotionalCombo/updatePromotionalCombo', async ({ combo_id, promotionalComboData }, { rejectWithValue }) => {
    try {
        const response = await updatePromotionalCombo(combo_id, promotionalComboData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteManyPromotionalCombosAction = createAsyncThunk('promotionalCombo/deleteManyPromotionalCombos', async (comboIds, { rejectWithValue }) => {
    try {
        const response = await deleteManyPromotionalCombos(comboIds)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getPromotionalComboByProductIdAction = createAsyncThunk('promotionalCombo/getPromotionalComboByProductId', async (productId, { rejectWithValue }) => {
    try {
        const response = await getPromotionalComboByProductId(productId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const promotionalComboSlice = createSlice({
    name: 'promotionalCombo',
    initialState: {
        promotionalCombos: [],
        promotionalCombo: null,
        status: 'idle',
        error: null,
        promotionalComboByProduct: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPromotionalCombosAction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getPromotionalCombosAction.fulfilled, (state, action) => {
                state.promotionalCombos = action.payload
                state.status = 'succeeded'
            })
            .addCase(getPromotionalCombosAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createPromotionalComboAction.pending, (state) => {
                state.error = null
            })
            .addCase(createPromotionalComboAction.fulfilled, (state, action) => {
                state.promotionalCombos.push(action.payload)
            })
            .addCase(createPromotionalComboAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getPromotionalComboByIdAction.pending, (state) => {
                state.error = null
            })
            .addCase(getPromotionalComboByIdAction.fulfilled, (state, action) => {
                state.promotionalCombo = action.payload
            })
            .addCase(getPromotionalComboByIdAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updatePromotionalComboAction.pending, (state) => {
                state.error = null
            })
            .addCase(updatePromotionalComboAction.fulfilled, (state, action) => {
                state.promotionalCombos = state.promotionalCombos.map((combo) => (combo._id === action.payload._id ? action.payload : combo))
                state.promotionalCombo = action.payload
            })
            .addCase(updatePromotionalComboAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(deleteManyPromotionalCombosAction.pending, (state) => {
                state.error = null
            })
            .addCase(deleteManyPromotionalCombosAction.fulfilled, (state, action) => {
                state.promotionalCombos = state.promotionalCombos.filter((combo) => !action.payload.includes(combo._id))
            })
            .addCase(deleteManyPromotionalCombosAction.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getPromotionalComboByProductIdAction.pending, (state) => {
                state.error = null
            })
            .addCase(getPromotionalComboByProductIdAction.fulfilled, (state, action) => {
                state.promotionalComboByProduct = action.payload
            })
            .addCase(getPromotionalComboByProductIdAction.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export default promotionalComboSlice.reducer
