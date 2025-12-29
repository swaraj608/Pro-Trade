"use client";
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

export default function OrderBook() {
  const [orders, setOrders] = useState({ bids: [], asks: [] });

  // Connect to Binance Depth Stream (Updates every 100ms)
  const { lastJsonMessage } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth10@100ms');

  useEffect(() => {
    if (lastJsonMessage) {
      // Bids (Buy orders) and Asks (Sell orders)
      setOrders({
        bids: lastJsonMessage.b.slice(0, 10), // Top 10 Bids
        asks: lastJsonMessage.a.slice(0, 10).reverse(), // Top 10 Asks
      });
    }
  }, [lastJsonMessage]);

  // Calculate SPREAD (Lowest Ask - Highest Bid)
  const highestBid = orders.bids[0] ? parseFloat(orders.bids[0][0]) : 0;
  const lowestAsk = orders.asks[orders.asks.length - 1] ? parseFloat(orders.asks[orders.asks.length - 1][0]) : 0;
  const spread = (lowestAsk - highestBid).toFixed(2);

  return (
    <div className="bg-[#171a21] border border-[#2a2e39] rounded-lg p-4 w-full font-mono text-xs">
      <h3 className="text-gray-500 font-bold mb-4 uppercase tracking-wider">Order Book</h3>
      
      {/* ASKS (Sellers) - Red Section */}
      <div className="flex flex-col-reverse">
        {orders.asks.map(([price, qty], i) => (
          <div key={i} className="flex justify-between py-1 relative overflow-hidden group">
            {/* DEPTH visualization bar */}
            <div className="absolute right-0 top-0 h-full bg-red-500/10 transition-all" style={{ width: `${Math.min(parseFloat(qty) * 10, 100)}%` }}></div>
            <span className="text-red-500 z-10">{parseFloat(price).toFixed(2)}</span>
            <span className="text-gray-400 z-10">{parseFloat(qty).toFixed(4)}</span>
          </div>
        ))}
      </div>

      {/* SPREAD Display */}
      <div className="my-4 py-2 border-y border-[#2a2e39] text-center bg-[#0e1015]">
        <span className="text-gray-500">Spread: </span>
        <span className="text-white font-bold">{spread}</span>
      </div>

      {/* BIDS (Buyers) - Green Section */}
      <div className="flex flex-col">
        {orders.bids.map(([price, qty], i) => (
          <div key={i} className="flex justify-between py-1 relative overflow-hidden">
            {/* DEPTH visualization bar */}
            <div className="absolute right-0 top-0 h-full bg-green-500/10 transition-all" style={{ width: `${Math.min(parseFloat(qty) * 10, 100)}%` }}></div>
            <span className="text-green-500 z-10">{parseFloat(price).toFixed(2)}</span>
            <span className="text-gray-400 z-10">{parseFloat(qty).toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}