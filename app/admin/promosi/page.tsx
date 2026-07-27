'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaEdit, FaImage, FaTag, FaAlignLeft, FaTimes } from 'react-icons/fa';

export default function AdminPromosiPage() {
  const [promosi, setPromosi] = useState<{ id: number; title: string; image: string; description: string }[]>([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchPromotions = async () => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data promo:', error);
    } else {
      setPromosi(data || []);
    }
  };

  useEffect(() => {
    fetchPromotions();

    const channel = supabase
      .channel('admin-realtime-promotions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'promotions' },
        () => {
          fetchPromotions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmitPromo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !image.trim() || !description.trim()) {
      Swal.fire('Peringatan', 'Judul, URL Gambar, dan Syarat & Ketentuan wajib diisi!', 'warning');
      return;
    }

    setLoading(true);

    if (editId !== null) {
      const { error } = await supabase
        .from('promotions')
        .update({ title, image, description })
        .eq('id', editId);

      setLoading(false);

      if (error) {
        Swal.fire('Gagal!', error.message, 'error');
      } else {
        Swal.fire('Berhasil!', 'Promo berhasil diperbarui.', 'success');
        handleResetForm();
        fetchPromotions();
      }
    } else {
      const { error } = await supabase
        .from('promotions')
        .insert([{ title, image, description }]);

      setLoading(false);

      if (error) {
        Swal.fire('Gagal!', error.message, 'error');
      } else {
        Swal.fire('Berhasil!', 'Promo baru berhasil ditambahkan.', 'success');
        handleResetForm();
        fetchPromotions();
      }
    }
  };

  const handleEditClick = (item: { id: number; title: string; image: string; description: string }) => {
    setEditId(item.id);
    setTitle(item.title);
    setImage(item.image);
    setDescription(item.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditId(null);
    setTitle('');
    setImage('');
    setDescription('');
  };

  const handleDeletePromo = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Promo?',
      text: 'Promo yang dihapus akan hilang dari halaman web pengguna.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) {
        Swal.fire('Gagal!', error.message, 'error');
      } else {
        Swal.fire('Terhapus!', 'Promo berhasil dihapus.', 'success');
        if (editId === id) handleResetForm();
        fetchPromotions();
      }
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-[#0f001a] dark:text-white">
      {/* Menggunakan max-w-7xl agar melebar ke kiri dan kanan dengan proporsional */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-purple-900 pb-3">
          <h1 className="text-2xl font-bold">
            Manajemen Admin - Kelola Promosi
          </h1>
          {editId !== null && (
            <button 
              onClick={handleResetForm}
              className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <FaTimes /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitPromo} className="flex flex-col gap-6 mb-10">
          
          {/* BAGIAN ATAS: 2 Kolom Kiri & Kanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KOTAK KIRI: Judul & URL Gambar */}
            <div className="bg-white dark:bg-[#12031a] p-6 rounded-xl border border-gray-200 dark:border-purple-900 shadow-lg flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                {editId !== null ? 'Edit Informasi Promo' : 'Informasi Dasar'}
              </h2>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Judul Promo</label>
                <div className="relative w-full flex items-center">
                  <FaTag className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Contoh: GARANSI KEKALAHAN 100%" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-purple-800 rounded text-sm text-gray-900 dark:text-white outline-none focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">URL Gambar Promo</label>
                <div className="relative w-full flex items-center">
                  <FaImage className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Contoh: https://... atau /banner.png" 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-purple-800 rounded text-sm text-gray-900 dark:text-white outline-none focus:border-yellow-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* KOTAK KANAN: Syarat & Ketentuan (Deskripsi) */}
            <div className="bg-white dark:bg-[#12031a] p-6 rounded-xl border border-gray-200 dark:border-purple-900 shadow-lg flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">Syarat & Ketentuan</h2>
              
              <div className="relative w-full flex-1 flex flex-col">
                <label className="block text-sm font-semibold mb-1">Isi Deskripsi / S&K</label>
                <div className="relative w-full flex-1 flex">
                  <FaAlignLeft className="absolute left-3.5 top-3 text-gray-400 text-sm pointer-events-none" />
                  <textarea 
                    rows={5}
                    placeholder="Tuliskan syarat dan ketentuan promo di sini..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-purple-800 rounded text-sm text-gray-900 dark:text-white outline-none focus:border-yellow-500 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* TOMBOL SIMPAN / UPDATE DI BAWAH (Background Terpisah/Penuh) */}
          <div className="bg-white dark:bg-[#12031a] p-4 rounded-xl border border-gray-200 dark:border-purple-900 shadow-lg flex gap-3">
            {editId !== null && (
              <button 
                type="button"
                onClick={handleResetForm}
                className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg text-sm transition cursor-pointer shadow-md"
              >
                Batal
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className={`${editId !== null ? 'w-2/3' : 'w-full'} bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md`}
            >
              <FaPlus /> {loading ? 'Menyimpan...' : editId !== null ? 'Perbarui Promo' : 'Tambah Promo Baru'}
            </button>
          </div>

        </form>

        {/* DAFTAR PROMO DI BAGIAN BAWAH (Grid 2 Kolom atau bisa diubah jadi 3 kolom jika ingin lebih melebar) */}
        <h2 className="text-lg font-semibold mb-4">Daftar Promo Saat Ini ({promosi.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promosi.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">Belum ada promo yang ditambahkan.</p>
          ) : (
            promosi.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#12031a] p-4 rounded-xl border border-gray-200 dark:border-purple-900 shadow-md flex flex-col justify-between transition-colors duration-300">
                <div>
                  <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">S&K: {item.description}</p>
                </div>

                {/* Tombol Aksi (Edit & Hapus) */}
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePromo(item.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}