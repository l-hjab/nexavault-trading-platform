import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { placeTrade, fetchOpenTrades } from '../store/slices/tradeSlice'
import { fetchMarkets } from '../store/slices/marketSlice'
import '../styles/Trade.css'

const Trade = () => {
  const dispatch = useDispatch()
  const { isTradePlacing, error } = useSelector((state) => state.trade)
  const { markets } = useSelector((state) => state.market)
  const { balance } = useSelector((state) => state.wallet)

  const [formData, setFormData] = useState({
    symbol: '',
    type: 'BUY',
    quantity: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
  })

  useEffect(() => {
    dispatch(fetchMarkets())
    dispatch(fetchOpenTrades())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.symbol || !formData.quantity || !formData.entryPrice) {
      alert('Please fill in all required fields')
      return
    }

    const tradeTotal = parseFloat(formData.quantity) * parseFloat(formData.entryPrice)
    if (tradeTotal > balance.available) {
      alert('Insufficient balance for this trade')
      return
    }

    try {
      await dispatch(placeTrade(formData)).unwrap()
      alert('Trade placed successfully!')
      setFormData({
        symbol: '',
        type: 'BUY',
        quantity: '',
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
      })
      dispatch(fetchOpenTrades())
    } catch (err) {
      alert(`Error placing trade: ${err}`)
    }
  }

  return (
    <div className="trade-page">
      <h1>Place a Trade</h1>

      <div className="trade-container">
        {/* Trade Form */}
        <section className="trade-form-section">
          <form onSubmit={handleSubmit} className="trade-form">
            <h2>Trade Details</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="symbol">Symbol *</label>
              <select
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
              >
                <option value="">Select a market</option>
                {markets.map((market) => (
                  <option key={market.symbol} value={market.symbol}>
                    {market.symbol} - ${market.price?.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Trade Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="entryPrice">Entry Price *</label>
              <input
                id="entryPrice"
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="Enter entry price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stopLoss">Stop Loss</label>
              <input
                id="stopLoss"
                type="number"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
                placeholder="Enter stop loss price"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="takeProfit">Take Profit</label>
              <input
                id="takeProfit"
                type="number"
                name="takeProfit"
                value={formData.takeProfit}
                onChange={handleChange}
                placeholder="Enter take profit price"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-summary">
              <p>
                <strong>Trade Total:</strong> $
                {(
                  parseFloat(formData.quantity || 0) * parseFloat(formData.entryPrice || 0)
                ).toFixed(2)}
              </p>
              <p>
                <strong>Available Balance:</strong> ${balance.available?.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              disabled={isTradePlacing}
              className="submit-btn"
            >
              {isTradePlacing ? 'Placing Trade...' : 'Place Trade'}
            </button>
          </form>
        </section>

        {/* Market Info */}
        <section className="market-info-section">
          <h2>Top Markets</h2>
          <div className="markets-list">
            {markets.slice(0, 5).map((market) => (
              <div
                key={market.symbol}
                className="market-item"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    symbol: market.symbol,
                    entryPrice: market.price.toString(),
                  }))
                }
              >
                <div className="market-header">
                  <h4>{market.symbol}</h4>
                  <p className={`change ${market.change >= 0 ? 'positive' : 'negative'}`}>
                    {market.change >= 0 ? '+' : ''}{market.change?.toFixed(2)}%
                  </p>
                </div>
                <p className="price">${market.price?.toFixed(2)}</p>
                <p className="volume">Vol: {market.volume?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Trade
