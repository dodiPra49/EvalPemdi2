'use client';

import React from 'react';
import { Award, TrendingUp, BarChart3 } from 'lucide-react';

export default function ScoreOverviewCard({ answers = {}, aspects = [], indicators = [] }) {
  let totalWeightedScore = 0;
  
  // Theme palette for each of the 7 aspects
  const aspectThemes = [
    { border: 'border-blue-200', bg: 'bg-blue-50/70 hover:bg-blue-100/70', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500' },
    { border: 'border-teal-200', bg: 'bg-teal-50/70 hover:bg-teal-100/70', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-800 border-teal-300', dot: 'bg-teal-500' },
    { border: 'border-indigo-200', bg: 'bg-indigo-50/70 hover:bg-indigo-100/70', text: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-500' },
    { border: 'border-sky-200', bg: 'bg-sky-50/70 hover:bg-sky-100/70', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800 border-sky-300', dot: 'bg-sky-500' },
    { border: 'border-purple-200', bg: 'bg-purple-50/70 hover:bg-purple-100/70', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
    { border: 'border-amber-200', bg: 'bg-amber-50/70 hover:bg-amber-100/70', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
    { border: 'border-rose-200', bg: 'bg-rose-50/70 hover:bg-rose-100/70', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' },
  ];

  const aspectScores = aspects.map((aspect, idx) => {
    const indicatorList = indicators.filter((ind) => ind.aspectId === aspect.id);
    let aspectWeightedSum = 0;

    indicatorList.forEach((ind) => {
      const userLevel = answers[ind.number]?.level || 3;
      const weightDecimal = (parseFloat(ind.weight) || 5.0) / 100.0;
      aspectWeightedSum += weightDecimal * userLevel;
      totalWeightedScore += weightDecimal * userLevel;
    });

    const aspectWeightDecimal = (parseFloat(aspect.weight) || 10.0) / 100.0;
    const aspectIndex = aspectWeightDecimal > 0 ? aspectWeightedSum / aspectWeightDecimal : 0;

    return {
      ...aspect,
      calculatedIndex: aspectIndex.toFixed(2),
      indicatorsCount: indicatorList.length,
      theme: aspectThemes[idx % aspectThemes.length]
    };
  });

  const finalIndex = totalWeightedScore.toFixed(2);

  // Predikat Sesuai Tabel 4 Halaman 38 Permenpan 8/2026
  let predicate = 'Kurang / Merintis';
  let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

  if (finalIndex > 4.00) {
    predicate = 'Memuaskan / Unggul (Leading)';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (finalIndex > 3.50) {
    predicate = 'Sangat Baik / Melembaga (Embedded)';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (finalIndex > 2.50) {
    predicate = 'Baik / Berkembang (Developing)';
    badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
  } else if (finalIndex > 1.50) {
    predicate = 'Cukup / Membangun (Emerging)';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  const answeredCount = Object.keys(answers).length;
  const totalIndicatorsCount = indicators.length || 20;
  const progressPercent = Math.min(100, Math.round((answeredCount / totalIndicatorsCount) * 100));

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden mb-8">
      {/* Soft Radiant Background Accents */}
      <div className="absolute -right-10 -top-10 w-96 h-96 bg-gradient-to-br from-sky-200/40 via-indigo-200/30 to-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-amber-200/20 to-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Main Score Widget */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/90 via-sky-50/80 to-indigo-50/70 border-2 border-blue-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-blue-600" /> Hasil Penilaian Mandiri
            </span>
            <span className="text-[11px] px-3 py-0.5 rounded-full font-extrabold bg-white text-blue-700 border border-blue-200 shadow-2xs">
              Tahun 2026
            </span>
          </div>

          <div className="my-5 flex items-baseline space-x-3">
            <div className="text-5xl sm:text-6xl font-black tracking-tight text-blue-950 font-mono">
              {finalIndex}
            </div>
            <div className="text-sm text-slate-700 font-bold">
              / 5.00 <span className="text-xs block text-slate-500 font-medium">Skala Indeks Pemdi</span>
            </div>
          </div>

          <div>
            <div className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-black border ${badgeColor} mb-4 shadow-2xs`}>
              <TrendingUp className="w-4 h-4 mr-1.5" />
              {predicate}
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-bold">
                <span>Kelengkapan Pengisian</span>
                <span className="text-blue-700">{answeredCount} dari {totalIndicatorsCount} Indikator ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200/90 rounded-full h-3 overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown 7 Aspek */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center">
              <BarChart3 className="w-4 h-4 mr-1.5 text-blue-600" /> Rincian Capaian 7 Aspek (Permenpan 8/2026)
            </h3>
            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Skala Capaian 1.0 - 5.0
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {aspectScores.map((aspect) => (
              <div 
                key={aspect.id}
                className={`border rounded-2xl p-3.5 transition-all shadow-2xs ${aspect.theme?.border || 'border-blue-200'} ${aspect.theme?.bg || 'bg-blue-50/70'}`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2 truncate max-w-[190px]">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${aspect.theme?.dot || 'bg-blue-500'}`} />
                    <span className={`font-extrabold truncate ${aspect.theme?.text || 'text-blue-900'}`} title={aspect.name}>
                      {aspect.id}. {aspect.name}
                    </span>
                  </div>
                  <span className={`font-mono font-black ml-2 px-2.5 py-0.5 rounded-lg text-[11px] border shadow-2xs ${aspect.theme?.badge || 'bg-blue-100 text-blue-800'}`}>
                    {aspect.calculatedIndex}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold pl-4.5">
                  <span>Bobot: {aspect.weight}%</span>
                  <span>{aspect.indicatorsCount} Indikator</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
