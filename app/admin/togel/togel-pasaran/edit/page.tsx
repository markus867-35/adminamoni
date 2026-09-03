'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiGrid, FiSave, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function UbahPasaranPage() {
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState<'data' | 'max_bet' | 'hadiah'>('data');
  
  // Form State untuk Ubah Pasaran
  const [namaPasaran, setNamaPasaran] = useState('');
  const [prize, setPrize] = useState('1 Prize');
  const [hariTutup, setHariTutup] = useState('');
  const [jamTutup, setJamTutup] = useState('');
  const [jamBuka, setJamBuka] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('Aktif');
  const [urutan, setUrutan] = useState(0);
  const [currentLogo, setCurrentLogo] = useState('https://placehold.co/100x100?text=Logo');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPasaranDetail = async () => {
      if (!id) return;
      setFetching(true);
      try {
        // Contoh fetch dari Supabase berdasarkan ID
        // const { data, error } = await supabase.from('togel_pasaran').select('*').eq('id', id).single();
        // if (!error && data) {
        //   setNamaPasaran(data.nama);
        //   setPrize(data.prize);
        //   setHariTutup(data.hari_tutup);
        //   setJamTutup(data.waktu_tutup);
        //   setJamBuka(data.waktu_buka);
        //   setWebsite(data.website);
        //   setStatus(data.status);
        //   setUrutan(data.urutan);
        //   if (data.logo) setCurrentLogo(data.logo);
        // }

        // Data Mockup untuk preview
        setNamaPasaran('SYDNEY POOLS');
        setPrize('1 Prize');
        setHariTutup('');
        setJamTutup('13:20:00');
        setJamBuka('13:50:00');
        setWebsite('');
        setStatus('Aktif');
        setUrutan(1);
      } catch (error) {
        console.error('Gagal memuat detail pasaran:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchPasaranDetail();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Contoh update ke Supabase
      // const { error } = await supabase.from('togel_pasaran').update({
      //   nama: namaPasaran,
      //   prize,
      //   hari_tutup: hariTutup,
      //   waktu_tutup: jamTutup,
      //   waktu_buka: jamBuka,
      //   website,
      //   status,
      //   urutan,
      // }).eq('id', id);

      console.log('Memperbarui pasaran ID:', id);
    } catch (error) {
      console.error('Gagal memperbarui pasaran:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setCurrentLogo('');
  };

  if (fetching) {
    return (
      <div className="w-full px-4 py-12 text-center text-gray-400 italic text-sm">
        Memuat data ubah pasaran...
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Ubah Pasaran</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/togel-pasaran" className="text-blue-600 hover:underline">Togel Pasaran</Link>
          <span>/</span>
          <span>Ubah Pasaran</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Ubah Pasaran</span>
        </div>

        <div className="p-4 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`px-4 py-2 text-sm rounded border transition cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 border-blue-500 font-medium shadow-xs'
                  : 'bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100'
              }`}
            >
              Data Pasaran
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('max_bet')}
              className={`px-4 py-2 text-sm rounded border transition cursor-pointer ${
                activeTab === 'max_bet'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 border-blue-500 font-medium shadow-xs'
                  : 'bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100'
              }`}
            >
              Pengaturan Max Bet
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hadiah')}
              className={`px-4 py-2 text-sm rounded border transition cursor-pointer ${
                activeTab === 'hadiah'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 border-blue-500 font-medium shadow-xs'
                  : 'bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100'
              }`}
            >
              Pengaturan Hadiah
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'data' && (
            <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
              {/* Nama Pasaran */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Nama Pasaran</label>
                <input 
                  type="text" 
                  value={namaPasaran}
                  onChange={(e) => setNamaPasaran(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Prize */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Prize</label>
                <select
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="1 Prize">1 Prize</option>
                  <option value="2 Prize">2 Prize</option>
                  <option value="3 Prize">3 Prize</option>
                </select>
              </div>

              {/* Hari Tutup */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Hari Tutup</label>
                <input 
                  type="text" 
                  value={hariTutup}
                  onChange={(e) => setHariTutup(e.target.value)}
                  placeholder="Kosongkan jika buka setiap hari"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Jam Tutup & Jam Buka */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Jam Tutup</label>
                  <input 
                    type="time" 
                    value={jamTutup}
                    onChange={(e) => setJamTutup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Jam Buka</label>
                  <input 
                    type="time" 
                    value={jamBuka}
                    onChange={(e) => setJamBuka(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Website</label>
                <input 
                  type="text" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Urutan */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Urutan</label>
                <input 
                  type="number" 
                  value={urutan}
                  onChange={(e) => setUrutan(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 block">Logo</label>
                {currentLogo ? (
                  <div className="inline-flex flex-col items-center gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                    <img src={currentLogo} alt="Logo Pasaran" className="w-24 h-24 object-contain" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Hapus Gambar</span>
                    </button>
                  </div>
                ) : (
                  <input 
                    type="file" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
                >
                  <FiSave className="text-sm" />
                  <span>{loading ? 'Memperbarui...' : 'Simpan'}</span>
                </button>
                <Link 
                  href="/admin/togel/togel-pasaran"
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
                >
                  <FiArrowLeft className="text-sm" />
                  <span>Kembali</span>
                </Link>
              </div>
            </form>
          )}

          {activeTab === 'max_bet' && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
              Pengaturan Max Bet untuk pasaran ini...
            </div>
          )}

          {activeTab === 'hadiah' && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
              Pengaturan Hadiah untuk pasaran ini...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}