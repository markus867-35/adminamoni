'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Key, ArrowLeft, Save, Upload, Trash2 } from 'lucide-react';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notifDepoWd, setNotifDepoWd] = useState(true);
  const [notifTogel, setNotifTogel] = useState(true);

  // Ambil data admin saat halaman pertama kali dimuat
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('admins').select('*').limit(1).single();

    if (error) {
      console.error('Gagal memuat profil:', error.message);
    } else if (data) {
      setAdminId(data.id);
      setName(data.username || '');
      setEmail(data.email || '');
      setAvatarUrl(data.avatar_url || null);
    }
    setLoading(false);
  };

  // Fungsi Upload / Ganti Foto Profil
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${adminId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      // Upload ke Supabase Storage (Pastikan bucket bernama 'avatars' sudah dibuat)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL dari file yang di-upload
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;

      // Update langsung ke database tabel admins
      const { error: updateError } = await supabase
        .from('admins')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', adminId);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Foto profil berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire('Gagal', error.message || 'Terjadi kesalahan saat mengunggah foto.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Fungsi Hapus Foto Profil
  const handleDeleteAvatar = async () => {
    if (!avatarUrl) return;

    const result = await Swal.fire({
      title: 'Hapus foto profil?',
      text: 'Foto profil akan dihapus dan dikembalikan ke default.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        // Update kolom avatar_url di database menjadi null/kosong
        const { error } = await supabase
          .from('admins')
          .update({ avatar_url: null })
          .eq('id', adminId);

        if (error) throw error;

        setAvatarUrl(null);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Foto profil berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire('Gagal', error.message, 'error');
      }
    }
  };

  // Fungsi Simpan Perubahan Profil (Nama & Email)
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

          {/* Isi Formulir Profil dengan Layout 2 Kolom (Kiri: Input, Kanan: Foto Profil) */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kolom Kiri: Input Data (Mengambil 2 span grid) */}
            <div className="md:col-span-2 space-y-4">
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
                
                <Link 
                  href="/profile/ubahpass"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Ubah Password</span>
                </Link>

                <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: Area Foto Profil yang Anda Tandai */}
            <div className="flex flex-col items-center justify-center border-l border-slate-200 dark:border-slate-800 pl-0 md:pl-6 space-y-4">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 self-start md:self-center">
                Foto Profil
              </label>

              {/* Preview Lingkaran/Kotak Foto */}
              <div className="relative w-50 h-50 rounded-full overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                {avatarUrl ? (
                  <Image 
                    src={avatarUrl} 
                    alt="Foto Profil" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>

              {/* Tombol Ganti & Hapus Foto */}
              <div className="flex flex-col space-y-2 w-full max-w-[180px]">
                <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded text-center cursor-pointer flex items-center justify-center space-x-1.5 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Ganti Foto'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading} 
                    className="hidden" 
                  />
                </label>

                {avatarUrl && (
                  <button 
                    type="button" 
                    onClick={handleDeleteAvatar}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium py-2 px-3 rounded flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
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