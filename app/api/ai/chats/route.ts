import { NextResponse } from 'next/server';

// Contoh penyimpanan sementara (bisa dihubungkan ke Supabase nantinya)
let mockDatabase: any[] = [];

export async function GET() {
  return NextResponse.json({ chats: mockDatabase });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, messages } = body;

    if (!id) {
      // Buat chat baru
      const newChat = {
        id: Date.now(),
        title: title || 'Percakapan Baru',
        messages: messages || [],
      };
      mockDatabase.unshift(newChat);
      return NextResponse.json({ success: true, id: newChat.id });
    } else {
      // Update chat yang sudah ada
      mockDatabase = mockDatabase.map(chat => 
        chat.id == id ? { ...chat, messages } : chat
      );
      return NextResponse.json({ success: true, id });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}