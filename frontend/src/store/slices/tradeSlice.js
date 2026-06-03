import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const placeTrade = createAsyncThunk(
  'trade/placeTrade',
  async (tradeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/trades', tradeData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Trade placement failed')
    }
  }
)

export const fetchOpenTrades = createAsyncThunk(
  'trade/fetchOpenTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/trades/open')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch open trades')
    }
  }
)

export const fetchClosedTrades = createAsyncThunk(
  'trade/fetchClosedTrades',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/trades/closed', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch closed trades')
    }
  }
)

export const closeTrade = createAsyncThunk(
  'trade/closeTrade',
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/trades/${tradeId}/close`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close trade')
    }
  }
)

export const updateStopLoss = createAsyncThunk(
  'trade/updateStopLoss',
  async ({ tradeId, stopLoss }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/trades/${tradeId}/stop-loss`, { stopLoss })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stop loss')
    }
  }
)

export const updateTakeProfit = createAsyncThunk(
  'trade/updateTakeProfit',
  async ({ tradeId, takeProfit }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/trades/${tradeId}/take-profit`, { takeProfit })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update take profit')
    }
  }
)

const initialState = {
  openTrades: [],
  closedTrades: [],
  selectedTrade: null,
  isLoading: false,
  isTradePlacing: false,
  error: null,
  stats: {
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    totalLoss: 0,
  },
}

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    selectTrade: (state, action) => {
      state.selectedTrade = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Place Trade
    builder
      .addCase(placeTrade.pending, (state) => {
        state.isTradePlacing = true
        state.error = null
      })
      .addCase(placeTrade.fulfilled, (state, action) => {
        state.isTradePlacing = false
        state.openTrades.push(action.payload)
        state.stats.totalTrades += 1
      })
      .addCase(placeTrade.rejected, (state, action) => {
        state.isTradePlacing = false
        state.error = action.payload
      })

    // Fetch Open Trades
    builder
      .addCase(fetchOpenTrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOpenTrades.fulfilled, (state, action) => {
        state.isLoading = false
        state.openTrades = action.payload.trades || action.payload
      })
      .addCase(fetchOpenTrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Fetch Closed Trades
    builder
      .addCase(fetchClosedTrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClosedTrades.fulfilled, (state, action) => {
        state.isLoading = false
        state.closedTrades = action.payload.trades || action.payload
        if (action.payload.stats) {
          state.stats = action.payload.stats
        }
      })
      .addCase(fetchClosedTrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Close Trade
    builder
      .addCase(closeTrade.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(closeTrade.fulfilled, (state, action) => {
        state.isLoading = false
        state.openTrades = state.openTrades.filter(
          (trade) => trade.id !== action.payload.id
        )
        state.closedTrades.unshift(action.payload)
      })
      .addCase(closeTrade.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update Stop Loss
    builder
      .addCase(updateStopLoss.pending, (state) => {
        state.error = null
      })
      .addCase(updateStopLoss.fulfilled, (state, action) => {
        const trade = state.openTrades.find((t) => t.id === action.payload.id)
        if (trade) {
          trade.stopLoss = action.payload.stopLoss
        }
      })
      .addCase(updateStopLoss.rejected, (state, action) => {
        state.error = action.payload
      })

    // Update Take Profit
    builder
      .addCase(updateTakeProfit.pending, (state) => {
        state.error = null
      })
      .addCase(updateTakeProfit.fulfilled, (state, action) => {
        const trade = state.openTrades.find((t) => t.id === action.payload.id)
        if (trade) {
          trade.takeProfit = action.payload.takeProfit
        }
      })
      .addCase(updateTakeProfit.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { selectTrade, clearError } = tradeSlice.actions
export default tradeSlice.reducer
