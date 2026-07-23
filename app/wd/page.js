'use client';

import Link from 'next/link';
import { Filter, RefreshCcw, Search, Table, CheckSquare, ChevronDown } from 'lucide-react';

export default function WithdrawalBaruPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Withdrawal Baru</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Withdrawal Baru</span>
          </div>
        </div>

        {/* Kotak Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Filter */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </div>

          {/* Isi Filter */}
          <div className="p-5 space-y-4">
            <div className="max-w-xs relative">
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Ke Bank</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="BCA" className="dark:bg-slate-800">BCA</option>
                  <option value="Mandiri" className="dark:bg-slate-800">Mandiri</option>
                  <option value="BNI" className="dark:bg-slate-800">BNI</option>
                  <option value="BRI" className="dark:bg-slate-800">BRI</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>
            </div>

            {/* Tombol Aksi Filter */}
            <div className="flex items-center space-x-2 pt-1">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <Search className="w-3.5 h-3.5" />
                <span>Cari</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kotak Tabel Withdrawal Baru */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Tabel */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Table className="w-4 h-4" />
            <span>Withdrawal Baru</span>
          </div>

          {/* Konten Tabel dengan Garis-Garis Kotak */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-10 text-center"><CheckSquare className="w-4 h-4 text-slate-400 mx-auto" /></th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">No.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Username</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Total</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Ke Bank</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Waktu Withdrawal</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="border border-slate-300 dark:border-slate-700 text-center py-8 text-slate-500 dark:text-slate-400">
                    Tidak ada data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bagian Bawah: Footer Copyright */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </div>
  );
}