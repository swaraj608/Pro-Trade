"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a backend call to your Backend Folder
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] flex flex-col items-center justify-center p-4">
      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl text-black font-black text-2xl mb-4">
            G
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Sign in to Gemini" : "Create an account"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin ? "Enter your details to access the terminal" : "Join thousands of traders today"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161a1e] border border-[#2a2e39] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleAction} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-600" size={18} />
                  <input type="text" placeholder="trader_pro" className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm text-white outline-none focus:border-yellow-500/50" required />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-600" size={18} />
                <input type="email" placeholder="name@email.com" className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm text-white outline-none focus:border-yellow-500/50" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-600" size={18} />
                <input type="password" placeholder="••••••••" className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm text-white outline-none focus:border-yellow-500/50" required />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2a2e39] text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-500 font-bold ml-2 hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600 px-8">
          By continuing, you agree to Gemini's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}