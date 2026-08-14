'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminTotoPage() {
  const [totoList, setTotoList] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '', bg_image: '', game_url: '' });
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showIconInput, setShowIconInput] = useState(true);

  const [editingToto, setEditingToto] = useState(null);
  const [formEdit, setFormEdit] = useState({ name: '', icon: '', bg_image: '', game_url: '' });

  // State untuk Preview Gambar di Popup Modal
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchToto = async () => {
    try {
      const { data, error } = await supabase
        .from('toto_games')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (Array.isArray(data)) setTotoList(data);
    } catch (error) {
      console.error('Gagal memuat data toto:', error.message);
    }
  };

  useEffect(() => {
    fetchToto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || form.name.trim() === "") {
      alert("Nama pasaran wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const newData = {
        name: form.name.trim(),
        icon: showIconInput ? (form.icon || null) : null,
        bg_image: form.bg_image || null,
        game_url: form.game_url || null
      };

      const { error } = await supabase
        .from('toto_games')
        .insert([newData]);

      if (error) throw error;

      alert("Pasaran toto berhasil ditambahkan!");

      setForm({ name: '', icon: '', bg_image: '', game_url: '' });
      await fetchToto();

    } catch (error) {
      console.error('Error:', error.message);
      alert('Gagal menyimpan pasaran toto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pasaran toto ini?')) return;

    try {
      const { error } = await supabase
        .from('toto_games')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Pasaran toto berhasil dihapus!');
      fetchToto();
    } catch (error) {
      console.error('Error:', error.message);
      alert('Gagal menghapus pasaran toto: ' + error.message);
    }
  };

  const handleEditClick = (toto) => {
    setEditingToto(toto.id);
    setFormEdit({
      name: toto.name || '',
      icon: toto.icon || '',
      bg_image: toto.bg_image || '',
      game_url: toto.game_url || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('toto_games')
        .update(formEdit)
        .eq('id', editingToto);

      if (error) throw error;

      alert('Pasaran toto berhasil diperbarui!');
      setEditingToto(null);
      fetchToto();
    } catch (error) {
      console.error('Error:', error.message);
      alert('Gagal mengupdate pasaran toto: ' + error.message);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f001a] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">🎱 Panel Admin: Kelola Toto Games</h1>
      </div>

      {/* Layout Grid 2 Kolom (Kiri: Form Input, Kanan: Live Preview Kotak Kuning) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
        
        {/* Form Tambah Pasaran Toto */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Tambah Pasaran Toto Baru</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nama Pasaran</label>
              <input 
                type="text" 
                placeholder="Contoh: TURKI" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>

            {/* Bagian URL Logo dengan Wadah dan Tombol ON/OFF yang Sejajar */}
            <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-black/20 border-purple-900/60' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                  URL Logo / Ikon Pasaran
                </span>
                <button
                  type="button"
                  onClick={() => setShowIconInput(!showIconInput)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                    showIconInput 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {showIconInput ? 'ON' : 'OFF'}
                </button>
              </div>

              {showIconInput && (
                <input 
                  type="text" 
                  placeholder="Contoh: /images/logo-turki.png atau link gambar" 
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                />
              )}
            </div>

            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>URL Background Card (Gambar Bola)</label>
              <input 
                type="text" 
                placeholder="Contoh: /images/bg-billiard.png atau link gambar" 
                value={form.bg_image}
                onChange={(e) => setForm({ ...form, bg_image: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Link URL Tombol Main</label>
              <input 
                type="text" 
                placeholder="Contoh: /play/turki atau https://..." 
                value={form.game_url}
                onChange={(e) => setForm({ ...form, game_url: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition shadow-[0_0_15px_rgba(234,179,8,0.4)] cursor-pointer"
            >
              {loading ? 'Menyimpan...' : 'Simpan Pasaran Toto'}
            </button>
          </div>
        </form>

        {/* Kotak Preview Gambar */}
        <div className="border-4 border-yellow-400 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[420px] bg-[#1a0033]/40 shadow-2xl">
          <h3 className="text-yellow-400 font-bold mb-4 uppercase tracking-widest text-xs">Live Preview Background Card</h3>
          
          {form.bg_image ? (
            <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-purple-800 shadow-inner flex items-center justify-center bg-black/60">
              <img 
                src={form.bg_image} 
                alt="Preview Background" 
                className="w-full h-full object-contain p-2 cursor-pointer"
                onClick={() => setPreviewImage(form.bg_image)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm space-y-2 p-6">
              <span className="text-4xl">🖼️</span>
              <p className="font-medium">Belum ada URL gambar yang dimasukkan.</p>
              <p className="text-xs text-gray-500">Silakan ketik atau tempel (*paste*) link gambar pada kolom <strong className="text-yellow-400">URL Background Card</strong> di sebelah kiri untuk melihat hasilnya secara langsung di sini.</p>
            </div>
          )}
        </div>

      </div>

      {/* Tabel Daftar Toto */}
      <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Daftar Pasaran Toto Aktif</h2>
      <div className={`rounded-2xl border overflow-hidden shadow-xl max-w-6xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-wider ${isDarkMode ? 'bg-purple-950/60 border-purple-800 text-gray-300' : 'bg-gray-200 border-gray-300 text-gray-700'}`}>
              <th className={`p-4 border-r ${isDarkMode ? 'border-purple-900/60' : 'border-gray-300'}`}>Logo</th>
              <th className={`p-4 border-r ${isDarkMode ? 'border-purple-900/60' : 'border-gray-300'}`}>Pasaran</th>
              <th className={`p-4 border-r ${isDarkMode ? 'border-purple-900/60' : 'border-gray-300'}`}>Background Card</th>
              <th className={`p-4 border-r ${isDarkMode ? 'border-purple-900/60' : 'border-gray-300'}`}>Link Game</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-purple-900/40' : 'divide-gray-200'}`}>
            {totoList.length === 0 ? (
              <tr>
                <td colSpan="5" className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Belum ada pasaran toto yang ditambahkan.</td>
              </tr>
            ) : (
              totoList.map((toto) => (
                <tr key={toto.id} className={`transition ${isDarkMode ? 'hover:bg-purple-900/20' : 'hover:bg-gray-50'}`}>
                  <td className={`p-4 border-r ${isDarkMode ? 'border-purple-900/40' : 'border-gray-200'}`}>
                    {toto.icon ? <img src={toto.icon} alt="" className="w-8 h-8 object-contain rounded" /> : '—'}
                  </td>
                  <td className={`p-4 font-bold border-r ${isDarkMode ? 'text-white border-purple-900/40' : 'text-gray-900 border-gray-200'}`}>{toto.name}</td>
                  
                  {/* Kolom Background Card (Thumbnail yang bisa diklik untuk memunculkan popup modal) */}
                  <td className={`p-4 border-r ${isDarkMode ? 'border-purple-900/40' : 'border-gray-200'}`}>
                    {toto.bg_image ? (
                      <div 
                        onClick={() => setPreviewImage(toto.bg_image)}
                        className="w-24 h-12 rounded-lg overflow-hidden border border-purple-500/40 bg-black/50 flex items-center justify-center shadow cursor-pointer hover:scale-105 transition-transform"
                        title="Klik untuk memperbesar gambar"
                      >
                        <img 
                          src={toto.bg_image} 
                          alt="BG" 
                          className="w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                    )}
                  </td>

                  <td className={`p-4 truncate max-w-xs border-r ${isDarkMode ? 'text-gray-300 border-purple-900/40' : 'text-gray-600 border-gray-200'}`}>{toto.game_url || '—'}</td>
                  
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(toto)}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(toto.id)}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

{/* Modal Popup Preview Gambar (Lightbox Bersih & Terpusat Penuh) */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-md p-2 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl w-auto h-[50vh] p-3 bg-transparant border border-yellow-400/60 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-default overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close Mengambang di Pojok Kanan Atas Gambar */}
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/70 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-colors cursor-pointer border border-white/20"
              title="Tutup"
            >
              ✕
            </button>
            
            <img 
              src={previewImage} 
              alt="Popup Full Preview" 
              className="max-w-full h-full object-contain rounded-xl shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Modal Form Edit Toto */}
      {editingToto && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl border ${isDarkMode ? 'bg-[#1a0033] border-purple-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Edit Pasaran Toto</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Nama Pasaran</label>
                <input 
                  type="text" 
                  value={formEdit.name} 
                  onChange={(e) => setFormEdit({ ...formEdit, name: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">URL Logo / Ikon</label>
                <input 
                  type="text" 
                  value={formEdit.icon} 
                  onChange={(e) => setFormEdit({ ...formEdit, icon: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">URL Background Card</label>
                <input 
                  type="text" 
                  value={formEdit.bg_image} 
                  onChange={(e) => setFormEdit({ ...formEdit, bg_image: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Link URL Tombol Main</label>
                <input 
                  type="text" 
                  value={formEdit.game_url} 
                  onChange={(e) => setFormEdit({ ...formEdit, game_url: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingToto(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}