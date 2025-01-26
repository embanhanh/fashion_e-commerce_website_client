import { createSlice } from '@reduxjs/toolkit'

const searchHistorySlice = createSlice({
    name: 'searchHistory',
    initialState: {
        history: [], // Mảng chứa lịch sử tìm kiếm
        maxItems: 10, // Số lượng tối đa các mục lịch sử
    },
    reducers: {
        addSearchTerm: (state, action) => {
            const searchTerm = action.payload
            // Loại bỏ term trùng lặp nếu có
            state.history = state.history.filter((term) => term !== searchTerm)
            // Thêm term mới vào đầu mảng
            state.history.unshift(searchTerm)
            // Giới hạn số lượng items
            if (state.history.length > state.maxItems) {
                state.history = state.history.slice(0, state.maxItems)
            }
        },
    },
})

export const { addSearchTerm } = searchHistorySlice.actions
export default searchHistorySlice.reducer
