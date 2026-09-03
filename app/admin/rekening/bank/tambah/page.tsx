'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default function TambahBankPage() {
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('Bank');
  const [status, setStatus] = useState('Pilih');
  const [untukRegister, UntukRegister] = useState('Tidak');
  const [untukDeposit, UntukDeposit] = useState('Tidak');
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Nama bank harus diisi!',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      // 1. Jika ada file gambar yang dipilih, upload ke Supabase Storage
      if (gambar) {
        const fileExt = gambar.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Pastikan Anda sudah membuat bucket public bernama 'bank-logos' di Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('bank-logos')
          .upload(filePath, gambar);

        if (uploadError) {
          throw new Error("Gagal mengunggah gambar: " + uploadError.message);
        }

        // Ambil URL publik dari file yang baru di-upload
        const { data: publicURLData } = supabase.storage
          .from('bank-logos')
          .getPublicUrl(filePath);

        imageUrl = publicURLData.publicUrl;
      }

      // 2. Menyimpan data ke tabel admin_banks termasuk image_url
      const { error } = await supabase
        .from('admin_banks')
        .insert([
          {
            bank_name: nama,
            member_group: tipe,
            sembunyikan: status === 'Aktif' ? '0' : '1',
            image_url: imageUrl || null, // Menyimpan URL gambar ke database
          }
        ]);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data bank berhasil disimpan!',
        timer: 1500,
        showConfirmButton: false,
      });

      router.push('/admin/rekening/bank');
      router.refresh();
    } catch (err: any) {
      console.error("Gagal menyimpan:", err.message);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan saat menyimpan data: ' + err.message,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Tambah Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/rekening/bank" className="text-blue-600 hover:underline">Bank</Link>
          <span>/</span>
          <span>Tambah Bank</span>
        </div>
      </div>

      {/* Main Container Card - Full Width */}
      <div className="w-full bg-white dark:bg-gray-900 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-lg shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Tambah Bank</span>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-4xl">
          
          {/* Input Nama */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nama</label>
            <input 
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Select Tipe */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe</label>
            <select 
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>

          {/* Select Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Pilih">Pilih</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Select Untuk Register */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Untuk Register</label>
            <select 
              value={untukRegister}
              onChange={(e) => UntukRegister(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
          </div>

          {/* Select Untuk Deposit */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Untuk Deposit</label>
            <select 
              value={untukDeposit}
              onChange={(e) => UntukDeposit(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gambar</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded overflow-hidden bg-white dark:bg-gray-800">
              <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm border-r border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-200 transition">
                Browse...
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setGambar(e.target.files?.[0] || null)}
                  className="hidden" 
                />
              </label>
              <span className="px-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                {gambar ? gambar.name : 'No file selected.'}
              </span>
            </div>
            <p className="text-xs text-red-500 mt-1">nb: ukuran [200 x 80] px</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link 
              href="/admin/rekening/bank"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium rounded transition shadow-sm inline-flex items-center justify-center cursor-pointer"
            >
              Kembali
            </Link>
          </div>

        </form>

      </div>

      {/* Footer Copyright */}
      <div className="text-center py-6 text-xs text-gray-500 dark:text-gray-400">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </div>
  );
}