'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiRotateCcw } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface LaporanPermainanTabProps {
  memberId: string | number;
  username: string;
}

export default function LaporanPermainanTab({ memberId, username }: LaporanPermainanTabProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dariTanggal, setDariTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [sampaiTanggal, setSampaiTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [permainan, setPermainan] = useState('');
  const [provider, setProvider] = useState('');
  const [transaksiId, setTransaksiId] = useState('');
  const [roundId, setRoundId] = useState('');
  const [limit, setLimit] = useState(15);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('laporan_permainan')
        .select('*')
        .eq('username', username)
        .order('id', { ascending: false })
        .limit(limit);

      if (transaksiId) {
        query = query.ilike('transaksi_id', `%${transaksiId}%`);
      }
      if (roundId) {
        query = query.ilike('round_id', `%${roundId}%`);
      }
      if (permainan) {
        query = query.eq('permainan', permainan);
      }
      if (provider) {
        query = query.eq('provider', provider);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Gagal mengambil laporan permainan:', error.message);
      } else {
        setReports(data || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username || memberId) {
      fetchReports();
    }
  }, [memberId, username, limit]);

  const handleCari = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const handleReset = () => {
    setDariTanggal(new Date().toISOString().split('T')[0]);
    setSampaiTanggal(new Date().toISOString().split('T')[0]);
    setPermainan('');
    setProvider('');
    setTransaksiId('');
    setRoundId('');
    setLimit(15);
  };

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4">
      {/* Form Filter Pencarian */}
      <form onSubmit={handleCari} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={dariTanggal}
              onChange={(e) => setDariTanggal(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={sampaiTanggal}
              onChange={(e) => setSampaiTanggal(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Permainan</label>
            <select
              value={permainan}
              onChange={(e) => setPermainan(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Slot">Slot</option>
              <option value="Casino">Casino</option>
              <option value="Sportsbook">Sportsbook</option>
              <option value="Togel">Togel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih</option>
              <option value="Pragmatic Play">Pragmatic Play</option>
              <option value="PG Soft">PG Soft</option>
              <option value="Habanero">Habanero</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              placeholder="Transaksi ID"
              value={transaksiId}
              onChange={(e) => setTransaksiId(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Round ID"
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-48">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 Data</option>
              <option value={25}>25 Data</option>
              <option value={50}>50 Data</option>
              <option value={100}>100 Data</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiRotateCcw className="text-xs" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
          >
            <FiSearch className="text-xs" />
            <span>Cari</span>
          </button>
        </div>
      </form>

      {/* Tabel Laporan Permainan */}
      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700 mt-2">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Info</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Tipe</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Debit</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Credit</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Saldo</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Tanggal</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Transaksi ID</th>
              <th className="p-3 font-semibold border-r border-gray-200 dark:border-gray-700">Round ID</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-400 italic">
                  Memuat data laporan permainan...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500 italic">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              reports.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.info || '-'}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.tipe || '-'}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.debit)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.credit)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{formatRupiah(item.saldo)}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {item.tanggal ? new Date(item.tanggal).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.transaksi_id || '-'}</td>
                  <td className="p-3 border-r border-gray-200 dark:border-gray-700">{item.round_id || '-'}</td>
                  <td className="p-3">{item.action || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tombol Kembali */}
      <div className="pt-2">
        <Link 
          href="/member"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft className="text-xs" />
          <span>Kembali</span>
        </Link>
      </div>
    </div>
  );
}