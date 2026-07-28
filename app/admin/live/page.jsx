'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = ['LIVE CASINO'];

export default function ManagementLiveCasino() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState('LIVE CASINO');

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [playUrl, setPlayUrl] = useState('');

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
      setDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    fetchGames();
    return () => observer.disconnect();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      // Mengambil data dari tabel (Anda bisa menyesuaikan nama tabel Supabase, misal: 'livecasino_games')
      const { data, error } = await supabase
        .from('live_games')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      if (data) setGames(data);
    } catch (error) {
      console.error('Gagal memuat data live casino:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game) => (game.category || 'LIVE CASINO').toUpperCase() === activeCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !imageUrl) {
      alert('Nama Provider dan URL Gambar wajib diisi!');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('livecasino_games')
          .update({ name, category: activeCategory, image_url: imageUrl, play_url: playUrl })
          .eq('id', editingId);
        if (error) throw error;
        alert('Provider Live Casino berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('livecasino_games')
          .insert([{ name, category: activeCategory, image_url: imageUrl, play_url: playUrl }]);
        if (error) throw error;
        alert('Provider Live Casino baru berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchGames();
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const handleEdit = (game, e) => {
    e.stopPropagation();
    setEditingId(game.id);
    setName(game.name);
    setImageUrl(game.image_url);
    setPlayUrl(game.play_url || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus provider live casino ini?')) return;
    try {
      const { error } = await supabase.from('livecasino_games').delete().eq('id', id);
      if (error) throw error;
      fetchGames();
    } catch (error) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-[#06081d] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide text-blue-500 uppercase">
            Management Live Casino
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Total: <span className="font-bold text-yellow-400">{games.length}</span> Assets Live Casino terdaftar
          </p>
        </div>

        <button
          onClick={() => { setEditingId(null); setName(''); setImageUrl(''); setPlayUrl(''); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
        >
          <span>+</span> Tambah Provider
        </button>
      </div>

      {/* TAB KATEGORI */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4 border-blue-900/40">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-extrabold tracking-wider transition shadow-sm ${
              activeCategory === cat
                ? 'bg-[#0b0e2d] text-white border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : darkMode ? 'bg-blue-950/40 text-gray-400 hover:bg-blue-900/50 border border-transparent' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TABEL DATA PROVIDER */}
      <div className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-xs uppercase font-extrabold tracking-wider ${darkMode ? 'bg-[#080b22] text-gray-300 border-b border-blue-900' : 'bg-gray-800 text-white'}`}>
                <th className="p-4 w-16 text-center">No</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Asset Visual</th>
                <th className="p-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${darkMode ? 'divide-blue-900/40' : 'divide-gray-200'}`}>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Memuat data...</td></tr>
              ) : filteredGames.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Tidak ada provider di kategori {activeCategory}.</td></tr>
              ) : (
                filteredGames.map((game, index) => (
                  <tr key={game.id} className={`transition ${darkMode ? 'hover:bg-blue-500/5' : 'hover:bg-gray-50'}`}>
                    <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                    <td className="p-4 font-black tracking-wide text-sm">{game.name}</td>
                    <td className="p-4">
                      <div 
                        onClick={() => router.push(`/admin/live/${game.name.toLowerCase()}?category=${activeCategory.toLowerCase()}`)}
                        className="w-32 h-14 rounded-lg overflow-hidden border border-blue-400/30 bg-black/40 shadow-inner flex items-center justify-center cursor-pointer hover:scale-105 transition"
                        title="Klik untuk kelola live casino"
                      >
                        <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => handleEdit(game, e)} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition border border-blue-500/30">✏️</button>
                        <button onClick={(e) => handleDelete(game.id, e)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition border border-red-500/30">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM DAFTARKAN PROVIDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#0b0e2d] border-blue-900 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg sm:text-xl tracking-wide uppercase">
                DAFTARKAN LIVE CASINO
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 hover:text-white flex items-center justify-center font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  BRAND NAME
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Evolution Gaming"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition shadow-inner ${
                    darkMode ? 'bg-[#06081d] border-blue-900/60 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-blue-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  CATEGORY
                </label>
                <input
                  type="text"
                  value={activeCategory}
                  disabled
                  className={`w-full p-3.5 rounded-2xl border text-sm font-bold opacity-80 cursor-not-allowed ${
                    darkMode ? 'bg-[#06081d] border-blue-900/60 text-blue-400' : 'bg-gray-100 border-gray-200 text-blue-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  ASSET URL (PNG/WEBP)
                </label>
                <input
                  type="text"
                  placeholder="https://image-link.com/logo.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition shadow-inner ${
                    darkMode ? 'bg-[#06081d] border-blue-900/60 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-blue-500'
                  }`}
                  required
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm tracking-wider transition border ${
                    darkMode ? 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl text-sm tracking-wider shadow-lg shadow-blue-600/30 transition"
                >
                  SAVE DATA
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}