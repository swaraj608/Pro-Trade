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
       <Link href="/auth" className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold">
           Trade Now
       </Link>
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

      {/* Footer */}
<footer className="border-t border-gray-800 bg-[#0b0e11] py-12 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      {/* Column 1 */}
      <div>
        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Platform</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><a href="#" className="hover:text-yellow-500 transition">Terminal</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">API Documentation</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">Trading Rules</a></li>
        </ul>
      </div>

      {/* Column 2 */}
      <div>
        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Support</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><a href="#" className="hover:text-yellow-500 transition">Help Center</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">System Status</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">Feedback</a></li>
        </ul>
      </div>

      {/* Column 3 */}
      <div>
        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><a href="#" className="hover:text-yellow-500 transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">Terms of Service</a></li>
          <li><a href="#" className="hover:text-yellow-500 transition">Cookie Policy</a></li>
        </ul>
      </div>

      {/* Column 4 */}
      <div className="flex flex-col items-start md:items-end">
        <h1 className="text-xl font-bold text-yellow-500 tracking-tighter mb-2">PRO-TRADE</h1>
        <p className="text-[10px] text-gray-600 md:text-right uppercase">
          Institutional Grade <br /> Digital Asset Terminal
        </p>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between gap-6">
      <div className="max-w-2xl">
        <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-tight">
          Risk Warning: Trading digital assets involves significant risk and can result in the loss of your invested capital. 
          The price of digital assets is highly volatile and not suitable for all investors. 
          Pro-Trade does not provide investment, tax, or legal advice.
        </p>
      </div>
      <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
        &copy; 2025 PRO-TRADE CORE. ALL RIGHTS RESERVED.
      </div>
    </div>
  </div>
</footer>
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