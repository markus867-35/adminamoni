import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { q, source = 'id', target = 'en' } = body;

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ translatedText: '' }, { status: 400 });
    }

    const targetLang = target || 'en';
    const sourceLang = source || 'id';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0].map((item: any) => item[0]).join('');
      return NextResponse.json({ translatedText });
    }

    return NextResponse.json({ translatedText: q });
  } catch (error: any) {
    console.error('Translate API Error:', error.message);
    // Mengembalikan teks asli alih-alih error 500 agar UI di frontend tetap aman
    return NextResponse.json({ translatedText: 'Gagal terhubung ke server terjemahan.' }, { status: 200 });
  }
}