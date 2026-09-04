'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface LaporanTransaksiTabProps {
  memberId: string | number;
  username: string;
}

export default function LaporanTransaksiTab({ memberId, username }: LaporanTransaksiTabProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('laporan_transaksi')
          .select('*')
          .eq('username', username)
          .order('id', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Gagal mengambil laporan transaksi:', error.message);
        } else {
          setTransactions(data || []);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username || memberId) {
      fetchTransactions();
    }
  }, [memberId, username, limit]);

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4">
      {/* Dropdown Munculkan Data */}
      <div className="w-48">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Munculkan</label>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={15}>15 Data</option>
          <option value={25}>25 Data</option>
          <option value={50}>50 Data</option>
          <option value={100}>100 Data</option>
        </select>
      </div>

      {/* Tabel Laporan Transaksi */}
      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Info</th>
              <th className="p-3 font-semibold w-36 border-r border-gray-200 dark:border-gray-700">Debit</th>
              <th className="p-3 font-semibold w-36 border-r border-gray-200 dark:border-gray-700">Credit</th>
              <th className="p-3 font-semibold w-36 border-r border-gray-200 dark:border-gray-700">Saldo</th>
              <th className="p-3 font-semibold w-48">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                  Memuat data laporan transaksi...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              transactions.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.info || item.keterangan || '-'}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.debit)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.credit)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.saldo)}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {item.tanggal ? new Date(item.tanggal).toLocaleString('id-ID') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Total Baris & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
        <Link 
          href="/member"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-xs" />
          <span>Kembali</span>
        </Link>

        <div className="text-xs text-gray-500 self-end sm:self-auto">
          Menampilkan {transactions.length > 0 ? 1 : 0} sampai {transactions.length} dari total {transactions.length} baris
        </div>
      </div>
    </div>
  );
}