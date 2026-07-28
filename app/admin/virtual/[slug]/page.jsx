'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DetailProviderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const providerSlug = params?.slug || ''; // contoh: pragmatic
  const category = searchParams.get('category') || 'slot'; // contoh: slot

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('POPULER'); // 'POPULER' atau 'REGULER'
  const [editingId, setEditingId] = useState(null);
  const [gameName, setGameName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
      setDarkMode(isDark);
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    fetchProviderGames();
    return () => observer.disconnect();
  }, [providerSlug]);

  const fetchProviderGames = async () => {
    try {
      setLoading(true);
      // Asumsi tabel database bernama 'provider_sub_games' atau sesuaikan dengan tabel Anda
      const { data, error } = await supabase
        .from('provider_sub_games')
        .select('*')
        .ilike('provider', providerSlug)
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) setGames(data);
    } catch (error) {
      console.error('Gagal memuat sub-game:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pisahkan berdasarkan jenis game (Populer & Reguler)
  const popularGames = games.filter((g) => (g.type || 'POPULER').toUpperCase() === 'POPULER');
  const regularGames = games.filter((g) => (g.type || '').toUpperCase() === 'REGULER');

  const handleOpenModal = (type) => {
    setModalType(type);
    setEditingId(null);
    setGameName('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const handleEdit = (game, e) => {
    e.stopPropagation();
    setModalType(game.type || 'POPULER');
    setEditingId(game.id);
    setGameName(game.name);
    setImageUrl(game.image_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus game ini?')) return;
    try {
      const { error } = await supabase.from('provider_sub_games').delete().eq('id', id);
      if (error) throw error;
      fetchProviderGames();
    } catch (error) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameName || !imageUrl) {
      alert('Nama Game dan URL Gambar wajib diisi!');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('provider_sub_games')
          .update({ name: gameName, image_url: imageUrl, type: modalType, provider: providerSlug })
          .eq('id', editingId);
        if (error) throw error;
        alert('Game berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('provider_sub_games')
          .insert([{ name: gameName, image_url: imageUrl, type: modalType, provider: providerSlug, category }]);
        if (error) throw error;
        alert('Game berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchProviderGames();
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-[#06081d] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* TOMBOL KEMBALI */}
      <button 
        onClick={() => router.back()} 
        className="text-xs font-bold text-gray-400 hover:text-white mb-4 tracking-wider flex items-center gap-1 transition"
      >
        ← KEMBALI
      </button>

      {/* HEADER SECTION */}
      <div className={`p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">MANAJEMEN GAME</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-blue-500 uppercase">
            {providerSlug} <span className={darkMode ? 'text-white' : 'text-gray-800'}>GAMES</span>
          </h1>
        </div>

        {/* TOMBOL AKSI TAMBAH */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleOpenModal('POPULER')}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center gap-2"
          >
            🔥 TAMBAH POPULER
          </button>
          <button
            onClick={() => handleOpenModal('REGULER')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            + TAMBAH REGULER
          </button>
        </div>
      </div>

      {/* SECTION 1: GAME TERPOPULER */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔥</span>
          <h2 className="text-sm sm:text-base font-black tracking-wider uppercase">GAME TERPOPULER</h2>
        </div>

        <div className="rounded-2xl border border-amber-500/40 overflow-hidden shadow-2xl bg-[#0b0e2d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-500 text-black font-black text-xs uppercase tracking-wider">
                  <th className="p-4 w-16 text-center">NO</th>
                  <th className="p-4">NAMA</th>
                  <th className="p-4 w-40">GAMBAR</th>
                  <th className="p-4 text-center w-28">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/20 text-sm">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Memuat data...</td></tr>
                ) : popularGames.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game terpopuler.</td></tr>
                ) : (
                  popularGames.map((game, index) => (
                    <tr key={game.id} className="hover:bg-amber-500/5 transition">
                      <td className="p-4 text-center font-bold text-amber-400">{index + 1}</td>
                      <td className="p-4 font-black tracking-wide text-white">{game.name}</td>
                      <td className="p-4">
                        <div className="w-28 h-12 rounded-lg overflow-hidden border border-amber-500/30 bg-black/50 shadow-inner flex items-center justify-center">
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

      {/* SECTION 2: GAME REGULER */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎮</span>
          <h2 className="text-sm sm:text-base font-black tracking-wider uppercase">GAME REGULER</h2>
        </div>

        <div className={`rounded-2xl border overflow-hidden shadow-2xl ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase font-black tracking-wider ${darkMode ? 'bg-[#080b22] text-gray-300 border-b border-blue-900' : 'bg-gray-800 text-white'}`}>
                  <th className="p-4 w-16 text-center">NO</th>
                  <th className="p-4">NAMA</th>
                  <th className="p-4 w-40">GAMBAR</th>
                  <th className="p-4 text-center w-28">AKSI</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? 'divide-blue-900/40' : 'divide-gray-200'}`}>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Memuat data...</td></tr>
                ) : regularGames.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game reguler.</td></tr>
                ) : (
                  regularGames.map((game, index) => (
                    <tr key={game.id} className={`transition ${darkMode ? 'hover:bg-blue-500/5' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                      <td className="p-4 font-black tracking-wide">{game.name}</td>
                      <td className="p-4">
                        <div className="w-28 h-12 rounded-lg overflow-hidden border border-blue-400/30 bg-black/50 shadow-inner flex items-center justify-center">
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

      {/* MODAL FORM TAMBAH / EDIT GAME */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#0b0e2d] border-blue-900 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg sm:text-xl tracking-wide uppercase">
                {editingId ? 'EDIT GAME' : `TAMBAH GAME ${modalType}`}
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
                  NAMA GAME
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gates of Olympus"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition shadow-inner ${
                    darkMode 
                      ? 'bg-[#06081d] border-blue-900/60 text-white placeholder-gray-500 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-blue-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  TIPE GAME
                </label>
                <select
                  value={modalType}
                  onChange={(e) => setModalType(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm font-bold outline-none transition shadow-inner ${
                    darkMode 
                      ? 'bg-[#06081d] border-blue-900/60 text-white focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-black focus:border-blue-500'
                  }`}
                >
                  <option value="POPULER">POPULER</option>
                  <option value="REGULER">REGULER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  URL GAMBAR (BANNER)
                </label>
                <input
                  type="text"
                  placeholder="https://image-link.com/game.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full p-3.5 rounded-2xl border text-sm outline-none transition shadow-inner ${
                    darkMode 
                      ? 'bg-[#06081d] border-blue-900/60 text-white placeholder-gray-500 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-blue-500'
                  }`}
                  required
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm tracking-wider transition border ${
                    darkMode 
                      ? 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800' 
                      : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100'
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