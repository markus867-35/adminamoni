'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface PromosiDepositItem {
  id: number;
  nama: string;
  tipeDurasi: string;
  pembagianBonus: string;
  tipeNilai: string;
  nilai: string; // diubah ke string agar bisa dikosongkan
  bonusMaksimal: number;
  perkalianTO: string;
  status: 'Aktif' | 'Tidak Aktif';
  urutan: number;
}

export default function PromosiDepositPage() {
  const [promosiData, setPromosiData] = useState<PromosiDepositItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPromosiDeposit = async () => {
    setLoading(true);
    try {
      // Nilai bonus dikosongkan sesuai instruksi
      setPromosiData([
        {
          id: 1,
          nama: 'BONUS CUAN PAGI & MALAM',
          tipeDurasi: 'Setiap hari',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 100000,
          perkalianTO: 'X5',
          status: 'Tidak Aktif',
          urutan: 7,
        },
        {
          id: 2,
          nama: 'BONUS CLAIM KEKALAHAN 100%',
          tipeDurasi: 'Sekali',
          pembagianBonus: 'Otomatis diakhir',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 15000,
          perkalianTO: 'X5',
          status: 'Aktif',
          urutan: 6,
        },
        {
          id: 3,
          nama: 'BONUS SLOT 100%',
          tipeDurasi: 'Sekali',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 25000,
          perkalianTO: 'X8',
          status: 'Tidak Aktif',
          urutan: 5,
        },
        {
          id: 4,
          nama: 'BONUS NEW MEMBER 20%',
          tipeDurasi: 'Sekali',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 15000,
          perkalianTO: 'X2',
          status: 'Aktif',
          urutan: 4,
        },
        {
          id: 5,
          nama: 'BONUS HARIAN TOGEL 5%',
          tipeDurasi: 'Setiap hari',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 5000,
          perkalianTO: 'X1',
          status: 'Aktif',
          urutan: 3,
        },
        {
          id: 6,
          nama: 'BONUS HARIAN ALL GAME 5%',
          tipeDurasi: 'Sekali',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 5000,
          perkalianTO: 'X1',
          status: 'Aktif',
          urutan: 2,
        },
        {
          id: 7,
          nama: 'BONUS HARIAN 5%',
          tipeDurasi: 'Setiap hari',
          pembagianBonus: 'Otomatis diawal',
          tipeNilai: 'Persen',
          nilai: '',
          bonusMaksimal: 5000,
          perkalianTO: 'X1',
          status: 'Aktif',
          urutan: 1,
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data promosi deposit:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromosiDeposit();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 0 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Promosi Deposit</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Promosi Deposit</span>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Promosi Deposit</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data promosi deposit...
            </div>
          ) : promosiData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data promosi deposit.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe Durasi</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Pembagian Bonus</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe Nilai</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Nilai</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Bonus Maksimal</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Perkalian Total TO</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Status</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Urutan</th>
                    <th className="py-2.5 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {promosiData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.nama}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.tipeDurasi}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.pembagianBonus}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.tipeNilai}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center font-mono">{item.nilai}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.bonusMaksimal)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono">{item.perkalianTO}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Aktif' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {item.status === 'Aktif' ? '✔ Aktif' : '✖ Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center font-mono">{item.urutan}</td>
                      <td className="py-2.5 px-3 text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && promosiData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {promosiData.length} dari total {promosiData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}