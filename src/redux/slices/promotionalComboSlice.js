import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPromotionalCombo, getPromotionalCombos } from '../../services/PromotionalComboService'

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

const promotionalComboSlice = createSlice({
    name: 'promotionalCombo',
    initialState: {
        promotionalCombos: [],
        status: 'idle',
        error: null,
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
    },
})

export default promotionalComboSlice.reducer
