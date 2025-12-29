A real-time crypto trading interface featuring live WebSocket data integration and a dual-layer architecture.

## 🏗️ Architecture Overview

- **Frontend (`/frontend`)**: 
  - Next.js 15+ (App Router)
  - Custom HTML5 Canvas Charting Engine
  - Real-time Order Book & Trade History via Binance WebSockets
  - Responsive Tailwind CSS Layout

- **Backend (`/backend`)**: 
  - Node.js API Server
  - JWT-based Authentication (Login/Signup)
  - User Balance & Trade Persistence

## 🚦 Quick Start

1. **Backend**: `cd backend && npm install && npm start` (Runs on Port 5000)
2. **Frontend**: `cd frontend && npm install && npm run dev` (Runs on Port 3000)

## 📡 Data Flow
User Input -> **Frontend** -> API Call -> **Backend** -> Database -> Success Response -> **Dashboard**
