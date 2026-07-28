'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminSportsDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const providerName = params?.id ? decodeURIComponent(params.id) : '';
  const category = searchParams.get('category') || 'sportsbook';

  const [darkMode, setDarkMode] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Form Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [gameType, setGameType] = useState('populer'); // 'populer' atau 'reguler'

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
      setDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    if (providerName) {
      fetchSubGames();
    }
    return () => observer.disconnect();
  }, [providerName]);

  const fetchSubGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sports_sub_games')
        .select('*')
        .ilike('provider', providerName)
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) setGames(data);
    } catch (error) {
      console.error('Gagal memuat sub game:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setEditingId(null);
    setName('');
    setImageUrl('');
    setGameType(type);
    setIsModalOpen(true);
  };

  const handleEdit = (game, e) => {
    e.stopPropagation();
    setEditingId(game.id);
    setName(game.name);
    setImageUrl(game.image_url);
    setGameType(game.type || 'populer');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !imageUrl) {
      alert('Nama dan URL Gambar wajib diisi!');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('sports_sub_games')
          .update({ name, image_url: imageUrl, type: gameType })
          .eq('id', editingId);
        if (error) throw error;
        alert('Data berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('sports_sub_games')
          .insert([{ provider: providerName.toLowerCase(), name, image_url: imageUrl, type: gameType }]);
        if (error) throw error;
        alert('Data berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchSubGames();
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const { error } = await supabase.from('sports_sub_games').delete().eq('id', id);
      if (error) throw error;
      fetchSubGames();
    } catch (error) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  const populerGames = games.filter(g => (g.type || 'populer') === 'populer');
  const regulerGames = games.filter(g => g.type === 'reguler');

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-[#06081d] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* KEMBALI */}
      <button 
        onClick={() => router.back()}
        className="text-xs font-bold text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition"
      >
        ← KEMBALI
      </button>

      {/* HEADER SECTION */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Manajemen Game
          </span>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-blue-500 mt-1">
            {providerName} <span className={darkMode ? 'text-white' : 'text-gray-900'}>GAMES</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openModal('populer')}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            🔥 TAMBAH POPULER
          </button>
          <button
            onClick={() => openModal('reguler')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
          >
            + TAMBAH REGULER
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Memuat data game...</div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* SECTION: GAME TERPOPULER */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-2">
              🔥 Game Terpopuler
            </h2>
            <div className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-[#0b0e2d] border-amber-500/30' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs uppercase font-black tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                      <th className="p-4 w-16 text-center">No</th>
                      <th className="p-4">Nama</th>
                      <th className="p-4">Gambar</th>
                      <th className="p-4 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-sm ${darkMode ? 'divide-blue-900/40' : 'divide-gray-200'}`}>
                    {populerGames.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game terpopuler.</td></tr>
                    ) : (
                      populerGames.map((game, idx) => (
                        <tr key={game.id} className={`transition ${darkMode ? 'hover:bg-amber-500/5' : 'hover:bg-gray-50'}`}>
                          <td className="p-4 text-center font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-4 font-black tracking-wide">{game.name}</td>
                          <td className="p-4">
                            <div className="w-24 h-12 rounded-lg overflow-hidden border border-amber-500/30 bg-black/40 flex items-center justify-center">
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
          </div>

          {/* SECTION: GAME REGULER */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              🎮 Game Reguler
            </h2>
            <div className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-xs uppercase font-black tracking-wider ${darkMode ? 'bg-[#080b22] text-white border-b border-blue-900' : 'bg-gray-800 text-white'}`}>
                      <th className="p-4 w-16 text-center">No</th>
                      <th className="p-4">Nama</th>
                      <th className="p-4">Gambar</th>
                      <th className="p-4 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-sm ${darkMode ? 'divide-blue-900/40' : 'divide-gray-200'}`}>
                    {regulerGames.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game reguler.</td></tr>
                    ) : (
                      regulerGames.map((game, idx) => (
                        <tr key={game.id} className={`transition ${darkMode ? 'hover:bg-blue-500/5' : 'hover:bg-gray-50'}`}>
                          <td className="p-4 text-center font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-4 font-black tracking-wide">{game.name}</td>
                          <td className="p-4">
                            <div className="w-24 h-12 rounded-lg overflow-hidden border border-blue-400/30 bg-black/40 flex items-center justify-center">
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
          </div>

        </div>
      )}

      {/* MODAL TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#0b0e2d] border-blue-900 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg sm:text-xl tracking-wide uppercase">
                {editingId ? 'Edit Game' : `Tambah Game ${gameType.toUpperCase()}`}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 hover:text-white flex items-center justify-center font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nama Game</label>
                <input
                  type="text"
                  placeholder="Contoh: Premier League / Live Match"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition ${darkMode ? 'bg-[#06081d] border-blue-900/60 text-white' : 'bg-gray-50 border-gray-200 text-black'}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">URL Gambar / Banner</label>
                <input
                  type="text"
                  placeholder="https://link-gambar.com/banner.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition ${darkMode ? 'bg-[#06081d] border-blue-900/60 text-white' : 'bg-gray-50 border-gray-200 text-black'}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tipe Kategori</label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition ${darkMode ? 'bg-[#06081d] border-blue-900/60 text-white' : 'bg-gray-50 border-gray-200 text-black'}`}
                >
                  <option value="populer">Game Terpopuler</option>
                  <option value="reguler">Game Reguler</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm tracking-wider transition border ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl text-sm tracking-wider shadow-lg shadow-blue-600/30 transition"
                >
                  SIMPAN
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}