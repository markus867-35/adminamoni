'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface PromosiCashbackItem {
  id: number;
  keterangan: string;
  permainan: string;
  tipeDurasi: string;
  nilai: string;
  minimalKekalahan: number;
  bonusMaksimal: string; // dikosongkan sesuai instruksi
  status: 'Aktif' | 'Tidak Aktif';
  waktuDibuat: string;
}

export default function PromosiCashbackPage() {
  const [cashbackData, setCashbackData] = useState<PromosiCashbackItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPromosiCashback = async () => {
    setLoading(true);
    try {
      // Bonus maksimal dikosongkan sesuai instruksi
      setCashbackData([
        {
          id: 1,
          keterangan: 'CB LIVE CASINO > 500jt',
          permainan: 'Live Casino',
          tipeDurasi: 'Sekali seminggu',
          nilai: '3%',
          minimalKekalahan: 500000001,
          bonusMaksimal: '',
          status: 'Tidak Aktif',
          waktuDibuat: '26 May 2025',
        },
        {
          id: 2,
          keterangan: 'CB LIVE CASINO > 300jt',
          permainan: 'Live Casino',
          tipeDurasi: 'Sekali seminggu',
          nilai: '2%',
          minimalKekalahan: 300000001,
          bonusMaksimal: '',
          status: 'Tidak Aktif',
          waktuDibuat: '26 May 2025',
        },
        {
          id: 3,
          keterangan: 'CASHBACK ALL SPORT 5%',
          permainan: 'Tembak Ikan, Sport, Virtual, Sabung Ayam',
          tipeDurasi: 'Sekali seminggu',
          nilai: '5%',
          minimalKekalahan: 200000,
          bonusMaksimal: '',
          status: 'Aktif',
          waktuDibuat: '13 March 2025',
        },
        {
          id: 4,
          keterangan: 'CASHBACK LIVECASINO 5%',
          permainan: 'Live Casino',
          tipeDurasi: 'Sekali seminggu',
          nilai: '5%',
          minimalKekalahan: 200000,
          bonusMaksimal: '',
          status: 'Aktif',
          waktuDibuat: '13 March 2025',
        },
        {
          id: 5,
          keterangan: 'CASHBACK SLOT 5%',
          permainan: 'Slot',
          tipeDurasi: 'Sekali seminggu',
          nilai: '5%',
          minimalKekalahan: 200000,
          bonusMaksimal: '',
          status: 'Aktif',
          waktuDibuat: '15 February 2025',
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data promosi cashback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromosiCashback();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 0 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Promosi Cashback</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Promosi Cashback</span>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Promosi Cashback</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data promosi cashback...
            </div>
          ) : cashbackData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data promosi cashback.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Keterangan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Permainan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe Durasi</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Nilai</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Minimal Kekalahan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Bonus Maksimal</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Status</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Dibuat</th>
                    <th className="py-2.5 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {cashbackData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.keterangan}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.permainan}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.tipeDurasi}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center font-mono">{item.nilai}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.minimalKekalahan)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center font-mono">{item.bonusMaksimal}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Aktif' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {item.status === 'Aktif' ? '✔ Aktif' : '✖ Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">{item.waktuDibuat}</td>
                      <td className="py-2.5 px-3 text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && cashbackData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {cashbackData.length} dari total {cashbackData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}