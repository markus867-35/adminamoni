'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LoginTemplate {
  id: string | number;
  title: string;
  description: string;
  code: string;
}

export default function AdminLoginTemplatesPage() {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [templates, setTemplates] = useState<LoginTemplate[]>([]);
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: 'preview' | 'code' }>({});
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // State untuk mode Edit
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // State untuk deteksi apakah halaman sedang mode dark atau light
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchTemplates();

    // Deteksi awal apakah root memiliki class 'dark'
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    // Observer untuk mendeteksi perubahan kelas 'dark' secara real-time pada dokumen
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('login_templates')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Gagal mengambil data:', error.message);
      } else if (data) {
        setTemplates(data);
        const tabs: { [key: string]: 'preview' | 'code' } = {};
        data.forEach((item) => {
          tabs[item.id] = 'preview';
        });
        setActiveTabs(tabs);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Fungsi Tambah / Update (Edit) Template
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    setLoading(true);

    try {
      if (editingId !== null) {
        // --- PROSES EDIT / UPDATE ---
        const { error } = await supabase
          .from('login_templates')
          .update({
            title: newTitle,
            description: newDesc || 'Template login kustom OneLiveGaming',
            code: newCode,
          })
          .eq('id', editingId);

        if (error) {
          alert('Gagal mengupdate template: ' + error.message);
        } else {
          setTemplates(
            templates.map((item) =>
              item.id === editingId
                ? { ...item, title: newTitle, description: newDesc, code: newCode }
                : item
            )
          );
          resetForm();
        }
      } else {
        // --- PROSES TAMBAH BARU ---
        const newItemData = {
          title: newTitle,
          description: newDesc || 'Template login kustom OneLiveGaming',
          code: newCode,
        };

        const { data, error } = await supabase
          .from('login_templates')
          .insert([newItemData])
          .select();

        if (error) {
          alert('Gagal menyimpan ke Supabase: ' + error.message);
        } else if (data && data.length > 0) {
          setTemplates([data[0], ...templates]);
          setActiveTabs({ ...activeTabs, [data[0].id]: 'preview' });
          resetForm();
        }
      }
    } catch (err) {
      console.error('Error saat menyimpan:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Hapus (Delete)
  const handleDelete = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return;

    try {
      const { error } = await supabase
        .from('login_templates')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus: ' + error.message);
      } else {
        setTemplates(templates.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error saat menghapus:', err);
    }
  };

  // Fungsi Masuk ke Mode Edit
  const handleEditClick = (item: LoginTemplate) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewDesc(item.description);
    setNewCode(item.code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi Reset Form
  const resetForm = () => {
    setEditingId(null);
    setNewTitle('');
    setNewDesc('');
    setNewCode('');
  };

  // Fungsi Download File HTML
  const handleDownload = (item: LoginTemplate) => {
    const fullHtml = `<!DOCTYPE html>
<html class="${isDarkMode ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <title>${item.title}</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    :root { --background: #f4f6f9; --foreground: #171717; }
    .dark { --background: #0b0f19; --foreground: #f1f5f9; }
    body { background: var(--background); color: var(--foreground); margin: 0; padding: 16px; font-family: Arial, Helvetica, sans-serif; }
  </style>
</head>
<body>
  ${item.code}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (id: string | number, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTab = (id: string | number, tab: 'preview' | 'code') => {
    setActiveTabs({ ...activeTabs, [id]: tab });
  };

  return (
    // Menggunakan variabel global CSS untuk background dan text utama halaman
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 transition-colors duration-300">
      
      <header className="max-w-8xl mx-auto mb-8 border-b border-slate-300 dark:border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <span className="bg-yellow-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs tracking-wider">OLG ADMIN</span>
          <h1 className="text-2xl font-bold tracking-wide mt-2">Login Template Manager</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        
        {/* FORM INPUT / EDIT - Warna background menyesuaikan mode terang/gelap */}
        <section className="bg-white dark:bg-[#111720] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {editingId !== null ? '✏️ Edit Template Login' : '➕ Tambah / Input Template Login Baru'}
            </h2>
            {editingId !== null && (
              <button 
                type="button" 
                onClick={resetForm}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
              >
                Batalkan Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Template</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: OneLiveGaming Neon Gold Login" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Deskripsi Singkat</label>
                <input 
                  type="text" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Contoh: Menggunakan tema warna gelap dan aksen emas." 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Kode / Konten (Akan dirender langsung di Live Preview)</label>
              <textarea 
                rows={6}
                value={newCode} 
                onChange={(e) => setNewCode(e.target.value)}
                placeholder='Masukkan kode HTML atau teks di sini...' 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-yellow-200 focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : editingId !== null ? 'Simpan Perubahan' : 'Simpan & Tampilkan Template'}
              </button>

              {editingId !== null && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>


        {/* DAFTAR TEMPLATE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide">📋 Daftar Template Login Tersimpan</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Total: {templates.length} Template</span>
          </div>

          {templates.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">Belum ada template tersimpan di database.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((item) => {
                const currentTab = activeTabs[item.id] || 'preview';

                return (
                  <div key={item.id} className="bg-white dark:bg-[#111720] scrollbar-transparent border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-colors duration-300">
                    
                    {/* Header Kartu & Tombol Aksi */}
                    <div className="bg-slate-100 dark:bg-[#161f2c] px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 transition-colors duration-300">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                        </div>

                        {/* TOMBOL AKSI: EDIT, DOWNLOAD, HAPUS */}
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleEditClick(item)}
                            title="Edit Template"
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-lg text-xs transition cursor-pointer border border-blue-500/30"
                          >
                            ✏️
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDownload(item)}
                            title="Download File HTML"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-lg text-xs transition cursor-pointer border border-emerald-500/30"
                          >
                            📥
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Hapus Template"
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg text-xs transition cursor-pointer border border-red-500/30"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                          <button 
                            type="button"
                            onClick={() => toggleTab(item.id, 'preview')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${currentTab === 'preview' ? 'bg-yellow-500 text-slate-950' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                          >
                            Live Preview
                          </button>
                          <button 
                            type="button"
                            onClick={() => toggleTab(item.id, 'code')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${currentTab === 'code' ? 'bg-yellow-500 text-slate-950' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                          >
                            Source Code
                          </button>
                        </div>

                        {currentTab === 'code' && (
                          <button 
                            type="button"
                            onClick={() => handleCopy(item.id, item.code)}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-yellow-400 font-bold rounded-lg text-[11px] transition cursor-pointer border border-slate-300 dark:border-slate-700"
                          >
                            {copiedId === item.id ? '✓ Copied!' : '📋 Copy'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preview atau Source Code dengan tinggi 750px */}
                    <div className="p-4 bg-slate-50 dark:bg-[#0d1117] flex-1 transition-colors duration-300">
                      {currentTab === 'preview' ? (
  <div className={`w-full h-[750px] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative ${isDarkMode ? 'bg-[#0b0f19]' : 'bg-white'}`}>
    <iframe 
      srcDoc={`<!DOCTYPE html>
      <html class="${isDarkMode ? 'dark' : ''}">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
          :root { --background: #f4f6f9; --foreground: #171717; }
          .dark { --background: #0b0f19; --foreground: #f1f5f9; }
          body { background: var(--background); color: var(--foreground); margin: 0; padding: 16px; font-family: Arial, Helvetica, sans-serif; }
        </style>
      </head>
      <body style="background: ${isDarkMode ? '#0b0f19' : '#ffffff'}; color: ${isDarkMode ? '#f1f5f9' : '#171717'};">
        ${item.code}
      </body>
      </html>`}
      title={item.title}
      className="w-full h-full border-0"
      sandbox="allow-scripts"
    />
  </div>
) : (
  /* Tambahkan custom scrollbar styling di sini */
  <div className="bg-slate-900 dark:bg-[#161f2c] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 h-[750px] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
    <pre className="text-[11px] font-mono text-yellow-600 dark:text-yellow-200/90 leading-relaxed">
      <code>{item.code}</code>
    </pre>
  </div>
)}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}