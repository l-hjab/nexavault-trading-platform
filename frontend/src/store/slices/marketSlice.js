import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMarkets = createAsyncThunk(
  'market/fetchMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/markets')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch markets')
    }
  }
)

export const fetchMarketDetails = createAsyncThunk(
  'market/fetchMarketDetails',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await api.get(`/markets/${symbol}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch market details')
    }
  }
)

export const fetchPriceHistory = createAsyncThunk(
  'market/fetchPriceHistory',
  async ({ symbol, timeframe }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/markets/${symbol}/history`, {
        params: { timeframe },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch price history')
    }
  }
)

const initialState = {
  markets: [],
  selectedMarket: null,
  priceHistory: [],
  isLoading: false,
  error: null,
  lastUpdate: null,
}

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    selectMarket: (state, action) => {
      state.selectedMarket = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Markets
    builder
      .addCase(fetchMarkets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.isLoading = false
        state.markets = action.payload.markets || action.payload
        state.lastUpdate = new Date().toISOString()
      })
      .addCase(fetchMarkets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Fetch Market Details
    builder
      .addCase(fetchMarketDetails.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMarketDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedMarket = action.payload
      })
      .addCase(fetchMarketDetails.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Fetch Price History
    builder
      .addCase(fetchPriceHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPriceHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.priceHistory = action.payload.history || action.payload
      })
      .addCase(fetchPriceHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { selectMarket, clearError } = marketSlice.actions
export default marketSlice.reducer
