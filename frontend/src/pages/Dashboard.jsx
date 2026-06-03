import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBalance } from '../store/slices/walletSlice'
import { fetchOpenTrades } from '../store/slices/tradeSlice'
import { fetchMarkets } from '../store/slices/marketSlice'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { balance, isLoading: walletLoading } = useSelector((state) => state.wallet)
  const { openTrades, stats } = useSelector((state) => state.trade)
  const { markets } = useSelector((state) => state.market)

  useEffect(() => {
    dispatch(fetchBalance())
    dispatch(fetchOpenTrades())
    dispatch(fetchMarkets())
  }, [dispatch])

  return (
    <div className="dashboard">
      <h1>Trading Dashboard</h1>

      {/* Balance Summary */}
      <section className="balance-summary">
        <div className="card">
          <h3>Total Balance</h3>
          <p className="amount">${balance.total?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card">
          <h3>Available</h3>
          <p className="amount">${balance.available?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card">
          <h3>Reserved</h3>
          <p className="amount">${balance.reserved?.toFixed(2) || '0.00'}</p>
        </div>
      </section>

      {/* Trading Stats */}
      <section className="trading-stats">
        <h2>Trading Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <label>Total Trades</label>
            <p>{stats.totalTrades}</p>
          </div>
          <div className="stat-card">
            <label>Win Rate</label>
            <p>{stats.winRate?.toFixed(2)}%</p>
          </div>
          <div className="stat-card">
            <label>Total Profit</label>
            <p className="profit">${stats.totalProfit?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="stat-card">
            <label>Total Loss</label>
            <p className="loss">${stats.totalLoss?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </section>

      {/* Open Trades */}
      <section className="open-trades">
        <h2>Open Trades ({openTrades.length})</h2>
        {openTrades.length > 0 ? (
          <div className="trades-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Entry Price</th>
                  <th>Current Price</th>
                  <th>Quantity</th>
                  <th>P&L</th>
                  <th>Stop Loss</th>
                  <th>Take Profit</th>
                </tr>
              </thead>
              <tbody>
                {openTrades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.symbol}</td>
                    <td className={trade.type === 'BUY' ? 'buy' : 'sell'}>{trade.type}</td>
                    <td>${trade.entryPrice?.toFixed(2)}</td>
                    <td>${trade.currentPrice?.toFixed(2)}</td>
                    <td>{trade.quantity}</td>
                    <td className={trade.pnl >= 0 ? 'profit' : 'loss'}>
                      ${trade.pnl?.toFixed(2)}
                    </td>
                    <td>${trade.stopLoss?.toFixed(2)}</td>
                    <td>${trade.takeProfit?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No open trades</p>
        )}
      </section>

      {/* Market Overview */}
      <section className="market-overview">
        <h2>Market Overview</h2>
        {markets.length > 0 ? (
          <div className="markets-grid">
            {markets.slice(0, 6).map((market) => (
              <div key={market.symbol} className="market-card">
                <h4>{market.symbol}</h4>
                <p className="price">${market.price?.toFixed(2)}</p>
                <p className={`change ${market.change >= 0 ? 'positive' : 'negative'}`}>
                  {market.change >= 0 ? '+' : ''}{market.change?.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No markets available</p>
        )}
      </section>
    </div>
  )
}

export default Dashboard
