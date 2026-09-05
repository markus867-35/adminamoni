'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Globe, Sparkles, Trash2, MapPin, Search } from 'lucide-react';

export default function TranslationPage() {
  const [sourceLang, setSourceLang] = useState('id');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [searchQuery, setSearchQuery] = useState('Istana Casino Poipet');
  const [mapLocation, setMapLocation] = useState('Istana Casino Poipet');

  const languages = [
    { code: 'ar', name: 'Arab' },
    { code: 'zh', name: 'Tionghoa (Sederhana)' },
    { code: 'nl', name: 'Belanda' },
    { code: 'en', name: 'Inggris' },
    { code: 'fr', name: 'Prancis' },
    { code: 'de', name: 'Jerman' },
    { code: 'hi', name: 'Hindi' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'it', name: 'Italia' },
    { code: 'ja', name: 'Jepang' },
    { code: 'ko', name: 'Korea' },
    { code: 'pt', name: 'Portugis' },
    { code: 'ru', name: 'Rusia' },
    { code: 'es', name: 'Spanyol' },
  ];

  // Terjemahan Client-Side langsung ke Google GTX tanpa error 500 API backend
  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal terjemahan');
        
        const data = await response.json();
        if (data && data[0]) {
          const result = data[0].map((item: any) => item[0]).join('');
          setTranslatedText(result);
        } else {
          setTranslatedText('Gagal menerjemahkan teks.');
        }
      } catch (error) {
        setTranslatedText('Terjadi kesalahan jaringan.');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [sourceText, sourceLang, targetLang]);

  const handleSwapLanguage = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMapLocation(searchQuery);
    }
  };

  return (
    <div className="min-h-screen text-[var(--foreground,inherit)] bg-[var(--background,transparent)] p-4 md:p-8 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* Header Judul */}
        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Google GTX Translator</h1>
            <p className="text-xs opacity-70">Terjemahan akurat instan lintas bahasa dunia.</p>
          </div>
        </div>

        {/* Kotak Translator */}
        <div className="w-full flex flex-col shadow-2xl">
          <div className="border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-t-2xl p-4 flex items-center justify-between backdrop-blur-md">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-transparent focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-black dark:text-white">
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSwapLanguage}
              className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
              title="Tukar Bahasa"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-transparent focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-black dark:text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-x border-b border-black/10 dark:border-white/10 rounded-b-2xl bg-black/5 dark:bg-white/[0.02] backdrop-blur-md">
            <div className="p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
              <textarea
                rows={5}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Ketik sesuatu di sini..."
                className="w-full bg-transparent placeholder-black/40 dark:placeholder-white/40 text-sm resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 mt-2 opacity-80">
                <span className="text-xs">{sourceText.length} karakter</span>
                {sourceText && (
                  <button
                    onClick={() => {
                      setSourceText('');
                      setTranslatedText('');
                    }}
                    className="p-2 hover:text-red-500 transition cursor-pointer"
                    title="Hapus Teks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between bg-black/[0.02] dark:bg-white/[0.01]">
              <div className="w-full text-sm min-h-[120px] whitespace-pre-wrap relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center gap-2 opacity-50">
                    <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="animate-pulse">Menerjemahkan dengan Google...</span>
                  </div>
                )}
                {!isLoading && (
                  translatedText || <span className="opacity-40">Hasil terjemahan otomatis akan muncul di sini...</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 mt-2 opacity-80">
                <span className="text-xs">Google GTx Translator</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    disabled={Boolean(!translatedText)}
                    className="p-2 transition rounded-lg disabled:opacity-40 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                    title="Salin Teks"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Interaktif & Kolom Pencarian Tempat */}
        <div className="w-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4 px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-semibold tracking-wide">Pencarian & Peta Google Maps</h2>
            </div>
            
            {/* Form Input Cari Lokasi */}
            <form onSubmit={handleSearchMap} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tempat atau kota..."
                  className="text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 focus:outline-none focus:border-blue-500 transition w-60"
                />
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition cursor-pointer flex items-center justify-center shadow-sm"
                title="Cari Lokasi di Peta"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bingkai Google Maps Embed dengan Lapisan Pelindung (Overlay Block) */}
          <div className="relative w-full h-[800px] rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/10 shadow-inner">
            <iframe
              title="Google Maps Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            ></iframe>

            {/* Kotak Transparan Penahan Klik (Overlay) agar tombol pop-up Google tidak bisa diklik dan membuka tab baru */}
            <div 
              className="absolute top-3 right-3 w-12 h-12 z-10 cursor-pointer bg-transparent"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Area Terkunci"
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}