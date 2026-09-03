'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function UbahBankPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('Bank');
  const [status, setStatus] = useState('Aktif');
  const [untukRegister, setUntukRegister] = useState('Ya');
  const [untukDeposit, setUntukDeposit] = useState('Ya');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Ambil data bank berdasarkan ID dari Supabase
  useEffect(() => {
    if (!id) return;
    const fetchBankData = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from('admin_banks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Gagal memuat data:", error.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat',
          text: error.message,
        });
      } else if (data) {
        setNama(data.bank_name || '');
        setTipe(data.member_group || 'Bank');
        setStatus(data.sembunyikan === '1' ? 'Nonaktif' : 'Aktif');
        setImageUrl(data.image_url || null);
      }
      setFetching(false);
    };

    fetchBankData();
  }, [id]);

  // Fungsi Hapus Gambar
  const handleRemoveImage = () => {
    setImageUrl(null);
    setNewImageFile(null);
  };

  // Simpan Perubahan ke Supabase dengan SweetAlert
  const handleUpdate = async (e: React.FormEvent) => {
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
      let finalImageUrl = imageUrl;

      // Jika user mengunggah file gambar baru
      if (newImageFile) {
        const fileExt = newImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload ke bucket Supabase Storage (pastikan nama bucket sesuai, contoh: 'bank-logos')
        const { error: uploadError } = await supabase.storage
          .from('bank-logos')
          .upload(filePath, newImageFile);

        if (uploadError) throw uploadError;

        // Dapatkan Public URL dari file yang diupload
        const { data: publicUrlData } = supabase.storage
          .from('bank-logos')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // Update data ke tabel admin_banks
      const { error } = await supabase
        .from('admin_banks')
        .update({
          bank_name: nama,
          member_group: tipe,
          sembunyikan: status === 'Aktif' ? '0' : '1',
          image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data bank berhasil diperbarui!',
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
        text: err.message,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-sm text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Ubah Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/rekening/bank" className="text-blue-600 hover:underline">Bank</Link>
          <span>/</span>
          <span>Ubah Bank</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border-y sm:border border-gray-200 dark:border-gray-800 sm:rounded-lg shadow-sm overflow-hidden">
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Ubah Bank</span>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5 max-w-4xl">
          
          {/* Input Nama */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nama</label>
            <input 
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
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
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Select Untuk Register */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Untuk Register</label>
            <select 
              value={untukRegister}
              onChange={(e) => setUntukRegister(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          {/* Select Untuk Deposit */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Untuk Deposit</label>
            <select 
              value={untukDeposit}
              onChange={(e) => setUntukDeposit(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          {/* Bagian Gambar & Upload Baru */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gambar Logo Bank</label>
            <div className="flex items-center gap-4">
              <div className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white flex items-center justify-center w-36 h-16 shadow-xs overflow-hidden">
                {newImageFile ? (
                  <img 
                    src={URL.createObjectURL(newImageFile)} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={nama} 
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : (
                  <span className="text-xs text-gray-400 italic">No Image</span>
                )}
              </div>
              
              {imageUrl || newImageFile ? (
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
                >
                  Hapus Gambar
                </button>
              ) : null}
            </div>

            {/* Input File untuk Ganti/Upload Gambar */}
            <div className="pt-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewImageFile(e.target.files[0]);
                  }
                }}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">Format: JPG, PNG, atau WEBP.</p>
            </div>
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
    </div>
  );
}