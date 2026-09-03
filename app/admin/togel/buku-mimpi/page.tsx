'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface BukuMimpiItem {
  id: number;
  keterangan: string;
  kategoriAngka: string;
  angka: string;
}

export default function BukuMimpiPage() {
  // Filter States
  const [keterangan, setKeterangan] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalRows = 847;
  const totalPages = 57;

  const [bukuMimpiData, setBukuMimpiData] = useState<BukuMimpiItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBukuMimpi = async () => {
    setLoading(true);
    try {
      // Contoh query Supabase dengan filter dan pagination
      // let query = supabase.from('buku_mimpi').select('*', { count: 'exact' });
      // if (keterangan) query = query.ilike('keterangan', `%${keterangan}%`);
      // const from = (currentPage - 1) * itemsPerPage;
      // const to = from + itemsPerPage - 1;
      // query = query.range(from, to);
      // const { data, error } = await query;
      // if (!error && data) setBukuMimpiData(data);

      // Data Mockup sesuai gambar
      setBukuMimpiData([
        { id: 1, keterangan: 'PENYAIR - TAPIR - SEMPRITAN - REMBULAN - TANGGALAN - KUMBO KARNO', kategoriAngka: '2D', angka: '00 (97-48-64-98)' },
        { id: 2, keterangan: 'SETAN - BANDENG - OBOR - JAMBU MENTE - TANGAN - BETARAKALA', kategoriAngka: '2D', angka: '01 (05-95-12-45)' },
        { id: 3, keterangan: 'SARJANA - BEKICOT - LONCAT TINGGI - WORTEL - SANDAL - BETARA BRAHMA', kategoriAngka: '2D', angka: '02 (16-53-09-35)' },
        { id: 4, keterangan: 'ORANG MATI - ANGSA - LONCAT GALAH - SAWI - KAKI - SUBALI', kategoriAngka: '2D', angka: '03 (32-53-85-25)' },
        { id: 5, keterangan: 'KWAN IN - MERAK - LOMPAT JAUH - KANGKUNG - BALON - DEWI RATIH', kategoriAngka: '2D', angka: '04 (12-65-05-15)' },
        { id: 6, keterangan: 'KEPALA RAMPOK - SINGA - LONCAT INDAH - KAYU MANIS - KERETA API - GURU LANGIT', kategoriAngka: '2D', angka: '05 (01-89-10-39)' },
        { id: 7, keterangan: 'DEWI BULAN - KELINCI - RENANG - KAPAS - BONEKA - DEWI SRI', kategoriAngka: '2D', angka: '06 (20-91-51-41)' },
        { id: 8, keterangan: 'PELAYAN - BABI - PERAHU LAYAR - BAWANG - PANCING - SULATRI', kategoriAngka: '2D', angka: '07 (24-58-57-08)' },
        { id: 9, keterangan: 'MALING KECIL - MACAN - MOTOR BOAT - KECUBUNG - PASAR - TALA MARIA', kategoriAngka: '2D', angka: '08 (17-57-04-07)' },
        { id: 10, keterangan: 'JENDRAL - KERBAU - MENDAYUNG - PEPAYA - JALA - BIMA', kategoriAngka: '2D', angka: '09 (33-87-88-37)' },
        { id: 11, keterangan: 'KELENTENG - KELABANG - MENYELAM - KELAPA - BIR - SANG PAMUJI', kategoriAngka: '2D', angka: '10 (18-82-03-32)' },
        { id: 12, keterangan: 'MENTERI SERAKAH - ANJING - LARI CEPAT - SAPU - KIPAS - SENGKUNI', kategoriAngka: '2D', angka: '11 (15-77-02-27)' },
        { id: 13, keterangan: 'PENASEHAT PERANG - KUDA - LARI GAWANG - LEMON - BOLA LAMPU - WIBISANA', kategoriAngka: '2D', angka: '12 (04-69-17-19)' },
        { id: 14, keterangan: 'PENJAGA PINTU - GAJAH - LARI ESTAFED - KIPAS ANGIN - KERIS - PRABU KESA', kategoriAngka: '2D', angka: '13 (14-79-07-29)' },
        { id: 15, keterangan: 'POTONG BABI - ONTA - TOLAK PELURU - JEMBATAN - SPET (SUNTIKAN) - JAYA LANGSUAN', kategoriAngka: '2D', angka: '14 (13-96-08-46)' },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data buku mimpi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBukuMimpi();
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBukuMimpi();
  };

  const handleReset = () => {
    setKeterangan('');
    setCurrentPage(1);
    fetchBukuMimpi();
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Buku Mimpi</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Buku Mimpi</span>
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
              {/* Keterangan */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
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
          <span>Buku Mimpi</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data buku mimpi...
            </div>
          ) : bukuMimpiData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data buku mimpi.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Keterangan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Kategori Angka</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Angka</th>
                    <th className="py-2.5 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {bukuMimpiData.map((item, index) => {
                    const absoluteNo = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{absoluteNo}.</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.keterangan}</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.kategoriAngka}</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono">{item.angka}</td>
                        <td className="py-2.5 px-3 text-center"></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer & Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalRows)} sampai {Math.min(currentPage * itemsPerPage, totalRows)} dari total {totalRows} baris
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 border rounded transition font-medium ${
                    currentPage === num
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <span className="px-1 text-gray-400">...</span>

              <button
                onClick={() => setCurrentPage(56)}
                className={`px-3 py-1 border rounded transition font-medium ${
                  currentPage === 56
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                }`}
              >
                56
              </button>

              <button
                onClick={() => setCurrentPage(57)}
                className={`px-3 py-1 border rounded transition font-medium ${
                  currentPage === 57
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                }`}
              >
                57
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}