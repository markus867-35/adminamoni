'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Image as ImageIcon, Smile, Settings, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function ChatContent() {
  const searchParams = useSearchParams();
  const targetAdmin = searchParams.get('to');

  const [currentUser, setCurrentUser] = useState('MIAKHALIFA'); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State indikator mengetik lawan jenis
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const typingChannelRef = useRef(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserRef = useRef(currentUser);
  const activeContactRef = useRef(activeContact);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  // Deteksi otomatis nama user yang login dari sidebar kiri bawah atau localStorage
  useEffect(() => {
    const checkLoginUser = () => {
      const allTextElements = document.querySelectorAll('*');
      for (let el of allTextElements) {
        if (el.children.length === 0 && el.textContent && el.textContent.includes('Login sebagai:')) {
          const parent = el.parentElement;
          if (parent) {
            const textParts = parent.innerText.split('\n');
            const foundName = textParts.find(p => p.trim() && !p.includes('Login sebagai:'));
            if (foundName) {
              setCurrentUser(foundName.trim());
            }
          }
        }
      }
      const stored = localStorage.getItem('username') || localStorage.getItem('admin') || localStorage.getItem('currentUser');
      if (stored) {
        setCurrentUser(stored);
      }
    };

    checkLoginUser();
    const interval = setInterval(checkLoginUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Ambil daftar admin dari tabel 'admins'
  useEffect(() => {
    async function fetchAdmins() {
      try {
        setLoadingContacts(true);
        const { data, error } = await supabase
          .from('admins')
          .select('id, username, avatar_url, last_seen');

        if (error) throw error;

        if (data) {
          const formattedContacts = data.map((admin) => ({
            id: admin.id,
            name: admin.username,
            preview: 'Klik untuk mulai pesan...',
            avatar: admin.avatar_url,
            online: true,
          }));
          setContacts(formattedContacts);
        }
      } catch (error) {
        console.error('Gagal mengambil daftar admin:', error.message);
      } finally {
        setLoadingContacts(false);
      }
    }

    fetchAdmins();
  }, []);

  const availableContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== currentUser.toLowerCase()
  );

  useEffect(() => {
    if (availableContacts.length > 0) {
      if (targetAdmin) {
        const found = availableContacts.find((c) => c.name.toLowerCase() === targetAdmin.toLowerCase());
        if (found) {
          setActiveContact(found);
        } else {
          const newContact = {
            id: Date.now().toString(),
            name: targetAdmin,
            preview: 'Mulai percakapan baru...',
            online: true,
          };
          setContacts((prev) => [newContact, ...prev]);
          setActiveContact(newContact);
        }
      } else if (!activeContact) {
        setActiveContact(availableContacts[0]);
      }
    }
  }, [targetAdmin, availableContacts, currentUser]);

  // Fungsi ambil pesan dari database + Realtime Subscription khusus pesan baru
  async function fetchMessages(contactName) {
    const targetName = contactName || activeContact?.name;
    if (!targetName) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender.eq.${currentUser},receiver.eq.${targetName}),and(sender.eq.${targetName},receiver.eq.${currentUser})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Gagal memuat pesan:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeContact && currentUser) {
      fetchMessages(activeContact.name);
      setIsTyping(false); // Reset status mengetik saat ganti kontak
    }
  }, [activeContact, currentUser]);

  // SUPABASE REALTIME (Pesan Masuk + Typing Indicator Broadcast)
  useEffect(() => {
    // Buat channel realtime gabungan unik
    const channelName = 'chat-room-sync';
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    // 1. Tangkap Pesan Masuk (Database Changes)
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const newMsg = payload.new;
        const currUser = currentUserRef.current;
        const actContact = activeContactRef.current;

        if (actContact && currUser) {
          const isRelevant = 
            (newMsg.sender.toLowerCase() === currUser.toLowerCase() && newMsg.receiver.toLowerCase() === actContact.name.toLowerCase()) ||
            (newMsg.sender.toLowerCase() === actContact.name.toLowerCase() && newMsg.receiver.toLowerCase() === currUser.toLowerCase());

          if (isRelevant) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === newMsg.id);
              if (exists) return prev;
              return [...prev, newMsg];
            });
            // Hilangkan status mengetik jika pesan sudah masuk
            setIsTyping(false);
          }
        }
      }
    );

    // 2. Tangkap Sinyal Sedang Mengetik (Broadcast Event)
    channel.on('broadcast', { event: 'typing' }, (payload) => {
      const { sender, receiver } = payload.payload;
      const currUser = currentUserRef.current;
      const actContact = activeContactRef.current;

      // Jika sinyal dikirim untuk user yang sedang login dan berasal dari kontak yang sedang dibuka
      if (actContact && currUser) {
        if (
          receiver.toLowerCase() === currUser.toLowerCase() &&
          sender.toLowerCase() === actContact.name.toLowerCase()
        ) {
          setIsTyping(true);

          // Otomatis hilangkan tulisan "mengetik..." setelah 2.5 detik jika tidak ada sinyal baru
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 2500);
        }
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        typingChannelRef.current = channel;
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fungsi saat user mengetik di input pesan
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Kirim sinyal broadcast "sedang mengetik" ke lawan bicara
    if (typingChannelRef.current && activeContact) {
      typingChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          sender: currentUser,
          receiver: activeContact.name,
        },
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      setSending(true);
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender: currentUser,
            receiver: activeContact.name,
            message: messageText,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data[0].id);
          if (exists) return prev;
          return [...prev, data[0]];
        });
      }
    } catch (error) {
      console.error('Gagal mengirim pesan:', error.message);
      alert('Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = availableContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );




// Tambahkan fungsi ini untuk menghapus pesan di Supabase:
const handleClearMessages = async () => {
  if (!activeContact || !currentUser) return;
  
  const confirmClear = window.confirm(`Yakin ingin membersihkan semua pesan dengan ${activeContact.name}?`);
  if (!confirmClear) return;

  try {
    const cur = currentUser.trim();
    const tgt = activeContact.name.trim();

    const { error } = await supabase
      .from('messages')
      .delete()
      .or(`and(sender.eq.${cur},receiver.eq.${tgt}),and(sender.eq.${tgt},receiver.eq.${cur})`);

    if (error) throw error;

    // Kosongkan state pesan di frontend
    setMessages([]);
    setShowDropdown(false);
  } catch (error) {
    console.error('Gagal membersihkan pesan:', error.message);
    alert('Gagal membersihkan pesan.');
  }
};

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-[#1b1e2b] text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#161924] border-r border-slate-800/80 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Cari admin terdaftar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e2230] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 tracking-wider px-3 py-1 uppercase">Daftar Admin Aktif Lainnya</p>
          
          {loadingContacts ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
              const isActive = activeContact?.name === contact.name;
              return (
                <div 
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive ? 'bg-[#25293d] border-l-4 border-purple-600 shadow-sm' : 'hover:bg-[#1e2230]/60'
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{contact.name.substring(0, 2).toUpperCase()}</span>
                    )}
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#161924] rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{contact.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{contact.preview}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              Tidak ada admin lain yang ditemukan.
            </div>
          )}
        </div>

        <div className="p-3 bg-[#13151f] border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.substring(0, 2).toUpperCase()}
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#13151f] rounded-full"></span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">Login: {currentUser}</span>
              <span className="text-[10px] text-emerald-400 font-medium">Online</span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* RUANG CHAT UTAMA */}
      <main className="flex-1 flex flex-col bg-[#1b1e2b] min-w-0">
        {activeContact ? (
          <>
            <header className="h-16 bg-[#1b1e2b] border-b border-slate-800/60 px-8 flex items-center justify-between shrink-0">
  <div>
    <h2 className="font-bold text-sm text-slate-100">{activeContact.name}</h2>
    {isTyping ? (
      <p className="text-[10px] text-purple-400 font-semibold animate-pulse">
        ✍️ {activeContact.name} sedang mengetik...
      </p>
    ) : (
      <p className="text-[10px] text-emerald-400 font-medium">● Status: Online (Admin)</p>
    )}
  </div>
  
  <div className="flex items-center gap-4 text-slate-400">
    <button className="hover:text-slate-200 transition-colors cursor-pointer">📞</button>
    <button className="hover:text-slate-200 transition-colors cursor-pointer">📹</button>
    
    {/* Dropdown Menu Container */}
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800/50"
      >
        •••
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-44 bg-[#161924] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
          <button
            onClick={handleClearMessages}
            className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#1e2230] transition-colors flex items-center gap-2 font-medium cursor-pointer"
          >
            🗑️ Bersihkan Pesan
          </button>
        </div>
      )}
    </div>
  </div>
</header>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="text-center my-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-[#161924] px-3 py-1 rounded-full">
                  Chat dengan {activeContact.name}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-full text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isMe = msg.sender.toLowerCase() === currentUser.toLowerCase();
                  return (
                    <div key={msg.id || index} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {msg.sender.substring(0, 2).toUpperCase()}
                      </div>
                      <div className={`max-w-[60%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                        <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-[#7c3aed] text-white rounded-br-none' 
                            : 'bg-white text-slate-800 rounded-bl-none font-medium'
                        }`}>
                          {msg.message}
                        </div>
                        <span className={`text-[10px] text-slate-500 block px-1 ${isMe ? 'text-right' : ''}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center space-y-1">
                  <p className="text-xs">Belum ada pesan dengan {activeContact.name}.</p>
                  <p className="text-[11px] text-slate-600">Kirim pesan di bawah untuk memulai percakapan.</p>
                </div>
              )}

              {/* BUBBLE "SEDANG MENGETIK" DI DALAM CHAT */}
              {isTyping && (
                <div className="flex items-end gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {activeContact.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs font-medium shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] text-slate-500 ml-1">{activeContact.name} sedang mengetik...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#1b1e2b] shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-[#161924] border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-purple-500 transition-colors shadow-lg">
                <button type="button" className="text-slate-500 hover:text-slate-300 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button type="button" className="text-slate-500 hover:text-slate-300 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  placeholder={`Kirim pesan ke ${activeContact.name} dengan ramah...` }
                  value={newMessage}
                  onChange={handleInputChange} // Menggunakan handler khusus untuk mengirim sinyal mengetik
                  className="flex-1 bg-transparent text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'KIRIM'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            Pilih admin di sebelah kiri untuk mulai chat.
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#1b1e2b] text-white">Memuat halaman pesan...</div>}>
      <ChatContent />
    </Suspense>
  );
}