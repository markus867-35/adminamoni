import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Menggunakan path alias agar anti-salah jalur

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('popular_games')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, provider, image, game_url } = body;

    const { data, error } = await supabase
      .from('popular_games')
      .insert([{ title, provider, image, game_url }]);

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tambahkan fungsi PUT ini agar method PUT diizinkan
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan pada parameter URL' }, { status: 400 });
    }

    const body = await request.json();
    const { title, provider, image, game_url } = body;

    const { data, error } = await supabase
      .from('popular_games')
      .update({ title, provider, image, game_url })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Data berhasil diperbarui', data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('popular_games')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}