import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(request) {
  try {
    const { secret, token } = await request.json();

    console.log("--- DEBUG BACKEND API 2FA ---");
    console.log("Secret diterima:", secret);
    console.log("Token diterima:", token);

    // Cek verifikasi dengan speakeasy dan tambahkan window toleransi waktu
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2, // Memberikan toleransi waktu 1 menit ke depan/belakang
    });

    console.log("Hasil Verifikasi Speakeasy:", verified);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Kode OTP salah atau waktu tidak sinkron!' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}