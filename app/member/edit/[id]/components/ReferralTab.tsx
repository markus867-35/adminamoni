'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiRotateCcw } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface ReferralTabProps {
  memberId: string | number;
  username: string;
}

export default function ReferralTab({ memberId, username }: ReferralTabProps) {
  const [referralData, setReferralData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dariTanggal, setDariTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [sampaiTanggal, setSampaiTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [referralUpline, setReferralUpline] = useState('');

  // Summary States
  const [totalDepositWithdraw, setTotalDepositWithdraw] = useState(0);
  const [totalToBetPembayaran, setTotalToBetPembayaran] = useState(0);

  const fetchReferral = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('referral')
        .select('*')
        .eq('username', username)
        .order('id', { ascending: false });

      if (referralUpline) {
        query = query.ilike('referral_upline', `%${referralUpline}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Gagal mengambil data referral:', error.message);
      } else {
        const rows = data || [];
        setReferralData(rows);

        // Hitung total ringkasan
        const sumDepWith = rows.reduce((acc, curr) => acc + (Number(curr.total_deposit || 0) - Number(curr.total_withdraw || 0)), 0);
        const sumToBetPay = rows.reduce((acc, curr) => acc + (Number(curr.total_to_bet || 0) - Number(curr.total_to_pembayaran || 0)), 0);

        setTotalDepositWithdraw(sumDepWith);
        setTotalToBetPembayaran(sumToBetPay);
      }
    } catch (err) {
      console.error('Error fetching referral:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username || memberId) {
      fetchReferral();
    }
  }, [memberId, username]);

  const handleCari = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReferral();
  };

  const handleReset = () => {
    setDariTanggal(new Date().toISOString().split('T')[0]);
    setSampaiTanggal(new Date().toISOString().split('T')[0]);
    setReferralUpline('');
  };

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-4">
      {/* Form Filter Pencarian */}
      <form onSubmit={handleCari} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={dariTanggal}
              onChange={(e) => setDariTanggal(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={sampaiTanggal}
              onChange={(e) => setSampaiTanggal(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiRotateCcw className="text-xs" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiSearch className="text-xs" />
            <span>Cari</span>
          </button>
        </div>
      </form>

      {/* Kotak Ringkasan / Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded p-3">
          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Referral Upline</span>
          <input
            type="text"
            placeholder="Referral Upline"
            value={referralUpline}
            onChange={(e) => setReferralUpline(e.target.value)}
            className="w-full px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded p-3 flex flex-col justify-center">
          <span className="block text-xs text-gray-500 dark:text-gray-400">Total Deposit - Withdraw</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{formatRupiah(totalDepositWithdraw)}</span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded p-3 flex flex-col justify-center">
          <span className="block text-xs text-gray-500 dark:text-gray-400">Total TO Bet - Pembayaran</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{formatRupiah(totalToBetPembayaran)}</span>
        </div>
      </div>

      {/* Tabel Referral */}
      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700 mt-2">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 font-semibold w-16 border-r border-gray-200 dark:border-gray-700">No.</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Username</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Total Deposit</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Total Withdraw</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Total TO Bet</th>
              <th className="p-3 font-semibold">Total TO Pembayaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                  Memuat data referral...
                </td>
              </tr>
            ) : referralData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              referralData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700 text-center">{index + 1}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.referral_username || item.username || '-'}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.total_deposit)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.total_withdraw)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.total_to_bet)}</td>
                  <td className="p-3">{formatRupiah(item.total_to_pembayaran)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Baris & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
        <Link 
          href="/member"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-xs" />
          <span>Kembali</span>
        </Link>

        <div className="text-xs text-gray-500 self-end sm:self-auto">
          Menampilkan sampai dari total {referralData.length} baris
        </div>
      </div>
    </div>
  );
}