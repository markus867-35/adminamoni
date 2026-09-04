'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserPlus, Trash2, ArrowLeft, RefreshCw, Settings } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMasterPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchAdmins();

    // Auto refresh data setiap 10 detik agar status online/offline di tabel ikut memperbarui diri secara real-time
    const interval = setInterval(() => {
      fetchAdmins();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAdmins = async () => {
    const { data, error } = await supabase.from('admins').select('*').order('id', { ascending: true });
    if (error) {
      console.error('Gagal mengambil data admin:', error.message);
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      Swal.fire('Peringatan', 'Semua kolom harus diisi!', 'warning');
      return;
    }

    const { error } = await supabase.from('admins').insert([
      { username: newUsername, email: newEmail, password: newPassword }
    ]);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire('Berhasil', 'Admin baru berhasil ditambahkan.', 'success');
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      fetchAdmins();
    }
  };

  const handleDeleteAdmin = async (id: string, username: string) => {
    const result = await Swal.fire({
      title: `Hapus admin ${username}?`,
      text: 'Akses login admin ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) {
        Swal.fire('Gagal', error.message, 'error');
      } else {
        Swal.fire('Terhapus!', 'Admin berhasil dihapus.', 'success');
        fetchAdmins();
      }
    }
  };

const handleSettingsAdmin = (adm: any) => {
    router.push(`/master/operator/setting/${adm.id}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Admin Master</h1>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
              <span>/</span>
              <span>Admin Master</span>
            </div>
          </div>

          <Link 
            href="/admin" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Daftar Akun Admin Master</span>
              </div>
              <button 
                onClick={fetchAdmins} 
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                    <th className="px-4 py-3 font-medium text-center border-r border-slate-200 dark:border-slate-800 w-12">No</th>
                    <th className="px-4 py-3 font-medium border-r border-slate-200 dark:border-slate-800">Nama Admin</th>
                    <th className="px-4 py-3 font-medium border-r border-slate-200 dark:border-slate-800">Email</th>
                    <th className="px-4 py-3 font-medium border-r border-slate-200 dark:border-slate-800">Status & Waktu Aktif</th>
                    <th className="px-4 py-3 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-200">
                  {loading && admins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-500">Memuat data admin...</td>
                    </tr>
                  ) : admins.length > 0 ? (
                    admins.map((adm, index) => {
                      const isOnline = adm.last_seen && (new Date().getTime() - new Date(adm.last_seen).getTime() < 60000);

                      return (
                        <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400 align-middle border-r border-slate-200 dark:border-slate-800">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 font-medium align-middle border-r border-slate-200 dark:border-slate-800">
                            <div className="flex items-center space-x-3">
                              <div 
                                onClick={() => {
                                  Swal.fire({
                                    title: `<span style="font-size: 16px;">${adm.username}</span>`,
                                    html: `
                                      <div style="display: flex; justify-content: center; align-items: center;">
                                        <img 
                                          src="${adm.avatar_url || 'https://via.placeholder.com/150'}" 
                                          alt="${adm.username}" 
                                          style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; border: 4px solid #cbd5e1;" 
                                        />
                                      </div>
                                      <p style="margin-top: 15px; font-size: 13px; color: #64748b;">Email: ${adm.email || '-'}</p>
                                    `,
                                    showCloseButton: true,
                                    showConfirmButton: false,
                                    width: '350px',
                                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e293b',
                                  });
                                }}
                                className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600 cursor-pointer hover:opacity-80 transition hover:ring-2 hover:ring-blue-500"
                                title="Klik untuk melihat foto profil"
                              >
                                {adm.avatar_url ? (
                                  <img 
                                    src={adm.avatar_url} 
                                    alt={adm.username} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                                    {adm.username ? adm.username.charAt(0) : 'A'}
                                  </span>
                                )}
                              </div>
                              
                              <span>{adm.username || '-'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 align-middle border-r border-slate-200 dark:border-slate-800">{adm.email || '-'}</td>
                          
                          <td className="px-4 py-3 align-middle border-r border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col justify-center">
                              {isOnline ? (
                                <div className="flex items-center space-x-2">
                                  <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 w-fit">
                                      Online
                                    </span>
                                    <span className="text-[11px] text-slate-400 mt-0.5">Aktif sekarang</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 w-fit">
                                      Offline
                                    </span>
                                    <span className="text-[11px] text-slate-400 mt-0.5">
                                      {adm.last_seen 
                                        ? `Terakhir: ${new Date(adm.last_seen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` 
                                        : 'Belum pernah aktif'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-center align-middle">
                            <div className="flex items-center justify-center space-x-1.5">
                              {/* Tombol Setting */}
                              <button 
                                onClick={() => handleSettingsAdmin(adm)}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition cursor-pointer inline-flex items-center justify-center"
                                title="Setting Admin"
                              >
                                <Settings className="w-4 h-4" />
                              </button>

                              {/* Tombol Hapus */}
                              <button 
                                onClick={() => handleDeleteAdmin(adm.id, adm.username)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition cursor-pointer inline-flex items-center justify-center"
                                title="Hapus Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-500">Tidak ada data admin ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm h-fit">
            <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
              <UserPlus className="w-4 h-4 text-blue-500" />
              <span>Tambah Admin Baru</span>
            </div>
            
            <form onSubmit={handleAddAdmin} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Username / Nama</label>
                <input 
                  type="text"
                  placeholder="Masukkan nama admin"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <input 
                  type="email"
                  placeholder="admin@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Password</label>
                <input 
                  type="password"
                  placeholder="Password akun"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Simpan Admin Baru</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </div>
  );
}