'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Swal from 'sweetalert2';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function TogelResultPage() {
  const [inputFilter, setInputFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [listPasaran, setListPasaran] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const rowsPerPage = 25;

  // Deklarasi dropdownRef hanya SEKALI di sini
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData(inputFilter, currentPage);
  }, [currentPage]);

 const fetchData = async (searchQuery = '', page = 1) => {
    setLoading(true);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage - 1;

    let countQuery = supabase.from('togel_results').select('*', { count: 'exact', head: true });
    if (searchQuery) {
      countQuery = countQuery.ilike('pasaran', `%${searchQuery}%`);
    }
    const { count } = await countQuery;
    setTotalData(count || 0);

    // Tambahkan .order('created_at', { ascending: false }) di sini
    // (Jika tabel Anda tidak memiliki kolom created_at, ganti 'created_at' dengan 'id')
    let query = supabase
      .from('togel_results')
      .select('*')
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);

    if (searchQuery) {
      query = query.ilike('pasaran', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setTableData(data || []);
      const uniquePasaran = [...new Set((data || []).map((item: any) => item.pasaran))];
      setListPasaran(uniquePasaran);
    }
    setLoading(false);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setCurrentPage(1);
    fetchData(inputFilter, 1);
  };

  const handleReset = () => {
    setInputFilter('');
    setIsOpen(false);
    setCurrentPage(1);
    fetchData('', 1);
  };

  const totalPages = Math.ceil(totalData / rowsPerPage) || 1;

  const filteredPasaran = listPasaran.filter(item => 
    item && item.toLowerCase().includes(inputFilter.toLowerCase())
  );

const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data ini akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('togel_results')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Data berhasil dihapus.',
        confirmButtonColor: '#10b981',
      });

      // Refresh data setelah berhasil dihapus
      fetchData(inputFilter, currentPage);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menghapus data: ' + error.message,
        confirmButtonColor: '#ef4444',
      });
    }
  };
  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-900 min-h-screen space-y-6">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Togel Result</h1>
        <p className="text-sm text-blue-600 dark:text-blue-400">Dashboard / Togel Result</p>
      </div>

      {/* FILTER BOX */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 text-xs tracking-wider flex items-center gap-2">
          <svg className="svg-inline--fa fa-filter w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472C487.5 32 501.5 40.9 508.1 54.87C514.8 68.84 512.7 85.37 502.1 97.33L320 320.9V448C320 460.1 313.2 471.2 302.3 476.6C291.5 482 278.5 480.9 268.8 473.6L204.8 425.6C196.7 419.6 192 410.1 192 400V320.9L9.042 97.33C-.745 85.37-2.765 68.84 3.854 54.87L3.853 54.87z"></path>
          </svg>
          FILTER
        </div>
          
        <form onSubmit={handleSearch} className="p-5 space-y-4">
          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">PASARAN</label>
            
            <input
              type="text"
              value={inputFilter}
              onChange={(e) => {
                setInputFilter(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="KETIK NAMA PASARAN..."
              className="w-full md:w-80 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-100 uppercase focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900"
            />

            {isOpen && filteredPasaran.length > 0 && (
              <ul className="absolute z-50 w-full md:w-80 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded shadow-lg">
                {filteredPasaran.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setInputFilter(item);
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-blue-500 hover:text-white cursor-pointer uppercase"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded text-sm font-medium transition shadow-sm cursor-pointer"
            >
              <svg className="svg-inline--fa fa-rotate w-3.5 h-3.5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="rotate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M449.9 39.96l-48.5 48.53C362.5 53.19 311.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.97 5.5 34.86-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c37.96 0 73 14.18 100.2 37.8L311.1 178C295.1 194.8 306.8 223.4 330.4 224h146.9C487.7 223.7 496 215.3 496 204.9V59.04C496 34.99 466.9 22.95 449.9 39.96zM441.8 289.6c-16.94-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-37.96 0-73-14.18-100.2-37.8L200 334C216.9 317.2 205.2 288.6 181.6 288H34.66C24.32 288.3 16 296.7 16 307.1v145.9c0 24.04 29.07 36.08 46.07 19.07l48.5-48.53C149.5 458.8 200.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z"></path>
              </svg>
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition shadow-sm cursor-pointer"
            >
              <svg className="svg-inline--fa fa-magnifying-glass w-3.5 h-3.5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"></path>
              </svg>
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* TABEL RIWAYAT TOGEL RESULT */}
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden w-full">
  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-wrap justify-between items-center gap-2">
    <span className="font-bold text-slate-700 dark:text-slate-200 text-xs tracking-wider flex items-center gap-2">
      <svg className="svg-inline--fa fa-table w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM224 256V160H64V256H224zM64 320V416H224V320H64zM288 416H448V320H288V416zM448 256V160H288V256H448z"></path>
      </svg>
      RIWAYAT TOGEL RESULT
    </span>
    <Link href="/admin/togel/togelresult/tambahresult">
      <button 
        type="button"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
      >
        + TAMBAH RESULT
      </button>
    </Link>
  </div>

  {/* Kontainer Scroll Horisontal Responsif */}
  <div className="w-full overflow-x-auto min-w-full">
    <table className="w-full text-left border-collapse min-w-[700px]">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap">
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">NO.</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">PASARAN</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">PERIODE</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">TANGGAL</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">RESULT</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">STATUS</th>
          <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">WAKTU DIBUAT</th>
          <th className="px-4 py-3 text-center">ACTION</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="text-center py-8 text-slate-500 italic text-sm">
              Memuat data...
            </td>
          </tr>
        ) : tableData.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-12 text-slate-400 italic text-sm">
              Belum ada data riwayat yang ditemukan.
            </td>
          </tr>
        ) : (
          tableData.map((item, index) => (
            <tr key={item.id || index} className="border-b border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-750 whitespace-nowrap">
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 font-medium">{item.pasaran}</td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">{item.periode || '-'}</td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">{item.tanggal || '-'}</td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400">{item.result}</td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 whitespace-nowrap">
                  <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </span>
                  {item.status || 'Sudah Dicairkan'}
                </span>
              </td>
              <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">{item.waktu_dibuat || new Date(item.created_at).toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-medium transition shadow-sm cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>


        {/* PAGINATION FOOTER */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div>
            Menampilkan {totalData > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, totalData)} dari {totalData} baris
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'}`}
            >
              Previous
            </button>
            <button className="px-3 py-1.5 border border-blue-600 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold rounded shadow-sm">
              Halaman {currentPage} dari {totalPages}
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalData === 0}
              className={`px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 ${currentPage === totalPages || totalData === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'}`}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}