'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiSearch, FiRotateCcw, FiFileText } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface TransaksiLengkapItem {
  id: number;
  username: string;
  total_bet: number;
  total_pembayaran: number;
  total_keuntungan: number;
}

export default function TransaksiLengkapPage() {
  const [startDate, setStartDate] = useState('2026-09-03');
  const [endDate, setEndDate] = useState('2026-09-03');
  const [provider, setProvider] = useState('Semua');
  const [tipe, setTipe] = useState('Semua');
  const [limit, setLimit] = useState('100 Data');

  const [reportData, setReportData] = useState<TransaksiLengkapItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransaksiLengkap = async () => {
    setLoading(true);
    try {
      // Contoh query Supabase (sesuaikan tabel/kolom)
      // let query = supabase.from('transaksi_lengkap').select('*');
      // const { data, error } = await query;
      // if (!error && data) setReportData(data);

      setReportData([]);
    } catch (error) {
      console.error('Gagal mengambil data transaksi lengkap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransaksiLengkap();
  };

  const handleReset = () => {
    setStartDate('2026-09-03');
    setEndDate('2026-09-03');
    setProvider('Semua');
    setTipe('Semua');
    setLimit('100 Data');
    setReportData([]);
  };

  const handleExport = () => {
    // Logika export Excel/CSV
    console.log('Exporting data...');
  };

  const formatIDCurrency = (amount: number, includePrefix = true) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return includePrefix ? `Rp. ${formatted}` : formatted;
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Transaksi Lengkap</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Transaksi Lengkap</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiFilter className="text-base" />
          <span>Filter</span>
        </div>
        <form onSubmit={handleSearch} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dari Tanggal */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Dari Tanggal</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sampai Tanggal */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Sampai Tanggal</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Provider */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Pragmatic">Pragmatic</option>
                <option value="Pg Soft">Pg Soft</option>
                <option value="Joker">Joker</option>
              </select>
            </div>

            {/* Tipe */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Tipe</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Slot">Slot</option>
                <option value="Live Casino">Live Casino</option>
                <option value="Crash Game">Crash Game</option>
              </select>
            </div>

            {/* Munculkan Data */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">Munculkan</label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="50 Data">50 Data</option>
                <option value="100 Data">100 Data</option>
                <option value="250 Data">250 Data</option>
                <option value="500 Data">500 Data</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
            >
              <FiRotateCcw className="text-sm" />
              <span>Reset</span>
            </button>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
            >
              <FiSearch className="text-sm" />
              <span>Cari</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiGrid className="text-base" />
            <span>Transaksi Lengkap</span>
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiFileText className="text-sm" />
            <span>Export</span>
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data transaksi...
            </div>
          ) : reportData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data transaksi ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Bet</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Pembayaran</th>
                    <th className="py-2.5 px-3 text-right">Total Keuntungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {reportData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 hover:underline cursor-pointer">
                        {item.username}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_bet, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_pembayaran, false)}</td>
                      <td className={`py-2.5 px-3 text-right font-medium ${item.total_keuntungan < 0 ? 'text-red-600' : ''}`}>
                        {formatIDCurrency(item.total_keuntungan, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}