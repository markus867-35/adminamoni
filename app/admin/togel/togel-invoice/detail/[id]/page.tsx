'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface TogelInvoiceDetailItem {
  id: number;
  pasaran: string;
  username: string;
  kategori: string;
  tipe: string;
  tebakan: string;
  posisi: string;
  bet: number;
  diskon: number;
  total: number;
}

export default function TogelInvoiceDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [detailData, setDetailData] = useState<TogelInvoiceDetailItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Contoh fetch dari Supabase berdasarkan ID Invoice
        // const { data, error } = await supabase.from('togel_invoice_detail').select('*').eq('invoice_id', id);
        // if (!error && data) setDetailData(data);

        // Data Mockup sesuai gambar
        setDetailData([
          {
            id: 1,
            pasaran: 'HONGKONG POOLS',
            username: 'Panen11',
            kategori: 'No Diskon',
            tipe: 'Games 4D',
            tebakan: '8374',
            posisi: 'Depan',
            bet: 1000,
            diskon: 0,
            total: 1000,
          },
          {
            id: 2,
            pasaran: 'HONGKONG POOLS',
            username: 'Panen11',
            kategori: 'No Diskon',
            tipe: 'Games 4D',
            tebakan: 'x374',
            posisi: 'Belakang',
            bet: 1000,
            diskon: 0,
            total: 1000,
          },
          {
            id: 3,
            pasaran: 'HONGKONG POOLS',
            username: 'Panen11',
            kategori: 'No Diskon',
            tipe: 'Games 4D',
            tebakan: 'xx74',
            posisi: 'Belakang',
            bet: 1000,
            diskon: 0,
            total: 1000,
          }
        ]);
      } catch (error) {
        console.error('Gagal memuat detail invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [id]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Togel Invoice Detail</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/togel-invoice" className="text-blue-600 hover:underline">Togel Invoice</Link>
          <span>/</span>
          <span>Togel Invoice Detail</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Togel Invoice Detail ID</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat detail invoice...
            </div>
          ) : detailData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data detail invoice.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Pasaran</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Kategori</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tebakan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Posisi</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Bet</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Diskon</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {detailData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.pasaran}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                        <Link href={`/admin/user/${item.username}`} className="text-blue-600 hover:underline">
                          {item.username}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.kategori}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.tipe}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono font-medium">{item.tebakan}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.posisi}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.bet)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.diskon)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{formatNumber(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Info / Pagination count */}
          {!loading && detailData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {detailData.length} dari total {detailData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}