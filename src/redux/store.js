import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/test'

export default configureStore({
    reducer: {
        counter: counterReducer,
    },
})
