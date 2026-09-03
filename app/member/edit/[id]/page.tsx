'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiGrid, FiSave, FiArrowLeft } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';
import DepositTab from '@/app/member/edit/[id]/components/DepositTab';
import DepositAutoTab from '@/app/member/edit/[id]/components/DepositAutoTab';
import WithdrawalTab from '@/app/member/edit/[id]/components/WithdrawalTab';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MemberData {
  id: string | number;
  username: string;
  nama_group: string;
  no_hp: string;
  bank_name: string;
  nama_rekening: string;
  nomor_rekening: string;
  status: string;
  created_at: string;
  saldo: number;
  total_deposit: number;
  note: string;
}

export default function UbahMemberPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.id;

  const [activeTab, setActiveTab] = useState('Member Data');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<MemberData>({
    id: '',
    username: '',
    nama_group: 'Regular',
    no_hp: '',
    bank_name: '',
    nama_rekening: '',
    nomor_rekening: '',
    status: 'AKTIF',
    created_at: '',
    saldo: 0,
    total_deposit: 0,
    note: '',
  });

  useEffect(() => {
    const fetchMemberById = async () => {
      if (!memberId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', memberId)
          .single();

        if (error) throw error;
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error('Gagal mengambil data member:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberById();
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('members')
        .update({
          nama_group: formData.nama_group,
          no_hp: formData.no_hp,
          bank_name: formData.bank_name,
          nama_rekening: formData.nama_rekening,
          nomor_rekening: formData.nomor_rekening,
          status: formData.status,
          note: formData.note,
        })
        .eq('id', memberId);

      if (error) throw error;

      alert(`Data member ${formData.username} berhasil diperbarui!`);
      router.push('/member');
    } catch (error) {
      console.error('Gagal menyimpan perubahan:', error);
      alert('Terjadi kesalahan saat menyimpan data ke database.');
    } finally {
      setSaving(false);
    }
  };

  const formatRupiah = (num: number) => {
    return 'Rp. ' + Number(num || 0).toLocaleString('id-ID');
  };

  const tabs = [
    'Member Data',
    'Deposit',
    'Deposit Auto',
    'Withdrawal',
    'Penyesuaian Saldo',
    'Laporan Transaksi',
    'Laporan Permainan',
    'Referral',
  ];

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-4">
      {/* Header & Breadcrumb */}
      <div className="px-2">
        <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100">Ubah Member</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/member" className="text-blue-600 hover:underline">Member</Link>
          <span>/</span>
          <span>Ubah Member</span>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FiGrid className="text-base" />
          <span>Ubah Member</span>
        </div>

        <div className="p-4 space-y-4">
{/* Tab Navigation Buttons ala Kotak Terpisah */}
          <div className="flex flex-wrap border border-gray-200 dark:border-gray-700 rounded-t bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden text-xs sm:text-sm">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 font-medium transition cursor-pointer text-center ${
                  index !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                } ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow-inner'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Area Konten Tab */}
          <div className="p-4">
            {loading ? (
              <div className="py-12 text-center text-gray-400 italic text-sm">
                Memuat data member dari database...
              </div>
            ) : (
              <>
                {/* KONTEN TAB 1: MEMBER DATA */}
                {activeTab === 'Member Data' && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Username</label>
                          <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Nama Group</label>
                          <select
                            name="nama_group"
                            value={formData.nama_group}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Member Baru">Member Baru</option>
                            <option value="VIP">VIP</option>
                            <option value="Reseller">Reseller</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Nomor Hp</label>
                          <input 
                            type="text" 
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Nama Bank</label>
                            <select
                              name="bank_name"
                              value={formData.bank_name}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="BCA">BCA</option>
                              <option value="SEABANK">SEABANK</option>
                              <option value="MANDIRI">MANDIRI</option>
                              <option value="BNI">BNI</option>
                              <option value="BRI">BRI</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Atas Nama</label>
                            <input 
                              type="text" 
                              name="nama_rekening"
                              value={formData.nama_rekening}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Nomor Rekening</label>
                            <input 
                              type="text" 
                              name="nomor_rekening"
                              value={formData.nomor_rekening}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="AKTIF">AKTIF</option>
                            <option value="SUSPEND">SUSPEND</option>
                            <option value="BLOKIR">BLOKIR</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Waktu Register</label>
                          <input 
                            type="text" 
                            value={formData.created_at}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Saldo</label>
                          <input 
                            type="text" 
                            value={formatRupiah(formData.saldo)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 font-semibold cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Total Deposit</label>
                          <input 
                            type="text" 
                            value={formatRupiah(formData.total_deposit)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 font-semibold cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 flex flex-col">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Note</label>
                        <textarea 
                          name="note"
                          rows={12}
                          value={formData.note || ''}
                          onChange={handleChange}
                          placeholder="Tambahkan catatan khusus untuk member ini..."
                          className="w-full flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <FiSave className="text-xs" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
                      </button>
                      <Link 
                        href="/member"
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition shadow-sm cursor-pointer"
                      >
                        <FiArrowLeft className="text-xs" />
                        <span>Kembali</span>
                      </Link>
                    </div>
                  </form>
                )}

                {/* KONTEN TAB: DEPOSIT MANUAL */}
                {activeTab === 'Deposit' && (
                  <DepositTab memberId={memberId as string} username={formData.username} />
                )}

                {/* KONTEN TAB: DEPOSIT AUTO */}
                {activeTab === 'Deposit Auto' && (
                  <DepositAutoTab memberId={memberId as string} username={formData.username} />
                )}

               {/* KONTEN TAB: WITHDRAWAL */}
                {activeTab === 'Withdrawal' && (
                  <WithdrawalTab memberId={memberId as string} username={formData.username} />
                )}

                {/* KONTEN TAB LAINNYA YANG BELUM DIBUAT */}
                {activeTab !== 'Member Data' && 
                 activeTab !== 'Deposit' && 
                 activeTab !== 'Deposit Auto' && 
                 activeTab !== 'Withdrawal' && (
                  <div className="py-12 text-center text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-700 rounded p-6">
                    Fitur untuk tab <span className="font-semibold text-blue-600">{activeTab}</span> akan ditampilkan di sini.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}