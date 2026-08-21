'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLivePreviewPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setLinks(data || []);
    setLoading(false);
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput) return;
    setSubmitting(true);

    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(urlInput)}`);
      const result = await response.json();

      const title = result.data?.title || urlInput;
      const description = result.data?.description || '';
      const image = result.data?.image?.url || '';

      const { error } = await supabase.from('links').insert([
        {
          url: urlInput,
          title: title,
          description: description,
          image: image,
        },
      ]);

      if (!error) {
        setUrlInput('');
        fetchLinks();
      } else {
        alert('Gagal menyimpan: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memproses URL.');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Yakin ingin menghapus link ini?')) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) fetchLinks();
  }

  return (
    <div className="p-8 text-gray-100 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-white">Live Preview Tool (Wider Mobile Frame)</h1>
      <p className="text-sm text-gray-400 mb-6">Lebar bingkai ponsel diperlebar (520px x 720px) agar area tampilannya lebih leluasa.</p>
      
      {/* Form Input */}
      <form onSubmit={handleAddLink} className="flex gap-3 mb-10 max-w-2xl">
        <input 
          type="url"
          required
          className="flex-1 bg-[#111827] border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" 
          placeholder="Tempel URL di sini (contoh: https://google.com)..." 
          value={urlInput} 
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button 
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : 'Generate'}
        </button>
      </form>

      {/* Grid Card dengan Layar HP Lebih Lebar */}
      {loading ? (
        <p className="text-gray-400">Memuat data...</p>
      ) : links.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Belum ada link yang disimpan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {links.map((link) => (
            <div key={link.id} className="bg-transprant max-w-7xl border border-gray-800 rounded-5xl p-5 shadow-xl flex flex-col justify-between">
              
              {/* Bagian Atas: Informasi Tautan */}
              <div className="mb-4">
                <h3 className="font-semibold text-white text-base line-clamp-1 mb-1">{link.title}</h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline line-clamp-1 block">
                  🔗 {link.url}
                </a>
              </div>

              {/* Bagian Tengah: Mockup Layar HP Lebih Lebar (520px x 720px) */}
              <div className="flex justify-center mb-10 overflow-x-auto py-2">
                <div className="relative w-[560px] h-[900px] bg-black border-4 border-gray-700 rounded-[44px] p-3 shadow-inner flex flex-shrink-0 flex-col">
                  
                  {/* Speaker / Kamera Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-4 bg-gray-800 rounded-full z-20"></div>
                  
                  {/* Area Layar Iframe Lebih Lebar */}
                  <div className="w-full h-full bg-white rounded-[20  px] overflow-hidden mt-3 relative">
                    <iframe 
                      src={link.url} 
                      title={link.title}
                      className="w-full h-full border-0 pointer-events-auto"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian Bawah: Deskripsi & Tombol Hapus */}
              <div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                  {link.description || 'Tidak ada deskripsi tersedia.'}
                </p>
                <div className="flex justify-end border-t border-gray-800/80 pt-3">
                  <button 
                    onClick={() => deleteLink(link.id)}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-lg transition-all w-full text-center font-medium"
                  >
                    Hapus Link
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}