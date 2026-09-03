'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiEye } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface MemberReferralItem {
  id: number;
  usernameUpline: string;
  kodeReferralUpline: string;
  totalDownline: number;
  totalDepositWithdraw: number;
  totalToBetToPembayaran: number;
}

export default function MemberReferralPage() {
  const router = useRouter();

  // Filter States
  const [usernameUpline, setUsernameUpline] = useState('');
  const [kodeReferralUpline, setKodeReferralUpline] = useState('');
  const [usernameDownline, setUsernameDownline] = useState('');
  const [kodeReferralDownline, setKodeReferralDownline] = useState('');
  const [dariTanggal, setDariTanggal] = useState('2026-09-03');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-09-03');

  const [memberReferralData, setMemberReferralData] = useState<MemberReferralItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemberReferral = async () => {
    setLoading(true);
    try {
      setMemberReferralData([
        {
          id: 1,
          usernameUpline: 'Wefir123',
          kodeReferralUpline: 'hbxansyw',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
        {
          id: 2,
          usernameUpline: 'paleman',
          kodeReferralUpline: '7hulueu3',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
        {
          id: 3,
          usernameUpline: 'kemputjaran',
          kodeReferralUpline: '5szqmefm',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
        {
          id: 4,
          usernameUpline: 'Setiana100',
          kodeReferralUpline: '3i1g8cfi',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
        {
          id: 5,
          usernameUpline: 'Ab1234cd',
          kodeReferralUpline: 'nlyyi6yg',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
        {
          id: 6,
          usernameUpline: 'Mieayam12',
          kodeReferralUpline: 'hfyzjxka',
          totalDownline: 0,
          totalDepositWithdraw: 0,
          totalToBetToPembayaran: 0,
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data member referral:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberReferral();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemberReferral();
  };

  const handleReset = () => {
    setUsernameUpline('');
    setKodeReferralUpline('');
    setUsernameDownline('');
    setKodeReferralDownline('');
    setDariTanggal('2026-09-03');
    setSampaiTanggal('2026-09-03');
    fetchMemberReferral();
  };

  const formatRupiah = (num: number) => {
    return 'Rp. ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Member Referral</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Member Referral</span>
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
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={usernameUpline}
                  onChange={(e) => setUsernameUpline(e.target.value)}
                  placeholder="Username (Upline)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={kodeReferralUpline}
                  onChange={(e) => setKodeReferralUpline(e.target.value)}
                  placeholder="Kode Referral (Upline)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={usernameDownline}
                  onChange={(e) => setUsernameDownline(e.target.value)}
                  placeholder="Username (Downline)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={kodeReferralDownline}
                  onChange={(e) => setKodeReferralDownline(e.target.value)}
                  placeholder="Kode Referral (Downline)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
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
          <span>Member Referral</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data member referral...
            </div>
          ) : memberReferralData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data member referral.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username (Upline)</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center w-36">Total Downline</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Deposit - Withdraw</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total TO Bet - TO Pembayaran</th>
                    <th className="py-2.5 px-3 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {memberReferralData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                        <span 
                          onClick={() => router.push(`/admin/member-referral/detail/${item.id}`)}
                          className="text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                          {item.usernameUpline}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 italic text-xs ml-1.5">- {item.kodeReferralUpline}</span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center font-medium">
                        {item.totalDownline}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatRupiah(item.totalDepositWithdraw)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatRupiah(item.totalToBetToPembayaran)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => router.push(`/member/member-referral/detail/${item.id}`)}
                            title="Detail / View" 
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition cursor-pointer"
                          >
                            <FiEye className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && memberReferralData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {memberReferralData.length} dari total {memberReferralData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}