import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './slices/categorySlice'

export default configureStore({
    reducer: {
        category: categoryReducer,
    },
})
