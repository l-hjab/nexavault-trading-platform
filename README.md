# NexaVault Trading Platform

A full-stack cryptocurrency trading platform with live market data, portfolio management, and advanced trading features.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/l-hjab/nexavault-trading-platform.git
cd nexavault-trading-platform

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Backend setup (new terminal)
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## 📊 Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Redux Toolkit
- Tailwind CSS + Custom CSS Variables
- TradingView Lightweight Charts
- Socket.io Client
- Axios

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Socket.io (WebSocket)
- Bcryptjs
- Helmet & CORS

## 🎨 Design System

**Dark Luxury Gold Theme:**
```
--bg-primary: #080C12
--bg-secondary: #0D1320
--bg-card: #131C2B
--gold: #C9A84C
--gold-light: #E8C97A
--text-primary: #F0EDE6
--text-muted: #8A94A6
--green: #22C55E
--red: #EF4444
```

**Fonts:** Syne (headings) + DM Sans (body)

## 📍 Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing Page | No |
| `/auth` | Login/Sign Up | No |
| `/dashboard` | User Dashboard | Yes |
| `/markets` | Market Data | Yes |
| `/trade/:symbol` | Trading | Yes |
| `/wallet` | Portfolio | Yes |
| `/profile` | Settings | Yes |

## ✨ Features

### Landing Page
- Responsive navbar
- Forex ticker (auto-scrolling)
- Hero slider (3 slides)
- Crypto price strip
- Statistics section
- About/Services/Why Us sections
- Footer

### Authentication
- Email sign up/login
- JWT token storage
- Session restoration
- Password reset

### Dashboard
- Portfolio summary cards
- Quick actions (Buy, Sell, Deposit, Withdraw)
- Portfolio allocation chart
- Recent transactions
- Live market widget
- Active trading plans

### Markets
- Sortable crypto table
- Real-time prices
- Sparkline charts
- Filter tabs (All, Crypto, Forex, Trending, Gainers, Losers)
- Pagination
- Trending section

### Trading
- TradingView chart (1m, 5m, 15m, 1h, 4h, 1D, 1W)
- Buy/Sell forms
- Market/Limit/Stop orders
- Order book with depth
- Recent trades
- Real-time execution

### Wallet
- Balance overview
- Holdings table
- Transaction history
- Deposit/Withdraw modals
- QR code for deposits

## 📁 Project Structure

```
nexavault-trading-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── landing/
│   │   │   ├── dashboard/
│   │   │   ├── markets/
│   │   │   └── trade/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── .env.example
└── .gitignore
```

## 🔧 Environment Variables

**Frontend (.env.local):**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/nexavault
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
COINGECKO_API_KEY=free
CORS_ORIGIN=http://localhost:5173
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Market
- `GET /api/market/prices` - All prices
- `GET /api/market/coin/:symbol` - Single coin
- `GET /api/market/forex` - Forex rates

### Trading
- `POST /api/trade/buy` - Buy order
- `POST /api/trade/sell` - Sell order
- `GET /api/trade/history` - Trade history

### Wallet
- `GET /api/wallet/balance` - Balance
- `GET /api/wallet/holdings` - Holdings
- `POST /api/wallet/deposit` - Deposit
- `POST /api/wallet/withdraw` - Withdraw

## 🚀 Development

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev

# Build
cd frontend && npm run build
cd backend && npm run build
```

## 📦 Dependencies

**Frontend:**
- react, react-dom, react-router-dom
- @reduxjs/toolkit, react-redux
- axios, socket.io-client
- lightweight-charts, recharts
- framer-motion, lucide-react
- tailwindcss

**Backend:**
- express, cors, helmet, morgan
- @prisma/client
- jsonwebtoken, bcryptjs
- socket.io, axios
- express-rate-limit

## 📄 License

MIT

## 💬 Support

For issues or questions, create an issue on GitHub.
