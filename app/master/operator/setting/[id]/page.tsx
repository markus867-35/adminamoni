'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Daftar lengkap pilihan menu sidebar yang tersedia di sistem Anda
const AVAILABLE_MENUS = [
  { id: 'dashboard', label: 'Dashboard' },
  
  // Transaksi
  { id: 'transaksi', label: 'Transaksi (Semua Sub-menu)' },
  { id: 'depo', label: '└ Deposit Baru' },
  { id: 'wd', label: '└ Withdrawal Baru' },
  { id: 'rangkuman-deposit', label: '└ Rangkuman Deposit' },
  { id: 'rangkuman-withdrawal', label: '└ Rangkuman Withdrawal' },
  { id: 'penyesuaian-saldo', label: '└ Penyesuaian Saldo' },
  { id: 'rangkuman-deposit-auto', label: '└ Rangkuman Deposit Auto' },

  // Member
  { id: 'member', label: 'Member (Semua Sub-menu)' },
  { id: 'member-group', label: '└ Member Group' },
  { id: 'online-member', label: '└ Online Member' },
  { id: 'lihat-ip', label: '└ Lihat IP' },
  { id: 'member-blacklist', label: '└ Member Blacklist' },
  { id: 'member-referral', label: '└ Member Referral' },

  // Promosi
  { id: 'promosi', label: 'Promosi (Semua Sub-menu)' },
  { id: 'promosi-deposit', label: '└ Promosi Deposit' },
  { id: 'promosi-cashback', label: '└ Promosi Cashback' },
  { id: 'promosi-referral', label: '└ Promosi Referral' },
  { id: 'promosi-rolling', label: '└ Promosi Rolling' },
  { id: 'proses-bonus', label: '└ Proses Bonus' },
  { id: 'laporan-bonus', label: '└ Laporan Bonus' },
  { id: 'laporan-cashback', label: '└ Laporan Cashback' },
  { id: 'laporan-referral', label: '└ Laporan Referral' },
  { id: 'laporan-rolling', label: '└ Laporan Rolling' },

  // Togel
  { id: 'togel', label: 'Togel (Semua Sub-menu)' },
  { id: 'togel-pasaran', label: '└ Togel Pasaran' },
  { id: 'togel-invoice', label: '└ Togel Invoice' },
  { id: 'togelresult', label: '└ Togel Result' },
  { id: 'togel-menang', label: '└ Togel Menang' },
  { id: 'laporan-togel', label: '└ Laporan Togel' },
  { id: 'livedrawal', label: '└ Togel Livedrawal' },
  { id: 'buku-mimpi', label: '└ Buku Mimpi' },

  // Laporan
  { id: 'laporan', label: 'Laporan (Semua Sub-menu)' },
  { id: 'game-perusahaan', label: '└ Laporan Game Perusahaan' },
  { id: 'game-member', label: '└ Laporan Game Member' },
  { id: 'laporan-jurnal', label: '└ Laporan Jurnal' },
  { id: 'transaksi-lengkap', label: '└ Transaksi Lengkap' },

  // Pengaturan Lainnya
  { id: 'pengaturan_bank', label: 'Pengaturan Bank ' },
  { id: 'pengaturan_provider', label: 'Pengaturan Provider' },
  { id: 'pengaturan_peralatan', label: 'Pengaturan Peralatan' },
  { id: 'storage', label: 'Storage' },
  { id: 'master', label: 'Master (Operator & Security)' },
];

interface AdminUpdateData {
  username: string;
  email: string;
  allowed_menus: string[];
  password?: string;
}

export default function AdminSettingPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [allowedMenus, setAllowedMenus] = useState<string[]>([]);

  useEffect(() => {
    if (adminId) {
      fetchAdminDetail();
    }
  }, [adminId]);

  const fetchAdminDetail = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error) {
      Swal.fire('Gagal', 'Gagal memuat data admin.', 'error');
      router.push('/admin/master');
    } else if (data) {
      setUsername(data.username || '');
      setEmail(data.email || '');

      let menus = data.allowed_menus;
      if (typeof menus === 'string') {
        try {
          menus = JSON.parse(menus);
        } catch (e) {
          menus = [];
        }
      }

      setAllowedMenus(Array.isArray(menus) ? menus : AVAILABLE_MENUS.map(m => m.id));
    }
    setLoading(false);
  };

  const handleCheckboxChange = (menuId: string) => {
    const currentMenus = Array.isArray(allowedMenus) ? allowedMenus : [];

    // Pemetaan relasi sub-menu berdasarkan kategori utamanya
    const subMenusMap: { [key: string]: string[] } = {
      transaksi: ['depo', 'wd', 'rangkuman-deposit', 'rangkuman-withdrawal', 'penyesuaian-saldo', 'rangkuman-deposit-auto'],
      member: ['member-group', 'online-member', 'lihat-ip', 'member-blacklist', 'member-referral'],
      promosi: ['promosi-deposit', 'promosi-cashback', 'promosi-referral', 'promosi-rolling', 'proses-bonus', 'laporan-bonus', 'laporan-cashback', 'laporan-referral', 'laporan-rolling'],
      togel: ['togel-pasaran', 'togel-invoice', 'togelresult', 'togel-menang', 'laporan-togel', 'livedrawal', 'buku-mimpi'],
      laporan: ['game-perusahaan', 'game-member', 'laporan-jurnal', 'transaksi-lengkap'],
    };

    if (currentMenus.includes(menuId)) {
      let updated = currentMenus.filter((id) => id !== menuId);
      if (subMenusMap[menuId]) {
        updated = updated.filter((id) => !subMenusMap[menuId].includes(id));
      }
      setAllowedMenus(updated);
    } else {
      const updated = Array.from(new Set([...currentMenus, menuId]));
      setAllowedMenus(updated);
    }
  };

  const handleUpdateSetting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.trim() !== '' && newPassword.length < 6) {
      Swal.fire('Peringatan', 'Password baru minimal harus 6 karakter.', 'warning');
      return;
    }

    setSubmitting(true);

    const cleanAllowedMenus = Array.from(new Set(allowedMenus));

    const updateData: AdminUpdateData = {
      username,
      email,
      allowed_menus: cleanAllowedMenus,
    };

    if (newPassword.trim() !== '') {
      updateData.password = newPassword;
    }

    const { error } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', adminId);

    setSubmitting(false);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire({
        title: 'Berhasil',
        text: 'Pengaturan admin berhasil diperbarui!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      setNewPassword('');
      fetchAdminDetail();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat form pengaturan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Setting Admin</h1>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
              <span>/</span>
              <Link href="/admin/master" className="hover:underline text-blue-600 dark:text-blue-400">Admin Master</Link>
              <span>/</span>
              <span>Setting</span>
            </div>
          </div>

          <Link 
            href="/master/operator" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </Link>
        </div>

        <form onSubmit={handleUpdateSetting} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm p-6 space-y-6">
          
          {/* 1. Informasi Akun */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Informasi Akun</span>
            </h2>

            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nama Admin / Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email Admin</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2. Menu Sidebar */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Hak Akses Menu Sidebar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Centang menu atau sub-menu yang diizinkan untuk diakses oleh admin ini pada panel sidebar.
            </p>

            {/* Container utama dengan space-y-3 agar setiap kategori utama ada jarak ke bawah */}
            <div className="space-y-3 pt-1 max-h-[480px] overflow-y-auto pr-2">
              
              {/* Dashboard */}
              <label className="flex items-center space-x-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 font-semibold cursor-pointer">
                <input 
                  type="checkbox"
                  checked={allowedMenus.includes('dashboard')}
                  onChange={() => handleCheckboxChange('dashboard')}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                />
                <span className="text-l text-slate-800 dark:text-slate-200">Dashboard</span>
              </label>

              {/* Transaksi & Sub-menu */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <label className="flex items-center space-x-2.5 font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowedMenus.includes('transaksi')}
                    onChange={() => handleCheckboxChange('transaksi')}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                  />
                  <span className="text-l text-slate-800 dark:text-slate-200">Transaksi (Semua Sub-menu)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                  {['depo', 'wd', 'rangkuman-deposit', 'rangkuman-withdrawal', 'penyesuaian-saldo', 'rangkuman-deposit-auto'].map((id) => {
                    const menu = AVAILABLE_MENUS.find(m => m.id === id);
                    if (!menu) return null;
                    return (
                      <label key={id} className="flex items-center space-x-2 p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={allowedMenus.includes(id)}
                          onChange={() => handleCheckboxChange(id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                        />
                        <span className="text-[12] text-slate-600 dark:text-slate-400">{menu.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Member & Sub-menu */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <label className="flex items-center space-x-2.5 font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowedMenus.includes('member')}
                    onChange={() => handleCheckboxChange('member')}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                  />
                  <span className="text-l text-slate-800 dark:text-slate-200">Member (Semua Sub-menu)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                  {['member-group', 'online-member', 'lihat-ip', 'member-blacklist', 'member-referral'].map((id) => {
                    const menu = AVAILABLE_MENUS.find(m => m.id === id);
                    if (!menu) return null;
                    return (
                      <label key={id} className="flex items-center space-x-2 p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={allowedMenus.includes(id)}
                          onChange={() => handleCheckboxChange(id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                        />
                        <span className="text-[12] text-slate-600 dark:text-slate-400">{menu.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Promosi & Sub-menu */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <label className="flex items-center space-x-2.5 font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowedMenus.includes('promosi')}
                    onChange={() => handleCheckboxChange('promosi')}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                  />
                  <span className="text-l text-slate-800 dark:text-slate-200">Promosi (Semua Sub-menu)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                  {['promosi-deposit', 'promosi-cashback', 'promosi-referral', 'promosi-rolling', 'proses-bonus', 'laporan-bonus', 'laporan-cashback', 'laporan-referral', 'laporan-rolling'].map((id) => {
                    const menu = AVAILABLE_MENUS.find(m => m.id === id);
                    if (!menu) return null;
                    return (
                      <label key={id} className="flex items-center space-x-2 p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={allowedMenus.includes(id)}
                          onChange={() => handleCheckboxChange(id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                        />
                        <span className="text-[12] text-slate-600 dark:text-slate-400">{menu.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Togel & Sub-menu */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <label className="flex items-center space-x-2.5 font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowedMenus.includes('togel')}
                    onChange={() => handleCheckboxChange('togel')}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                  />
                  <span className="text-l text-slate-800 dark:text-slate-200">Togel (Semua Sub-menu)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                  {['togel-pasaran', 'togel-invoice', 'togelresult', 'togel-menang', 'laporan-togel', 'livedrawal', 'buku-mimpi'].map((id) => {
                    const menu = AVAILABLE_MENUS.find(m => m.id === id);
                    if (!menu) return null;
                    return (
                      <label key={id} className="flex items-center space-x-2 p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={allowedMenus.includes(id)}
                          onChange={() => handleCheckboxChange(id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                        />
                        <span className="text-[12] text-slate-600 dark:text-slate-400">{menu.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Laporan & Sub-menu */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <label className="flex items-center space-x-2.5 font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowedMenus.includes('laporan')}
                    onChange={() => handleCheckboxChange('laporan')}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                  />
                  <span className="text-l text-slate-800 dark:text-slate-200">Laporan (Semua Sub-menu)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                  {['game-perusahaan', 'game-member', 'laporan-jurnal', 'transaksi-lengkap'].map((id) => {
                    const menu = AVAILABLE_MENUS.find(m => m.id === id);
                    if (!menu) return null;
                    return (
                      <label key={id} className="flex items-center space-x-2 p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={allowedMenus.includes(id)}
                          onChange={() => handleCheckboxChange(id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                        />
                        <span className="text-[12] text-slate-600 dark:text-slate-400">{menu.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pengaturan Lainnya */}
              {['pengaturan_bank', 'pengaturan_provider', 'pengaturan_peralatan', 'storage', 'master'].map((id) => {
                const menu = AVAILABLE_MENUS.find(m => m.id === id);
                if (!menu) return null;
                return (
                  <label key={id} className="flex items-center space-x-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 font-semibold cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={allowedMenus.includes(id)}
                      onChange={() => handleCheckboxChange(id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                    />
                    <span className="text-l text-slate-800 dark:text-slate-200">{menu.label}</span>
                  </label>
                );
              })}

            </div>
          </div>

          {/* 3. Ganti atau Riset Password */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Ganti atau Riset Password
            </h2>

            <div>
              <label className="block text-l text-slate-500 dark:text-slate-400 mb-1">Password Baru (Opsional)</label>
              <input 
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Isi bagian ini hanya jika Anda ingin mereset password akun admin tersebut (minimal 6 karakter).
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}