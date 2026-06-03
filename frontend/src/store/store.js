import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import marketReducer from './slices/marketSlice'
import walletReducer from './slices/walletSlice'
import tradeReducer from './slices/tradeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    wallet: walletReducer,
    trade: tradeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
})

export default store
