'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiFileText } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface LaporanRollingItem {
  id: number;
  username: string;
  keterangan: string;
  jumlahBonus: number;
  tanggal: string;
}

export default function LaporanRollingPage() {
  // Filter States
  const [username, setUsername] = useState('');
  const [dariTanggal, setDariTanggal] = useState('2026-09-01');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-09-03');
  const [munculkan, setMunculkan] = useState('15 Data');

  const [laporanRollingData, setLaporanRollingData] = useState<LaporanRollingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLaporanRolling = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi Laporan Rolling
      setLaporanRollingData([
        {
          id: 1,
          username: 'Septiana123',
          keterangan: 'ROLLINGAN HARIAN 1%',
          jumlahBonus: 412.50,
          tanggal: '03 September 2026',
        },
        {
          id: 2,
          username: 'Tibiajah',
          keterangan: 'ROLLINGAN HARIAN 1%',
          jumlahBonus: 646.80,
          tanggal: '03 September 2026',
        },
        {
          id: 3,
          username: 'Cakudin',
          keterangan: 'ROLLINGAN HARIAN 1%',
          jumlahBonus: 319.50,
          tanggal: '03 September 2026',
        },
        {
          id: 4,
          username: 'paelll',
          keterangan: 'ROLLINGAN HARIAN 1%',
          jumlahBonus: 369.90,
          tanggal: '03 September 2026',
        },
        {
          id: 5,
          username: 'Hanif20',
          keterangan: 'ROLLINGAN HARIAN 1%',
          jumlahBonus: 361.50,
          tanggal: '03 September 2026',
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data laporan rolling:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporanRolling();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLaporanRolling();
  };

  const handleReset = () => {
    setUsername('');
    setDariTanggal('2026-09-01');
    setSampaiTanggal('2026-09-03');
    setMunculkan('15 Data');
    fetchLaporanRolling();
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Laporan Rolling</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Laporan Rolling</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiFilter className="text-base" />
          <span>Filter</span>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Username */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dari Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Munculkan */}
              <div className="space-y-1">
                <select 
                  value={munculkan}
                  onChange={(e) => setMunculkan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="15 Data">15 Data</option>
                  <option value="25 Data">25 Data</option>
                  <option value="50 Data">50 Data</option>
                  <option value="100 Data">100 Data</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
              >
                <FiRotateCcw className="text-xs" />
                <span>Reset</span>
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
              >
                <FiSearch className="text-xs" />
                <span>Cari</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Laporan Rolling</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Top Bar: Total Bonus Box & Export Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-72 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded p-3 space-y-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Rp. 3.030.463,03
              </div>
            </div>

            <button 
              type="button"
              onClick={() => alert('Mengekspor data laporan rolling...')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer ml-auto"
            >
              <FiFileText className="text-sm" />
              <span>Export</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data laporan rolling...
            </div>
          ) : laporanRollingData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data laporan rolling.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Keterangan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Jumlah Bonus</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {laporanRollingData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 hover:underline cursor-pointer">
                        {item.username}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.keterangan}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.jumlahBonus)}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{item.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && laporanRollingData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {laporanRollingData.length} dari total {laporanRollingData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}