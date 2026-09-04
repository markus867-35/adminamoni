'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DepositAutoTabProps {
  memberId: string | number;
  username: string;
}

export default function DepositAutoTab({ memberId, username }: DepositAutoTabProps) {
  const [depositsAuto, setDepositsAuto] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepositAuto = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('deposit_auto')
          .select('*')
          .eq('member_id', memberId); // atau gunakan .eq('username', username) jika diperlukan

        if (error) throw error;
        if (data) setDepositsAuto(data);
      } catch (err) {
        console.error('Gagal memuat data deposit auto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchDepositAuto();
  }, [memberId]);

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-2 py-1">
      {loading ? (
        <div className="py-8 text-center text-gray-400 text-sm">Memuat data deposit auto...</div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-2.5 font-semibold w-12 border-r border-gray-200 dark:border-gray-700">No.</th>
                  <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Total</th>
                  <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Metode / Bank</th>
                  <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Waktu Deposit</th>
                  <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Status</th>
                  <th className="p-2.5 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                {depositsAuto.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                      Belum ada data deposit auto untuk member ini.
                    </td>
                  </tr>
                ) : (
                  depositsAuto.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{index + 1}.</td>
                      <td className="p-2.5 font-medium border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.total)}</td>
                      <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{item.metode || item.bank_name || '-'}</td>
                      <td className="p-2.5 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{item.waktu_deposit || item.created_at}</td>
                      <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ✓ {item.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-600 dark:text-gray-400">{item.keterangan || item.admin_respon || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500 text-right">
            Menampilkan {depositsAuto.length} dari total {depositsAuto.length} baris
          </div>
        </>
      )}
            <div className="pt-2">
        <Link 
          href="/member"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-xs" />
          <span>Kembali</span>
        </Link>
      </div>
    </div>
  );
}