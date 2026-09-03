'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

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
          <div className="flex h-screen overflow-hidden">
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block flex-shrink-0`}>
              <Sidebar isOpen={isSidebarOpen} />
            </div>

            {/* Container utama sebelah kanan (menggunakan flex-col dan min-h-screen agar footer menempel di bawah) */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
              <Header toggleSidebar={toggleSidebar} />
              
              {/* Area Konten */}
              <main className="p-6 flex-1 bg-[#f4f6f9] dark:bg-[#0b0f19] transition-colors duration-300">
                {children}
              </main>

              {/* Footer Copyright Otomatis di Semua Halaman Dashboard */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 bg-[#f4f6f9] dark:bg-[#0b0f19]">
                Copyright &copy; OneLiveGaming 2026
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}