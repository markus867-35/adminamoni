'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiEye } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface TogelInvoiceItem {
  id: number;
  pasaran: string;
  username: string;
  kategori: string;
  tipe: string;
  bet: number;
  diskon: number;
  total: number;
  periode: string;
  waktu_dibuat: string;
}

export default function TogelInvoicePage() {
  // Filter States
  const [username, setUsername] = useState('');
  const [pasaran, setPasaran] = useState('Pilih');
  const [dariTanggal, setDariTanggal] = useState('2026-09-01');
  const [sampaiTanggal, setSampaiTanggal] = useState('2026-09-03');
  const [periode, setPeriode] = useState('');

  const [invoiceData, setInvoiceData] = useState<TogelInvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTogelInvoice = async () => {
    setLoading(true);
    try {
      // Contoh query Supabase dengan filter
      // let query = supabase.from('togel_invoice').select('*');
      // if (username) query = query.ilike('username', `%${username}%`);
      // if (pasaran !== 'Pilih') query = query.eq('pasaran', pasaran);
      // if (periode) query = query.eq('periode', periode);
      // const { data, error } = await query;
      // if (!error && data) setInvoiceData(data);

      // Data Mockup sesuai gambar
      setInvoiceData([
        {
          id: 1,
          pasaran: 'CHINA',
          username: 'Omang89',
          kategori: 'No Diskon',
          tipe: 'Games 4D',
          bet: 18000,
          diskon: 0,
          total: 18000,
          periode: '678',
          waktu_dibuat: '03 September 2026, 13:46:07'
        },
        {
          id: 2,
          pasaran: 'SYDNEY LOTTO',
          username: 'Adinda28',
          kategori: 'Diskon',
          tipe: 'Games 4D',
          bet: 84000,
          diskon: 56280,
          total: 27720,
          periode: '532',
          waktu_dibuat: '03 September 2026, 13:44:32'
        }
      ]);
    } catch (error) {
      console.error('Gagal mengambil data togel invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTogelInvoice();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTogelInvoice();
  };

  const handleReset = () => {
    setUsername('');
    setPasaran('Pilih');
    setDariTanggal('2026-09-01');
    setSampaiTanggal('2026-09-03');
    setPeriode('');
    fetchTogelInvoice();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Togel Invoice</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Togel Invoice</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiFilter className="text-base" />
          <span>Filter</span>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Username */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Pasaran */}
              <div className="space-y-1">
                <select
                  value={pasaran}
                  onChange={(e) => setPasaran(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Pilih">Pilih</option>
                  <option value="CHINA">CHINA</option>
                  <option value="SYDNEY LOTTO">SYDNEY LOTTO</option>
                  <option value="SYDNEY POOLS">SYDNEY POOLS</option>
                  <option value="HONGKONG POOLS">HONGKONG POOLS</option>
                </select>
              </div>

              {/* Dari Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Tanggal */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  placeholder="Periode"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
              >
                <FiRotateCcw className="text-xs" />
                <span>Reset</span>
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
              >
                <FiSearch className="text-xs" />
                <span>Cari</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Togel Invoice</span>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data invoice...
            </div>
          ) : invoiceData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data togel invoice.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Pasaran</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Kategori</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tipe</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Bet</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Diskon</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">Periode</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Dibuat</th>
                    <th className="py-2.5 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {invoiceData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium">{item.pasaran}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">
                        <Link href={`/admin/user/${item.username}`} className="text-blue-600 hover:underline">
                          {item.username}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.kategori}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">{item.tipe}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.bet)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono">{formatNumber(item.diskon)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono font-medium">{formatNumber(item.total)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{item.periode}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">{item.waktu_dibuat}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Link
                          href={`/admin/togel/togel-invoice/detail/${item.id}`}
                          className="inline-flex p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition cursor-pointer"
                          title="Detail"
                        >
                          <FiEye className="text-sm" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}