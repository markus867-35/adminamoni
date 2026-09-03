'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface BankItem {
  id: number;
  bank_name: string;
  member_group: string | null;
  sembunyikan: string | null;
  image?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
}

export default function BankPage() {
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_banks')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      console.log('Cek struktur data dari Supabase:', data); // Buka Inspect Element (F12) -> Console untuk melihat nama kolom yang benar
      setBanks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Bank</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-lg shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiGrid className="text-base" />
            <span>Bank</span>
          </div>
          <Link 
            href="/admin/rekening/bank/tambah"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiPlus className="text-sm" />
            <span>Tambah</span>
          </Link>
        </div>

       {/* Table Content */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-sm border border-gray-200 dark:border-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-semibold bg-gray-50/50 dark:bg-gray-800/20">
                <th className="py-3 px-4 w-16 border-r border-gray-200 dark:border-gray-800">No.</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">Nama</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">Tipe</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">Status</th>
                <th className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">Gambar</th>
                <th className="py-3 px-4 text-center border-r border-gray-200 dark:border-gray-800">Register</th>
                <th className="py-3 px-4 text-center border-r border-gray-200 dark:border-gray-800">Deposit</th>
                <th className="py-3 px-4 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                    Memuat data dari database...
                  </td>
                </tr>
              ) : banks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                    Belum ada data bank. Silakan klik tombol &quot;Tambah&quot; di atas.
                  </td>
                </tr>
              ) : (
                banks.map((bank, index) => {
                  // Mencari URL gambar dari berbagai kemungkinan nama kolom di database
                  const bankImage = bank.image || bank.logo || bank.logo_url || bank.image_url;

                  return (
                    <tr key={bank.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">{index + 1}.</td>
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-800 font-medium">{bank.bank_name}</td>
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">{bank.member_group || '-'}</td>
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">
                        {bank.sembunyikan === '1' ? 'Nonaktif' : 'Aktif'}
                      </td>
                      
{/* Kolom Gambar */}
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-800">
                        <div 
                          className="w-24 h-14 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          title="Klik untuk memperbesar gambar"
                          onClick={() => {
                            if (bankImage) {
                              Swal.fire({
                                title: bank.bank_name || 'Logo Bank',
                                html: `<div style="display: flex; justify-content: center; align-items: center;"><img src="${bankImage}" style="max-width: 100%; max-height: 300px; object-fit: contain;" /></div>`,
                                showCloseButton: true,
                                showConfirmButton: false,
                                width: '400px',
                              });
                            }
                          }}
                        >
                          {bankImage ? (
                            <img 
                              src={bankImage} 
                              alt={bank.bank_name} 
                              className="max-h-full max-w-full object-contain pointer-events-none"
                            />
                          ) : (
                            <span className="text-xs text-gray-400 italic">No Image</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center border-r border-gray-200 dark:border-gray-800">
                        <input 
                          type="checkbox" 
                          defaultChecked={true} 
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-center border-r border-gray-200 dark:border-gray-800">
                        <input 
                          type="checkbox" 
                          defaultChecked={true} 
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link 
                          href={`/admin/rekening/bank/ubah/${bank.id}`}
                          className="p-1.5 bg-amber-400 hover:bg-amber-500 text-white rounded transition shadow-sm inline-flex items-center justify-center cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="text-xs" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}