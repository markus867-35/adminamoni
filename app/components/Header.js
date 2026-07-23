'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ChevronDown, User, Wallet, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Cek tema yang tersimpan saat pertama kali halaman dimuat
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // 2. Fungsi untuk menangani perubahan tema (Toggle)
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin_theme', 'dark');
      setIsDarkMode(true);
    }
  };

const handleLogout = async () => {
    // 1. Hapus sesi dari Supabase
    await supabase.auth.signOut();

    // 2. Bersihkan localStorage/sessionStorage jika ada cache sisa auth
    localStorage.clear();
    sessionStorage.clear();

    // 3. Beri sedikit jeda waktu milidetik agar state membersihkan diri, lalu pindah halaman
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <header 
      style={{ minHeight: '64px', height: '64px' }}
      className="sticky top-0 z-50 bg-[#161036] flex items-center justify-between px-5 shadow-md text-white"
    >
      <button 
        onClick={toggleSidebar} 
        className="p-2 hover:bg-white/10 rounded-lg transition cursor-pointer"
        title="Buka/Tutup Sidebar"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>
      
      <div className="flex items-center space-x-4">
        {/* Tombol Toggle Tema (Matahari / Bulan) */}
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 transition cursor-pointer"
          title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-200" />}
        </button>

        <div className="flex items-center bg-[#251d54] px-3.5 py-1.5 rounded-full text-xs font-semibold text-yellow-400 border border-yellow-500/30 shadow-inner">
          <Wallet className="w-3.5 h-3.5 mr-2" />
          <span>Rp 101.345.500</span>
          <ChevronDown className="w-3 h-3 ml-2 text-slate-400" />
        </div>

        {/* Bagian Profil dengan Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-slate-200" />
            </div>
            
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 text-slate-700 dark:text-slate-200 z-50">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/profile');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Profil</span>
              </button>
              
              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

<button 
      onClick={handleLogout}
      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left cursor-pointer"
    >
      <LogOut className="w-4 h-4 text-red-500" />
      <span>Keluar</span>
    </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}