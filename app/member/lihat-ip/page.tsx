'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiFileText } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface LihatIpItem {
  id: number;
  username: string;
  ip: string;
  waktuLogin: string;
}

export default function LihatIpPage() {
  // Filter States
  const [username, setUsername] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [dariTanggal, setDariTanggal] = useState('2026-09-03');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-09-03');

  const [lihatIpData, setLihatIpData] = useState<LihatIpItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLihatIp = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi Lihat IP
      setLihatIpData([
        {
          id: 1,
          username: 'Celeng123',
          ip: '103.186.193.157',
          waktuLogin: '03 September 2026, 14:55:31',
        },
        {
          id: 2,
          username: 'Imam280893',
          ip: '182.2.181.214',
          waktuLogin: '03 September 2026, 14:54:13',
        },
        {
          id: 3,
          username: 'ADRW11',
          ip: '2404:c0:6a10:463f:18d1:bea7:4319:8c08',
          waktuLogin: '03 September 2026, 14:53:45',
        },
        {
          id: 4,
          username: 'WongAnyar21',
          ip: '103.166.212.254',
          waktuLogin: '03 September 2026, 14:52:23',
        },
        {
          id: 5,
          username: 'Aswin1982',
          ip: '114.122.8.46',
          waktuLogin: '03 September 2026, 14:51:33',
        },
        {
          id: 6,
          username: 'Mio008',
          ip: '182.2.44.221',
          waktuLogin: '03 September 2026, 14:50:54',
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data lihat ip:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLihatIp();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLihatIp();
  };

  const handleReset = () => {
    setUsername('');
    setIpFilter('');
    setDariTanggal('2026-09-03');
    setSampaiTanggal('2026-09-03');
    fetchLihatIp();
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Lihat IP</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Lihat IP</span>
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
              {/* Username */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* IP */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={ipFilter}
                  onChange={(e) => setIpFilter(e.target.value)}
                  placeholder="IP"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dari Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
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
            <span>Lihat IP</span>
          </div>

          <button 
            type="button"
            onClick={() => alert('Mengekspor data Lihat IP...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiFileText className="text-sm" />
            <span>Export</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data Lihat IP...
            </div>
          ) : lihatIpData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data Lihat IP.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">IP</th>
                    <th className="py-2.5 px-3">Waktu Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {lihatIpData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 hover:underline cursor-pointer">
                        {item.username}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono text-xs">
                        {item.ip}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-600 dark:text-gray-400">
                        {item.waktuLogin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && lihatIpData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {lihatIpData.length} dari total {lihatIpData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}