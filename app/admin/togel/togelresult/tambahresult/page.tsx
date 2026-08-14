'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function TambahTogelResultPage() {
  const [pasaran, setPasaran] = useState('');
  const [resultPrize, setResultPrize] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pasaran || !resultPrize || !tanggal) {
      alert('Semua field harus diisi!');
      return;
    }

    setLoading(true);
    
    // Diubah target tabelnya ke 'togel_results'
    const { error } = await supabase
      .from('togel_results') 
      .insert([
        { 
          pasaran: pasaran,       // Sesuai nama kolom di tabel
          result: resultPrize,    // Sesuai nama kolom di tabel
          tanggal: tanggal        // Sesuai nama kolom di tabel
        }
      ]);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
    } else {
      alert('Berhasil menyimpan result!');
      // Reset form
      setPasaran('');
      setResultPrize('');
      setTanggal('');
    }
  };

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col justify-between">
      
      {/* KONTEN UTAMA */}
      <div className="space-y-6">
        
        {/* HEADER TITLE */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tambah Togel Result</h1>
          <p className="text-sm text-blue-600 dark:text-blue-400">Dashboard / Togel Result / Tambah Togel Result</p>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 text-xs tracking-wider flex items-center gap-2">
                <svg className="svg-inline--fa fa-table me-1 w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM224 256V160H64V256H224zM64 320V416H224V320H64zM288 416H448V320H288V416zM448 256V160H288V256H448z"></path>
    </svg> Tambah Togel Result
          </div>
            
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* Input Pasaran */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-300 block">Pasaran</label>
              <select
                value={pasaran}
                onChange={(e) => setPasaran(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900"
              >
                <option value="">Pilih</option>
                <option value="SYDNEY POOLS">SYDNEY POOLS</option>
                <option value="HONGKONG POOLS">HONGKONG POOLS</option>
                <option value="SINGAPORE POOLS">SINGAPORE POOLS</option>
                <option value="NEW HAMPSHIRE POOLS EVENING">NEW HAMPSHIRE POOLS EVENING</option>
                <option value="WISCONSIN POOLS MIDDAY">WISCONSIN POOLS MIDDAY</option>
              </select>
            </div>

            {/* Input Result Prize */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-300 block">Result Prize</label>
              <input
                type="text"
                value={resultPrize}
                onChange={(e) => setResultPrize(e.target.value)}
                placeholder="Masukkan hasil nomor..."
                className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900"
              />
            </div>

            {/* Input Tanggal */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-300 block">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded text-sm font-medium transition shadow-sm cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 py-1.5 rounded text-sm font-medium transition shadow-sm cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1.5 rounded text-sm font-medium transition shadow-sm cursor-pointer"
              >
                Kalkulasi
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-10">
        Copyright &copy; OneLiveGaming 2026
      </footer>

    </div>
  );
}