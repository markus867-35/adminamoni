'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function RootLayout({ children }) {
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

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
              <Header toggleSidebar={toggleSidebar} />
              {/* Tambahkan dark:bg-[#0b0f19] agar area konten ikut menjadi gelap */}
              <main className="p-6 flex-1 bg-[#f4f6f9] dark:bg-[#0b0f19] transition-colors duration-300">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}