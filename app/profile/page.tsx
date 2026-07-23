import Link from 'next/link';
import { User, Key, ArrowLeft, Save } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Profil</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Profil</span>
          </div>
        </div>

        {/* Kotak Utama Profil */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Kotak */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Profil</span>
          </div>

          {/* Isi Formulir Profil */}
          <div className="p-5 space-y-4">
            
            {/* Input Nama */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nama</label>
              <input 
                type="text" 
                defaultValue="Admin OneLive" 
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                defaultValue="admin@onelive.com" 
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Status</label>
              <input 
                type="text" 
                disabled 
                defaultValue="Aktif" 
                className="w-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-80"
              />
            </div>

            {/* Bagian Notifikasi Checkbox */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Notifikasi</span>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>Depo & WD</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>Togel</span>
                </label>
              </div>
            </div>

            {/* Tombol Aksi (Simpan, Ubah Password, Kembali) */}
            <div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <Key className="w-3.5 h-3.5" />
                <span>Ubah Password</span>
              </button>
              <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bagian Bawah: Footer Copyright yang menempel di dasar layar */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </div>
  );
}