'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imagePositionY, setImagePositionY] = useState(50);
  const [imagePositionX, setImagePositionX] = useState(50); // <-- TAMBAHKAN INI

  // State Form Profil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notifDepoWd, setNotifDepoWd] = useState(true);
  const [notifTogel, setNotifTogel] = useState(true);

// Ambil data admin berdasarkan session yang aktif di localStorage
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    
    // 1. Ambil email admin yang sedang login dari localStorage
    const loggedInEmail = localStorage.getItem('admin_email');

    if (!loggedInEmail) {
      // Jika tidak ada data login, lempar kembali ke halaman login
      router.push('/login');
      return;
    }

    // 2. Ambil data admin dari Supabase berdasarkan email yang sedang login
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', loggedInEmail)
      .maybeSingle();

    if (error) {
      console.error('Gagal memuat profil:', error.message);
    } else if (data) {
      setAdminId(data.id);
      setName(data.username || '');
      setEmail(data.email || '');
      setAvatarUrl(data.avatar_url || null);
    } else {
      // Jika data admin tidak ditemukan di database
      router.push('/login');
    }
    
    setLoading(false);
  };

// 1. Saat user pilih file, jangan langsung upload, tapi tampilkan modal preview dulu
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedImageFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImageSrc(reader.result as string);
      setShowCropModal(true); // Buka modal penyesuaian
    };
    reader.readAsDataURL(file);
    
    // Reset input value supaya bisa pilih file yang sama jika dibatalkan
    e.target.value = '';
  };

  // 2. Fungsi proses crop/penyesuaian posisi menggunakan Canvas sebelum di-upload ke Supabase
const handleConfirmUpload = async () => {
  if (!selectedImageFile || !previewImageSrc) return;

  try {
    setUploading(true);
    setShowCropModal(false);

    const img = document.createElement('img');
    img.src = previewImageSrc;
    
    await new Promise((resolve) => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    const size = 400; // Resolusi hasil crop (400x400 px)
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Gagal memproses gambar.');

    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    
    // PERUBAHAN DI SINI: Menggunakan X dan Y dari slider
    let x = ((size - w) * imagePositionX) / 100; 
    let y = ((size - h) * imagePositionY) / 100;

    ctx.drawImage(img, x, y, w, h);

    const blob: Blob = await new Promise((resolve) => 
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
    );

    const fileExt = 'jpg';
    const fileName = `${adminId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const newAvatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('admins')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', adminId);

    if (updateError) throw updateError;

    setAvatarUrl(newAvatarUrl);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Foto profil berhasil disesuaikan dan diperbarui.',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error: any) {
    Swal.fire('Gagal', error.message || 'Terjadi kesalahan saat mengunggah foto.', 'error');
  } finally {
    setUploading(false);
    setSelectedImageFile(null);
    setPreviewImageSrc(null);
    setImagePositionX(50); // Reset ke tengah
    setImagePositionY(50); // Reset ke tengah
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

<button 
  type="button" 
  onClick={() => router.push('/admin')}
  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
>
  <ArrowLeft className="w-3.5 h-3.5" />
  <span>Kembali</span>
</button>
              </div>
            </div>

{/* Kolom Kanan: Area Foto Profil */}
<div className="flex flex-col items-center justify-center border-l border-slate-200 dark:border-slate-800 pl-0 md:pl-6 space-y-4">
  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 self-start md:self-center">
    Foto Profil
  </label>

<div 
    onClick={() => {
      if (!avatarUrl) return;
      Swal.fire({
        title: 'Foto Profil',
        html: `
          <div 
            id="zoom-container"
            style="display: flex; justify-content: center; align-items: center; padding: 10px; overflow: hidden; width: 100%; height: 320px; position: relative; cursor: grab;"
            onmousedown="
              let container = this;
              container.isDragging = true;
              container.startX = event.clientX - (container.scrollLeft || 0);
              container.startY = event.clientY - (container.scrollTop || 0);
              container.style.cursor = 'grabbing';
            "
            onmousemove="
              let container = this;
              if (!container.isDragging) return;
              event.preventDefault();
              container.scrollLeft = container.startX - event.clientX;
              container.scrollTop = container.startY - event.clientY;
            "
            onmouseup="
              let container = this;
              container.isDragging = false;
              container.style.cursor = 'grab';
            "
            onmouseleave="
              let container = this;
              container.isDragging = false;
              container.style.cursor = 'grab';
            "
          >
            <img 
              id="zoomable-avatar" 
              src="${avatarUrl}" 
              alt="Foto Profil" 
              style="width: 260px; height: 260px; border-radius: 50%; object-fit: cover; border: 4px solid #3b82f6; transition: transform 0.05s ease; transform: scale(1); transform-origin: center center;" 
              data-scale="1"
              onwheel="
                event.preventDefault();
                let img = this;
                let container = document.getElementById('zoom-container');
                let scale = parseFloat(img.dataset.scale || '1');
                if (event.deltaY < 0) {
                  scale += 0.2; 
                } else {
                  scale -= 0.2; 
                  if (scale < 1) scale = 1; 
                }
                if (scale > 4) scale = 4; 
                img.dataset.scale = scale;
                img.style.transform = 'scale(' + scale + ')';
                
                if (scale > 1) {
                  container.style.overflow = 'auto';
                } else {
                  container.style.overflow = 'hidden';
                  container.scrollLeft = 0;
                  container.scrollTop = 0;
                }
              "
              ondblclick="
                let img = this;
                let container = document.getElementById('zoom-container');
                let scale = parseFloat(img.dataset.scale || '1');
                if (scale === 1) {
                  scale = 2.5; 
                  container.style.overflow = 'auto';
                } else {
                  scale = 1; 
                  container.style.overflow = 'hidden';
                  container.scrollLeft = 0;
                  container.scrollTop = 0;
                }
                img.dataset.scale = scale;
                img.style.transform = 'scale(' + scale + ')';
              "
              title="Scroll mouse, double-click (klik 2x), atau klik tahan lalu geser"
            />
          </div>
          
        `,
        width: '450px',
        showCloseButton: true,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#111720' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#171717',
      });
    }}
    className={`relative w-55 h-55 rounded-full overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner transition ${
      avatarUrl ? 'cursor-pointer group hover:ring-2 hover:ring-yellow-500' : 'cursor-default'
    }`}
    title={avatarUrl ? "Klik untuk melihat foto" : "Belum ada foto"}
  >
    {avatarUrl ? (
      <>
        <Image 
          src={avatarUrl} 
          alt="Foto Profil" 
          fill 
          // pointer-events-none agar klik menembus ke div pembungkus
          className="object-cover pointer-events-none group-hover:scale-105 transition duration-300"
        />
        {/* Overlay hover text */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-semibold pointer-events-none">
          🔍 Lihat Foto
        </div>
      </>
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
        onChange={handleFileSelect} 
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

      {/* Modal Pengaturan Posisi Foto (Crop Sederhana) */}
{/* Modal Pengaturan Posisi Foto (Geser Atas-Bawah & Kiri-Kanan) */}
{showCropModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 w-full max-w-sm space-y-4 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white text-center">
        Sesuaikan Posisi Foto Profil
      </h3>

      {/* Preview Lingkaran */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-md bg-slate-100">
          {previewImageSrc && (
            <img 
              src={previewImageSrc} 
              alt="Crop Preview" 
              className="absolute w-full h-full object-cover"
              // Mengatur posisi X dan Y secara bersamaan
              style={{ objectPosition: `${imagePositionX}% ${imagePositionY}%` }}
            />
          )}
        </div>
      </div>

      {/* Slider Geser Kiri - Kanan */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Geser Kiri / Kanan:</span>
          <span>{imagePositionX}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={imagePositionX} 
          onChange={(e) => setImagePositionX(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Slider Geser Atas - Bawah */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Geser Atas / Bawah:</span>
          <span>{imagePositionY}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={imagePositionY} 
          onChange={(e) => setImagePositionY(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Tombol Aksi Modal */}
      <div className="flex space-x-2 pt-2">
        <button 
          type="button"
          onClick={() => setShowCropModal(false)}
          className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded text-xs font-medium transition"
        >
          Batal
        </button>
        <button 
          type="button"
          onClick={handleConfirmUpload}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition"
        >
          Simpan & Upload
        </button>
      </div>
    </div>
  </div>
)}
      
      {/* Bagian Bawah: Footer Copyright */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </form>

    
  );
}