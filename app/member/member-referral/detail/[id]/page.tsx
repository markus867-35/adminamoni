'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface DetailMemberReferralItem {
  id: number;
  usernameDownline: string;
  totalDeposit: number;
  totalWithdraw: number;
  totalToBet: number;
  totalToPembayaran: number;
}

export default function DetailMemberReferralPage() {
  // Filter States
  const [usernameDownline, setUsernameDownline] = useState('');
  const [dariTanggal, setDariTanggal] = useState('2026-09-03');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-09-03');

  // Summary / Header Info States
  const [referralUpline, setReferralUpline] = useState('Wefir123 - hbxansyw');
  const [totalDepositWithdraw, setTotalDepositWithdraw] = useState(0);
  const [totalToBetPembayaran, setTotalToBetPembayaran] = useState(0);

  const [detailData, setDetailData] = useState<DetailMemberReferralItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDetailReferral = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi (kosong / belum ada data downline)
      setDetailData([]);
      setTotalDepositWithdraw(0);
      setTotalToBetPembayaran(0);
    } catch (error) {
      console.error('Gagal mengambil data detail member referral:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailReferral();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDetailReferral();
  };

  const handleReset = () => {
    setUsernameDownline('');
    setDariTanggal('2026-09-03');
    setSampaiTanggal('2026-09-03');
    fetchDetailReferral();
  };

  const formatRupiah = (num: number) => {
    return 'Rp. ' + num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Detail Member Referral</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/member/member-referral" className="text-blue-600 hover:underline">Member Referral</Link>
          <span>/</span>
          <span>Detail Member Referral</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Username (Downline) */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={usernameDownline}
                  onChange={(e) => setUsernameDownline(e.target.value)}
                  placeholder="Username (Downline)"
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
          <span>Detail Member Referral</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Info Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Referral Upline</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{referralUpline}</span>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Deposit - Withdraw</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 mt-1">{formatRupiah(totalDepositWithdraw)}</span>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total TO Bet - Pembayaran</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 mt-1">{formatRupiah(totalToBetPembayaran)}</span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data detail member referral...
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username (Downline)</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Deposit</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Withdraw</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total TO Bet</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total TO Pembayaran</th>
                    <th className="py-2.5 px-3 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {detailData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm italic">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    detailData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600">
                          {item.usernameDownline}
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                          {formatRupiah(item.totalDeposit)}
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                          {formatRupiah(item.totalWithdraw)}
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                          {formatRupiah(item.totalToBet)}
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                          {formatRupiah(item.totalToPembayaran)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {/* Optional Action / Detail button */}
                          <button title="Action" className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            -
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
            Menampilkan sampai dari total {detailData.length} baris
          </div>
        </div>
      </div>
    </div>
  );
}