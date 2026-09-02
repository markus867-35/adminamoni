'use client';
import { useState } from 'react';

export default function Security2FAPage() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [emailInput, setEmailInput] = useState(''); // State untuk menampung input email
  const [isSetupMode, setIsSetupMode] = useState(false);

  // 1. Fungsi untuk meminta QR Code dan Secret Key dari Backend berdasarkan email yang dimasukkan
  const handleStartSetup = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      alert("Masukkan alamat email admin yang valid terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch('/api/auth/setup-2fa', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      
      if (res.ok && data.success) {
        setQrCode(data.qrCodeUrl); 
        setSecret(data.secret);    
        setIsSetupMode(true);
      } else {
        alert(data.message || "Gagal memuat setup 2FA dari server.");
      }
    } catch (err) {
      console.error("Gagal memuat setup 2FA", err);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  // 2. Fungsi untuk verifikasi kode pertama kali & menyimpan ke database sesuai email
  const handleVerifyAndSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/verify-and-save-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, secret, email: emailInput }) // Kirim email bersama token & secret
      });
      const data = await res.json();

      if (data.success) {
        alert("2FA Berhasil Diaktifkan!");
        setIsSetupMode(false);
        setToken('');
      } else {
        alert(data.message || "Kode verifikasi salah.");
      }
    } catch (err) {
      console.error("Gagal verifikasi", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pengaturan Two-Factor Authentication (2FA)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Amankan akun admin Anda menggunakan Google Authenticator atau Authy.</p>

      {!isSetupMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Masukkan Email Admin:
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Contoh: admin@onelivegaming.com"
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
          <button
            onClick={handleStartSetup}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Aktifkan 2FA Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            Mengatur 2FA untuk akun: <b>{emailInput}</b>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">1. Scan QR Code di bawah ini menggunakan aplikasi Authenticator Anda:</p>
            {qrCode && <img src={qrCode} alt="QR Code 2FA" className="mx-auto w-48 h-48 border bg-white p-2 rounded" />}
          </div>

          <form onSubmit={handleVerifyAndSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                2. Masukkan 6 digit kode dari aplikasi:
              </label>
              <input
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Contoh: 123456"
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm tracking-widest text-center"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                Konfirmasi & Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsSetupMode(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}