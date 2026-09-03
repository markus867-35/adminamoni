'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiFilter, FiGrid, FiSearch, FiRotateCcw } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface JurnalItem {
  id: number;
  tanggal: string;
  total_deposit: number;
  total_withdrawal: number;
  total_adjustment_plus: number;
  total_adjustment_min: number;
  total_bonus: number;
  total_cashback: number;
  total_referral: number;
  total_rolling: number;
  total_marketing: number;
  total: number;
}

export default function LaporanJurnalPage() {
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-03');

  // Data dikosongkan (empty array) sesuai permintaan
  const [reportData, setReportData] = useState<JurnalItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJurnalReport = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      // Contoh query Supabase (sesuaikan nama tabel dan kolom)
      // let query = supabase.from('laporan_jurnal').select('*');
      // if (start && end) {
      //   query = query.gte('tanggal', start).lte('tanggal', end);
      // }
      // const { data, error } = await query;
      // if (!error && data) setReportData(data);

      setReportData([]);
    } catch (error) {
      console.error('Gagal memuat laporan jurnal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJurnalReport(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setReportData([]);
  };

  const formatIDCurrency = (amount: number, includePrefix = true) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return includePrefix ? `Rp. ${formatted}` : formatted;
  };

  // Hitung Footer Grand Total otomatis dari reportData
  let sumDeposit = 0;
  let sumWithdrawal = 0;
  let sumAdjPlus = 0;
  let sumAdjMin = 0;
  let sumBonus = 0;
  let sumCashback = 0;
  let sumReferral = 0;
  let sumRolling = 0;
  let sumMarketing = 0;
  let sumTotal = 0;

  reportData.forEach((item) => {
    sumDeposit += item.total_deposit;
    sumWithdrawal += item.total_withdrawal;
    sumAdjPlus += item.total_adjustment_plus;
    sumAdjMin += item.total_adjustment_min;
    sumBonus += item.total_bonus;
    sumCashback += item.total_cashback;
    sumReferral += item.total_referral;
    sumRolling += item.total_rolling;
    sumMarketing += item.total_marketing;
    sumTotal += item.total;
  });

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Laporan Jurnal</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <span>Laporan Jurnal</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiFilter className="text-base" />
          <span>Filter</span>
        </div>
        <form onSubmit={handleSearch} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Dari Tanggal</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Sampai Tanggal</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
            >
              <FiRotateCcw className="text-sm" />
              <span>Reset</span>
            </button>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
            >
              <FiSearch className="text-sm" />
              <span>Cari</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Laporan Jurnal</span>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/60 text-center">
                  <th className="py-2.5 px-2 border-r border-gray-300 dark:border-gray-700 w-12">No.</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 w-28 text-left">Tanggal</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Deposit <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Withdrawal <br/><span className="text-[10px] font-normal">(-)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Adjustment <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Adjustment <br/><span className="text-[10px] font-normal">(-)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Bonus <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Cashback <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Referral <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Rolling <br/><span className="text-[10px] font-normal">(+)</span></th>
                  <th className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">Total Marketing <br/><span className="text-[10px] font-normal">(+/-)</span></th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400 italic">
                      Memuat data laporan jurnal...
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400 italic">
                      Tidak ada data laporan jurnal.
                    </td>
                  </tr>
                ) : (
                  reportData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-2 border-r border-gray-300 dark:border-gray-700 text-center">{index + 1}.</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 whitespace-nowrap">{item.tanggal}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_deposit, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_withdrawal, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_adjustment_plus, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_adjustment_min, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_bonus, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_cashback, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_referral, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_rolling, false)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 dark:border-gray-700 text-right">{formatIDCurrency(item.total_marketing, false)}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatIDCurrency(item.total, false)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* Footer Grand Total */}
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/40 font-bold border-t-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-right">
                  <td colSpan={2} className="py-3 px-3 border-r border-gray-300 dark:border-gray-700 text-center"></td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumDeposit)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumWithdrawal)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumAdjPlus)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumAdjMin)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumBonus)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumCashback)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumReferral)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumRolling)}</td>
                  <td className="py-3 px-3 border-r border-gray-300 dark:border-gray-700">{formatIDCurrency(sumMarketing)}</td>
                  <td className="py-3 px-3">{formatIDCurrency(sumTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}