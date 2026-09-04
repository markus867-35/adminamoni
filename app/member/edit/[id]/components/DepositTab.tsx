'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface DepositTabProps {
  memberId: string | number;
  username: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DepositTab({ memberId, username }: DepositTabProps) {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('deposits') // Sesuaikan nama tabel jika berbeda (misal: 'deposit_manual')
          .select('*')
          .eq('username', username)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setDeposits(data);
        }
      } catch (error) {
        console.error('Gagal memuat data deposit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [username]);

  const formatRupiah = (num: number) => {
    return 'Rp. ' + Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4">
      {/* Tabel Data Deposit */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-gray-700 w-16">No.</th>
              <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-gray-700">Total</th>
              <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-gray-700">Ke Bank</th>
              <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-gray-700">Waktu Deposit</th>
              <th className="px-4 py-3 font-semibold border-r border-gray-200 dark:border-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold">Admin Respon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                  Memuat data deposit...
                </td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              deposits.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-medium">{formatRupiah(item.total || item.amount)}</td>
                  <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">{item.ke_bank || item.bank_name || '-'}</td>
                  <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">{item.created_at}</td>
                  <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'SUCCESS' || item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      item.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.admin_respon || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan sampai dari total {deposits.length} baris
        </div>
        <Link 
          href="/member"
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-xs" />
          <span>Kembali</span>
        </Link>
      </div>
    </div>
  );
}