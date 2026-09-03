'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiSearch, FiRotateCcw } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface LaporanItem {
  id: number;
  bank_name: string;
  account_number: string | null;
  account_name: string | null;
  total_deposit: number;
}

export default function LaporanBankPage() {
  // Mendapatkan tanggal hari ini format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLaporan = async () => {
    setLoading(true);
    
    // Contoh pengambilan data dari tabel admin_banks (sesuaikan dengan tabel transaksi/deposit Anda jika ada)
    const { data, error } = await supabase
      .from('admin_banks')
      .select('*')
      .not('account_number', 'is', null)
      .order('id', { ascending: true });

    if (error) {
      console.error('Gagal mengambil data laporan:', error.message);
    } else {
      // Mock data atau mapping total_deposit (bisa disesuaikan dengan query SUM dari tabel transaksi Anda)
      const formattedData = (data || []).map((item, idx) => ({
        ...item,
        total_deposit: item.total_deposit || [1410015, 31020, 78500][idx % 3], // Contoh angka simulasi sesuai gambar
      }));
      setLaporan(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLaporan();
  };

  const handleReset = () => {
    setStartDate(today);
    setEndDate(today);
    fetchLaporan();
  };

  // Hitung total keseluruhan deposit
  const grandTotal = laporan.reduce((sum, item) => sum + Number(item.total_deposit || 0), 0);

  // Format angka ke format Rupiah (contoh: 1.519.535 tanpa teks Rp di awal sel angka agar bersih, atau sesuai gambar)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Laporan Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Laporan Bank</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiFilter className="text-base" />
          <span>Filter</span>
        </div>
        <form onSubmit={handleSearch} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dari Tanggal */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Dari Tanggal</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sampai Tanggal */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Sampai Tanggal</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
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

      {/* Main Container Card (Tabel Laporan) */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Laporan Bank</span>
        </div>

        {/* Table Content dengan Garis Kotak-kotak */}
        <div className="overflow-x-auto w-full p-4">
          <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16">No.</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Bank</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nomor Rekening</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama Rekening</th>
                <th className="py-2.5 px-3 text-right">Total Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                    Memuat laporan bank...
                  </td>
                </tr>
              ) : laporan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                    Tidak ada data laporan untuk rentang tanggal tersebut.
                  </td>
                </tr>
              ) : (
                laporan.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{index + 1}.</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.bank_name}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.account_number || '-'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 uppercase">{item.account_name || '-'}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatNumber(item.total_deposit)}</td>
                  </tr>
                ))
              )}

              {/* Baris Total / Grand Total di bawah */}
              {!loading && laporan.length > 0 && (
                <tr className="font-bold bg-gray-50/50 dark:bg-gray-800/30 border-t-2 border-gray-300 dark:border-gray-700">
                  <td colSpan={4} className="py-3 px-3 border-r border-gray-300 dark:border-gray-700 text-right"></td>
                  <td className="py-3 px-3 text-right text-gray-800 dark:text-gray-100">
                    Rp. {formatNumber(grandTotal)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}