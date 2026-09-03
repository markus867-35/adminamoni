'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilter, FiSearch, FiRotateCcw, FiGrid, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface RangkumanDepositAutoItem {
  id: number;
  username: string;
  promo: string;
  pembagianBonus: string;
  total: number;
  bonus: number;
  grandTotal: number;
  tujuan: string;
  refId: string;
  waktuDeposit: string;
  waktuRespon: string;
  status: string;
}

export default function RangkumanDepositAutoPage() {
  // Filter States
  const [username, setUsername] = useState('');
  const [dariTanggalDeposit, setDariTanggalDeposit] = useState('2026-09-03');
  const [sampaiTanggalDeposit, setSampaiTanggalDeposit] = useState('2026-09-03');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalDepositFilter, setTotalDepositFilter] = useState('');
  const [refId, setRefId] = useState('');
  const [urutan, setUrutan] = useState('Tanggal Terbaru');
  const [munculkan, setMunculkan] = useState('15 Data');

  // Summary / Header Info States
  const [summaryTotalDeposit, setSummaryTotalDeposit] = useState(10485002);
  const [summaryTotalBonusAwal, setSummaryTotalBonusAwal] = useState(53200);
  const [summaryTotal, setSummaryTotal] = useState(10538202);

  const [depositData, setDepositData] = useState<RangkumanDepositAutoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepositAuto = async () => {
    setLoading(true);
    try {
      // Mockup data sesuai gambar referensi Rangkuman Deposit Auto
      setDepositData([
        {
          id: 1,
          username: 'Andianto1908',
          promo: '',
          pembagianBonus: '',
          total: 20000,
          bonus: 0,
          grandTotal: 20000,
          tujuan: 'QRIS',
          refId: 'qrizz-192-202609031603101926451320260903160310',
          waktuDeposit: '03 September 2026, 16:03:10',
          waktuRespon: '03 September 2026, 16:03:42',
          status: 'Terima',
        },
        {
          id: 2,
          username: 'Jonoo123',
          promo: '',
          pembagianBonus: '',
          total: 359555,
          bonus: 0,
          grandTotal: 359555,
          tujuan: 'QRIS',
          refId: 'qrizz-192-202609031601231925581720260903160123',
          waktuDeposit: '03 September 2026, 16:01:24',
          waktuRespon: '03 September 2026, 16:01:47',
          status: 'Terima',
        },
      ]);
    } catch (error) {
      console.error('Gagal mengambil data rangkuman deposit auto:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositAuto();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDepositAuto();
  };

  const handleReset = () => {
    setUsername('');
    setDariTanggalDeposit('2026-09-03');
    setSampaiTanggalDeposit('2026-09-03');
    setStatusFilter('');
    setTotalDepositFilter('');
    setRefId('');
    setUrutan('Tanggal Terbaru');
    setMunculkan('15 Data');
    fetchDepositAuto();
  };

  const formatRupiah = (num: number) => {
    return 'Rp. ' + num.toLocaleString('id-ID');
  };

  const formatRupiahDecimal = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Rangkuman Deposit Auto</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Rangkuman Deposit Auto</span>
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

              {/* Dari Tanggal Deposit */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={dariTanggalDeposit}
                  onChange={(e) => setDariTanggalDeposit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sampai Tanggal Deposit */}
              <div className="space-y-1">
                <input 
                  type="date" 
                  value={sampaiTanggalDeposit}
                  onChange={(e) => setSampaiTanggalDeposit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="Terima">Terima</option>
                  <option value="Proses">Proses</option>
                  <option value="Tolak">Tolak</option>
                </select>
              </div>

              {/* Total Deposit */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={totalDepositFilter}
                  onChange={(e) => setTotalDepositFilter(e.target.value)}
                  placeholder="Total Deposit"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Ref ID */}
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="Ref ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Urutan */}
              <div className="space-y-1">
                <select
                  value={urutan}
                  onChange={(e) => setUrutan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Tanggal Terbaru">Tanggal Terbaru</option>
                  <option value="Tanggal Terlama">Tanggal Terlama</option>
                </select>
              </div>

              {/* Munculkan */}
              <div className="space-y-1">
                <select
                  value={munculkan}
                  onChange={(e) => setMunculkan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="15 Data">15 Data</option>
                  <option value="25 Data">25 Data</option>
                  <option value="50 Data">50 Data</option>
                  <option value="100 Data">100 Data</option>
                </select>
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
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiGrid className="text-base" />
            <span>Rangkuman Deposit Auto</span>
          </div>

          <button 
            type="button"
            onClick={() => alert('Mengekspor data Rangkuman Deposit Auto...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiFileText className="text-sm" />
            <span>Export</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Deposit</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 mt-1">{formatRupiah(summaryTotalDeposit)}</span>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Bonus Auto Awal</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 mt-1">{formatRupiah(summaryTotalBonusAwal)}</span>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 mt-1">{formatRupiah(summaryTotal)}</span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Memuat data rangkuman deposit auto...
            </div>
          ) : depositData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic text-sm">
              Tidak ada data rangkuman deposit auto.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60">
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-16 text-center">No.</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Username</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Promo</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Pembagian Bonus</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Bonus</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Grand Total</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Tujuan</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Ref ID</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Deposit</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700">Waktu Respon</th>
                    <th className="py-2.5 px-3 text-center w-28">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                  {depositData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-blue-600 hover:underline cursor-pointer">
                        {item.username}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                        {item.promo}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-500">
                        {item.pembagianBonus}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatRupiahDecimal(item.total)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs">
                        {formatRupiahDecimal(item.bonus)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right font-mono text-xs font-semibold">
                        {formatRupiahDecimal(item.grandTotal)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-medium text-xs">
                        {item.tujuan}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 font-mono text-xs max-w-xs truncate" title={item.refId}>
                        {item.refId}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                        {item.waktuDeposit}
                      </td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                        {item.waktuRespon}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <FiCheckCircle className="text-xs" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && depositData.length > 0 && (
            <div className="text-right text-xs text-gray-500 dark:text-gray-400 pt-2">
              Menampilkan 1 sampai {depositData.length} dari total {depositData.length} baris
            </div>
          )}
        </div>
      </div>
    </div>
  );
}