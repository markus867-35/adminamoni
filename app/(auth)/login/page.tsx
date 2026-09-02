'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // State Tambahan untuk 2FA
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [adminData, setAdminData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. Cek data admin berdasarkan email dan password
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      setErrorMsg('Email atau password salah!');
      setLoading(false);
      return;
    }
console.log("Nilai is_2fa_enabled saat ini:", data.is_2fa_enabled);
    // 2. Cek apakah admin ini mengaktifkan 2FA
// 2. Cek apakah admin ini mengaktifkan 2FA
    if (data.is_2fa_enabled) {
      setAdminData(data);
      setRequires2FA(true); // <--- INI YANG MEMBUATNYA MASUK KE HALAMAN/FORM 2FA
      setLoading(false);
      return;
    }

    // 3. Jika TIDAK pakai 2FA, jalankan proses login normal
    await finalizeLogin(data);
  };

  // Fungsi terpisah untuk menyelesaikan proses login & redirect
  const finalizeLogin = async (data) => {
    // Update waktu last_login ke database
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    // Simpan sesi ke localStorage
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_email', data.email);
    localStorage.setItem('admin_name', data.username);

    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      router.push('/admin');
      router.refresh();
    }, 1200);
  };

 const handleVerify2FA = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');

  // --- TAMBAHKAN INI UNTUK DEBUGGING ---
  console.log("Data Admin saat Verifikasi:", adminData);
  console.log("Secret yang dikirim:", adminData?.two_factor_secret);
  console.log("Token yang dikirim:", otpToken);
  // ------------------------------------

  try {
    const res = await fetch('/api/auth/verify-login-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        secret: adminData?.two_factor_secret, 
        token: otpToken 
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Kode OTP salah atau sudah kadaluarsa!');
    }

    await finalizeLogin(adminData);
  } catch (err) {
    setErrorMsg(err.message);
    setLoading(false);
  }
};
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-40 scale-105" 
        style={{ backgroundImage: `url('https://ik.imagekit.io/j72i7hsy1/login1.jpg')` }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl h-[540px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Sisi Kiri: Gambar & Branding */}
        <div className="relative bg-slate-900 hidden md:flex flex-col justify-between p-8 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 scale-105"
            style={{ backgroundImage: `url('https://ik.imagekit.io/j72i7hsy1/login1.jpg')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="relative z-10">
            <span className="font-extrabold tracking-widest text-lg text-white">AMONISLOT</span>
          </div>

          <div className="relative z-10 space-y-2">
            <h2 className="text-xl font-bold">{requires2FA ? 'Security Verification' : 'Welcome Back!'}</h2>
            <p className="text-xs text-slate-300">
              {requires2FA 
                ? 'Akun Anda dilindungi oleh Two-Factor Authentication.' 
                : 'Masuk untuk mengelola dashboard dan aktivitas Anda dengan mudah.'}
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Form Login / Form 2FA */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white text-slate-900 h-full overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {requires2FA ? 'Verifikasi OTP' : 'Login Admin'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {requires2FA ? 'Masukkan 6 digit kode Google Authenticator' : 'Silakan masukkan akun Anda'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-600 text-center font-medium">
              {errorMsg}
            </div>
          )}

          {!requires2FA ? (
            /* ================= FORM 1: EMAIL & PASSWORD ================= */
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
          ) : (
            /* ================= FORM 2: KODE 2FA OTP ================= */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="relative border border-slate-300 rounded-xl bg-white px-3 py-1.5 focus-within:border-orange-500 shadow-sm">
                <label className="block text-[11px] text-slate-400 font-normal">Kode Authenticator</label>
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-slate-400 mr-2" />
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm text-slate-800 tracking-widest focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-xs tracking-wider transition shadow-md cursor-pointer flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verifikasi & Masuk'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setRequires2FA(false)}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}