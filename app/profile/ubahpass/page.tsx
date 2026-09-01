'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { LayoutGrid, ArrowLeft, Save } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChangePasswordPage() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Ambil ID admin pertama saat halaman dimuat
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data, error } = await supabase.from('admins').select('id').limit(1).single();
      if (error) {
        console.error('Gagal mengambil data admin:', error.message);
      } else if (data) {
        setAdminId(data.id);
      }
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire('Peringatan', 'Semua kolom password harus diisi!', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Peringatan', 'Password baru dan konfirmasi password tidak cocok!', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire('Peringatan', 'Password minimal harus 6 karakter!', 'warning');
      return;
    }

    if (!adminId) {
      Swal.fire('Error', 'ID Admin tidak ditemukan.', 'error');
      return;
    }

    // Update password ke tabel admins di Supabase
    const { error } = await supabase
      .from('admins')
      .update({ password: newPassword })
      .eq('id', adminId);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Password berhasil diubah.',
        timer: 1500,
        showConfirmButton: false,
      });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat...</div>;
  }

  return (
    <form onSubmit={handleUpdatePassword} className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className=" max-w-xl w-full space-y-6">
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Ubah Password</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/profile" className="hover:underline text-blue-600 dark:text-blue-400">Profil</Link>
            <span>/</span>
            <span>Ubah Password</span>
          </div>
        </div>

        {/* Kotak Utama Pengaturan Akun */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Kotak */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <LayoutGrid className="w-4 h-4" />
            <span>Pengaturan Akun</span>
          </div>

          {/* Isi Formulir */}
          <div className="p-5 space-y-4">
            
            {/* Input New Password */}
            <div>
              <input 
                type="password" 
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Input Confirm Password */}
            <div>
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tombol Aksi (Simpan & Kembali) */}
            <div className="flex items-center space-x-2 pt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>

              <Link 
                href="/profile" 
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bagian Bawah: Footer Copyright */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </form>
  );
}