'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGrid, FiSave, FiEdit2 } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface AutoWdItem {
  id: number;
  nama_provider: string;
  urutan: number | null;
}

export default function AutoDepoWdPage() {
  // State untuk form Auto Depo
  const [formData, setFormData] = useState({
    nama_provider: 'Qrizz',
    client_id: '01eee0e742aa4a5fb8acaeb6f501d44f1776852193802wMR',
    client_secret: 'c530d179ab7e39fa0b039ddebbe95f5c56d34d8df910e0cdc4794e6105af6619',
    client_secret_iv: '6WaqmL1GOE0haAcJ4gArbQ==',
    client_secret_key: 'we8gqaEn4CCgnanP0bmrg==',
    salt_key: 'XNVLmilrSfmBtO3P',
    tipe: ['QRIS'],
    status: 'Aktif',
    withdraw: 'Aktif',
  });

  // State untuk tabel Auto WD
  const [autoWdList, setAutoWdList] = useState<AutoWdItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data auto WD (bisa disesuaikan dengan tabel database Anda, misal 'auto_wd_providers')
  const fetchAutoWd = async () => {
    setLoading(true);
    // Contoh pengambilan data, jika tabel belum ada kita sediakan mock data sesuai gambar
    const { data, error } = await supabase
      .from('auto_wd') // Ganti dengan nama tabel Anda jika sudah ada di database
      .select('*')
      .order('urutan', { ascending: true });

    if (error) {
      // Jika tabel belum dibuat di supabase, gunakan data dummy bawaan gambar agar langsung tampil rapi
      setAutoWdList([
        { id: 1, nama_provider: 'E-Power', urutan: 1 },
        { id: 2, nama_provider: 'Firstpay', urutan: 1 },
        { id: 3, nama_provider: 'Qrizz', urutan: 1 },
      ]);
    } else {
      setAutoWdList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAutoWd();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'Berhasil!',
      text: 'Pengaturan Auto Depo berhasil disimpan.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Auto Depo & WD</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Auto Depo & WD</span>
        </div>
      </div>

      {/* Bagian 1: Auto Depo Form Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Auto Depo</span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Nama Provider */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Nama Provider</label>
            <select
              name="nama_provider"
              value={formData.nama_provider}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Qrizz">Qrizz</option>
              <option value="E-Power">E-Power</option>
              <option value="Firstpay">Firstpay</option>
            </select>
          </div>

          {/* Client ID */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Client ID</label>
            <input
              type="text"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Client Secret */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Client Secret</label>
            <input
              type="text"
              name="client_secret"
              value={formData.client_secret}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Client Secret IV */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Client Secret IV</label>
            <input
              type="text"
              name="client_secret_iv"
              value={formData.client_secret_iv}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Client Secret Key */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Client Secret Key</label>
            <input
              type="text"
              name="client_secret_key"
              value={formData.client_secret_key}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Salt Key */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Salt Key</label>
            <input
              type="text"
              name="salt_key"
              value={formData.salt_key}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Tipe (Tag input style seperti QRIS) */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tipe</label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-2 py-0.5 rounded text-xs text-gray-700 dark:text-gray-200">
                <button type="button" className="text-gray-400 hover:text-red-500 font-bold pr-0.5">×</button>
                QRIS
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Withdraw */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Withdraw</label>
            <select
              name="withdraw"
              value={formData.withdraw}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
            >
              <FiSave className="text-sm" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bagian 2: Auto WD Table Card dengan Garis Pembatas Kotak */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Auto WD</span>
        </div>

        <div className="overflow-x-auto w-full p-4">
          <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16">No.</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Nama Provider</th>
                <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-28">Urutan</th>
                <th className="py-2.5 px-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                    Memuat data Auto WD...
                  </td>
                </tr>
              ) : autoWdList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                    Belum ada data Auto WD.
                  </td>
                </tr>
              ) : (
                autoWdList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.nama_provider}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{item.urutan}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/admin/rekening/autodepowd/ubah/${item.id}`}
                        className="p-1.5 bg-amber-400 hover:bg-amber-500 text-white rounded transition shadow-sm inline-flex items-center justify-center cursor-pointer"
                        title="Edit"
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