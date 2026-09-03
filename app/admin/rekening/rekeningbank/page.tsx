'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface RekeningItem {
  id: number;
  urutan: number | null;
  bank_name: string;
  account_number: string | null;
  account_name: string | null;
  potongan_admin: number | null;
  sembunyikan: string | null; // '0' = Aktif/Tidak disembunyikan, '1' = Disembunyikan/Iya
  updated_at: string | null;
  created_at?: string | null; // <-- Tambahkan baris ini
  member_group?: string | null;
}

export default function RekeningBankPage() {
  const [rekenings, setRekenings] = useState<RekeningItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRekening = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_banks')
      .select('*')
      .not('account_number', 'is', null) // <-- Hanya ambil data yang account_number-nya sudah diisi
      .order('urutan', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setRekenings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRekening();
  }, []);

  // Format tanggal waktu diubah
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '');
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Rekening Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Rekening Bank</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiGrid className="text-base" />
            <span>Rekening Bank</span>
          </div>
          <Link 
            href="/admin/rekening/rekeningbank/tambah"
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiPlus className="text-sm" />
            <span>Tambah</span>
          </Link>
        </div>

      {/* Table Content dengan Garis Pembatas Kotak-kotak */}
        <div className="overflow-x-auto w-full p-4">
          <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">Urutan</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Bank</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nomor Rekening</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama Rekening</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Potongan Admin</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Sembunyikan</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Diubah</th>
                <th className="py-2.5 px-3 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              
              {/* Baris Kategori Grup (Sesuai contoh gambar) */}
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-300 dark:border-gray-700">
                <td colSpan={8} className="py-2 px-3 font-medium text-xs text-gray-500 dark:text-gray-400">
                  Member Baru
                </td>
              </tr>

              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                    Memuat data rekening...
                  </td>
                </tr>
              ) : rekenings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                    Belum ada data rekening bank. Silakan klik tombol &quot;Tambah&quot;.
                  </td>
                </tr>
                ) : (
                rekenings.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                    {/* Ubah dari {item.urutan ?? 0} menjadi {index + 1} agar otomatis berurutan (1, 2, 3...) */}
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.bank_name}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.account_number || '-'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 uppercase">{item.account_name || '-'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                      {item.potongan_admin ? `${Number(item.potongan_admin).toFixed(2)}%` : '0.00%'}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                      {item.sembunyikan === '1' ? 'Iya' : 'Tidak'}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                      {formatDate(item.updated_at || item.created_at)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Link 
                        href={`/admin/rekening/rekeningbank/ubah/${item.id}`}
                        className="p-1.5 bg-amber-400 hover:bg-amber-500 text-white rounded transition shadow-sm inline-flex items-center justify-center cursor-pointer"
                        title="Edit Rekening"
                      >
                        <FiEdit2 className="text-xs" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}