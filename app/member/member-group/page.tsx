'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiEdit, FiTrash2 } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface MemberGroupItem {
  id: number;
  nama: string;
  maxDeposit: number;
}

export default function MemberGroupPage() {
  const [memberGroupData, setMemberGroupData] = useState<MemberGroupItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemberGroup = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi Member Group
      setMemberGroupData([
        {
          id: 1,
          nama: 'Member Baru',
          maxDeposit: 100000,
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data member group:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberGroup();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Member Group</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Member Group</span>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Member Group</span>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data member group...
            </div>
          ) : memberGroupData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data member group.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Max Deposit</th>
                    <th className="py-2.5 px-3 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {memberGroupData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">
                        {item.nama}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono">
                        {formatNumber(item.maxDeposit)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            title="Edit"
                            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded transition cursor-pointer"
                          >
                            <FiEdit className="text-xs" />
                          </button>
                          <button 
                            title="Delete"
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && memberGroupData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {memberGroupData.length} dari total {memberGroupData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}