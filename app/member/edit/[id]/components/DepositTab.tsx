'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface DepositTabProps {
  memberId: string | number;
  username: string;
}

export default function DepositTab({ memberId, username }: DepositTabProps) {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('deposits')
          .select('*')
          .eq('member_id', memberId); // atau .eq('username', username)

        if (error) throw error;
        if (data) setDeposits(data);
      } catch (err) {
        console.error('Gagal memuat data deposit:', err);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) fetchDeposits();
  }, [memberId]);

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4 py-2">
      {loading ? (
        <div className="py-8 text-center text-gray-400 text-sm">Memuat data deposit...</div>
      ) : (
        <>
         <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded">
  <table className="w-full text-left text-xs sm:text-sm border-collapse border border-gray-200 dark:border-gray-700">
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
        <th className="p-2.5 font-semibold w-12 border-r border-gray-200 dark:border-gray-700">No.</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Total</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Dari Rekening</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Ke Rekening</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Bukti</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Waktu Deposit</th>
        <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Status</th>
        <th className="p-2.5 font-semibold">Admin Respon</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
      {deposits.length === 0 ? (
        <tr>
          <td colSpan={8} className="p-6 text-center text-gray-500 italic">
            Belum ada data riwayat deposit untuk member ini.
          </td>
        </tr>
      ) : (
        deposits.map((item, index) => (
          <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{index + 1}.</td>
            <td className="p-2.5 font-medium border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.total)}</td>
            <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">
              <div>{item.dari_rekening}</div>
              <div className="text-xs text-gray-500">a.n {item.nama_rekening_pengirim}</div>
            </td>
            <td className="p-2.5 text-blue-600 dark:text-blue-400 border-r border-gray-200 dark:border-gray-700">{item.ke_rekening}</td>
            <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">
              {item.bukti_url ? (
                <a href={item.bukti_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Lihat
                </a>
              ) : (
                '-'
              )}
            </td>
            <td className="p-2.5 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">{item.waktu_deposit}</td>
            <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                ✓ {item.status}
              </span>
              <div className="text-[11px] text-gray-500 mt-0.5">{item.waktu_respon}</div>
            </td>
            <td className="p-2.5 text-gray-600 dark:text-gray-400">{item.admin_respon}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>

          </div>

          <div className="text-xs text-gray-500 text-right">
            Menampilkan {deposits.length} dari total {deposits.length} baris
          </div>
        </>
      )}
    </div>
  );
}