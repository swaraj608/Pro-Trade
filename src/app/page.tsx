import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#0e1015] text-white min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-500 tracking-tighter">PRO-TRADE</h1>
        <div className="space-x-8 hidden md:flex text-gray-400">
          <a href="#" className="hover:text-white">Markets</a>
          <a href="#" className="hover:text-white">Platforms</a>
          <a href="#" className="hover:text-white">Company</a>
        </div>
        <button 
            onClick={() => router.push('/auth')}
            className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold">
            Trade Now
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto pt-20 pb-32 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Trade the World's <br /> 
          <span className="text-yellow-500">Fastest Markets</span>
        </h2>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          Experience ultra-low latency, deep liquidity, and professional tools. 
          Powered by real-time WebSocket technology.
        </p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform">
          Open Terminal <ArrowRight size={20} />
        </Link>
      </header>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-20">
        <FeatureCard icon={<Zap className="text-yellow-500"/>} title="0.1ms Execution" desc="Lightning fast trades with zero slippage technology." />
        <FeatureCard icon={<ShieldCheck className="text-yellow-500"/>} title="Secure Assets" desc="Full transparency and institutional grade security." />
        <FeatureCard icon={<Globe className="text-yellow-500"/>} title="Global Access" desc="Trade 200+ instruments including Crypto and Forex." />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-[#171a21] border border-gray-800 rounded-2xl hover:border-yellow-500/50 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}