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

  // Ambil data catatan saat komponen dimuat
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

  // Simpan atau Update Catatan
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire('Peringatan', 'Judul dan isi catatan tidak boleh kosong!', 'warning');
      return;
    }

    if (editingId) {
      // Proses Update
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
      // Proses Tambah Baru
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

  // Edit Catatan (pindahkan data ke form)
  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hapus Catatan
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

  // Reset Form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Notepad</h1>
          <p className="text-gray-500">Kelola catatan, ide, atau pengumuman penting di sini.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingId ? 'Edit Catatan' : 'Buat Catatan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Judul</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul catatan..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Konten / Isi</label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi catatan di sini..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm resize-none"
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
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition text-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Daftar Catatan</h2>
            
            {loading ? (
              <div className="text-center py-10 text-gray-500">Memuat catatan...</div>
            ) : notes.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center border border-gray-100 text-gray-400">
                Belum ada catatan yang tersimpan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{note.title}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {new Date(note.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-4 mb-4">
                        {note.content}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition"
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
    </div>
  );
}