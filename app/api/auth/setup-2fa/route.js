import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    // Tangkap email yang dikirim dari frontend
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email tidak ditemukan untuk setup 2FA!' },
        { status: 400 }
      );
    }

    // Buat secret key unik dengan nama yang dinamis mengikuti email admin
    const secret = speakeasy.generateSecret({
      name: `OneLiveGaming (${email})`, // <-- Dinamis berdasarkan email
      issuer: 'OneLiveGaming',
    });

    // Ubah URL otpauth menjadi gambar QR Code (Base64)
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return NextResponse.json({
      success: true,
      secret: secret.base32, 
      qrCodeUrl: qrCodeUrl,  
    });
  } catch (error) {
    console.error("Error Setup 2FA:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}