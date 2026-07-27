'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface LayananItem {
  id: number | string;
  name: string;
  link: string;
  icon: string; // <-- Tambahan state icon
  isNew?: boolean;
}

export default function HubungiAdminPage() {
  const [layananList, setLayananList] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Gagal memuat layanan:', error);
    } else {
      setLayananList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();

    const channel = supabase
      .channel('realtime-contacts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTambahKolom = () => {
    const newItem: LayananItem = {
      id: 'temp-' + Date.now(),
      name: '',
      link: '',
      icon: 'FaWhatsapp', // Default icon
      isNew: true,
    };
    setLayananList([...layananList, newItem]);
  };

  const handleSaveItem = async (item: LayananItem) => {
    if (!item.name.trim() || !item.link.trim()) {
      Swal.fire('Peringatan', 'Nama layanan dan link wajib diisi!', 'warning');
      return;
    }

    if (typeof item.id === 'string' && item.id.startsWith('temp-')) {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ name: item.name, link: item.link, icon: item.icon }])
        .select();

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else if (data) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Layanan baru berhasil ditambahkan!',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchContacts();
      }
    } else {
      const { error } = await supabase
        .from('contacts')
        .update({ name: item.name, link: item.link, icon: item.icon })
        .eq('id', item.id);

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Perubahan layanan disimpan!',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleHapusKolom = async (id: number | string) => {
    if (typeof id === 'string' && id.startsWith('temp-')) {
      setLayananList(layananList.filter((item) => item.id !== id));
      return;
    }

    const result = await Swal.fire({
      title: 'Hapus Layanan?',
      text: 'Data layanan ini akan dihapus permanen dari web.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        setLayananList(layananList.filter((item) => item.id !== id));
        Swal.fire('Terhapus!', 'Layanan berhasil dihapus.', 'success');
      }
    }
  };

  // Diperbarui untuk mendukung field 'icon'
  const handleChange = (id: number | string, field: 'name' | 'link' | 'icon', value: string) => {
    setLayananList(
      layananList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  if (loading) {
    return <div className="text-white text-center py-20">Memuat data...</div>;
  }

  return (
    <main className="bg-white dark:bg-[#1a0525] text-gray-900 dark:text-white w-full min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Judul Halaman */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-purple-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase text-yellow-500 dark:text-yellow-400">
              Pengaturan Hubungi Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
              Kelola daftar layanan WhatsApp & kontak admin yang tampil secara real-time.
            </p>
          </div>

          <button
            onClick={handleTambahKolom}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm transition cursor-pointer shadow-lg"
          >
            <FaPlus size={14} /> Tambah Layanan
          </button>
        </div>

        {/* Daftar Kolom Input */}
        <div className="space-y-4">
          {layananList.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Belum ada layanan. Klik tombol "Tambah Layanan" di atas.</p>
          ) : (
            layananList.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-gray-50 dark:bg-[#12031a] border border-gray-200 dark:border-purple-900/80 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300"
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Input Nama Layanan */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nama Layanan #{index + 1}
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: CS Official"
                      value={item.name}
                      onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                      className="bg-white dark:bg-[#1a0525] border border-gray-300 dark:border-purple-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition"
                    />
                  </div>

                  {/* Input Link Tujuan */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Link Tujuan 
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: https://wa.me/628..."
                      value={item.link}
                      onChange={(e) => handleChange(item.id, 'link', e.target.value)}
                      className="bg-white dark:bg-[#1a0525] border border-gray-300 dark:border-purple-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition"
                    />
                  </div>

                  {/* Input Nama Ikon (Opsional) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Url icon
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: FaWhatsapp"
                      value={item.icon || ''}
                      onChange={(e) => handleChange(item.id, 'icon', e.target.value)}
                      className="bg-white dark:bg-[#1a0525] border border-gray-300 dark:border-purple-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition"
                    />
                  </div>

                </div>

                {/* Tombol Simpan & Hapus */}
                <div className="flex items-center gap-2 self-end md:self-center mt-2 md:mt-5">
                  <button
                    onClick={() => handleSaveItem(item)}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                    title="Simpan Perubahan Baris Ini"
                  >
                    <FaSave size={14} /> Simpan
                  </button>

                  <button
                    onClick={() => handleHapusKolom(item.id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-3 rounded-xl transition cursor-pointer border border-red-500/30"
                    title="Hapus Layanan Ini"
                  >
                    <FaTrash size={16} />
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