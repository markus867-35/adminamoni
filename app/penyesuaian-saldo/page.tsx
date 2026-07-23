'use client';

import Link from 'next/link';
import { Filter, RefreshCcw, Search, Table, ChevronDown, Plus, PlusCircle } from 'lucide-react';

export default function PenyesuaianSaldoPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Penyesuaian Saldo</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Penyesuaian Saldo</span>
          </div>
        </div>

        {/* Kotak Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Filter */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </div>

          {/* Isi Filter Grid */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Username */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Tipe Filter */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Tipe</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="Ditambah" className="dark:bg-slate-800">Ditambah</option>
                  <option value="Dikurangi" className="dark:bg-slate-800">Dikurangi</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Kategori Filter */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Kategori</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="Deposit" className="dark:bg-slate-800">Deposit</option>
                  <option value="Withdrawal" className="dark:bg-slate-800">Withdrawal</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Dari Tanggal */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Dari Tanggal</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Sampai Tanggal */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Sampai Tanggal</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

            </div>

            {/* Tombol Aksi Filter */}
            <div className="flex items-center space-x-2 pt-2">
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

        {/* Kotak Utama Penyesuaian Saldo */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Tabel */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Table className="w-4 h-4" />
            <span>Penyesuaian Saldo</span>
          </div>

          {/* Kotak Ringkasan Total di Atas */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Total Ditambah</span>
                <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 22.444.928</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Total Dikurangi</span>
                <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 0</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Total Penyesuaian</span>
                <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 22.444.928</span>
              </div>
            </div>

            {/* Form Input Tambah Penyesuaian Saldo Baru */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Username</label>
                <input type="text" className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
              </div>

              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Tipe</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="pilih" className="dark:bg-slate-800">Pilih Tipe</option>
                  <option value="ditambah" className="dark:bg-slate-800">Ditambah</option>
                  <option value="dikurangi" className="dark:bg-slate-800">Dikurangi</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Tipe</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="penyesuaian" className="dark:bg-slate-800">Penyesuaian Saldo</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Jumlah</label>
                <input type="text" defaultValue="0" className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
              </div>

              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Keterangan</label>
                <input type="text" className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
              </div>
            </div>

            {/* Tombol Tambah */}
            <div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Konten Tabel dengan Garis Tegas */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">No.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Username</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Tipe</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Kategori</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Keterangan</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Total</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Admin</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Waktu Adjustment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-700 dark:text-slate-200">
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">1.</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-blue-600 dark:text-blue-400 font-medium">Maxwin01</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                      <PlusCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Ditambah</span>
                    </span>
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">Deposit</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">Callback payment 732494151</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">90.000</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">PGA MVP</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">23 July 2026, 07:34:27</td>
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