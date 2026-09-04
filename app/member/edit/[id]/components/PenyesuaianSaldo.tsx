'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';

import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface SaldoAdjustmentTabProps {
  memberId: string | number;
  username: string;
}

export default function SaldoAdjustmentTab({ memberId, username }: SaldoAdjustmentTabProps) {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSaldo, setCurrentSaldo] = useState<number>(0);
  
  // Form State
  const [tipe, setTipe] = useState('');
  const [kategori, setKategori] = useState('Penyesuaian Saldo');
  const [jumlah, setJumlah] = useState<number | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch data penyesuaian saldo & saldo member saat ini
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil riwayat penyesuaian saldo (asumsi nama tabel: adjustment_saldo / saldo_adjustments)
      const { data: adjData, error: adjError } = await supabase
        .from('adjustment_saldo')
        .select('*')
        .eq('username', username)
        .order('id', { ascending: false });

      if (adjError) {
        console.error('Gagal mengambil riwayat:', adjError.message);
      } else {
        setAdjustments(adjData || []);
      }

      // 2. Ambil saldo member dari tabel members / users
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('saldo')
        .eq('id', memberId)
        .single();

      if (!memberError && memberData) {
        setCurrentSaldo(memberData.saldo || 0);
      }
    } catch (err) {
      console.error('Error fetching adjustment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username || memberId) {
      fetchData();
    }
  }, [memberId, username]);

  const handleTambah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipe) {
      Swal.fire('Peringatan', 'Silakan pilih Tipe penyesuaian saldo terlebih dahulu.', 'warning');
      return;
    }
    if (!jumlah || Number(jumlah) <= 0) {
      Swal.fire('Peringatan', 'Jumlah saldo harus diisi dengan benar.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('adjustment_saldo').insert([
        {
          member_id: memberId,
          username: username,
          tipe: tipe,
          kategori: kategori,
          total: Number(jumlah),
          keterangan: keterangan,
          waktu_adjustment: new Date().toISOString(),
          admin: 'Admin' // Sesuaikan jika ada state admin aktif
        }
      ]);

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Penyesuaian saldo berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false
      });

      // Reset form & reload data
      setTipe('');
      setJumlah('');
      setKeterangan('');
      fetchData();
    } catch (err: any) {
      console.error('Gagal menyimpan:', err);
      Swal.fire('Error', err.message || 'Gagal menyimpan penyesuaian saldo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (num: number) => {
    return Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-4 py-2">
      {/* Kotak Info Saldo */}
      <div className="w-full sm:w-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-sm">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Saldo</div>
        <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">
          Rp. {formatRupiah(currentSaldo)}
        </div>
      </div>

      {/* Form Input Penyesuaian Saldo */}
      <form onSubmit={handleTambah} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end bg-white dark:bg-gray-900">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            value={username} 
            disabled 
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-300 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tipe</label>
          <select 
            value={tipe} 
            onChange={(e) => setTipe(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Pilih Tipe</option>
            <option value="Tambah Saldo">Tambah Saldo</option>
            <option value="Potong Saldo">Potong Saldo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kategori</label>
          <select 
            value={kategori} 
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Penyesuaian Saldo">Penyesuaian Saldo</option>
            <option value="Bonus / Hadiah">Bonus / Hadiah</option>
            <option value="Koreksi Admin">Koreksi Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Jumlah</label>
          <input 
            type="number" 
            value={jumlah} 
            onChange={(e) => setJumlah(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Keterangan</label>
          <input 
            type="text" 
            value={keterangan} 
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Keterangan..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="sm:col-span-5 pt-1">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <FiPlus className="text-sm" />
            <span>{submitting ? 'Menyimpan...' : 'Tambah'}</span>
          </button>
        </div>
      </form>

      {/* Tabel Riwayat */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded mt-4">
        <table className="w-full text-left text-xs sm:text-sm border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-2.5 font-semibold w-16 border-r border-gray-200 dark:border-gray-700">No.</th>
              <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Tipe</th>
              <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Info</th>
              <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Total</th>
              <th className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Admin</th>
              <th className="p-2.5 font-semibold">Waktu Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                  Memuat data...
                </td>
              </tr>
            ) : adjustments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              adjustments.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{index + 1}.</td>
                  <td className="p-2.5 font-medium border-r border-gray-200 dark:border-gray-700">{item.tipe}</td>
                  <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{item.keterangan || item.kategori || '-'}</td>
                  <td className="p-2.5 font-semibold border-r border-gray-200 dark:border-gray-700">Rp. {formatRupiah(item.total)}</td>
                  <td className="p-2.5 border-r border-gray-200 dark:border-gray-700">{item.admin || 'System'}</td>
                  <td className="p-2.5 text-gray-600 dark:text-gray-400">{item.waktu_adjustment ? new Date(item.waktu_adjustment).toLocaleString('id-ID') : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

{/* Total Baris */}
      <div className="text-xs text-gray-500 text-right">
        Menampilkan sampai dari total {adjustments.length} baris
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