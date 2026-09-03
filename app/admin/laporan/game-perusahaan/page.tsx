'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiSearch, FiRotateCcw } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface SubGameItem {
  name: string;
  total_bet: number;
  total_pembayaran: number;
  total_keuntungan: number;
  potongan_persen: number;
  total_tagihan: number;
}

interface ProviderItem {
  id: string;
  provider_name: string;
  sub_games: SubGameItem[];
}

export default function LaporanGamePerusahaanPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Data dikosongkan (empty array)
  const [reportData, setReportData] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data dari database / API
  const fetchReportData = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      // Contoh query Supabase (sesuaikan nama tabel dan kolom dengan database Anda)
      // let query = supabase.from('laporan_game_perusahaan').select('*');
      // if (start && end) {
      //   query = query.gte('tanggal', start).lte('tanggal', end);
      // }
      // const { data, error } = await query;

      // if (!error && data) {
      //   setReportData(data);
      // }
      
      // Biarkan tetap kosong jika belum ada tabelnya
      setReportData([]);
    } catch (error) {
      console.error('Gagal memuat laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReportData(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    fetchReportData('', '');
  };

  // Helper format mata uang ala Indonesia (pemisah ribuan titik, desimal koma)
  const formatIDCurrency = (amount: number, includePrefix = true) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return includePrefix ? `Rp. ${formatted}` : formatted;
  };

  // Hitung Grand Total dari seluruh provider & sub-game
  let grandTotalBet = 0;
  let grandTotalPembayaran = 0;
  let grandTotalKeuntungan = 0;
  let grandTotalTagihan = 0;

  reportData.forEach((prov) => {
    prov.sub_games.forEach((sub) => {
      grandTotalBet += sub.total_bet;
      grandTotalPembayaran += sub.total_pembayaran;
      grandTotalKeuntungan += sub.total_keuntungan;
      grandTotalTagihan += sub.total_tagihan;
    });
  });

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Laporan Game Perusahaan</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Laporan Game Perusahaan</span>
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
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Dari Tanggal</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Sampai Tanggal</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Laporan Game Perusahaan</span>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Cards di atas tabel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Bet</span>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {formatIDCurrency(grandTotalBet)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Pembayaran</span>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {formatIDCurrency(grandTotalPembayaran)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Keuntungan</span>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {formatIDCurrency(grandTotalKeuntungan)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-xs space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Tagihan</span>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {formatIDCurrency(grandTotalTagihan)}
              </div>
            </div>
          </div>

          {/* Tabel Utama dengan Garis Kotak-Kotak */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-1/4">Tipe</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Bet</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Pembayaran</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Keuntungan</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center w-28">Potongan (%)</th>
                  <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                      Memuat data laporan...
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                      Tidak ada data laporan.
                    </td>
                  </tr>
                ) : (
                  reportData.map((provider) => {
                    const provTotalBet = provider.sub_games.reduce((acc, curr) => acc + curr.total_bet, 0);
                    const provTotalPembayaran = provider.sub_games.reduce((acc, curr) => acc + curr.total_pembayaran, 0);
                    const provTotalKeuntungan = provider.sub_games.reduce((acc, curr) => acc + curr.total_keuntungan, 0);
                    const provTotalTagihan = provider.sub_games.reduce((acc, curr) => acc + curr.total_tagihan, 0);

                    return (
                      <>
                        <tr key={`prov-${provider.id}`} className="bg-gray-50/80 dark:bg-gray-800/30 font-bold">
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                            {provider.provider_name}
                          </td>
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right text-gray-800 dark:text-gray-100">
                            {formatIDCurrency(provTotalBet)}
                          </td>
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right text-gray-800 dark:text-gray-100">
                            {formatIDCurrency(provTotalPembayaran)}
                          </td>
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right text-gray-800 dark:text-gray-100">
                            {formatIDCurrency(provTotalKeuntungan)}
                          </td>
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center"></td>
                          <td className="py-2.5 px-3 text-right text-gray-800 dark:text-gray-100">
                            {formatIDCurrency(provTotalTagihan)}
                          </td>
                        </tr>

                        {provider.sub_games.map((sub, sIdx) => (
                          <tr key={`sub-${provider.id}-${sIdx}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                            <td className="py-2 px-3 pl-6 border-r border-gray-300 dark:border-gray-700">
                              <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                {sub.name}
                              </Link>
                            </td>
                            <td className="py-2 px-3 border-r border-gray-300 dark:border-gray-700 text-right">
                              {formatIDCurrency(sub.total_bet, false)}
                            </td>
                            <td className="py-2 px-3 border-r border-gray-300 dark:border-gray-700 text-right">
                              {formatIDCurrency(sub.total_pembayaran, false)}
                            </td>
                            <td className="py-2 px-3 border-r border-gray-300 dark:border-gray-700 text-right">
                              {formatIDCurrency(sub.total_keuntungan, false)}
                            </td>
                            <td className="py-2 px-3 border-r border-gray-300 dark:border-gray-700 text-center">
                              {sub.potongan_persen > 0 ? `${sub.potongan_persen.toFixed(2)}%` : ''}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {formatIDCurrency(sub.total_tagihan, false)}
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}