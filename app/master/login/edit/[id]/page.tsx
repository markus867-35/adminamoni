'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTemplateDetail();
    }
  }, [id]);

  const fetchTemplateDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('login_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert('Gagal mengambil data template: ' + error.message);
        router.push('/admin/login-templates');
      } else if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setCode(data.code);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('login_templates')
        .update({
          title,
          description: description || 'Template login kustom OneLiveGaming',
          code,
        })
        .eq('id', id);

      if (error) {
        alert('Gagal mengupdate template: ' + error.message);
      } else {
        router.push('/master/login');
      }
    } catch (err) {
      console.error('Error saat menyimpan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs">
        Memuat data template...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-slate-800 pb-3 mb-3 gap-2 dark:text-white">Edit</h1>
      <main className="max-w-10xl mx-auto bg-white dark:bg-[#111720] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        
        {/* Header Form */}
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <h1 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="text-lg">✏️</span> Edit Template Login
          </h1>
          <button 
            type="button" 
            onClick={() => router.push('/master/login')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
          >
            Batalkan Edit
          </button>
        </div>

        {/* Form Utama */}
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nama Template</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi Singkat</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Kode / Konten (Akan dirender langsung di Live Preview)
            </label>
            <textarea 
              rows={18}
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-yellow-200 focus:outline-none focus:border-yellow-500 leading-relaxed resize-y"
              required
            />
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>

            <button 
              type="button" 
              onClick={() => router.push('/master/login')}
              className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}