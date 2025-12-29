"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Activity, Terminal, Shield } from 'lucide-react';
import useWebSocket from 'react-use-websocket';

export default function TradingDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [price, setPrice] = useState<string>("0.00");
  const [priceColor, setPriceColor] = useState("text-emerald-500");
  const [orderBook, setOrderBook] = useState<{ bids: string[][], asks: string[][] }>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [candles, setCandles] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- RAW DATA STREAMS ---
  const { lastJsonMessage: tickerData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
  const { lastJsonMessage: depthData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth10@100ms');
  const { lastJsonMessage: klineData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
  const { lastJsonMessage: tradeData } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=80')
      .then(res => res.json())
      .then(data => {
        setCandles(data.map((d: any) => ({
          t: d[0], o: parseFloat(d[1]), h: parseFloat(d[2]), l: parseFloat(d[3]), c: parseFloat(d[4])
        })));
      });
  }, []);

  useEffect(() => {
    if (tickerData?.c) {
      const p = parseFloat(tickerData.c).toFixed(2);
      setPriceColor(p > price ? "text-emerald-500" : "text-rose-500");
      setPrice(p);
    }
    if (depthData?.b) setOrderBook({ bids: depthData.b.slice(0, 15), asks: depthData.a.slice(0, 15).reverse() });
    if (tradeData) setRecentTrades(prev => [{ p: tradeData.p, q: tradeData.q, t: tradeData.T, m: tradeData.m }, ...prev].slice(0, 20));
    if (klineData?.k) {
      const k = klineData.k;
      const newCandle = { t: k.t, o: parseFloat(k.o), h: parseFloat(k.h), l: parseFloat(k.l), c: parseFloat(k.c) };
      setCandles(prev => {
        const last = prev[prev.length - 1];
        if (last && last.t === newCandle.t) return [...prev.slice(0, -1), newCandle];
        return [...prev.slice(-79), newCandle];
      });
    }
  }, [tickerData, depthData, klineData, tradeData]);

  // RAW CANVAS ENGINE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = (canvas.parentElement?.clientWidth || 800) * dpr;
    canvas.height = (canvas.parentElement?.clientHeight || 400) * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const chartW = w - 60;
    const chartH = h - 20;

    const minP = Math.min(...candles.map(c => c.l));
    const maxP = Math.max(...candles.map(c => c.h));
    const range = maxP - minP;
    const getY = (p: number) => chartH - ((p - minP) / range) * chartH;
    const candleWidth = chartW / candles.length;

    ctx.clearRect(0, 0, w, h);
    
    // Grid Lines
    ctx.strokeStyle = '#1e1e1e';
    ctx.lineWidth = 1;
    for(let i=0; i<6; i++) {
      const gridY = (chartH / 6) * i;
      ctx.beginPath(); ctx.moveTo(0, gridY); ctx.lineTo(chartW, gridY); ctx.stroke();
    }

    candles.forEach((c, i) => {
      const x = i * candleWidth;
      const isUp = c.c >= c.o;
      ctx.fillStyle = isUp ? '#10b981' : '#f43f5e';
      ctx.strokeStyle = ctx.fillStyle;
      
      // Wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth/2, getY(c.h));
      ctx.lineTo(x + candleWidth/2, getY(c.l));
      ctx.stroke();

      // Body
      const bY = getY(Math.max(c.o, c.c));
      const bH = Math.max(1, Math.abs(getY(c.o) - getY(c.c)));
      ctx.fillRect(x + 1, bY, candleWidth - 2, bH);
    });
  }, [candles, isSidebarOpen]);

  return (
    <div className="flex h-screen bg-[#050505] text-[#a0a0a0] font-mono overflow-hidden selection:bg-emerald-500/30">
      
      {/* 1. MINIMAL NAV */}
      <aside className={`${isSidebarOpen ? 'w-16' : 'w-0'} transition-all duration-200 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center py-4 gap-6 overflow-hidden`}>
        <div className="w-10 h-10 border border-emerald-500 flex items-center justify-center text-emerald-500 rounded-sm">
          <Terminal size={20} />
        </div>
        <Activity size={20} className="hover:text-white cursor-pointer" />
        <Shield size={20} className="hover:text-white cursor-pointer" />
        <div className="mt-auto mb-4 p-2 rotate-180 [writing-mode:vertical-lr] text-[10px] tracking-tighter text-zinc-600 font-bold border-l border-zinc-800">
            SYSTEM_v4.0.2
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* DATA STRIP */}
        <header className="h-10 border-b border-[#1a1a1a] bg-[#080808] flex items-center px-4 justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-bold text-xs tracking-widest uppercase">BTC_USDT_PERP</span>
            <span className={`text-sm font-bold ${priceColor}`}>{price}</span>
            <span className="text-[10px] text-zinc-600 uppercase">Index: 67,420.12</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span>VOL: 2.14B</span>
            <div className="w-[1px] h-3 bg-zinc-800"></div>
            <span>LATENCY: 14MS</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: ORDERBOOK */}
          <div className="w-64 border-r border-[#1a1a1a] flex flex-col text-[10px]">
            <div className="p-2 border-b border-[#1a1a1a] font-bold text-zinc-400 flex justify-between uppercase">
                <span>Price</span><span>Size</span>
            </div>
            <div className="flex-1 p-2 space-y-[1px]">
               {orderBook.asks.map(([p, q], i) => (
                 <div key={i} className="flex justify-between text-rose-500/80">
                   <span>{parseFloat(p).toFixed(1)}</span><span>{parseFloat(q).toFixed(3)}</span>
                 </div>
               ))}
               <div className={`text-center py-2 text-sm font-bold border-y border-[#1a1a1a] my-2 ${priceColor}`}>{price}</div>
               {orderBook.bids.map(([p, q], i) => (
                 <div key={i} className="flex justify-between text-emerald-500/80">
                   <span>{parseFloat(p).toFixed(1)}</span><span>{parseFloat(q).toFixed(3)}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* CENTER: CHART */}
          <div className="flex-1 flex flex-col bg-[#050505]">
            <div className="flex-1 relative border-b border-[#1a1a1a]">
              <canvas ref={canvasRef} className="w-full h-full opacity-80" />
            </div>
            {/* RAW RECENT TRADES */}
            <div className="h-40 bg-[#080808] overflow-hidden flex flex-col">
              <div className="px-3 py-1 text-[9px] font-bold border-b border-[#1a1a1a] text-zinc-600 uppercase tracking-widest">Live Execution Log</div>
              <div className="flex-1 overflow-hidden grid grid-cols-2 p-2 gap-4">
                 <div className="space-y-0.5 overflow-hidden">
                    {recentTrades.slice(0, 10).map((t, i) => (
                       <div key={i} className="flex justify-between text-[9px]">
                         <span className={t.m ? 'text-rose-500' : 'text-emerald-500'}>{t.p}</span>
                         <span className="text-zinc-700">{t.q}</span>
                       </div>
                    ))}
                 </div>
                 <div className="space-y-0.5 opacity-40">
                    {recentTrades.slice(10, 20).map((t, i) => (
                       <div key={i} className="flex justify-between text-[9px]">
                         <span className="text-zinc-600">{t.p}</span>
                         <span className="text-zinc-800">{t.q}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROL */}
          <div className="w-72 bg-[#0a0a0a] border-l border-[#1a1a1a] p-4 flex flex-col gap-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-bold text-zinc-600 uppercase mb-2 block">Margin_Type</label>
                  <div className="flex gap-1">
                    <button className="flex-1 py-1 border border-zinc-800 text-[10px] text-zinc-400 hover:border-emerald-500 transition">CROSS</button>
                    <button className="flex-1 py-1 border border-emerald-500 bg-emerald-500/10 text-[10px] text-emerald-500">ISOLATED</button>
                  </div>
               </div>
               <div>
                  <label className="text-[9px] font-bold text-zinc-600 uppercase mb-1 block">Contract_Size</label>
                  <input className="w-full bg-transparent border border-zinc-800 p-2 text-xs text-white outline-none focus:border-emerald-500" placeholder="0.00" />
               </div>
               <div>
                  <div className="flex justify-between text-[9px] font-bold text-zinc-600 uppercase mb-1"><span>Risk_Leverage</span><span>10x</span></div>
                  <input type="range" className="w-full accent-emerald-500 h-1 bg-zinc-900 rounded-none appearance-none" />
               </div>
            </div>

            <div className="mt-auto flex gap-2">
               <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black py-4 text-[10px] font-black uppercase tracking-widest transition">Execute_Long</button>
               <button className="flex-1 bg-rose-600 hover:bg-rose-500 text-black py-4 text-[10px] font-black uppercase tracking-widest transition">Execute_Short</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}