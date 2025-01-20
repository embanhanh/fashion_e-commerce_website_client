import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import categoryReducer from './slices/categorySlice'
import productReducer from './slices/productSlice'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import shopReducer from './slices/shopSlice'
import bannerReducer from './slices/bannerSlice'
import userReducer from './slices/userSlice'
import voucherReducer from './slices/voucherSlice'
import orderReducer from './slices/orderSilce'
import promotionalComboReducer from './slices/promotionalComboSlice'
import searchHistoryReducer from './slices/searchHistorySlice'

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isLoggedIn', 'user'],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

const searchHistoryPersistConfig = {
    key: 'searchHistory',
    storage,
    whitelist: ['history'],
}

const persistedSearchHistoryReducer = persistReducer(searchHistoryPersistConfig, searchHistoryReducer)

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        product: productReducer,
        auth: persistedAuthReducer,
        cart: cartReducer,
        shop: shopReducer,
        user: userReducer,
        banner: bannerReducer,
        voucher: voucherReducer,
        order: orderReducer,
        promotionalCombo: promotionalComboReducer,
        searchHistory: persistedSearchHistoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)
