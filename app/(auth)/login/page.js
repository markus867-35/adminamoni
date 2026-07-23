'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-40 scale-105" 
        style={{ backgroundImage: `url('https://ik.imagekit.io/j72i7hsy1/login1.jpg')` }}
      ></div>

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Sisi Kiri: Gambar & Branding */}
        <div className="relative bg-slate-900 hidden md:flex flex-col justify-between p-8 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url('https://ik.imagekit.io/j72i7hsy1/login1.jpg')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="relative z-10">
            <span className="font-extrabold tracking-widest text-lg text-white">AMONISLOT</span>
          </div>

          <div className="relative z-10 space-y-2">
            <h2 className="text-xl font-bold">Welcome Back!</h2>
            <p className="text-xs text-slate-300">Masuk untuk mengelola dashboard dan aktivitas Anda dengan mudah.</p>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white text-slate-900">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900"> Login</h2>
            <p className="text-xs text-slate-500 mt-1">Silakan masukkan akun Anda</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-600 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button 
            type="button"
            className="w-full flex items-center justify-center space-x-2 border border-slate-300 hover:bg-slate-50 transition py-2.5 rounded-xl text-xs font-medium text-slate-700 shadow-sm cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[11px]">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative border border-slate-300 rounded-xl bg-white px-3 py-1.5 focus-within:border-orange-500 shadow-sm">
              <label className="block text-[11px] text-slate-400 font-normal">Email Address</label>
              <div className="flex items-center">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="relative border border-slate-300 rounded-xl bg-white px-3 py-1.5 focus-within:border-orange-500 shadow-sm">
              <label className="block text-[11px] text-slate-400 font-normal">Password</label>
              <div className="flex items-center">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff5500] hover:bg-[#e04c00] text-white font-medium py-3 rounded-xl text-xs tracking-wider transition shadow-md cursor-pointer mt-2 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="text-[#ff5500] font-medium hover:underline">
              Sign up
            </a>
          </div>

          <div className="flex justify-center space-x-4 mt-6 text-slate-400">
            <a href="#" className="hover:text-slate-600 transition">🌐</a>
            <a href="#" className="hover:text-slate-600 transition">💬</a>
            <a href="#" className="hover:text-slate-600 transition">📷</a>
          </div>

        </div>

      </div>
    </div>
  );
}