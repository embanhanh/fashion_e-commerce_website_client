import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './slices/categorySlice'
import productReducer from './slices/productSlice'
import authReducer from './slices/authSlice'
export default configureStore({
    reducer: {
        category: categoryReducer,
        product: productReducer,
        auth: authReducer,
    },
})
