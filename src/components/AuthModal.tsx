"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Determine which endpoint to hit in your backend folder
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      // Change 'http://localhost:5000' to your actual backend server URL
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Store the token (sent from your backend)
        localStorage.setItem('authToken', data.token);
        // 2. Close modal and go to dashboard
        onClose();
        router.push('/dashboard');
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Cannot connect to backend server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#161a1e] border border-[#2a2e39] w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm">Access the Pro-Terminal Dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm outline-none focus:border-yellow-500 text-white"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm outline-none focus:border-yellow-500 text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-[#0b0e11] border border-[#2a2e39] rounded-lg py-3 pl-10 text-sm outline-none focus:border-yellow-500 text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Login" : "Register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs text-gray-500 hover:text-yellow-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}