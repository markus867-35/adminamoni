'use client';

import Link from 'next/link';
import { Filter, RefreshCcw, Search, Table, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function RangkumanDepositPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Rangkuman Deposit</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Rangkuman Deposit</span>
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
                  placeholder="" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Ke Bank */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Ke Bank</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="BCA" className="dark:bg-slate-800">BCA</option>
                  <option value="Mandiri" className="dark:bg-slate-800">Mandiri</option>
                  <option value="DANA" className="dark:bg-slate-800">DANA</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Ke Nomor Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Ke Nomor Rekening</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Ke Nama Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Ke Nama Rekening</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Admin Respon */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Admin Respon</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Dari Tanggal Deposit */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Dari Tanggal Deposit</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Sampai Tanggal Deposit */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Sampai Tanggal Deposit</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Status</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="Terima" className="dark:bg-slate-800">Terima</option>
                  <option value="Tolak" className="dark:bg-slate-800">Tolak</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Total Deposit */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Total Deposit</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Urutan */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Urutan</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="terbaru" className="dark:bg-slate-800">Tanggal Terbaru</option>
                  <option value="terlama" className="dark:bg-slate-800">Tanggal Terlama</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Munculkan Data */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Munculkan</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="15" className="dark:bg-slate-800">15 Data</option>
                  <option value="25" className="dark:bg-slate-800">25 Data</option>
                  <option value="50" className="dark:bg-slate-800">50 Data</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
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

        {/* Kotak Utama Rangkuman Deposit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Tabel */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Table className="w-4 h-4" />
            <span>Rangkuman Deposit</span>
          </div>

          {/* Kotak Informasi Total Ringkasan di Atas Tabel */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
              <span className="block text-xs text-slate-500 dark:text-slate-400">Total Deposit</span>
              <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 0</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
              <span className="block text-xs text-slate-500 dark:text-slate-400">Total Bonus Auto Awal</span>
              <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 0</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded p-3">
              <span className="block text-xs text-slate-500 dark:text-slate-400">Total</span>
              <span className="text-base font-semibold text-slate-800 dark:text-white">Rp. 0</span>
            </div>
          </div>

          {/* Konten Tabel dengan Garis Tegas */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">No.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Username</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Promo</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Pembagian Bonus</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Total</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Potongan Admin</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Bonus</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Grand Total</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Dari Bank</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Ke Bank</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Bukti</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Waktu Deposit</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Status</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Admin Respon</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-700 dark:text-slate-200">
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">1.</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-blue-600 dark:text-blue-400 font-medium">Maxwin01</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5"></td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5"></td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">90.000</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">0.00%</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">0,00</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">90.000,00</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                    DANA - 082336848853<br />
                    <span className="text-[10px] text-slate-500">a.n Leni nuraeni</span>
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-blue-600 dark:text-blue-400">Penyesuaian Saldo</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5"></td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">23 July 2026, 07:34:27</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Terima</span>
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">23 July 2026, 07:34:27</div>
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">PGA MVP</td>
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