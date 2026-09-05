'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Import komponen react-leaflet secara dinamis di dalam file widget agar aman dari SSR
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

interface MapWidgetProps {
  sourceLang: string;
  targetLang: string;
  getLanguageName: (code: string) => string;
}

const langCoordinates: Record<string, [number, number]> = {
  id: [-0.7893, 113.9213],
  en: [55.3781, -3.4360],
  es: [40.4637, -3.7492],
  fr: [46.2276, 2.2137],
  de: [51.1657, 10.4515],
  ja: [36.2048, 138.2529],
  ar: [23.8859, 45.0792],
  zh: [35.8617, 104.1954],
  hi: [20.5937, 78.9629],
  ru: [61.5240, 105.3188],
};

const getCoordinates = (code: string): [number, number] => {
  const baseCode = code.split('-')[0];
  return langCoordinates[baseCode] || [-0.7893, 113.9213];
};

export default function MapWidget({ sourceLang, targetLang, getLanguageName }: MapWidgetProps) {
  // Perbaikan icon marker Leaflet agar hanya berjalan di browser (Client-side)
  if (typeof window !== 'undefined') {
    import('leaflet').then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
  }

  return (
    <MapContainer
      center={[3.1390, 101.6869]}
      zoom={10}
      maxZoom={19}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%', zIndex: 1 }}
      attributionControl={false}
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
  );
}