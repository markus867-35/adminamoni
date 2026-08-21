'use client';
import { useState, useEffect } from 'react';

type Message = { role: 'user' | 'model'; text: string };
type ChatHistoryItem = { id: number | string; title: string; messages: Message[] };

export default function AiChatPage() {
  const [currentChatId, setCurrentChatId] = useState<number | string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatList, setChatList] = useState<ChatHistoryItem[]>([]);
  
  // State untuk toggle tema manual (opsional, jika tidak pakai class 'dark' di root HTML)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    fetchChatHistoryList();
  }, []);

  async function fetchChatHistoryList() {
    try {
      const res = await fetch('/api/ai/chats');
      if (res.ok) {
        const data = await res.json();
        setChatList(data.chats || []);
      }
    } catch (error) {
      console.error('Gagal memuat riwayat:', error);
    }
  }

  function handleNewChat() {
    setCurrentChatId(null);
    setMessages([]);
    setAiInput('');
  }

  async function handleSendAiMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput;
    setAiInput('');
    setAiLoading(true);

    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(updatedMessages);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan pada server');

      const finalMessages = [...updatedMessages, { role: 'model' as const, text: data.reply || 'Maaf, tidak ada respons.' }];
      setMessages(finalMessages);

      const saveRes = await fetch('/api/ai/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentChatId,
          title: updatedMessages[0].text.slice(0, 30) + '...',
          messages: finalMessages,
        }),
      });

      const saveData = await saveRes.json();
      if (saveRes.ok && !currentChatId) {
        setCurrentChatId(saveData.id);
        fetchChatHistoryList();
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message}` }]);
    } finally {
      setAiLoading(false);
    }
  }

  function handleSelectChat(chat: ChatHistoryItem) {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  }

  return (
    // Tambahkan state isDarkMode pada pembungkus utama agar bisa toggle dinamis
    <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark bg-[#131314] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white dark:bg-[#1e1f20] border-r border-gray-200 dark:border-gray-800 flex flex-col p-4 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h1 className="font-semibold text-sm tracking-wide">Gemini</h1>
          </div>
          
          {/* Tombol Toggle Tema (Terang/Gelap) */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#282a2c] text-xs hover:opacity-80 transition"
            title="Ubah Tema"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <button 
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#282a2c] dark:hover:bg-[#333538] text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-full text-xs font-medium mb-6 w-full transition"
        >
          <span>+</span> Percakapan baru
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <p className="px-2 py-1 font-semibold text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Terbaru</p>
          {chatList.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left px-3 py-2 rounded-lg truncate transition ${currentChatId === chat.id ? 'bg-gray-200 dark:bg-[#282a2c] text-gray-900 dark:text-white font-medium' : 'hover:bg-gray-100 dark:hover:bg-[#282a2c]'}`}
            >
              {chat.title}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <a href="/admin/code-storage" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">← Kembali ke Repository</a>
        </div>
      </aside>

      {/* Area Utama Chat */}
      <main className="flex-1 flex flex-col h-full max-w-4xl mx-auto p-6">
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2">
                Siap Anda gunakan kapan saja
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Ketik pesan di bawah untuk mulai mengobrol.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-[#1e1f20] text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap rounded-bl-sm border border-gray-200 dark:border-gray-800 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#1e1f20] text-gray-500 dark:text-gray-400 text-xs px-4 py-3 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800 shadow-sm">
                Gemini sedang berpikir...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendAiMessage} className="relative">
          <input 
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="w-full bg-white dark:bg-[#1e1f20] border border-gray-300 dark:border-gray-800 rounded-full py-4 pl-6 pr-20 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 shadow-sm"
            placeholder="Minta Gemini..."
          />
          <button 
            type="submit" 
            disabled={aiLoading} 
            className="absolute right-3 top-3.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full text-xs font-medium disabled:opacity-50 transition"
          >
            Kirim
          </button>
        </form>
      </main>
    </div>
  );
}