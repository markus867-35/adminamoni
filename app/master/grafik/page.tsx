'use client';
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, LineSeries, HistogramSeries } from 'lightweight-charts';

export default function ExactSoSoValueChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 900 });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#070913' }, // Hitam gelap pekat ala SoSoValue
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#111827' },
        horzLines: { color: '#111827' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
      rightPriceScale: {
        borderColor: '#1f2937',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      leftPriceScale: {
        visible: true, // Mengaktifkan skala kiri untuk garis aset
        borderColor: '#1f2937',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
    });

    // 1. Histogram Inflow (Batang tipis rapat di bagian atas-tengah)
    const inflowSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'right', 
    });

    // Perbanyak data tiruan dengan rentang harian agar batangnya jadi rapat dan tipis
    inflowSeries.setData([
      { time: '2024-01-10', value: 400, color: '#22c55e' },
      { time: '2024-01-11', value: 250, color: '#22c55e' },
      { time: '2024-01-12', value: -120, color: '#ef4444' },
      { time: '2024-01-13', value: 300, color: '#22c55e' },
      { time: '2024-01-14', value: 550, color: '#22c55e' },
      { time: '2024-01-15', value: -200, color: '#ef4444' },
      { time: '2024-01-16', value: 150, color: '#22c55e' },
      { time: '2024-01-17', value: 480, color: '#22c55e' },
      { time: '2024-01-18', value: 320, color: '#22c55e' },
      { time: '2024-01-19', value: -90, color: '#ef4444' },
      { time: '2024-01-20', value: 600, color: '#22c55e' },
    ]);

    // 2. Line Series Putih (Total Net Assets - di sumbu kiri/kanan terpisah)
    const assetsSeries = chart.addSeries(LineSeries, {
      color: '#ffffff',
      lineWidth: 2,
      priceScaleId: 'left', // Menggunakan skala kiri agar posisinya independen
    });

    assetsSeries.setData([
      { time: '2024-01-10', value: 40 },
      { time: '2024-01-11', value: 43 },
      { time: '2024-01-12', value: 42 },
      { time: '2024-01-13', value: 47 },
      { time: '2024-01-14', value: 50 },
      { time: '2024-01-15', value: 52 },
      { time: '2024-01-16', value: 55 },
      { time: '2024-01-17', value: 58 },
      { time: '2024-01-18', value: 60 },
      { time: '2024-01-19', value: 63 },
      { time: '2024-01-20', value: 66 },
    ]);

    // 3. Line Series Oranye (BTC Price - di bawah)
    const priceSeries = chart.addSeries(LineSeries, {
      color: '#f97316',
      lineWidth: 2,
      priceScaleId: 'left',
    });

    priceSeries.setData([
      { time: '2024-01-10', value: 25 },
      { time: '2024-01-11', value: 26 },
      { time: '2024-01-12', value: 25.5 },
      { time: '2024-01-13', value: 28 },
      { time: '2024-01-14', value: 29 },
      { time: '2024-01-15', value: 30 },
      { time: '2024-01-16', value: 31 },
      { time: '2024-01-17', value: 32 },
      { time: '2024-01-18', value: 33 },
      { time: '2024-01-19', value: 34 },
      { time: '2024-01-20', value: 35 },
    ]);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="bg-[#070913] border border-slate-800/80 rounded-xl p-4 shadow-2xl">
      {/* Header Info ala SoSoValue */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium mb-4 text-slate-300">
        <div className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-400">Daily Total Net Inflow</span>
          <span className="text-red-400 font-bold">-$903.11M</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span className="text-slate-400">Total Net Assets</span>
          <span className="text-white font-bold">$113.02B</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-md border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span className="text-slate-400">BTC Price</span>
          <span className="text-orange-400 font-bold">$86,462.97</span>
        </div>
      </div>

      {/* Area Grafik */}
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}