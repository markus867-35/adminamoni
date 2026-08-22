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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<number | string | null>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem('onelivegaming_ai_chats');
    if (savedChats) {
      try {
        setChatList(JSON.parse(savedChats));
      } catch (error) {
        console.error('Gagal memparsing riwayat chat:', error);
      }
    }

    function handleClickOutside() {
      setActiveMenuId(null);
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  function saveToLocalStorage(updatedList: ChatHistoryItem[]) {
    setChatList(updatedList);
    localStorage.setItem('onelivegaming_ai_chats', JSON.stringify(updatedList));
  }

  function handleNewChat() {
    setCurrentChatId(null);
    setMessages([]);
    setAiInput('');
  }

  function handleDeleteChat(e: React.MouseEvent, chatId: number | string) {
    e.stopPropagation();
    const updatedList = chatList.filter(chat => chat.id !== chatId);
    saveToLocalStorage(updatedList);

    if (currentChatId === chatId) {
      handleNewChat();
    }
    setActiveMenuId(null);
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

      const activeChatId = currentChatId || Date.now();
      const chatTitle = updatedMessages[0].text.slice(0, 30) + '...';

      let updatedList = [...chatList];
      const existingIndex = updatedList.findIndex(c => c.id === activeChatId);

      if (existingIndex >= 0) {
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          messages: finalMessages,
        };
      } else {
        const newChatItem: ChatHistoryItem = {
          id: activeChatId,
          title: chatTitle,
          messages: finalMessages,
        };
        updatedList.unshift(newChatItem);
      }

      saveToLocalStorage(updatedList);
      if (!currentChatId) {
        setCurrentChatId(activeChatId);
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
<div className={`flex h-[88dvh] min-h-[50dvh] overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark bg-[#131314] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar Kiri */}
      <aside className="w-80 bg-white dark:bg-[#1e1f20] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full flex-shrink-0 transition-colors">
        <div className="p-4 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h1 className="font-semibold text-sm tracking-wide">Gemini</h1>
            </div>
            
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
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#282a2c] dark:hover:bg-[#333538] text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-full text-xs font-medium w-full transition"
          >
            <span>+</span> Percakapan baru
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <p className="px-2 py-1 font-semibold text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Terbaru</p>
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`group relative flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer transition ${currentChatId === chat.id ? 'bg-gray-200 dark:bg-[#282a2c] text-gray-900 dark:text-white font-medium' : 'hover:bg-gray-100 dark:hover:bg-[#282a2c]'}`}
            >
              <span className="truncate pr-6">{chat.title}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-gray-300 dark:hover:bg-[#383a3c] transition"
                title="Opsi"
              >
                <span className="text-gray-500 dark:text-gray-300 font-bold tracking-widest text-[10px]">•••</span>
              </button>

              {activeMenuId === chat.id && (
                <div className="absolute right-2 top-9 z-10 bg-white dark:bg-[#282a2c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-24">
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#333538] flex items-center gap-1.5"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <a href="/admin/code-storage" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">← Kembali ke Repository</a>
        </div>
      </aside>

{/* Area Utama Chat */}
     <main className="flex-1 relative overflow-hidden transition-colors duration-200 bg-gray-50 dark:bg-[#E6E6FA]">
        
        {/* 1. CONTAINER AREA CHAT (Hanya untuk pesan saja, memenuhi layar dikurangi tinggi input) */}
        <div className="absolute inset-x-0 top-0 bottom-[88px] overflow-y-auto px-6 pt-6 pb-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
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
        </div>

        {/* 2. CONTAINER INPUT FORM (Terpisah total di luar container chat, menempel di paling bawah) */}
        <div className="absolute inset-x-0 bottom-0 h-[88px] px-6 py-4 bg-gradient-to-t from-gray-50 via-gray-50/90 dark:from-[#131314] dark:via-[#131314]/90 to-transparent z-20 flex items-center">
          <div className="max-w-4xl mx-auto w-full">
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
          </div>
        </div>

      </main>
    </div>
  );
}