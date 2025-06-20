import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAnswer } from '../../services/ChatbotService'

export const getAnswerAction = createAsyncThunk('chatbot/getAnswer', async (message, { rejectWithValue }) => {
    try {
        const response = await getAnswer(message)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: {
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAnswerAction.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(getAnswerAction.fulfilled, (state, action) => {
                state.status = 'succeeded'
            })
            .addCase(getAnswerAction.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || 'An error occurred while fetching the answer.'
            })
    },
})

export default chatbotSlice.reducer
