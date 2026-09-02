import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { token, secret, email } = await request.json(); 
    
    // Debugging: Cek apa yang dikirim frontend ke backend
    console.log("Menerima data email:", email);
    console.log("Menerima secret:", secret);

    if (!token || !secret || !email) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap (Token, Secret, atau Email kosong)!' },
        { status: 400 }
      );
    }

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Kode OTP salah atau sudah kadaluarsa!' },
        { status: 400 }
      );
    }

    // Lakukan update dengan membersihkan spasi pada email (trim)
    const { data: updatedData, error: updateError } = await supabase
      .from('admins')
      .update({
        two_factor_secret: secret,
        is_2fa_enabled: true,
      })
      .eq('email', email.trim())
      .select(); // Tambahkan .select() untuk mengecek apakah ada baris yang benar-benar ter-update

    console.log("Hasil update Supabase:", updatedData);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Jika updatedData kosong ([]), berarti email tidak ditemukan di database!
    if (!updatedData || updatedData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Email admin tidak ditemukan di database Supabase!' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '2FA Berhasil Diaktifkan!',
    });
  } catch (error) {
    console.error("Error Verifikasi & Simpan:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}