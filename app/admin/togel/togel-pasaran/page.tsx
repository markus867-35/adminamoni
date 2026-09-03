'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiPlus, FiEdit2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface TogelPasaranItem {
  id: number;
  nama: string;
  prize: string;
  hari_tutup: string;
  waktu_tutup: string;
  waktu_buka: string;
  urutan: number;
  status: 'Aktif' | 'Nonaktif';
}

export default function TogelPasaranPage() {
  const [pasaranData, setPasaranData] = useState<TogelPasaranItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTogelPasaran = async () => {
    setLoading(true);
    try {
      // Contoh query Supabase (sesuaikan nama tabel dan kolom)
      // const { data, error } = await supabase.from('togel_pasaran').select('*').order('urutan', { ascending: true });
      // if (!error && data) setPasaranData(data);

      setPasaranData([]);
    } catch (error) {
      console.error('Gagal mengambil data togel pasaran:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTogelPasaran();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Togel Pasaran</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Togel Pasaran</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiGrid className="text-base" />
            <span>Togel Pasaran</span>
          </div>
          <Link 
            href="/admin/togel/togel-pasaran/tambah"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiPlus className="text-sm font-bold" />
            <span>Tambah</span>
          </Link>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data pasaran...
            </div>
          ) : pasaranData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data pasaran togel.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Prize</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Hari Tutup</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center w-20">Urutan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center w-28">Status</th>
                    <th className="py-2.5 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {pasaranData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.nama}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.prize}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.hari_tutup}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                        Tutup : {item.waktu_tutup} | Buka : {item.waktu_buka}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{item.urutan}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-white ${
                          item.status === 'Aktif' ? 'bg-emerald-600' : 'bg-red-600'
                        }`}>
                          {item.status === 'Aktif' ? <FiCheckCircle className="text-xs" /> : <FiXCircle className="text-xs" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Link
                          href={`/admin/togel/togel-pasaran/edit/${item.id}`}
                          className="inline-flex p-1.5 bg-amber-400 hover:bg-amber-500 text-white rounded shadow-sm transition cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}