'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiCheckCircle } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface OnlineMemberItem {
  id: number;
  username: string;
  ip: string;
  waktuRegister: string;
  upline: string;
  status: string;
  waktuLogin: string;
}

export default function OnlineMemberPage() {
  const [onlineMemberData, setOnlineMemberData] = useState<OnlineMemberItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOnlineMember = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi Online Member
      setOnlineMemberData([
        {
          id: 1,
          username: 'Semar99',
          ip: '140.213.254.29',
          waktuRegister: '17 December 2025, 22:46:45',
          upline: '',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 14:26:59',
        },
        {
          id: 2,
          username: 'Kabul123',
          ip: '182.5.100.26',
          waktuRegister: '08 March 2026, 19:41:42',
          upline: '',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 13:13:09',
        },
        {
          id: 3,
          username: 'Hardomi2',
          ip: '114.4.79.231',
          waktuRegister: '15 August 2025, 10:15:37',
          upline: '',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 13:51:00',
        },
        {
          id: 4,
          username: 'Endangasa02',
          ip: '114.8.204.114',
          waktuRegister: '30 August 2026, 12:37:10',
          upline: '',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 12:17:15',
        },
        {
          id: 5,
          username: 'Boom23',
          ip: '114.10.149.204',
          waktuRegister: '31 January 2026, 09:56:01',
          upline: 'dewadanaa',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 12:08:13',
        },
        {
          id: 6,
          username: 'Aboy123',
          ip: '114.10.112.227',
          waktuRegister: '02 September 2026, 23:52:59',
          upline: '',
          status: 'Aktif',
          waktuLogin: '03 September 2026, 14:21:26',
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data online member:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineMember();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Online Member</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Online Member</span>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Online Member</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data online member...
            </div>
          ) : onlineMemberData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data online member.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">IP</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Register</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Upline</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Status</th>
                    <th className="py-2.5 px-3">Waktu Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {onlineMemberData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 hover:underline cursor-pointer">
                        {item.username}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono text-xs">
                        {item.ip}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                        {item.waktuRegister}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs">
                        {item.upline}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <FiCheckCircle className="text-xs" />
                          {item.status}
                        </span>
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

          {!loading && onlineMemberData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {onlineMemberData.length} dari total {onlineMemberData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}