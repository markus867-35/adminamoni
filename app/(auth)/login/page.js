'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

  // Cek data ke tabel kustom 'admins'
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    setErrorMsg('Email atau password salah!');
    setLoading(false);
  } else {
    // Jika login berhasil, simpan status sesi sederhana di localStorage (atau langsung arahkan ke dashboard)
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_email', data.email);

    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: 'Selamat datang kembali, ' + data.username,
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      router.push('/admin');
      router.refresh();
    }, 1200);
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
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Login Admin</h2>
            <p className="text-xs text-slate-500 mt-1">Silakan masukkan akun Anda</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-600 text-center font-medium">
              {errorMsg}
            </div>
          )}

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

        </div>

      </div>
    </div>
  );
}