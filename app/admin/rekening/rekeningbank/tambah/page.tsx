'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiGrid } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function TambahRekeningPage() {
  const router = useRouter();

  const [memberGroup, setMemberGroup] = useState('Member Baru');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [tipePotongan, setTipePotongan] = useState('Persen');
  const [potonganAdmin, setPotonganAdmin] = useState('0');
  const [sembunyikan, setSembunyikan] = useState('0'); // '0' = Tidak, '1' = Iya
  const [urutan, setUrutan] = useState('0');
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankName) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Silakan pilih Nama Bank terlebih dahulu!',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!accountNumber.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Nomor Rekening harus diisi!',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // 1. Upload file gambar/QRIS ke Supabase Storage jika ada
      if (gambar) {
        const fileExt = gambar.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('bank-logos') // Pastikan bucket 'bank-logos' sudah dibuat public di Supabase
          .upload(filePath, gambar);

        if (uploadError) {
          throw new Error("Gagal mengunggah gambar: " + uploadError.message);
        }

        const { data: publicURLData } = supabase.storage
          .from('bank-logos')
          .getPublicUrl(filePath);

        imageUrl = publicURLData.publicUrl;
      }

      // 2. Simpan data ke tabel admin_banks
      const { error } = await supabase
        .from('admin_banks')
        .insert([
          {
            member_group: memberGroup,
            bank_name: bankName,
            account_name: accountName,
            account_number: accountNumber,
            tipe_potongan: tipePotongan,
            potongan_admin: parseFloat(potonganAdmin) || 0,
            sembunyikan: sembunyikan,
            urutan: parseInt(urutan) || 0,
            image_url: imageUrl,
            updated_at: new Date().toISOString(), // <-- Tambahkan ini agar tanggal & waktu terisi saat dibuat
          },
        ]);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data rekening bank berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false,
      });

      router.push('/admin/rekening/rekeningbank');
      router.refresh();
    } catch (err: any) {
      console.error("Gagal menyimpan:", err.message);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err.message,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Tambah Rekening Bank</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/rekening/bank" className="text-blue-600 hover:underline">Rekening Bank</Link>
          <span>/</span>
          <span>Tambah Rekening Bank</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Tambah Rekening Bank</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-4xl">
          
          {/* Member Group */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Member Group</label>
            <select
              value={memberGroup}
              onChange={(e) => setMemberGroup(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Member Baru">Member Baru</option>
              <option value="Bank">Bank</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          {/* Nama Bank */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nama Bank</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Pilih</option>
              <option value="BCA">BCA</option>
              <option value="BNI">BNI</option>
              <option value="BRI">BRI</option>
              <option value="CIMB">CIMB</option>
              <option value="Mandiri">Mandiri</option>
              <option value="Danamon">Danamon</option>
              <option value="OVO">OVO</option>
              <option value="GOPAY">GOPAY</option>
              <option value="DANA">DANA</option>
              <option value="LINKAJA">LINKAJA</option>
              <option value="SEABANK">SEABANK</option>
              <option value="BANK SYARIAH INDONESIA (BSI)">BANK SYARIAH INDONESIA (BSI)</option>
              <option value="JAGO">JAGO</option>
            </select>
          </div>

          {/* Nama Rekening */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nama Rekening</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Contoh: CITRA AGUSTINA"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
            />
          </div>

          {/* Nomor Rekening */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nomor Rekening</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Contoh: 0955286133"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Grid Tipe Potongan & Persen Potongan Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Potongan Admin</label>
              <select
                value={tipePotongan}
                onChange={(e) => setTipePotongan(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Persen">Persen</option>
                <option value="Nominal">Nominal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Persen Potongan Admin</label>
              <input
                type="number"
                step="0.01"
                value={potonganAdmin}
                onChange={(e) => setPotonganAdmin(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sembunyikan */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sembunyikan</label>
            <select
              value={sembunyikan}
              onChange={(e) => setSembunyikan(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="0">Tidak</option>
              <option value="1">Iya</option>
            </select>
          </div>

          {/* Urutan */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Urutan</label>
            <input
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Gambar QRIS / Logo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gambar QRIS</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setGambar(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-gray-500 border border-gray-300 dark:border-gray-700 rounded bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link 
              href="/admin/rekening/rekeningbank"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium rounded transition shadow-sm inline-flex items-center justify-center cursor-pointer"
            >
              Kembali
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}