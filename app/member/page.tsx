'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, RefreshCcw, Search, Table, ChevronDown, CheckCircle2, Edit, Key, Loader2 } from 'lucide-react';

export default function MemberPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk menampung nilai input filter
  const [filterUsername, setFilterUsername] = useState('');
  const [filterNoRek, setFilterNoRek] = useState('');
  const [filterNamaRek, setFilterNamaRek] = useState('');
  const [filterNoHp, setFilterNoHp] = useState('');
  const [filterUpline, setFilterUpline] = useState('');
  const [filterRefCode, setFilterRefCode] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // Fungsi untuk mengambil data member dari API database Anda
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/members');
      const result = await response.json();

      if (result.success) {
        setMembers(result.data);
      } else {
        setError(result.error || 'Gagal memuat data');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter data berdasarkan input yang diketikkan admin
  const filteredMembers = members.filter((member) => {
    const matchUsername = member.username?.toLowerCase().includes(filterUsername.toLowerCase()) ?? true;
    const matchNoRek = member.nomor_rekening?.toLowerCase().includes(filterNoRek.toLowerCase()) ?? true;
    const matchNamaRek = member.nama_rekening?.toLowerCase().includes(filterNamaRek.toLowerCase()) ?? true;
    const matchNoHp = member.no_hp?.toLowerCase().includes(filterNoHp.toLowerCase()) ?? true;
    const matchUpline = member.upline?.toLowerCase().includes(filterUpline.toLowerCase()) ?? true;
    const matchRefCode = member.kode_referral?.toLowerCase().includes(filterRefCode.toLowerCase()) ?? true;
    const matchGroup = filterGroup ? member.group === filterGroup : true;
    const matchStatus = filterStatus ? member.status?.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchLevel = filterLevel ? String(member.level) === filterLevel : true;

    return (
      matchUsername &&
      matchNoRek &&
      matchNamaRek &&
      matchNoHp &&
      matchUpline &&
      matchRefCode &&
      matchGroup &&
      matchStatus &&
      matchLevel
    );
  });

  const handleReset = () => {
    setFilterUsername('');
    setFilterNoRek('');
    setFilterNamaRek('');
    setFilterNoHp('');
    setFilterUpline('');
    setFilterRefCode('');
    setFilterGroup('');
    setFilterStatus('');
    setFilterLevel('');
    fetchMembers();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] justify-between space-y-6">
      {/* Bagian Atas: Konten Utama */}
      <div className="space-y-6">
        
        {/* Header Halaman & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-normal text-slate-800 dark:text-white">Member</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Link href="/admin" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link>
            <span>/</span>
            <span>Member</span>
          </div>
        </div>

        {/* Kotak Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Filter */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </div>

          {/* Isi Filter Grid */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Username */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Username</label>
                <input 
                  type="text" 
                  value={filterUsername}
                  onChange={(e) => setFilterUsername(e.target.value)}
                  placeholder="Cari username..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Nomor Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Nomor Rekening</label>
                <input 
                  type="text" 
                  value={filterNoRek}
                  onChange={(e) => setFilterNoRek(e.target.value)}
                  placeholder="Cari no rekening..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Nama Rekening */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Nama Rekening</label>
                <input 
                  type="text" 
                  value={filterNamaRek}
                  onChange={(e) => setFilterNamaRek(e.target.value)}
                  placeholder="Cari nama rekening..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* No Hp */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">No Hp</label>
                <input 
                  type="text" 
                  value={filterNoHp}
                  onChange={(e) => setFilterNoHp(e.target.value)}
                  placeholder="Cari no hp..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Upline Referral Username */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Upline Referral Username</label>
                <input 
                  type="text" 
                  value={filterUpline}
                  onChange={(e) => setFilterUpline(e.target.value)}
                  placeholder="Cari upline..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Kode Referral */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Kode Referral</label>
                <input 
                  type="text" 
                  value={filterRefCode}
                  onChange={(e) => setFilterRefCode(e.target.value)}
                  placeholder="Cari kode referral..."
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Dari Tanggal Register */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Dari Tanggal Register</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Sampai Tanggal Register */}
              <div className="border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Sampai Tanggal Register</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-23" 
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Member Group */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Member Group</label>
                <select 
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="VIP" className="dark:bg-slate-800">VIP</option>
                  <option value="Regular" className="dark:bg-slate-800">Regular</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Status */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="Aktif" className="dark:bg-slate-800">Aktif</option>
                  <option value="Dibanned" className="dark:bg-slate-800">Dibanned</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

              {/* Level */}
              <div className="relative border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-3 py-1.5 focus-within:border-blue-500">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Level</label>
                <select 
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="" className="dark:bg-slate-800">Pilih</option>
                  <option value="1" className="dark:bg-slate-800">Level 1</option>
                  <option value="2" className="dark:bg-slate-800">Level 2</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              </div>

            </div>

            {/* Tombol Aksi Filter */}
            <div className="flex items-center space-x-2 pt-2">
              <button 
                onClick={handleReset}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button 
                onClick={fetchMembers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kotak Utama Tabel Member */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
          {/* Header Tabel */}
          <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Table className="w-4 h-4" />
              <span>Member ({filteredMembers.length})</span>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </div>

          {/* Konten Tabel dengan Garis Tegas & Terang */}
          <div className="p-4 overflow-x-auto">
            {error && <div className="p-4 text-red-500 text-xs mb-3">{error}</div>}

            <table className="w-full border-collapse text-left text-xs border border-slate-300 dark:border-slate-700">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 w-12 text-center">No.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Username</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Rekening</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Upline</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Kode Referral</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Status</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Saldo</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Total Deposit</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-slate-500">
                      Memuat data member dari database...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-slate-500">
                      Tidak ada data member yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, index) => (
                    <tr key={member.id || index} className="text-slate-700 dark:text-slate-200">
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">{index + 1}.</td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-blue-600 dark:text-blue-400 font-medium">
                        {member.username}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                        {member.bank_name ? `${member.bank_name} - ${member.nomor_rekening} - ${member.nama_rekening}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5">{member.upline || '-'}</td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5">{member.kode_referral || '-'}</td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5">
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{member.status || 'Aktif'}</span>
                        </span>
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">
                        {Number(member.saldo || 0).toLocaleString()}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">
                        {Number(member.total_deposit || 0).toLocaleString()}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">
                        <div className="inline-flex items-center space-x-1">
                          <Link 
                            href={`/member/edit/${member.id}`}
                            className="bg-amber-400 hover:bg-amber-500 text-white p-1.5 rounded transition inline-flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded transition cursor-pointer" title="Reset Password">
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bagian Bawah: Footer Copyright */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        Copyright &copy; OneLiveGaming 2026
      </div>
    </div>
  );
}