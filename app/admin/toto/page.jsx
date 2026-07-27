'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminTotoPage() {
  const [totoList, setTotoList] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', open: '', close: '', code: '', icon: '', bg_image: '', game_url: '' });
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [editingToto, setEditingToto] = useState(null);
  const [formEdit, setFormEdit] = useState({ name: '', date: '', open: '', close: '', code: '', icon: '', bg_image: '', game_url: '' });

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
    if (!form.name || !form.code) {
      alert('Nama pasaran dan kode wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('toto_games')
        .insert([form]);

      if (error) throw error;

      alert('Pasaran Toto berhasil ditambahkan!');
      setForm({ name: '', date: '', open: '', close: '', code: '', icon: '', bg_image: '', game_url: '' });
      fetchToto();
    } catch (error) {
      console.error('Error:', error.message);
      alert('Gagal menambahkan pasaran toto: ' + error.message);
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
      date: toto.date || '',
      open: toto.open || '',
      close: toto.close || '',
      code: toto.code || '',
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

      {/* Form Tambah Pasaran Toto */}
      <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border shadow-xl mb-8 max-w-xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tanggal</label>
              <input 
                type="text" 
                placeholder="2026-07-26"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>
            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kode Pasaran (Kuning)</label>
              <input 
                type="text" 
                placeholder="Contoh: 5696" 
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jam Buka</label>
              <input 
                type="text" 
                placeholder="Contoh: 17:45" 
                value={form.open}
                onChange={(e) => setForm({ ...form, open: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>
            <div>
              <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jam Tutup / Countdown</label>
              <input 
                type="text" 
                placeholder="Contoh: 00:00:00" 
                value={form.close}
                onChange={(e) => setForm({ ...form, close: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>URL Logo / Ikon Pasaran</label>
            <input 
              type="text" 
              placeholder="Contoh: /images/logo-turki.png atau link gambar" 
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
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
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pasaran Toto'}
          </button>
        </div>
      </form>

      {/* Tabel Daftar Toto */}
      <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Daftar Pasaran Toto Aktif</h2>
      <div className={`rounded-2xl border overflow-hidden shadow-xl max-w-5xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-wider ${isDarkMode ? 'bg-purple-950/60 border-purple-800 text-gray-300' : 'bg-gray-200 border-gray-300 text-gray-700'}`}>
              <th className="p-4">Logo</th>
              <th className="p-4">Pasaran</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Kode</th>
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
                  <td className="p-4">
                    {toto.icon ? <img src={toto.icon} alt="" className="w-8 h-8 object-contain rounded" /> : '—'}
                  </td>
                  <td className={`p-4 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{toto.name}</td>
                  <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{toto.date}</td>
                  <td className="p-4 font-mono text-yellow-400 font-bold">{toto.code}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(toto)}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(toto.id)}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Tanggal</label>
                  <input 
                    type="text" 
                    value={formEdit.date} 
                    onChange={(e) => setFormEdit({ ...formEdit, date: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Kode</label>
                  <input 
                    type="text" 
                    value={formEdit.code} 
                    onChange={(e) => setFormEdit({ ...formEdit, code: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Jam Buka</label>
                  <input 
                    type="text" 
                    value={formEdit.open} 
                    onChange={(e) => setFormEdit({ ...formEdit, open: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                    required 
                  />
                </div>
                <div>
                  <label className="box-border block text-xs uppercase tracking-wider mb-1">Jam Tutup</label>
                  <input 
                    type="text" 
                    value={formEdit.close} 
                    onChange={(e) => setFormEdit({ ...formEdit, close: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                    required 
                  />
                </div>
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
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-2.5 rounded-xl text-xs font-bold transition shadow"
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