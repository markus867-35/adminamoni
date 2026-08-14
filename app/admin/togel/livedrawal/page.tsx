'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AdminPage() {
  const router = useRouter();
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default mendeteksi apakah elemen html memiliki kelas 'dark'
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Memantau perubahan kelas 'dark' secara global di elemen <html> web Anda
  useEffect(() => {
    const checkTheme = () => {
      const rootDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(rootDark);
    };

    // Cek pertama kali saat load
    checkTheme();

    // Buat observer untuk mendeteksi perubahan atribut/kelas pada tag <html> secara real-time
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('id, name, live_draw_url, market_date')
        .order('name', { ascending: true });

      if (error) throw error;
      setMarkets(data || []);
    } catch (err: any) {
      console.error('Gagal memuat pasaran:', err.message);
      Swal.fire('Error', 'Gagal memuat data dari database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUrl = async (id: any, newUrl: string, marketName: string) => {
    try {
      const { error } = await supabase
        .from('markets')
        .update({ live_draw_url: newUrl })
        .eq('id', id);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `URL Live Draw untuk pasaran ${marketName} berhasil diperbarui.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error('Gagal memperbarui:', err.message);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan ke Supabase.', 'error');
    }
  };

  const filteredMarkets = markets.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#050b2e] text-white' : 'bg-[#f3f4f6] text-gray-900'} p-4 md:p-8 font-sans transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Admin */}
        <div className={`flex flex-col md:flex-row justify-between items-center ${isDarkMode ? 'bg-[#0b1354] border-blue-900 text-white' : 'bg-white border-gray-300 text-gray-900'} border p-4 rounded-xl shadow-lg gap-4 transition-colors duration-300`}>
          <div>
            <h1 className={`${isDarkMode ? 'text-amber-400' : 'text-blue-600'} font-black text-xl tracking-wider`}>Panel Admin - Live Draw URL</h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Kelola dan update tautan Live Draw pasaran togel secara langsung.</p>
          </div>
        </div>

        {/* Input Pencarian Pasaran */}
        <div className={`${isDarkMode ? 'bg-[#0b1354] border-blue-900' : 'bg-white border-gray-300'} border p-4 rounded-xl shadow-lg transition-colors duration-300`}>
          <input
            type="text"
            placeholder="Cari nama pasaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isDarkMode ? 'bg-[#050b2e] text-white placeholder-gray-400 border-blue-800' : 'bg-white text-black placeholder-gray-400 border-gray-300'} text-xs px-3 py-2.5 rounded outline-none shadow-inner border transition-colors duration-300`}
          />
        </div>

        {/* List Tabel / Kartu Pengaturan URL */}
        <div className={`${isDarkMode ? 'bg-[#0b1354] border-blue-900' : 'bg-white border-gray-300'} border rounded-xl p-4 shadow-lg transition-colors duration-300`}>
          {loading ? (
            <p className={`text-center text-xs ${isDarkMode ? 'text-amber-200' : 'text-gray-500'} py-8`}>Memuat data dari Supabase...</p>
          ) : filteredMarkets.length > 0 ? (
            <div className="space-y-4">
              {filteredMarkets.map((market) => (
                <div 
                  key={market.id} 
                  className={`${isDarkMode ? 'bg-[#080e3b] border-blue-800/60' : 'bg-gray-50 border-gray-200'} border p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-3 shadow transition-colors duration-300`}
                >
                  <div className="w-full md:w-1/3">
                    <h3 className={`${isDarkMode ? 'text-amber-400' : 'text-blue-700'} font-bold text-sm tracking-wider`}>{market.name}</h3>
                    <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tanggal: {market.market_date || '-'}</span>
                  </div>

                  {/* Input URL Live Draw */}
                  <div className="w-full md:w-2/3 flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={market.live_draw_url || ''}
                      placeholder="Masukkan URL Live Draw (https://...)"
                      id={`url-input-${market.id}`}
                      className={`w-full ${isDarkMode ? 'bg-[#050b2e] text-white placeholder-gray-500 border-blue-800' : 'bg-white text-black placeholder-gray-400 border-gray-300'} text-xs px-3 py-2 rounded outline-none shadow-inner border transition-colors duration-300`}
                    />
                    <button
                      onClick={() => {
                        const inputElement = document.getElementById(`url-input-${market.id}`) as HTMLInputElement;
                        if (inputElement) {
                          handleUpdateUrl(market.id, inputElement.value, market.name);
                        }
                      }}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-4 py-2 rounded text-xs shadow transition cursor-pointer whitespace-nowrap"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center text-xs ${isDarkMode ? 'text-amber-200' : 'text-gray-500'} py-8`}>Pasaran tidak ditemukan.</p>
          )}
        </div>

      </div>
    </div>
  );
}