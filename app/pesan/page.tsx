'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Image as ImageIcon, Smile, Settings, Loader2 } from 'lucide-react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Contact {
  id: any;
  name: string;
  preview: string;
  avatar?: any;
  online: boolean;
  unreadCount?: number; // Tambahkan ini
}

interface Message {
  id: any;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const targetAdmin = searchParams.get('to');

  const [currentUser, setCurrentUser] = useState('MIAKHALIFA'); 
const fileInputRef = useRef<HTMLInputElement | null>(null);
const [hoveredMessageId, setHoveredMessageId] = useState<any>(null);
const [editingMessageId, setEditingMessageId] = useState<any>(null);
const [editText, setEditText] = useState('');
const [uploadingImage, setUploadingImage] = useState(false);
const [selectedImage, setSelectedImage] = useState<string | null>(null); // Untuk modal preview
  const [showDropdown, setShowDropdown] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
const localVideoRef = useRef<HTMLVideoElement | null>(null);
const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
const localStreamRef = useRef<MediaStream | null>(null);
  
  // State indikator mengetik lawan jenis
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);

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
            unreadCount: 0,
          }));
          setContacts(formattedContacts);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
        console.error('Gagal mengambil daftar admin:', errorMessage);
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
  async function fetchMessages(contactName?: string) {
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
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      console.error('Gagal memuat pesan:', errorMessage);
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

        if (currUser) {
          // Cek apakah pesan ini relevan dengan chat yang SEDANG DIBUKA
          if (actContact) {
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

          // CEK PESAN MASUK UNTUK SEMUA KONTAK (Memperbarui Preview & Unread Count Badge)
          if (newMsg.receiver.toLowerCase() === currUser.toLowerCase()) {
            setContacts((prevContacts) =>
              prevContacts.map((contact) => {
                // Apakah pengirim pesan ini sama dengan kontak dalam list?
                if (contact.name.toLowerCase() === newMsg.sender.toLowerCase()) {
                  const isCurrentChatOpen = actContact && actContact.name.toLowerCase() === newMsg.sender.toLowerCase();
                  
                  return {
                    ...contact,
                    preview: newMsg.message, // Update teks preview terakhir
                    // Jika chat sedang dibuka, unreadCount tetap 0. Jika tidak, tambah 1.
                    unreadCount: isCurrentChatOpen ? 0 : (contact.unreadCount || 0) + 1,
                  };
                }
                return contact;
              })
            );
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
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

const handleSendMessage = async (e: React.FormEvent) => {
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
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      console.error('Gagal mengirim pesan:', errorMessage);
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
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
    console.error('Gagal membersihkan pesan:', errorMessage);
    alert('Gagal membersihkan pesan.');
  }
};




const isUserOnline = (lastSeenString: string) => {
  if (!lastSeenString) return false;
  
  const lastSeenTime = new Date(lastSeenString).getTime();
  const currentTime = new Date().getTime();
  
  // Selisih dalam milidetik (contoh: 5 menit = 5 * 60 * 1000 = 300000 ms)
  const diffInMinutes = (currentTime - lastSeenTime) / (1000 * 60);
  
  // Jika terakhir terlihat kurang dari atau sama dengan 5 menit lalu, anggap ONLINE
  return diffInMinutes <= 5;
};





const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !activeContact) return;

  // Validasi ukuran (maksimal 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran gambar maksimal 5MB!');
    return;
  }

  try {
    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    // PERBAIKI BARIS INI:
const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload ke Supabase Storage (Pastikan Anda sudah membuat bucket bernama 'chat-images' di Supabase)
    const { error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Ambil Public URL dari file yang diupload
    const { data: publicUrlData } = supabase.storage
      .from('chat-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Kirim URL gambar sebagai pesan ke tabel 'messages'
    const { data, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          sender: currentUser,
          receiver: activeContact.name,
          message: imageUrl,
        },
      ])
      .select();

    if (messageError) throw messageError;

    if (data && data.length > 0) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === data[0].id);
        if (exists) return prev;
        return [...prev, data[0]];
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
    console.error('Gagal mengunggah gambar:', errorMessage);
    alert('Gagal mengunggah gambar. Pastikan bucket Supabase "chat-images" sudah dibuat.');
  } finally {
    setUploadingImage(false);
    if (e.target) e.target.value = ''; // Reset input file
  }
};





// Fungsi Hapus Pesan
const handleDeleteMessage = async (msgId: any) => {
  if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', msgId);

    if (error) throw error;

    // Hapus dari state lokal frontend
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  } catch (error) {
    console.error('Gagal menghapus pesan:', error);
    alert('Gagal menghapus pesan.');
  }
};

// Fungsi Simpan Hasil Edit Pesan
const handleSaveEdit = async (msgId: any) => {
  if (!editText.trim()) return;

  try {
    const { error } = await supabase
      .from('messages')
      .update({ message: editText.trim() })
      .eq('id', msgId);

    if (error) throw error;

    // Perbarui state lokal frontend
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, message: editText.trim() } : m))
    );

    setEditingMessageId(null);
    setEditText('');
  } catch (error) {
    console.error('Gagal mengedit pesan:', error);
    alert('Gagal mengedit pesan.');
  }
};




const startCall = async () => {
  try {
    setIsCallActive(true);

    // Pastikan browser mendukung mediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Browser Anda tidak Mendukung akses kamera.");
      return;
    }

    // 1. Minta izin kamera dan mikrofon
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 1280, height: 720 }, 
      audio: true 
    });
    
    localStreamRef.current = stream;
    
    // 2. Tempel stream ke elemen video lokal secara langsung
    setTimeout(() => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => console.log("Play error:", e));
      }
    }, 100);

    // 3. Inisialisasi WebRTC Peer Connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnectionRef.current = pc;

    // Masukkan track lokal ke sambungan
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Tangkap video lawan bicara
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(e => console.log("Remote play error:", e));
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

  } catch (error: any) {
    console.error("Gagal mengakses kamera/mikrofon:", error);
    alert("Gagal membuka kamera: " + (error.message || error));
    setIsCallActive(false);
  }
};



// Fungsi untuk mengakhiri panggilan
const endCall = () => {
  // Matikan semua track kamera dan mikrofon lokal
  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
  }
  
  // Tutup koneksi WebRTC PeerConnection
  if (peerConnectionRef.current) {
    peerConnectionRef.current.close();
    peerConnectionRef.current = null;
  }

  // Tutup tampilan modal video call
  setIsCallActive(false);
};

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white text-slate-900 dark:bg-[#1b1e2b] dark:text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
      
{/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 dark:bg-[#161924] dark:border-slate-800/80 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Cari admin terdaftar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 dark:bg-[#1e2230] dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
                  onClick={() => {
                    setContacts(prevContacts =>
                      prevContacts.map(c => c.name === contact.name ? { ...c, unreadCount: 0 } : c)
                    );
                    setActiveContact(contact);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-slate-200 border-l-4 border-purple-600 shadow-sm dark:bg-[#25293d]' 
                      : 'hover:bg-slate-100 dark:hover:bg-[#1e2230]/60'
                  }`}
                >
<div className="relative w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-slate-700 dark:text-slate-200">
  {contact.avatar ? (
    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
  ) : (
    <span>{contact.name.substring(0, 2).toUpperCase()}</span>
  )}

  {/* TITIK HIJAU LEBIH JELAS & BERCAHAYA */}
  {contact.online && (
    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#161924] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
  )}
</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{contact.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{contact.preview}</p>
                  </div>

                  {/* Badge Unread Count */}
                  {contact.unreadCount && contact.unreadCount > 0 ? (
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {contact.unreadCount}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              Tidak ada admin lain yang ditemukan.
            </div>
          )}
        </div>

<div className="p-3 bg-slate-50 border-t border-slate-200 dark:bg-[#13151f] dark:border-slate-800/80 flex items-center justify-between">
  <div className="flex items-center gap-2.5">
    <div className="relative w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
      {currentUser.substring(0, 2).toUpperCase()}
      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-[#13151f] rounded-full"></span>
    </div>
    <div className="min-w-0">
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">Login: {currentUser}</span>
      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
    </div>
  </div>
  <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
    <Settings className="w-4 h-4" />
  </button>
</div>
      </aside>

{/* RUANG CHAT UTAMA */}
<main className="flex-1 flex flex-col bg-white text-slate-900 dark:bg-[#1b1e2b] dark:text-slate-100 min-w-0">
  {activeContact ? (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 dark:bg-[#1b1e2b] dark:border-slate-800/60">
        <div>
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">{activeContact.name}</h2>
          {isTyping ? (
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold animate-pulse">
              ✍️ {activeContact.name} sedang mengetik...
            </p>
          ) : (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">● Status: Online (Admin)</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <button 
  onClick={startCall} // <-- Sambungkan ke fungsi WebRTC
  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
  title="Video Call"
>
  📹
</button>
          <button className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">📹</button>
          
          {/* Dropdown Menu Container */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              •••
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 dark:bg-[#161924] dark:border-slate-800">
                <button
                  onClick={handleClearMessages}
                  className="w-full text-left px-4 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-[#1e2230] transition-colors flex items-center gap-2 font-medium cursor-pointer"
                >
                  🗑️ Bersihkan Pesan
                </button>
              </div>
            )}
          </div>
        </div>
      </header>



{/* MODAL VIDEO CALL */}
{isCallActive && (
  <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
    <div className="relative w-full max-w-4xl bg-[#161924] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center gap-4">
      <div className="text-white text-xs font-semibold">
        Sedang Berpanggilan dengan {activeContact.name}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Video Lawan Bicara */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 text-[10px] bg-black/60 text-white px-2 py-1 rounded">
            {activeContact.name}
          </span>
        </div>

        {/* Video Diri Sendiri */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 text-[10px] bg-black/60 text-white px-2 py-1 rounded">
            Saya (Anda)
          </span>
        </div>
      </div>

      {/* Tombol Tutup / Akhiri Panggilan */}
      <button 
        onClick={endCall}
        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg mt-2"
      >
        Akhiri Panggilan ✕
      </button>
    </div>
  </div>
)}


            {/* HEADER CHAT */}
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1b1e2b]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  {activeContact.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeContact.name}</h3>
                  <span className="text-[10px] text-emerald-500 font-medium">Aktif</span>
                </div>
              </div>
            </header>

            {/* DAFTAR PESAN + HOVER TITIK TIGA */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-slate-50 dark:bg-[#1b1e2b]">
              <div className="text-center my-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-[#161924] px-3 py-1 rounded-full shadow-sm">
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
                  const msgId = msg.id || index;
                  const isHovered = hoveredMessageId === msgId;
                  const isEditing = editingMessageId === msgId;
                  
                  const isImageUrl = typeof msg.message === 'string' && (
                    msg.message.match(/\.(jpeg|jpg|gif|png|webp)$/i) || 
                    msg.message.includes('supabase.co/storage/v1/object/public')
                  );

                  return (
                    <div 
                      key={msgId} 
                      className={`flex items-end gap-3 relative group ${isMe ? 'flex-row-reverse' : ''}`}
                      onMouseEnter={() => setHoveredMessageId(msgId)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
                        {msg.sender.substring(0, 2).toUpperCase()}
                      </div>

                      <div className={`max-w-[60%] space-y-1 relative ${isMe ? 'items-end' : ''}`}>
                        
                        {/* TOMBOL TITIK TIGA SAAT HOVER */}
                        {isHovered && (
                          <div className={`absolute -top-3 ${isMe ? '-left-8' : '-right-8'} z-10`}>
                            <div className="relative group/menu">
                              <button className="w-6 h-6 bg-white dark:bg-[#161924] border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-sm text-xs font-bold cursor-pointer">
                                ⋮
                              </button>

                              <div className={`absolute ${isMe ? 'right-0' : 'left-0'} top-7 hidden group-hover/menu:block bg-white dark:bg-[#161924] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 min-w-[100px] z-20 text-xs`}>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.message);
                                    alert('Pesan disalin!');
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                  Copy
                                </button>

                                {isMe && !isImageUrl && (
                                  <button 
                                    onClick={() => {
                                      setEditingMessageId(msgId);
                                      setEditText(msg.message);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                )}

                                {isMe && (
                                  <button 
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-[#7c3aed] text-white rounded-br-none' 
                            : 'bg-white text-slate-800 dark:bg-[#161924] dark:text-slate-200 rounded-bl-none font-medium border border-slate-200 dark:border-slate-800'
                        }`}>
                          {isEditing ? (
                            <div className="flex flex-col gap-2">
                              <input 
                                type="text" 
                                value={editText} 
                                onChange={(e) => setEditText(e.target.value)}
                                className="bg-white/20 dark:bg-black/30 text-white px-2 py-1 rounded text-xs focus:outline-none border border-white/30"
                                autoFocus
                              />
                              <div className="flex justify-end gap-2 text-[10px]">
                                <button onClick={() => setEditingMessageId(null)} className="hover:underline cursor-pointer">Batal</button>
                                <button onClick={() => handleSaveEdit(msg.id)} className="bg-white text-purple-700 px-2 py-0.5 rounded font-bold cursor-pointer">Simpan</button>
                              </div>
                            </div>
                          ) : isImageUrl ? (
                            <img 
                              src={msg.message} 
                              alt="Attachment" 
                              className="max-w-full max-h-60 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(msg.message)}
                            />
                          ) : (
                            msg.message
                          )}
                        </div>
                        <span className={`text-[10px] text-slate-400 dark:text-slate-500 block px-1 ${isMe ? 'text-right' : ''}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-center space-y-1">
                  <p className="text-xs">Belum ada pesan dengan {activeContact.name}.</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-600">Kirim pesan di bawah untuk memulai percakapan.</p>
                </div>
              )}

              {/* BUBBLE "SEDANG MENGETIK" */}
              {isTyping && (
                <div className="flex items-end gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
                    {activeContact.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="bg-white dark:bg-[#161924] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs font-medium shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">{activeContact.name} sedang mengetik...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* MODAL FULLSCREEN UNTUK GAMBAR */}
            {selectedImage && (
              <div 
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                  <img 
                    src={selectedImage} 
                    alt="Full Preview" 
                    className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" 
                  />
                  <button 
                    className="absolute -top-10 right-0 text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                  >
                    Tutup ✕
                  </button>
                </div>
              </div>
            )}

            {/* FORM INPUT PESAN DI BAWAH */}
            <div className="p-4 bg-white border-t border-slate-200 dark:bg-[#1b1e2b] dark:border-slate-800/80 shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 dark:bg-[#161924] dark:border-slate-800 focus-within:border-purple-500 transition-colors shadow-lg">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingImage}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  title="Kirim Gambar"
                >
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> : <ImageIcon className="w-4 h-4" />}
                </button>

                <button type="button" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>

                <input 
                  type="text" 
                  placeholder={`Kirim pesan ke ${activeContact.name} dengan ramah...`}
                  value={newMessage}
                  onChange={handleInputChange} 
                  className="flex-1 bg-transparent text-xs md:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
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
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs">
            Pilih kontak di sebelah kiri untuk mulai chat.
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white dark:bg-[#1b1e2b] text-slate-800 dark:text-white">Memuat halaman pesan...</div>}>
      <ChatContent />
    </Suspense>
  );
}