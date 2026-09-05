'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Globe, Sparkles, Trash2, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan icon marker Leaflet agar tidak hilang
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Import komponen Leaflet secara dinamis khusus client-side (SSR false)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function TranslationPage() {
  const [sourceLang, setSourceLang] = useState('id');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMapSyncing, setIsMapSyncing] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsMapSyncing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const langCoordinates: Record<string, [number, number]> = {
    id: [-0.7893, 113.9213], // Indonesia
    en: [55.3781, -3.4360],  // Inggris / UK
    es: [40.4637, -3.7492],  // Spanyol
    fr: [46.2276, 2.2137],   // Prancis
    de: [51.1657, 10.4515],  // Jerman
    ja: [36.2048, 138.2529], // Jepang
    ar: [23.8859, 45.0792],  // Arab
    zh: [35.8617, 104.1954], // Tiongkok
    hi: [20.5937, 78.9629],  // India
    ru: [61.5240, 105.3188], // Rusia
  };

  const getCoordinates = (code: string): [number, number] => {
    const baseCode = code.split('-')[0];
    return langCoordinates[baseCode] || [-0.7893, 113.9213];
  };

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

  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: sourceText,
            source: sourceLang,
            target: targetLang,
          }),
        });
        const data = await response.json();
        if (data && data.translatedText) {
          setTranslatedText(data.translatedText);
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

  const getLanguageName = (code: string) => {
    const found = languages.find((l) => l.code === code);
    return found ? found.name : code;
  };

  return (
    <div className="min-h-screen text-[var(--foreground,inherit)] bg-[var(--background,transparent)] p-4 md:p-8 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-9xl mx-auto flex flex-col gap-6">
        {/* Tambahkan tag link Leaflet CSS di sini */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
        {/* Header Judul */}
        <div className="flex items-center gap-3">
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

        {/* Peta Dunia Interaktif */}
        <div className="w-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-semibold tracking-wide">Peta Interaktif Wilayah Bahasa</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>Asal: <strong className="text-blue-500">{getLanguageName(sourceLang)}</strong></span>
              <span>Tujuan: <strong className="text-emerald-500">{getLanguageName(targetLang)}</strong></span>
            </div>
          </div>

          <div className="relative w-full h-[800px] rounded-xl border border-black/10 dark:border-white/10 overflow-hidden z-0">
            {isMounted && MapContainer && TileLayer && Marker && Popup ? (
              <MapContainer
                center={[3.1390, 101.6869]}
                zoom={10}
                maxZoom={19}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%', zIndex: 1 }}
                attributionControl={false}
                key="single-file-map"
              >
                <TileLayer 
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  maxZoom={19}
                />
                
                <Marker position={getCoordinates(sourceLang)}>
                  <Popup>
                    <div className="text-xs font-sans">
                      <strong>Bahasa Asal:</strong> {getLanguageName(sourceLang)}
                    </div>
                  </Popup>
                </Marker>

                <Marker position={getCoordinates(targetLang)}>
                  <Popup>
                    <div className="text-xs font-sans">
                      <strong>Bahasa Tujuan:</strong> {getLanguageName(targetLang)}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-black/5 dark:bg-white/5">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-medium">Memuat Peta...</span>
              </div>
            )}

            {/* Overlay Sinkronisasi */}
            {isMapSyncing && (
              <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 transition-opacity duration-500">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-medium tracking-wide">Menyinkronkan Peta...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}