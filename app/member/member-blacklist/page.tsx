'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiEdit, FiTrash2 } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface MemberBlacklistItem {
  id: number;
  namaBank: string;
  nomorRekening: string;
  atasNama: string;
  waktuBuat: string;
  keterangan: string;
  ip?: string;
  username?: string;
}

export default function MemberBlacklistPage() {
  // Tab State: 'rekening' | 'ip' | 'username'
  const [activeTab, setActiveTab] = useState<'rekening' | 'ip' | 'username'>('rekening');

  // Filter States
  const [nomorRekening, setNomorRekening] = useState('');
  const [atasNama, setAtasNama] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');

  const [blacklistData, setBlacklistData] = useState<MemberBlacklistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlacklist = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai tab aktif (saat ini kosong sesuai gambar referensi)
      setBlacklistData([]);
    } catch (error) {
      console.error('Gagal mengambil data member blacklist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlacklist();
  };

  const handleReset = () => {
    setNomorRekening('');
    setAtasNama('');
    setIpFilter('');
    setUsernameFilter('');
    fetchBlacklist();
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Member Blacklist</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Member Blacklist</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTab === 'rekening' && (
                <>
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      value={nomorRekening}
                      onChange={(e) => setNomorRekening(e.target.value)}
                      placeholder="Nomor Rekening"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      value={atasNama}
                      onChange={(e) => setAtasNama(e.target.value)}
                      placeholder="Atas Nama"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'ip' && (
                <div className="space-y-1 sm:col-span-2">
                  <input 
                    type="text" 
                    value={ipFilter}
                    onChange={(e) => setIpFilter(e.target.value)}
                    placeholder="IP Address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {activeTab === 'username' && (
                <div className="space-y-1 sm:col-span-2">
                  <input 
                    type="text" 
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
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
          <span>Member Blacklist</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Switch Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('rekening')}
              className={`px-4 py-2 rounded text-xs font-medium transition cursor-pointer ${
                activeTab === 'rekening'
                  ? 'bg-gray-800 text-white dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Berdasarkan Rekening
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ip')}
              className={`px-4 py-2 rounded text-xs font-medium transition cursor-pointer ${
                activeTab === 'ip'
                  ? 'bg-gray-800 text-white dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Berdasarkan IP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('username')}
              className={`px-4 py-2 rounded text-xs font-medium transition cursor-pointer ${
                activeTab === 'username'
                  ? 'bg-gray-800 text-white dark:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Berdasarkan Username
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data member blacklist...
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    {activeTab === 'rekening' && (
                      <>
                        <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama Bank</th>
                        <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nomor Rekening</th>
                        <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Atas Nama</th>
                      </>
                    )}
                    {activeTab === 'ip' && (
                      <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">IP Address</th>
                    )}
                    {activeTab === 'username' && (
                      <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    )}
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Buat</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Keterangan</th>
                    <th className="py-2.5 px-3 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {blacklistData.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'rekening' ? 7 : 5} className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm italic">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    blacklistData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                        {activeTab === 'rekening' && (
                          <>
                            <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.namaBank}</td>
                            <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono">{item.nomorRekening}</td>
                            <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.atasNama}</td>
                          </>
                        )}
                        {activeTab === 'ip' && (
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono">{item.ip}</td>
                        )}
                        {activeTab === 'username' && (
                          <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600">{item.username}</td>
                        )}
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">{item.waktuBuat}</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs">{item.keterangan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button title="Edit" className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded transition cursor-pointer">
                              <FiEdit className="text-xs" />
                            </button>
                            <button title="Delete" className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer">
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
            Menampilkan sampai dari total {blacklistData.length} baris
          </div>
        </div>
      </div>
    </div>
  );
}