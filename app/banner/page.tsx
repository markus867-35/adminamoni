'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

// Inisialisasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Banner {
  id: number;
  image_url: string;
  created_at: string;
}

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Ambil data banner dari database
  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error.message);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. Tambah Banner Baru
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      Swal.fire('Peringatan', 'URL Gambar tidak boleh kosong!', 'warning');
      return;
    }

    const { error } = await supabase
      .from('banners')
      .insert([{ image_url: imageUrl.trim() }]);

    if (error) {
      Swal.fire('Gagal!', 'Gagal menambahkan banner: ' + error.message, 'error');
    } else {
      Swal.fire('Berhasil!', 'Banner baru telah ditambahkan.', 'success');
      setImageUrl('');
      fetchBanners();
    }
  };

  // 3. Hapus Banner
  const handleDeleteBanner = async (id: number) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Banner yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) {
        Swal.fire('Gagal!', 'Gagal menghapus banner: ' + error.message, 'error');
      } else {
        Swal.fire('Terhapus!', 'Banner berhasil dihapus.', 'success');
        fetchBanners();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f001a] text-gray-900 dark:text-white p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-purple-700 dark:text-yellow-400 border-b border-gray-200 dark:border-purple-800 pb-3">
          KELOLA BANNER HERO SLIDER
        </h1>

        {/* --- FORM TAMBAH BANNER --- */}
        <div className="bg-gray-50 dark:bg-[#1a0033] border border-gray-200 dark:border-purple-800/60 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tambah Banner Baru</h2>
          <form onSubmit={handleAddBanner} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                URL Gambar Banner (ImageKit / Storage / Direct Link)
              </label>
              <input
                type="url"
                placeholder="https://ik.imagekit.io/xxx/banner.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white dark:bg-[#0f001a] border border-gray-300 dark:border-purple-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-all"
            >
              + Tambah Banner
            </button>
          </form>

          {imageUrl && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview Gambar:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="h-32 object-cover rounded border border-gray-300 dark:border-purple-700"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        {/* --- DAFTAR BANNER --- */}
        <div className="bg-gray-50 dark:bg-[#1a0033] border border-gray-200 dark:border-purple-800/60 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Daftar Banner Aktif ({banners.length})</h2>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data banner...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada banner yang ditambahkan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="bg-white dark:bg-[#0f001a] border border-gray-200 dark:border-purple-800/80 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div className="relative h-44 w-full bg-gray-200 dark:bg-gray-900">
                    <img
                      src={banner.image_url}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded">
                      Slide #{index + 1}
                    </span>
                  </div>

                  <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-purple-800/50">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={banner.image_url}>
                      {banner.image_url}
                    </span>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shrink-0"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}