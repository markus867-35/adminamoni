'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Save, ArrowLeft, Loader2, Table } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MemberChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (memberId) {
      fetchMemberDetail();
    }
  }, [memberId]);

  const fetchMemberDetail = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('username')
      .eq('id', memberId)
      .single();

    if (error) {
      Swal.fire('Gagal', 'Gagal memuat data member.', 'error');
      router.push('/member');
    } else if (data) {
      setUsername(data.username || '');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.trim() === '') {
      Swal.fire('Peringatan', 'Kata sandi baru tidak boleh kosong.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire('Peringatan', 'Kata sandi baru minimal harus 6 karakter.', 'warning');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('members')
      .update({ password: newPassword })
      .eq('id', memberId);

    setSubmitting(false);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire({
        title: 'Berhasil',
        text: 'Kata sandi member berhasil diperbarui!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      setNewPassword('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-10xl mx-auto w-full pb-2">
      <div>
        <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Ubah Kata Sandi</h1>
        <div className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 mt-0.5">
          <Link href="/admin" className="hover:underline">Dashboard</Link>
          <span className="text-slate-500">/</span>
          <Link href="/member" className="hover:underline">Member</Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-500 dark:text-slate-400">Ubah Kata Sandi</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-white">
          <Table className="w-4 h-4 text-slate-500" />
          <span>Ubah Kata Sandi {username ? `(${username})` : ''}</span>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
          <div className="max-w-xl">
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Kata Sandi Baru</label>
            <input 
              type="password"
              placeholder="Kata Sandi Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button 
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan</span>
              )}
            </button>

            <Link 
              href="/member" 
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded text-xs font-medium transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>Kembali</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}