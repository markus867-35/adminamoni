import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { q, source, target } = await request.json();

    // Endpoint gratis Google Translate (GTX)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(q)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Format respons dari gtx berupa array bersarang, gabungkan teks hasil terjemahannya
    if (data && data[0]) {
      const translatedText = data[0].map((item: any[]) => item[0]).join('');
      return NextResponse.json({ translatedText });
    } else {
      return NextResponse.json({ error: 'Gagal menerjemahkan' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}