'use client';
import { useState, useEffect } from 'react';

export default function AdminPopularGamesPage() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ title: '', provider: '', image: '', game_url: '' });
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State untuk menangani proses Edit
  const [editingGame, setEditingGame] = useState(null);
  const [formEdit, setFormEdit] = useState({ title: '', provider: '', image: '', game_url: '' });

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

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/admin/popular-games');
      const data = await res.json();
      setGames(data);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.provider || !form.image || !form.game_url) {
      alert('Semua kolom (Judul, Provider, Gambar, dan URL Game) harus diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/popular-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Game populer berhasil ditambahkan!');
        setForm({ title: '', provider: '', image: '', game_url: '' });
        fetchGames();
      } else {
        alert('Gagal menambahkan game.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus game ini dari daftar populer?')) return;

    try {
      const res = await fetch(`/api/admin/popular-games?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Game berhasil dihapus!');
        fetchGames();
      } else {
        alert('Gagal menghapus game.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fungsi saat tombol Edit diklik
  const handleEditClick = (game) => {
    setEditingGame(game.id);
    setFormEdit({
      title: game.title,
      provider: game.provider,
      image: game.image,
      game_url: game.game_url
    });
  };

  // Fungsi untuk menyimpan perubahan Update ke Supabase via API Route
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/popular-games', {
        method: 'PUT', // Menggunakan metode PUT untuk update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingGame, ...formEdit }),
      });

      if (res.ok) {
        alert('Game berhasil diperbarui!');
        setEditingGame(null);
        fetchGames();
      } else {
        alert('Gagal mengupdate game.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f001a] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">⚙️ Panel Admin: Kelola Game Paling Populer</h1>
      </div>

      {/* Form Tambah Game */}
      <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border shadow-xl mb-8 max-w-xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Tambah Game Populer Baru</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Judul Game</label>
            <input 
              type="text" 
              placeholder="Contoh: Mahjong Ways 2" 
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Provider</label>
            <input 
              type="text" 
              placeholder="Contoh: PGSOFT" 
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>URL / Path Gambar</label>
            <input 
              type="text" 
              placeholder="Contoh: /game1.jpg atau link gambar" 
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>URL / Link Tujuan Game</label>
            <input 
              type="text" 
              placeholder="Contoh: /play/mahjong-ways atau https://..." 
              value={form.game_url}
              onChange={(e) => setForm({ ...form, game_url: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          >
            {loading ? 'Menyimpan...' : 'Simpan & Publikasikan ke Frontend'}
          </button>
        </div>
      </form>

      {/* Tabel Daftar Game */}
      <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Daftar Game Populer Saat Ini</h2>
      <div className={`rounded-2xl border overflow-hidden shadow-xl max-w-5xl transition-colors duration-300 ${isDarkMode ? 'bg-[#1a0033] border-purple-800' : 'bg-white border-gray-300'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-wider ${isDarkMode ? 'bg-purple-950/60 border-purple-800 text-gray-300' : 'bg-gray-200 border-gray-300 text-gray-700'}`}>
              <th className="p-4">Gambar</th>
              <th className="p-4">Judul Game</th>
              <th className="p-4">Provider</th>
              <th className="p-4">Link URL</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-purple-900/40' : 'divide-gray-200'}`}>
            {games.length === 0 ? (
              <tr>
                <td colSpan="5" className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Belum ada game populer yang ditambahkan.</td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className={`transition ${isDarkMode ? 'hover:bg-purple-900/20' : 'hover:bg-gray-50'}`}>
                  <td className="p-4">
                    <img src={game.image} alt={game.title} className="w-12 h-12 object-cover rounded-lg border border-purple-700" />
                  </td>
                  <td className={`p-4 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{game.title}</td>
                  <td className={`p-4 uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{game.provider}</td>
                  <td className={`p-4 truncate max-w-xs ${isDarkMode ? 'text-yellow-400' : 'text-blue-600'}`}>{game.game_url}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Tombol Edit */}
                      <button 
                        onClick={() => handleEditClick(game)}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                      >
                        Edit
                      </button>
                      
                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => handleDelete(game.id)}
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

      {/* Modal Form Edit */}
      {editingGame && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl border ${isDarkMode ? 'bg-[#1a0033] border-purple-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Edit Data Game Populer</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Judul Game</label>
                <input 
                  type="text" 
                  value={formEdit.title} 
                  onChange={(e) => setFormEdit({ ...formEdit, title: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Provider</label>
                <input 
                  type="text" 
                  value={formEdit.provider} 
                  onChange={(e) => setFormEdit({ ...formEdit, provider: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">URL / Path Gambar</label>
                <input 
                  type="text" 
                  value={formEdit.image} 
                  onChange={(e) => setFormEdit({ ...formEdit, image: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">URL / Link Tujuan Game</label>
                <input 
                  type="text" 
                  value={formEdit.game_url} 
                  onChange={(e) => setFormEdit({ ...formEdit, game_url: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 ${isDarkMode ? 'bg-black/50 border-purple-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                  required 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingGame(null)}
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