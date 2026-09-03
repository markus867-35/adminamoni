'use client';

import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Tag, 
  Hash, 
  ChevronDown,
  ChevronRight,
  Landmark,
  FileText,
  Dices,
  Database,
  Settings,
  Wrench,
  Server,
  Briefcase,
  FolderGit2,
  ChevronUp
} from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const [adminName, setAdminName] = useState('Admin');
  // State untuk mengontrol menu mana saja yang sedang terbuka
  const [openMenus, setOpenMenus] = useState({
    transaksi: false,
    member: false,
    promosi: false,
    togel: false,
    Laporan: false,PengaturanProvider: false,PengaturanPeralatan:false,storage:false,master:false,
    PengaturanBank: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

useEffect(() => {
    // Mengambil nama admin yang disimpan saat login
    const name = localStorage.getItem('admin_name');
    if (name) {
      setAdminName(name);
    }
  }, []);
  return (
    <aside className={`w-64 bg-[#1b2531] text-slate-300 flex flex-col justify-between shrink-0 select-none sticky top-0 h-screen border-r border-slate-800 transition-all duration-300 ${
      isOpen ? 'flex' : 'hidden'
    }`}>
      <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#1b2531] [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        {/* Logo / Header Sidebar */}
        <div className="h-16 flex items-center px-6 bg-[#161f28] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-slate-900">M</div>
            <span className="text-white font-semibold tracking-wider text-sm">ADMIN PANEL</span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="py-2 space-y-1 text-sm font-medium">
          
          {/* Dashboard */}
          <Link href="/admin" className="flex items-center px-6 py-3 hover:bg-[#222d3d] transition text-white">
            <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" />
            Dashboard
          </Link>

          {/* Menu Transaksi (Dropdown) */}
          <div>
            <button 
              onClick={() => toggleMenu('transaksi')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <ArrowLeftRight className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Transaksi</span>
              </div>
              {openMenus.transaksi ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.transaksi && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/depo" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Deposit Baru</Link>
                <Link href="/wd" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Withdrawal Baru</Link>
                <Link href="/rangkuman-deposit" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Rangkuman Deposit</Link>
                <Link href="/rangkuman-withdrawal" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Rangkuman Withdrawal</Link>
                <Link href="/penyesuaian-saldo" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Penyesuaian Saldo</Link>
                <Link href="#" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Rangkuman Deposit Auto</Link>
              </div>
            )}
          </div>

          {/* Menu Member (Dropdown) */}
          <div>
            <button 
              onClick={() => toggleMenu('member')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Member</span>
              </div>
              {openMenus.member ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.member && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/member" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Member Group</Link>
                <Link href="/member" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Member</Link>
                <Link href="#" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Lihat IP</Link>
              </div>
            )}
          </div>

          {/* Menu Promosi (Dropdown) */}
          <div>
            <button 
              onClick={() => toggleMenu('promosi')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Promosi</span>
              </div>
              {openMenus.promosi ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.promosi && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/admin/promosi/promosi-deposit" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Promosi Deposit</Link>
                <Link href="/admin/promosi/promosi-cashback" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Promosi Cashback</Link>
                <Link href="/admin/promosi/promosi-referral" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Promosi Referral</Link>
                <Link href="/admin/promosi/promosi-rolling" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Promosi Rolling</Link>
                <Link href="/admin/promosi/proses-bonus" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Proses Bonus</Link>
                <Link href="/admin/promosi/laporan-bonus" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Bonus</Link>
                <Link href="/admin/promosi/laporan-cashback" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Cashback</Link>
                <Link href="/admin/promosi/laporan-referral" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Referral</Link>
                <Link href="/admin/promosi/laporan-rolling" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Rolling</Link>
              </div>
            )}
          </div>

          {/* Menu Togel (Dropdown) */}
          <div>
            <button 
              onClick={() => toggleMenu('togel')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <Dices className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Togel</span>
              </div>
              {openMenus.togel ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.togel && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/admin/togel/togel-pasaran" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Togel pasaran</Link>
                <Link href="/admin/togel/togel-invoice" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Togel Invoice</Link>
                <Link href="/admin/togel/togelresult" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Togel Result</Link>
                <Link href="/admin/togel/togel-menang" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Togel Menang</Link>
                <Link href="/admin/togel/laporan-togel" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Togel</Link>
                <Link href="/admin/togel/livedrawal" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Togel livedrawal</Link>
                <Link href="/admin/togel/buku-mimpi" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Buku Mimpi</Link>
              </div>
            )}
          </div>


                    <div>
            <button 
              onClick={() => toggleMenu('Laporan')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Laporan</span>
              </div>
              {openMenus.Laporan ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.Laporan && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/admin/laporan/game-perusahaan" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Game Perusahaan</Link>
                <Link href="/admin/laporan/game-member" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Game Member</Link>
                <Link href="/admin/laporan/laporan-jurnal" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Jurnal</Link>
                <Link href="/admin/laporan/transaksi-lengkap" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Transaksi Lengkap</Link>
                <Link href="#" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Turnover</Link>
              </div>
            )}
          </div>


                    <div>
             <button 
              onClick={() => toggleMenu('PengaturanBank')} 
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
            >
              <div className="flex items-center">
                <Landmark className="w-4 h-4 mr-3 text-slate-400" /> 
                <span>Pengaturan Bank</span>
              </div>
              {openMenus.PengaturanBank ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openMenus.PengaturanBank && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/admin/rekening/bank" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Bank</Link>
                <Link href="/admin/rekening/rekeningbank" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Rekening Bank</Link>
                <Link href="/admin/rekening/laporan-bank" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Laporan Bank</Link>
                <Link href="/admin/rekening/autodepowd" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Auto Depo & Wd</Link>
              </div>
            )}
          </div>



<div>
  <button 
    onClick={() => toggleMenu('PengaturanProvider')} 
    className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
  >
    <div className="flex items-center">
      <Settings className="w-4 h-4 mr-3 text-slate-400" /> 
      <span>Pengaturan Provider</span>
    </div>
    {openMenus.PengaturanProvider ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
  </button>

            {openMenus.PengaturanProvider && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/admin/toto" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" /><span>Toto</span></Link>
                <Link href="/admin/slot" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Slot</Link>
                <Link href="/admin/live" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Live Casino</Link>
                <Link href="/admin/support" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Sport</Link>
                <Link href="/admin/virtual" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Virtual</Link>
                <Link href="/admin/fishing" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Fishing</Link>
                <Link href="/admin/crash" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Carsh</Link>
              </div>
            )}
          </div>


<div>
  <button 
    onClick={() => toggleMenu('PengaturanPeralatan')} 
    className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
  >
    <div className="flex items-center">
      <Wrench className="w-4 h-4 mr-3 text-slate-400" /> 
      <span>Pengaturan Peralatan</span>
    </div>
    {openMenus.PengaturanPeralatan ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
  </button>

            {openMenus.PengaturanPeralatan && (
              <div className="bg-[#141b22] py-1 space-y-1 text-xs">
                <Link href="/banner" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" /><span>Banner</span></Link>
                <Link href="/admin/hubungi" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Hubungi</Link>
                <Link href="#" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Pengumuman</Link>
                <Link href="#" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Info</Link>
                <Link href="/admin/popular-games" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Populer</Link>
                <Link href="/admin/promosi" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Promosi</Link>
                <Link href="/live-preview-tool" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Live Preview Tool</Link>
              </div>
            )}
          </div>



<div>
  <button 
    onClick={() => toggleMenu('storage')} 
    className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
  >
<div className="flex items-center">
    <Database className="w-4 h-4 mr-3 text-slate-400" />
    <span>Storage</span>
  </div>
    {openMenus.storage ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
  </button>

  {openMenus.storage && (
    <div className="bg-[#141b22] py-1 space-y-1 text-xs">
      <Link href="/admin/code-storage/bot" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" /><span>Bot</span></Link>
      <Link href="/admin/code-storage/extession" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Extession</Link>
      <Link href="/admin/code-storage/managerimage" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Manager Image</Link>
      <Link href="/admin/code-storage/ai-chat" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Gemini</Link>
      <Link href="/admin/code-storage/notepad" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" />Notepad</Link>
    </div>
  )}
</div>





<div>
  <button 
    onClick={() => toggleMenu('master')} 
    className="w-full flex items-center justify-between px-6 py-3 hover:bg-[#222d3d] transition text-slate-300 cursor-pointer"
  >
<div className="flex items-center">
    <Server className="w-4 h-4 mr-3 text-slate-400" />
    <span>Master</span>
  </div>
    {openMenus.master ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
  </button>

  {openMenus.master && (
    <div className="bg-[#141b22] py-1 space-y-1 text-xs">
      <Link href="/master/operator" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" /><span>Operator</span></Link>
      <Link href="/master/security" className="flex items-center px-8 py-2.5 hover:text-white hover:bg-[#222d3d] transition"><ChevronRight className="w-3 h-3 mr-2 text-slate-400 shrink-0" /><span>Security</span></Link>


    </div>
  )}
</div>

        </nav>
      </div>

{/* Footer Sidebar (Login Sebagai) */}
      <div className="p-4 bg-[#141b22] text-xs text-slate-400 border-t border-slate-800 shrink-0">
        <p className="tracking-wider text-[11px] text-slate-400">Login sebagai:</p>
        <p className="font-bold text-white tracking-wide mt-0.5 truncate">{adminName}</p>
      </div>
    </aside>
  );
}