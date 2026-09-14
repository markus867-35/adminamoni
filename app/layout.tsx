'use client';

import { useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react'; // Import ikon pesan
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Cek apakah halaman saat ini adalah halaman login
  const isLoginPage = pathname === '/login';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased m-0 p-0 bg-[#f4f6f9] dark:bg-[#0b0f19] text-[#171717] dark:text-[#f1f5f9] transition-colors duration-300">
        {isLoginPage ? (
          // Jika di halaman login, render children secara penuh tanpa sidebar/header/wrapper
          <main className="w-screen h-screen overflow-hidden">
            {children}
          </main>
        ) : (
          // Jika di dalam dashboard, gunakan struktur flex layout yang stabil
          <div className="flex h-screen overflow-hidden relative">
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block flex-shrink-0`}>
              <Sidebar isOpen={isSidebarOpen} />
            </div>

            {/* Container utama sebelah kanan (menggunakan relative agar tombol floating menempel di sini) */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
              <Header toggleSidebar={toggleSidebar} />
              
              {/* Area Konten */}
              <main className="p-6 flex-1 bg-[#f4f6f9] dark:bg-[#0b0f19] transition-colors duration-300">
                {children}
              </main>

              {/* Footer Copyright Otomatis di Semua Halaman Dashboard */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 bg-[#f4f6f9] dark:bg-[#0b0f19]">
                Copyright &copy; OneLiveGaming 2023
              </div>

              {/* ================================================= */}
              {/* TOMBOL / IKON PESAN MELAYANG (FLOATING CHAT BUTTON) */}
              {/* ================================================= */}
              <button
                onClick={() => {
                  // Mengarahkan ke halaman pesan utama Anda
                  router.push('/pesan'); 
                }}
                title="Buka Chat / Pesan"
                className="fixed bottom-15 right-6 z-50 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-purple-400/40"
              >
                <MessageSquare className="w-5 h-5" />
                {/* Opsional: Titik indikator hijau notifikasi online/pesan baru */}
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0b0f19] rounded-full"></span>
              </button>

            </div>
          </div>
        )}
      </body>
    </html>
  );
}