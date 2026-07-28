'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProviderGameDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const providerName = decodeURIComponent(params.provider || '').toUpperCase();
  const category = searchParams.get('category') || 'slot';

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [gameName, setGameName] = useState('');
  const [gameImage, setGameImage] = useState('');
  const [gameType, setGameType] = useState('populer');

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
  }, [providerName]);

  const fetchProviderGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('provider_games')
        .select('*')
        .ilike('provider', providerName)
        .eq('category', category)
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) setGames(data);
    } catch (error) {
      console.error('Gagal memuat game:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (type) => {
    setEditingId(null);
    setGameName('');
    setGameImage('');
    setGameType(type);
    setIsModalOpen(true);
  };

  const handleEdit = (game) => {
    setEditingId(game.id);
    setGameName(game.name);
    setGameImage(game.image_url);
    setGameType(game.type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus game ini?')) return;
    try {
      const { error } = await supabase.from('provider_games').delete().eq('id', id);
      if (error) throw error;
      fetchProviderGames();
    } catch (error) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameName || !gameImage) {
      alert('Nama Game dan URL Gambar wajib diisi!');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('provider_games')
          .update({ name: gameName, image_url: gameImage, type: gameType })
          .eq('id', editingId);
        if (error) throw error;
        alert('Game berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('provider_games')
          .insert([{ provider: providerName, category: category, name: gameName, image_url: gameImage, type: gameType }]);
        if (error) throw error;
        alert('Game baru berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchProviderGames();
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const popularGames = games.filter((g) => g.type === 'populer');
  const regularGames = games.filter((g) => g.type === 'reguler');

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-[#06081d] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => router.push('/admin/slot')}
        className="text-xs font-bold text-gray-400 hover:text-blue-400 transition mb-4 flex items-center gap-1"
      >
        ← KEMBALI
      </button>

      {/* HEADER UTAMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl">
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Manajemen Game</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-blue-500">
            {providerName} <span className="text-yellow-400">GAMES</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal('populer')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            🔥 TAMBAH POPULER
          </button>
          <button
            onClick={() => handleOpenAddModal('reguler')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            + TAMBAH REGULER
          </button>
        </div>
      </div>

      {/* SECTION 1: GAME TERPOPULER */}
      <div className="mb-10">
        <h2 className="text-sm font-extrabold text-yellow-400 uppercase tracking-wider mb-3">🔥 Game Terpopuler</h2>
        <div className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-[#0b0e2d] border-yellow-500/50' : 'bg-white border-yellow-400'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-500 text-black text-xs uppercase font-black tracking-wider">
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Gambar</th>
                  <th className="p-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? 'divide-yellow-500/20 text-white' : 'divide-gray-200 text-gray-900'}`}>
                {popularGames.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game terpopuler.</td></tr>
                ) : (
                  popularGames.map((game, index) => (
                    <tr key={game.id} className="hover:bg-amber-500/5 transition">
                      <td className="p-4 text-center font-bold text-amber-500">{index + 1}</td>
                      <td className="p-4 font-black tracking-wide">{game.name}</td>
                      <td className="p-4">
                        <div className="w-32 h-14 rounded-lg overflow-hidden border border-yellow-500/40 bg-black/40 shadow-inner flex items-center justify-center">
                          <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(game)} className="w-8 h-8 rounded-lg bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white flex items-center justify-center transition border border-orange-500/30">✏️</button>
                          <button onClick={() => handleDelete(game.id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition border border-red-500/30">🗑️</button>
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
        <h2 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider mb-3">🎮 Game Reguler</h2>
        <div className={`rounded-2xl border overflow-hidden shadow-xl ${darkMode ? 'bg-[#0b0e2d] border-blue-900' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase font-extrabold tracking-wider ${darkMode ? 'bg-[#080b22] text-gray-300 border-b border-blue-900' : 'bg-gray-800 text-white'}`}>
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Gambar</th>
                  <th className="p-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? 'divide-blue-900/40 text-white' : 'divide-gray-200 text-gray-900'}`}>
                {regularGames.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-gray-400">Belum ada game reguler.</td></tr>
                ) : (
                  regularGames.map((game, index) => (
                    <tr key={game.id} className={`transition ${darkMode ? 'hover:bg-blue-500/5' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                      <td className="p-4 font-black tracking-wide">{game.name}</td>
                      <td className="p-4">
                        <div className="w-32 h-14 rounded-lg overflow-hidden border border-blue-400/30 bg-black/40 shadow-inner flex items-center justify-center">
                          <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(game)} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition border border-blue-500/30">✏️</button>
                          <button onClick={() => handleDelete(game.id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition border border-red-500/30">🗑️</button>
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

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-[#0b0e2d] border-blue-900 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-blue-500/20">
              <h3 className="font-extrabold text-lg text-yellow-400">
                {editingId ? '✏️ Edit Game' : `➕ Tambah Game ${gameType.toUpperCase()}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Game</label>
                <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none ${darkMode ? 'bg-[#06081d] border-blue-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">URL Gambar Banner Game</label>
                <input type="text" value={gameImage} onChange={(e) => setGameImage(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none ${darkMode ? 'bg-[#06081d] border-blue-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`} required />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-2.5 rounded-xl text-sm transition">Simpan</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}