import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key belum diset di .env.local' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      // Tambahkan instruksi sistem di sini agar AI tahu hari dan tanggal saat ini
      config: {
        systemInstruction: "Hari ini adalah Jumat, 21 Agustus 2026. Selalu gunakan informasi ini apabila pengguna bertanya mengenai hari, tanggal, atau waktu saat ini.",
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses AI' }, { status: 500 });
  }
}