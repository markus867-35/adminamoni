'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Users, 
  Filter, 
  RotateCcw, 
  Search, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setLoading(false); // Buka loading setelah dipastikan login
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f6f9] dark:bg-[#0b0f19] text-slate-500">
        Memuat...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Dashboard</h1>
        <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
      </div>

      {/* 3 Kartu Menu Cepat di Atas */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Permintaan Deposit */}
        <div className="bg-[#2563eb] text-white rounded shadow-sm overflow-hidden flex flex-col justify-between dark:border dark:border-white/10">
          <div className="p-4 flex items-center space-x-3">
            <ArrowDownToLine className="w-6 h-6" />
            <span className="font-medium text-base">Permintaan Deposit</span>
          </div>
          <Link href="/depo" className="bg-black/10 px-4 py-2.5 text-xs flex items-center justify-between hover:bg-black/20 transition">
            <span>Lihat</span>
            <span>&rsaquo;</span>
          </Link>
        </div>

        {/* Permintaan Withdrawal */}
        <div className="bg-[#eab308] text-white rounded shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 flex items-center space-x-3">
            <ArrowUpFromLine className="w-6 h-6" />
            <span className="font-medium text-base">Permintaan Withdrawal</span>
          </div>
          <Link href="/wd" className="bg-black/10 px-4 py-2.5 text-xs flex items-center justify-between hover:bg-black/20 transition">
            <span>Lihat</span>
            <span>&rsaquo;</span>
          </Link>
        </div>

        {/* Member */}
        <div className="bg-[#15803d] text-white rounded shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 flex items-center space-x-3">
            <Users className="w-6 h-6" />
            <span className="font-medium text-base">Member</span>
          </div>
          <Link href="/member" className="bg-black/10 px-4 py-2.5 text-xs flex items-center justify-between hover:bg-black/20 transition">
            <span>Lihat</span>
            <span>&rsaquo;</span>
          </Link>
        </div>

                <div className="bg-[#FF0000] text-white rounded shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 flex items-center space-x-3">
            <Users className="w-6 h-6" />
            <span className="font-medium text-base">Laporan Perusahaan</span>
          </div>
          <Link href="/member" className="bg-black/10 px-4 py-2.5 text-xs flex items-center justify-between hover:bg-black/20 transition">
            <span>Lihat</span>
            <span>&rsaquo;</span>
          </Link>
        </div>
      </div>

{/* Kotak Filter */}
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
  <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
    <Filter className="w-4 h-4" />
    <span>Filter</span>
  </div>
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dari Tanggal</label>
      <input 
        type="date" 
        defaultValue="2026-07-22" 
        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Sampai Tanggal</label>
      <input 
        type="date" 
        defaultValue="2026-07-22" 
        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
      />
    </div>
  </div>
  <div className="px-4 pb-4 flex items-center space-x-2">
    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5 transition cursor-pointer">
      <RotateCcw className="w-3.5 h-3.5" />
      <span>Reset</span>
    </button>
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded text-xs flex items-center space-x-1.5 transition cursor-pointer">
      <Search className="w-3.5 h-3.5" />
      <span>Cari</span>
    </button>
  </div>
</div>

{/* Grid Statistik Bawah */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  
  {/* Total Deposit */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
    <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center space-x-2 text-slate-800 dark:text-white text-sm font-medium">
      <ArrowDownToLine className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      <span>Total Deposit</span>
    </div>
    <div className="p-4 space-y-3">
      {/* Butuh Diproses */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Butuh Diproses [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
      {/* Diterima */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Diterima [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
      {/* Ditolak */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <XCircle className="w-3.5 h-3.5" />
          <span>Ditolak [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
    </div>
  </div>

  {/* Total Withdrawal */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
    <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center space-x-2 text-slate-800 dark:text-white text-sm font-medium">
      <ArrowUpFromLine className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      <span>Total Withdrawal</span>
    </div>
    <div className="p-4 space-y-3">
      {/* Butuh Diproses */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Butuh Diproses [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
      {/* Diterima */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Diterima [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
      {/* Ditolak */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <XCircle className="w-3.5 h-3.5" />
          <span>Ditolak [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
    </div>
  </div>

  {/* Total Penyesuaian Saldo */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
    <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center space-x-2 text-slate-800 dark:text-white text-sm font-medium">
      <Wallet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      <span>Total Penyesuaian Saldo</span>
    </div>
    <div className="p-4 space-y-3">
      {/* Ditambah */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Ditambah [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
      {/* Dikurangi */}
      <div className="border border-slate-200 dark:border-slate-800 rounded">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5">
          <XCircle className="w-3.5 h-3.5" />
          <span>Dikurangi [0]</span>
        </div>
        <div className="p-3 text-sm text-slate-700 dark:text-slate-200 font-medium">Rp. 0</div>
      </div>
    </div>
  </div>

</div>

{/* Footer Copyright */}
<div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-800 mt-10">
  Copyright &copy; OneLiveGaming 2026
</div>
    </div>
  );
}