import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './slices/categorySlice'
import productReducer from './slices/productSlice'

export default configureStore({
    reducer: {
        category: categoryReducer,
        product: productReducer,
    },
})
