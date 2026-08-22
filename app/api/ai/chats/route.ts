import { NextResponse } from 'next/server';
// Sesuaikan dengan client database yang kamu gunakan di proyek OneLiveGaming
// import { supabase } from '@/lib/supabase'; 

export async function GET() {
  try {
    // Contoh query mengambil riwayat dari database
    // const { data, error } = await supabase.from('chat_histories').select('*').order('id', { ascending: false });
    // if (error) throw error;

    // Untuk sementara jika belum terhubung database, kembalikan array kosong / data uji
    return NextResponse.json({ chats: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, title, messages } = await request.json();

    // Jika chat baru (id belum ada), simpan sebagai baris baru di database
    // Jika sudah ada, update pesan berdasarkan id chat tersebut
    
    // Contoh simulasi response sukses menyimpan:
    const newId = id || Date.now(); 

    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}