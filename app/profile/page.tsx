'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { User, Key, ArrowLeft, Save } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);

  // State Form Profil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifDepoWd, setNotifDepoWd] = useState(true);
  const [notifTogel, setNotifTogel] = useState(true);

  // Ambil data admin saat halaman pertama kali dimuat
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    // Contoh mengambil data admin pertama (bisa disesuaikan jika menggunakan session login ID)
    const { data, error } = await supabase.from('admins').select('*').limit(1).single();

    if (error) {
      console.error('Gagal memuat profil:', error.message);
    } else if (data) {
      setAdminId(data.id);
      setName(data.username || '');
      setEmail(data.email || '');
      // Jika di database Anda kolom notifikasi belum ada, Anda bisa menambahkannya nanti.
    }
    setLoading(false);
  };

  // Fungsi Simpan Perubahan Profil
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminId) return;

    const { error } = await supabase
      .from('admins')
      .update({
        username: name,
        email: email,
      })
      .eq('id', adminId);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Fungsi Ubah Password menggunakan SweetAlert2 Prompt
  const handleChangePassword = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Ubah Password Baru',
      input: 'password',
      inputPlaceholder: 'Masukkan password baru',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan Password',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#059669', // warna emerald
    });

    if (newPassword) {
      if (newPassword.length < 6) {
        Swal.fire('Peringatan', 'Password minimal harus 6 karakter!', 'warning');
        return;
      }

      const { error } = await supabase
        .from('admins')
        .update({ password: newPassword }) // Jika menggunakan hashing, sesuaikan di sini
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
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data profil...</div>;
  }

  return (
    <form onSubmit={handleSaveProfile} className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Profil</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Profil</span>
          </div>
        </div>

        {/* Kotak Utama Profil */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Kotak */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Profil</span>
          </div>

          {/* Isi Formulir Profil */}
          <div className="p-5 space-y-4">
            
            {/* Input Nama */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nama</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Status</label>
              <input 
                type="text" 
                disabled 
                defaultValue="Aktif" 
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-80"
              />
            </div>

            {/* Bagian Notifikasi Checkbox */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Notifikasi</span>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={notifDepoWd}
                    onChange={(e) => setNotifDepoWd(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>Depo & WD</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={notifTogel}
                    onChange={(e) => setNotifTogel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>Togel</span>
                </label>
              </div>
            </div>

           {/* Tombol Aksi (Simpan, Ubah Password, Kembali) */}
<div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
  <button 
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
  >
    <Save className="w-3.5 h-3.5" />
    <span>Simpan</span>
  </button>
  
  {/* Ubah dari button menjadi Link ke halaman ubah password */}
  <Link 
    href="/profile/ubahpass"
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
  >
    <Key className="w-3.5 h-3.5" />
    <span>Ubah Password</span>
  </Link>

  <Link href="/admin" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
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