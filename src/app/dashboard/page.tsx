"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Wallet, Search, Bell, ChevronLeft, ChevronRight, Star, History, List, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useWebSocket from 'react-use-websocket';

export default function TradingDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [price, setPrice] = useState<string>("0.00");
  const [priceColor, setPriceColor] = useState("text-green-400");
  const [orderBook, setOrderBook] = useState<{ bids: string[][], asks: string[][] }>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [leverage, setLeverage] = useState(10);
  const [amount, setAmount] = useState(100);
  const [candles, setCandles] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- WEBSOCKETS ---
  const { lastJsonMessage: tickerData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
  const { lastJsonMessage: depthData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth10@100ms');
  const { lastJsonMessage: klineData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
  const { lastJsonMessage: tradeData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60')
      .then(res => res.json())
      .then(data => {
        setCandles(data.map((d: any) => ({
          t: d[0], o: parseFloat(d[1]), h: parseFloat(d[2]), l: parseFloat(d[3]), c: parseFloat(d[4])
        })));
      });
  }, []);

  useEffect(() => {
    if (tickerData?.c) {
      setPriceColor(parseFloat(tickerData.c).toFixed(2) > price ? "text-green-400" : "text-red-400");
      setPrice(parseFloat(tickerData.c).toFixed(2));
    }
    if (depthData?.b) setOrderBook({ bids: depthData.b.slice(0, 12), asks: depthData.a.slice(0, 12).reverse() });
    if (tradeData) setRecentTrades(prev => [{ p: tradeData.p, q: tradeData.q, t: tradeData.T, m: tradeData.m }, ...prev].slice(0, 15));
    if (klineData?.k) {
      const k = klineData.k;
      const newCandle = { t: k.t, o: parseFloat(k.o), h: parseFloat(k.h), l: parseFloat(k.l), c: parseFloat(k.c) };
      setCandles(prev => {
        const last = prev[prev.length - 1];
        if (last && last.t === newCandle.t) return [...prev.slice(0, -1), newCandle];
        return [...prev.slice(-59), newCandle];
      });
    }
  }, [tickerData, depthData, klineData, tradeData]);

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 400;
    const chartW = canvas.width - 60;
    const chartH = canvas.height - 20;
    const minP = Math.min(...candles.map(c => c.l)) * 0.9998;
    const maxP = Math.max(...candles.map(c => c.h)) * 1.0002;
    const range = maxP - minP;
    const getY = (p: number) => chartH - ((p - minP) / range) * chartH;
    const candleWidth = (chartW / 60) - 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e222d';
    for(let i=1; i<5; i++) {
        const y = (chartH / 5) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(chartW, y); ctx.stroke();
    }
    candles.forEach((c, i) => {
      const x = i * (chartW / 60);
      ctx.fillStyle = c.c >= c.o ? '#26a69a' : '#ef5350';
      ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath(); ctx.moveTo(x + candleWidth/2, getY(c.h)); ctx.lineTo(x + candleWidth/2, getY(c.l)); ctx.stroke();
      ctx.fillRect(x + 1, getY(Math.max(c.o, c.c)), candleWidth - 2, Math.max(1, Math.abs(getY(c.o) - getY(c.c))));
    });
  }, [candles, isSidebarOpen]);

  return (
    <div className="flex h-screen bg-[#0b0e11] text-gray-400 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-60' : 'w-0'} transition-all duration-300 border-r border-[#2a2e39] bg-[#161a1e] flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-2 min-w-[240px]">
          <div className="w-6 h-6 bg-yellow-500 rounded text-black font-bold flex items-center justify-center text-xs">B</div>
          <span className="text-white font-bold text-sm tracking-tight">BINANCE-CLONE</span>
        </div>
        <div className="p-3 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-600" size={12}/>
            <input placeholder="Search Pairs" className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded py-1 pl-7 text-[10px] outline-none focus:border-yellow-500/50" />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto min-w-[240px] text-[11px]">
          {['BTC/USDT', 'ETH/USDT', 'SOL/USDT'].map(coin => (
            <div key={coin} className="flex justify-between p-2 hover:bg-[#2a2e39]/30 cursor-pointer">
              <span>{coin}</span><span className="text-white">{coin.includes('BTC') ? price : '--'}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-12 border-b border-[#2a2e39] bg-[#161a1e] flex items-center px-4 gap-6">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-[#2a2e39] rounded"><List size={16}/></button>
          <div className="flex gap-4 items-center">
            <span className="text-white font-bold text-sm">BTCUSDT</span>
            <span className={`text-sm font-mono font-bold ${priceColor}`}>${price}</span>
          </div>
          <div className="flex gap-4 text-[10px]">
            <div><p className="text-gray-500">24h Change</p><p className="text-green-400">+2.45%</p></div>
            <div><p className="text-gray-500">24h High</p><p className="text-white">68,240.00</p></div>
            <div><p className="text-gray-500">24h Low</p><p className="text-white">66,120.00</p></div>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Middle Row: Orderbook + Chart + Recent Trades */}
          <div className="flex flex-1 border-b border-[#2a2e39] overflow-hidden">
            
            {/* Order Book */}
            <div className="w-56 border-r border-[#2a2e39] flex flex-col bg-[#161a1e]">
              <div className="p-2 text-[10px] font-bold border-b border-[#2a2e39]">Order Book</div>
              <div className="flex-1 overflow-hidden p-2 text-[10px] font-mono">
                <div className="text-red-400 space-y-0.5">
                  {orderBook.asks.map(([p, q], i) => <div key={i} className="flex justify-between"><span>{parseFloat(p).toFixed(1)}</span><span>{parseFloat(q).toFixed(3)}</span></div>)}
                </div>
                <div className={`py-2 text-center text-sm font-bold border-y border-[#2a2e39] my-1 ${priceColor}`}>{price}</div>
                <div className="text-green-400 space-y-0.5">
                  {orderBook.bids.map(([p, q], i) => <div key={i} className="flex justify-between"><span>{parseFloat(p).toFixed(1)}</span><span>{parseFloat(q).toFixed(3)}</span></div>)}
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex flex-col bg-[#0b0e11]">
              <div className="flex-1 relative">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            </div>

            {/* Recent Trades */}
            <div className="w-56 border-l border-[#2a2e39] flex flex-col bg-[#161a1e]">
              <div className="p-2 text-[10px] font-bold border-b border-[#2a2e39]">Recent Trades</div>
              <div className="flex-1 overflow-hidden p-2 text-[10px] font-mono space-y-1">
                {recentTrades.map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span className={t.m ? 'text-red-400' : 'text-green-400'}>{parseFloat(t.p).toFixed(1)}</span>
                    <span className="text-gray-500">{parseFloat(t.q).toFixed(4)}</span>
                    <span className="text-gray-600">{new Date(t.t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Area: Positions / Assets */}
          <div className="h-48 bg-[#161a1e]">
            <div className="flex border-b border-[#2a2e39] text-[10px]">
               <button className="px-4 py-2 border-b-2 border-yellow-500 text-white font-bold">Open Positions (0)</button>
               <button className="px-4 py-2 text-gray-500">Order History</button>
               <button className="px-4 py-2 text-gray-500">Assets</button>
            </div>
            <div className="p-8 text-center text-xs text-gray-600 uppercase tracking-widest font-bold">
              No active positions found
            </div>
          </div>
        </div>
      </main>

      {/* 3. RIGHT PANEL (EXECUTION) */}
      <aside className="w-72 border-l border-[#2a2e39] bg-[#161a1e] flex flex-col p-4">
        <div className="flex gap-1 bg-[#0b0e11] p-1 rounded mb-4">
          <button className="flex-1 py-1 text-[10px] font-bold bg-[#2a2e39] text-white rounded">Limit</button>
          <button className="flex-1 py-1 text-[10px] font-bold text-gray-600">Market</button>
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Price</label>
            <input type="text" readOnly value={price} className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded p-2 text-xs text-white" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Amount (USDT)</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded p-2 text-xs text-white" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1"><span>Leverage</span><span className="text-yellow-500">{leverage}x</span></div>
            <input type="range" min="1" max="100" value={leverage} onChange={(e)=>setLeverage(Number(e.target.value))} className="w-full accent-yellow-500" />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold text-xs">Buy / Long</button>
          <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded font-bold text-xs">Sell / Short</button>
        </div>
      </aside>
    </div>
  );
}