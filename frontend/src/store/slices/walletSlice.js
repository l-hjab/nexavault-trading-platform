import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wallet')
    }
  }
)

export const fetchBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/balance')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance')
    }
  }
)

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/transactions', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const depositFunds = createAsyncThunk(
  'wallet/depositFunds',
  async (depositData, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/deposit', depositData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Deposit failed')
    }
  }
)

export const withdrawFunds = createAsyncThunk(
  'wallet/withdrawFunds',
  async (withdrawData, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/withdraw', withdrawData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Withdrawal failed')
    }
  }
)

const initialState = {
  balance: {
    total: 0,
    available: 0,
    reserved: 0,
  },
  assets: [],
  transactions: [],
  isLoading: false,
  error: null,
  depositInProgress: false,
  withdrawInProgress: false,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Wallet
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload.balance || {}
        state.assets = action.payload.assets || []
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Fetch Balance
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload.transactions || action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Deposit Funds
    builder
      .addCase(depositFunds.pending, (state) => {
        state.depositInProgress = true
        state.error = null
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.depositInProgress = false
        state.balance.available += action.payload.amount
        state.transactions.unshift(action.payload.transaction)
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.depositInProgress = false
        state.error = action.payload
      })

    // Withdraw Funds
    builder
      .addCase(withdrawFunds.pending, (state) => {
        state.withdrawInProgress = true
        state.error = null
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.withdrawInProgress = false
        state.balance.available -= action.payload.amount
        state.transactions.unshift(action.payload.transaction)
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.withdrawInProgress = false
        state.error = action.payload
      })
  },
})

export const { clearError } = walletSlice.actions
export default walletSlice.reducer
