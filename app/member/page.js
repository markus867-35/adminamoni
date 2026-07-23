'use client';

import Link from 'next/link';
import { Filter, RefreshCcw, Search, Table, ChevronDown, CheckCircle2, Edit, Key } from 'lucide-react';

export default function MemberPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Member</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Member</span>
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

              {/* Nomor Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Nomor Rekening</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Nama Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Nama Rekening</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* No Hp */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">No Hp</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Upline Referral Username */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Upline Referral Username</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Kode Referral */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Kode Referral</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Dari Tanggal Register */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Dari Tanggal Register</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Sampai Tanggal Register */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Sampai Tanggal Register</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Member Group */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Member Group</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="VIP" className="dark:bg-slate-800">VIP</option>
                  <option value="Regular" className="dark:bg-slate-800">Regular</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Status */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Status</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="Aktif" className="dark:bg-slate-800">Aktif</option>
                  <option value="Dibanned" className="dark:bg-slate-800">Dibanned</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Level */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Level</label>
                <select className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6">
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="1" className="dark:bg-slate-800">Level 1</option>
                  <option value="2" className="dark:bg-slate-800">Level 2</option>
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

        {/* Kotak Utama Tabel Member */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Tabel */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Table className="w-4 h-4" />
            <span>Member</span>
          </div>

          {/* Konten Tabel dengan Garis Tegas & Terang */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-12 text-center">No.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Username</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Rekening</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Upline</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Kode Referral</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Status</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Saldo</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Total Deposit</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-700 dark:text-slate-200">
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">1.</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-blue-600 dark:text-blue-400 font-medium">Bibygntg1</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">SEABANK - 901799980775 - Adit subianto</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5"></td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">wephbjbh</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Aktif</span>
                    </span>
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">43.040</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">45.000</td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">
                    <div className="inline-flex items-center space-x-1">
                      <button className="bg-amber-400 hover:bg-amber-500 text-white p-1.5 rounded transition cursor-pointer">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded transition cursor-pointer">
                        <Key className="w-3.5 h-3.5" />
                      </button>
                    </div>
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