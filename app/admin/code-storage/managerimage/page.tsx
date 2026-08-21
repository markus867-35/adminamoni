'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminImageManager() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  const [folderQueries, setFolderQueries] = useState<Record<string, string>>({});

  // State untuk Modal Preview Gambar
  const [selectedImageBlobUrl, setSelectedImageBlobUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase.from('admin_images').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Gagal mengambil data dari database:", error.message);
    }
    if (data) setImages(data);
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
      const storagePath = `uploads/${Date.now()}-${sanitizedPath}`;

      // 1. Upload file ke Storage Bucket
      const { error: storageError } = await supabase.storage
        .from('images')
        .upload(storagePath, file);

      if (storageError) {
        console.error("Gagal upload ke storage:", storageError.message);
        failCount++;
        continue;
      }

      // 2. Insert record ke Tabel Database
      const { error: dbError } = await supabase.from('admin_images').insert([
        { name: relativePath, path: storagePath }
      ]);

      if (dbError) {
        console.error("Gagal insert ke tabel database:", dbError.message);
        failCount++;
      } else {
        successCount++;
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    fetchImages();

    if (failCount === 0) {
      Swal.fire('Berhasil!', `Semua file (${successCount}) berhasil diunggah dan disimpan ke database!`, 'success');
    } else {
      Swal.fire('Perhatian', `Berhasil: ${successCount}, Gagal: ${failCount}. Cek console browser (F12).`, 'warning');
    }
  }

  async function openImageModal(name: string, path: string) {
    setSelectedFileName(name);
    setLoadingContent(true);
    setIsEditorOpen(true);
    setSelectedImageBlobUrl(null);

    try {
      const { data, error } = await supabase.storage.from('images').download(path);
      if (error || !data) throw error;

      const imageUrl = URL.createObjectURL(data);
      setSelectedImageBlobUrl(imageUrl);
    } catch (error) {
      Swal.fire('Gagal', 'Gagal memuat gambar dari storage.', 'error');
    } finally {
      setLoadingContent(false);
    }
  }

  async function handleDelete(id: string, path: string, e: React.MouseEvent) {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: 'Gambar ini akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    await supabase.storage.from('images').remove([path]);
    const { error } = await supabase.from('admin_images').delete().eq('id', id);

    if (error) {
      Swal.fire('Gagal', 'Gagal menghapus gambar: ' + error.message, 'error');
    } else {
      fetchImages();
      Swal.fire('Terhapus!', 'Gambar berhasil dihapus.', 'success');
    }
  }

  async function handleDeleteFolder(folderName: string, folderFiles: any[], e: React.MouseEvent) {
    e.stopPropagation();
    const result = await Swal.fire({
      title: `Hapus Folder "${folderName}"?`,
      text: `Semua gambar (${folderFiles.length} file) di dalam folder ini akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Folder!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      const filePaths = folderFiles.map((f) => f.path);
      const fileIds = folderFiles.map((f) => f.id);

      if (filePaths.length > 0) {
        await supabase.storage.from('images').remove(filePaths);
      }

      for (const id of fileIds) {
        await supabase.from('admin_images').delete().eq('id', id);
      }

      fetchImages();
      Swal.fire('Terhapus!', `Folder ${folderName} beserta isinya berhasil dihapus.`, 'success');
    } catch (err: any) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus folder: ' + err.message, 'error');
    }
  }

  const handleFolderSearch = (folderName: string, query: string) => {
    setFolderQueries(prev => ({ ...prev, [folderName]: query }));
  };

  const filteredImages = images.filter((img) => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedImages = filteredImages.reduce((acc, img) => {
    const parts = img.name.split('/');
    if (parts.length > 1) {
      const folderName = parts[0];
      if (!acc[folderName]) acc[folderName] = [];
      acc[folderName].push(img);
    } else {
      if (!acc['File Satuan']) acc['File Satuan'] = [];
      acc['File Satuan'].push(img);
    }
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-2xl font-bold mb-6">Manajemen Gambar</h1>

      {/* Bagian Upload Folder */}
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

      {/* Bagian Search Bar Global */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari nama file gambar atau folder secara global..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
        />
      </div>

      {/* Bagian Daftar Folder & File Gambar */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DAFTAR FOLDER & GAMBAR TERSIMPAN</h2>
        
        {Object.keys(groupedImages).length === 0 ? (
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-8 rounded-xl text-center text-gray-400">
            {searchQuery ? 'Tidak ada gambar atau folder yang cocok dengan pencarian.' : 'Belum ada gambar atau folder yang diunggah ke database.'}
          </div>
        ) : (
          Object.entries(groupedImages).map(([folderName, filesList]) => {
            const folderFiles = filesList as any[];
            const folderQuery = folderQueries[folderName] || '';
            const filteredFolderFiles = folderFiles.filter((f: any) =>
              f.name.toLowerCase().includes(folderQuery.toLowerCase())
            );

            return (
              <div 
                key={folderName}
                className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm space-y-4"
              >
                {/* Header Folder & Menu Titik Tiga */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📁</span>
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {folderName} <span className="text-xs text-gray-400 font-normal">({filteredFolderFiles.length} dari {folderFiles.length} file)</span>
                    </h3>

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
                    placeholder={`Cari gambar di dalam ${folderName}...`}
                    value={folderQuery}
                    onChange={(e) => handleFolderSearch(folderName, e.target.value)}
                    className="bg-gray-50 dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors"
                  />
                </div>

                {filteredFolderFiles.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400">
                    Tidak ada gambar yang cocok dengan pencarian di folder ini.
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {filteredFolderFiles.map((f) => {
                        const displayName = f.name.includes('/') ? f.name.split('/').slice(1).join('/') : f.name;

                        return (
                          <div 
                            key={f.id} 
                            onClick={() => openImageModal(f.name, f.path)}
                            className="group relative bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 p-4 rounded-xl flex flex-col items-center text-center transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
                          >
                            <div className="absolute top-2 right-2 z-10">
                              <div className="relative group/menu">
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-gray-200/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded-md text-xs w-6 h-6 flex items-center justify-center transition-colors"
                                >
                                  ⋮
                                </button>
                                
                                <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover/menu:block text-left">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openImageModal(f.name, f.path);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white"
                                  >
                                    🖼️ Lihat
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

                            <div className="mb-2 w-full">
                              <BlobThumbnail path={f.path} name={f.name} />
                            </div>

                            <span className="text-xs text-gray-800 dark:text-gray-200 font-medium line-clamp-2 w-full mb-2 break-all" title={displayName}>
                              {displayName}
                            </span>

                            <span className="mt-auto text-[10px] text-indigo-600 dark:text-indigo-400 group-hover:underline">
                              Klik untuk perbesar
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

      {/* Modal / Pop-up Preview Gambar */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 w-full max-w-3xl h-[75vh] rounded-2xl flex flex-col p-6 shadow-2xl">
            
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                  <span>🖼️</span> {selectedFileName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pratinjau gambar via Blob</p>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs transition-all"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden relative flex items-center justify-center p-4">
              {loadingContent ? (
                <div className="text-gray-400 text-sm">Memuat gambar...</div>
              ) : selectedImageBlobUrl ? (
                <img src={selectedImageBlobUrl} alt={selectedFileName} className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
              ) : (
                <div className="text-red-400 text-sm">Gagal memuat gambar.</div>
              )}
            </div>

            <div className="flex justify-end items-center mt-4 pt-2">
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-5 py-2 rounded-lg font-medium transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function BlobThumbnail({ path, name }: { path: string; name: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadThumb() {
      const { data, error } = await supabase.storage.from('images').download(path);
      if (!error && data && isMounted) {
        const url = URL.createObjectURL(data);
        setBlobUrl(url);
      }
    }
    loadThumb();

    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [path]);

  if (blobUrl) {
    return (
      <div className="w-full h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <img src={blobUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-full h-28 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center text-xs text-gray-400">
      Memuat...
    </div>
  );
}