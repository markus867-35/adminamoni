'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminCodeStorage() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [folderQueries, setFolderQueries] = useState<Record<string, string>>({});

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFilePath, setSelectedFilePath] = useState<string>(''); 
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false); 

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const { data } = await supabase.from('code_files').select('*').order('created_at', { ascending: false });
    if (data) setFiles(data);
  }

async function handleUpload() {
  if (selectedFiles.length === 0) return;
  setUploading(true);

  let successCount = 0;
  let failCount = 0;

  for (const file of selectedFiles) {
    // @ts-ignore
    const relativePath = file.webkitRelativePath || file.name;
    const sanitizedPath = relativePath.replace(/[^a-zA-Z0-9_./-]/g, '_');
    const storagePath = `${Date.now()}-${sanitizedPath}`;

    const { error: storageError } = await supabase.storage
      .from('codes')
      .upload(storagePath, file);

    if (!storageError) {
      const { error: dbError } = await supabase.from('code_files').insert([
        { name: relativePath, path: storagePath }
      ]);
      
      if (!dbError) {
        successCount++;
      } else {
        failCount++;
      }
    } else {
      failCount++;
    }
  }

  setUploading(false);
  setSelectedFiles([]);
  fetchFiles();

  // Menampilkan SweetAlert berdasarkan hasil unggahan
  Swal.fire({
    icon: failCount === 0 ? 'success' : 'warning',
    title: failCount === 0 ? 'Berhasil!' : 'Selesai dengan catatan',
    text: `Folder dan seluruh file berhasil diunggah! (${successCount} berhasil${failCount > 0 ? `, ${failCount} gagal` : ''})`,
    confirmButtonColor: '#4f46e5',
  });
}

  async function openFile(url: string, name: string, path: string) {
    setSelectedFileName(name);
    setSelectedFilePath(path); 
    setLoadingContent(true);
    setIsEditorOpen(true);
    try {
      const freshUrl = `${url}?t=${new Date().getTime()}`;
      const response = await fetch(freshUrl, { cache: 'no-store' });
      const text = await response.text();
      setSelectedCode(text);
    } catch (error) {
      setSelectedCode('Gagal memuat isi file.');
    } finally {
      setLoadingContent(false);
    }
  }

  async function handleSaveEdit() {
    if (!selectedFilePath || selectedCode === null) return;
    setSavingEdit(true);

    const blob = new Blob([selectedCode], { type: 'text/plain;charset=utf-8' });

    const { error } = await supabase.storage
      .from('codes')
      .upload(selectedFilePath, blob, { 
        upsert: true,
        contentType: 'text/plain;charset=utf-8'
      });

    setSavingEdit(false);

    if (error) {
      alert('Gagal menyimpan perubahan: ' + error.message);
    } else {
      alert('Perubahan berhasil disimpan!');
      setIsEditorOpen(false);
      fetchFiles();
    }
  }

  function getFileIcon(name: string) {
    if (name.endsWith('.js')) {
      return '📜';
    } else if (name.endsWith('.html')) {
      return '🌐';
    } else if (name.endsWith('.json')) {
      return '📦';
    } else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      return '🖼️';
    } else if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      return '⚛️';
    }
    return '📄';
  }

  async function handleDelete(id: string, path: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Apakah kamu yakin ingin menghapus file ini?')) return;

    await supabase.storage.from('codes').remove([path]);
    const { error } = await supabase.from('code_files').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus file: ' + error.message);
    } else {
      fetchFiles();
    }
  }

  // Fungsi baru untuk menghapus seluruh folder dan file di dalamnya
  async function handleDeleteFolder(folderName: string, folderFiles: any[], e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Apakah kamu yakin ingin menghapus seluruh folder "${folderName}" beserta ${folderFiles.length} file di dalamnya?`)) return;

    const pathsToRemove = folderFiles.map(f => f.path);
    const idsToRemove = folderFiles.map(f => f.id);

    // Hapus dari Storage Supabase
    await supabase.storage.from('codes').remove(pathsToRemove);

    // Hapus dari Database Supabase
    const { error } = await supabase.from('code_files').delete().in('id', idsToRemove);

    if (error) {
      alert('Gagal menghapus folder: ' + error.message);
    } else {
      fetchFiles();
    }
  }

  const handleFolderSearch = (folderName: string, query: string) => {
    setFolderQueries(prev => ({ ...prev, [folderName]: query }));
  };

  const filteredFiles = files.filter((file) => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const parts = file.name.split('/');
    if (parts.length > 1) {
      const folderName = parts[0];
      if (!acc[folderName]) acc[folderName] = [];
      acc[folderName].push(file);
    } else {
      if (!acc['File Satuan']) acc['File Satuan'] = [];
      acc['File Satuan'].push(file);
    }
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-2xl font-bold mb-6">Code Repository & Manager</h1>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-xl mb-4 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <input 
          type="file" 
          // @ts-ignore
          webkitdirectory="" 
          directory=""
          multiple 
          onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} 
          className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 flex-1"
        />
        <button 
          onClick={handleUpload} 
          disabled={uploading || selectedFiles.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium w-full md:w-auto disabled:opacity-50 transition-all"
        >
          {uploading ? 'Mengunggah Folder...' : `Simpan Folder (${selectedFiles.length} file)`}
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari nama file atau folder secara global..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">DAFTAR FOLDER & FILE TERSIMPAN</h2>
        
        {Object.keys(groupedFiles).length === 0 ? (
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-8 rounded-xl text-center text-gray-400">
            {searchQuery ? 'Tidak ada file atau folder yang cocok dengan pencarian.' : 'Belum ada file atau folder kode yang diunggah.'}
          </div>
) : (
  Object.entries(groupedFiles).map(([folderName, filesList]) => {
    const folderFiles = filesList as any[]; // Deklarasikan di sini
    const folderQuery = folderQueries[folderName] || '';
    const filteredFolderFiles = folderFiles.filter((f: any) =>
      f.name.toLowerCase().includes(folderQuery.toLowerCase())
    );
    return (
      <div 
        key={folderName}
        className="bg-gray-50/50 dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4"
      >
        {/* Header Folder & Menu Titik Tiga Folder */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800/60 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">📁</span>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {folderName} <span className="text-xs text-gray-400 font-normal">({filteredFolderFiles.length} dari {folderFiles.length} file)</span>
            </h3>

            {/* Titik Tiga untuk Hapus Folder */}
            <div className="relative group/folderMenu inline-block">
              <button 
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent hover:bg-gray-200/60 dark:hover:bg-gray-800 p-1 rounded-md text-xs w-6 h-6 flex items-center justify-center transition-colors"
              >
                ⋮
              </button>
              <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover/folderMenu:block text-left z-20">
                <button 
                  onClick={(e) => handleDeleteFolder(folderName, folderFiles, e)}
                  className="w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white"
                >
                  🗑️ Hapus Folder
                </button>
              </div>
            </div>
          </div>

                  <input
                    type="text"
                    placeholder={`Cari file di dalam ${folderName}...`}
                    value={folderQuery}
                    onChange={(e) => handleFolderSearch(folderName, e.target.value)}
                    className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors"
                  />
                </div>

                {filteredFolderFiles.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400">
                    Tidak ada file yang cocok dengan pencarian di folder ini.
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {filteredFolderFiles.map((f) => {
                      const fileUrl = supabase.storage.from('codes').getPublicUrl(f.path).data.publicUrl;
                      const displayName = f.name.includes('/') ? f.name.split('/').slice(1).join('/') : f.name;

                      return (
                        <div 
                          key={f.id} 
                          onClick={() => openFile(fileUrl, f.name, f.path)}
                          className="group relative bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800/80 hover:border-indigo-500/50 p-5 rounded-xl flex flex-col items-center text-center transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
                        >
                          <div className="absolute top-2 right-2 z-10">
                            <div className="relative group/menu">
                              <button 
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md text-xs w-6 h-6 flex items-center justify-center transition-colors"
                              >
                                ⋮
                              </button>
                              
                              <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover/menu:block text-left">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFile(fileUrl, f.name, f.path);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white"
                                >
                                  ✏️ Edit / Lihat
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(f.id, f.path, e)}
                                  className="w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                  🗑️ Hapus
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="text-3xl mb-3 mt-2 group-hover:scale-110 transition-transform">
                            {getFileIcon(f.name)}
                          </div>

                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium line-clamp-1 w-full mb-1" title={displayName}>
                            {displayName}
                          </span>

                          <span className="mt-auto text-[11px] text-indigo-600 dark:text-indigo-400 group-hover:underline">
                            Klik untuk lihat
                          </span>
                        </div> 
                      );
                    })}
                  </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 w-full max-w-4xl h-[80vh] rounded-2xl flex flex-col p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                  <span>{getFileIcon(selectedFileName)}</span> {selectedFileName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pratinjau dan edit kode sumber</p>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs transition-all"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden relative flex">
              {loadingContent ? (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                  Memuat isi file...
                </div>
              ) : (
                <textarea 
                  value={selectedCode || ''}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full h-full bg-transparent text-gray-800 dark:text-green-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedCode || '');
                  alert('Kode berhasil disalin ke clipboard!');
                }}
                className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-4 py-2 rounded-lg font-medium transition-all"
              >
                Salin Kode
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}