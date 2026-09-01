'use client';
import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminNotepad() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // State untuk Pop-up Modal Lihat
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Swal.fire('Error', 'Gagal memuat catatan: ' + error.message, 'error');
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire('Peringatan', 'Judul dan isi catatan tidak boleh kosong!', 'warning');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', editingId);

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Catatan berhasil diperbarui.',
          timer: 1500,
          showConfirmButton: false,
        });
        resetForm();
        fetchNotes();
      }
    } else {
      const { error } = await supabase
        .from('notes')
        .insert([{ title, content }]);

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Catatan baru berhasil ditambahkan.',
          timer: 1500,
          showConfirmButton: false,
        });
        resetForm();
        fetchNotes();
      }
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Catatan yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Catatan telah dihapus.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchNotes();
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  // Fungsi untuk mendeteksi kode HEX dan merender kotak warna di sampingnya
  const renderContentWithColors = (text: string) => {
    const hexRegex = /(#[0-9A-Fa-f]{3,6}\b)/g;
    const parts = text.split(hexRegex);

    return parts.map((part, index) => {
      if (hexRegex.test(part)) {
        return (
          <span key={index} className="inline-flex items-center gap-1.5 align-middle mx-0.5 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <span
              className="w-3.5 h-3.5 rounded-sm inline-block shadow-sm shrink-0 border border-black/10 dark:border-white/10"
              style={{ backgroundColor: part }}
            />
            <span className="font-mono text-xs font-semibold">{part}</span>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-6 transition-colors duration-300 relative">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Notepad</h1>
          <p className="text-gray-500 dark:text-gray-400">Kelola catatan, ide, atau pengumuman penting di sini.</p>
        </div>

        {/* Layout Grid Full */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Form Section */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit transition-colors">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {editingId ? 'Edit Catatan' : 'Buat Catatan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Judul</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul catatan..."
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Konten / Isi</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi catatan (misal: #222d3d)..."
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 text-sm resize-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm shadow-sm"
                >
                  {editingId ? 'Perbarui' : 'Simpan'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-lg transition text-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Daftar Catatan</h2>
            
            {loading ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">Memuat catatan...</div>
            ) : notes.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl text-center border border-gray-100 dark:border-gray-800 text-gray-400 transition-colors">
                Belum ada catatan yang tersimpan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg line-clamp-1">{note.title}</h3>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                          {new Date(note.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap line-clamp-4 mb-4">
                        {renderContentWithColors(note.content)}
                      </div>
                    </div>

                    {/* Tombol Aksi: Edit, Lihat, Hapus */}
                    <div className="flex justify-end gap-1.5 pt-3 border-t border-gray-50 dark:border-gray-800">
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-medium transition"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg text-xs font-medium transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pop-up Modal Detail Catatan */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                {selectedNote.title}
              </h3>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                Dibuat pada:{' '}
                {new Date(selectedNote.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                {renderContentWithColors(selectedNote.content)}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
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