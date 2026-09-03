'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiFileText } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface HistoryKoinItem {
  id: number;
  tanggal: string;
  tipe: string;
  promo: string;
  durasiPromo: string;
  pembagianPromo: string;
  dari: string;
  kepada: string;
  debit: number;
  kredit: number;
  saldo: number;
}

export default function HistoryKoinPage() {
  // Filter States
  const [tipe, setTipe] = useState('');
  const [durasiPromo, setDurasiPromo] = useState('');
  const [pembagianPromo, setPembagianPromo] = useState('');
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [dariJam, setDariJam] = useState('');
  const [sampaiJam, setSampaiJam] = useState('');

  const [historyData, setHistoryData] = useState<HistoryKoinItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistoryKoin = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi History Koin
      setHistoryData([
        {
          id: 1,
          tanggal: '03 September 2026, 16:13:24',
          tipe: 'Penyesuaian Saldo',
          promo: '',
          durasiPromo: '',
          pembagianPromo: '',
          dari: 'PGA MVP',
          kepada: 'kaconk87',
          debit: 0,
          kredit: 10000,
          saldo: 131654416.30,
        },
        {
          id: 2,
          tanggal: '03 September 2026, 16:13:23',
          tipe: 'Penyesuaian Saldo',
          promo: '',
          durasiPromo: '',
          pembagianPromo: '',
          dari: 'PGA MVP',
          kepada: 'Elfhys123',
          debit: 0,
          kredit: 100000,
          saldo: 131664416.30,
        },
        {
          id: 3,
          tanggal: '03 September 2026, 16:10:59',
          tipe: 'Penyesuaian Saldo',
          promo: '',
          durasiPromo: '',
          pembagianPromo: '',
          dari: 'PGA MVP',
          kepada: 'apel989',
          debit: 0,
          kredit: 200000,
          saldo: 131764416.30,
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data history koin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryKoin();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistoryKoin();
  };

  const handleReset = () => {
    setTipe('');
    setDurasiPromo('');
    setPembagianPromo('');
    setDariTanggal('');
    setSampaiTanggal('');
    setDariJam('');
    setSampaiJam('');
    fetchHistoryKoin();
  };

  const formatNumberDecimal = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">History Koin</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>History Koin</span>
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
              {/* Tipe */}
              <div className="space-y-1">
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih</option>
                  <option value="Penyesuaian Saldo">Penyesuaian Saldo</option>
                  <option value="Bonus">Bonus</option>
                </select>
              </div>

              {/* Durasi Promo */}
              <div className="space-y-1">
                <select
                  value={durasiPromo}
                  onChange={(e) => setDurasiPromo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih</option>
                  <option value="Harian">Harian</option>
                  <option value="Mingguan">Mingguan</option>
                </select>
              </div>

              {/* Pembagian Promo */}
              <div className="space-y-1">
                <select
                  value={pembagianPromo}
                  onChange={(e) => setPembagianPromo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih</option>
                  <option value="Otomatis">Otomatis</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Dari Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  placeholder="Dari Tanggal"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  placeholder="Sampai Tanggal"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dari Jam */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={dariJam}
                  onChange={(e) => setDariJam(e.target.value)}
                  placeholder="--:-- --"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Jam */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={sampaiJam}
                  onChange={(e) => setSampaiJam(e.target.value)}
                  placeholder="--:-- --"
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
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiGrid className="text-base" />
            <span>History Koin</span>
          </div>

          <button 
            type="button"
            onClick={() => alert('Mengekspor data History Koin...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiFileText className="text-sm" />
            <span>Export</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data history koin...
            </div>
          ) : historyData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data history koin.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tanggal</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Promo</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Durasi Promo</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Pembagian Promo</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Dari</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Kepada</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Debit</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Kredit</th>
                    <th className="py-2.5 px-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {historyData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                        {item.tanggal}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-xs">
                        {item.tipe}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                        {item.promo}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                        {item.durasiPromo}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                        {item.pembagianPromo}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-xs">
                        {item.dari}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 text-xs">
                        {item.kepada}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatNumberDecimal(item.debit)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatNumberDecimal(item.kredit)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs font-semibold">
                        {formatNumberDecimal(item.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && historyData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {historyData.length} dari total {historyData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}