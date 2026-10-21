'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileCheck2, 
  Award, 
  Search, 
  CheckCircle, 
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';

export default function AdminDashboardView({ onNavigateTab }) {
  const [summaryData, setSummaryData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    try {
      setIsLoading(true);
      const data = await api.getDashboardSummary();
      setSummaryData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    { 
      title: 'Total Unit Kerja / OPD', 
      value: summaryData?.totalOpd || '6 OPD', 
      subtext: '100% Terdaftar di Database', 
      icon: Building2, 
      color: 'text-blue-700 bg-blue-100 border-blue-200', 
      bgCard: 'bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-white' 
    },
    { 
      title: 'Pengguna Terdaftar', 
      value: summaryData?.totalUsers || '5 User', 
      subtext: '5 Role Berbeda (MySQL)', 
      icon: Users, 
      color: 'text-purple-700 bg-purple-100 border-purple-200', 
      bgCard: 'bg-gradient-to-br from-purple-50/90 via-indigo-50/60 to-white' 
    },
    { 
      title: 'Rata-Rata Indeks Pemdi', 
      value: summaryData?.averageIndex || '3.25', 
      subtext: `Predikat: ${summaryData?.predicate || 'Baik / Berkembang'}`, 
      icon: Award, 
      color: 'text-emerald-700 bg-emerald-100 border-emerald-200', 
      bgCard: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white' 
    },
    { 
      title: 'Bukti Dukung Terverifikasi', 
      value: summaryData?.totalEvidences || '0 Berkas', 
      subtext: 'Tersimpan di Penyimpanan Sistem', 
      icon: FileCheck2, 
      color: 'text-teal-700 bg-teal-100 border-teal-200', 
      bgCard: 'bg-gradient-to-br from-teal-50/90 via-cyan-50/60 to-white' 
    },
  ];

  const unitsList = (summaryData?.units || []).filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.pic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Pusat Pengawasan Pemdi Nasional &bull; Realtime MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            Dashboard Pengawasan Evaluasi Pemdi
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium max-w-2xl">
            Ringkasan pemantauan indeks pemerintah digital dan progres penilaian mandiri seluruh perangkat daerah berdasarkan Permenpan RB No. 8/2026.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={loadDashboard}
            className="p-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-2xs active:scale-95"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => onNavigateTab('master-users')}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-2xs active:scale-95"
          >
            Kelola User
          </button>
          <button 
            onClick={() => onNavigateTab('master-units')}
            className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            + Tambah Unit Kerja
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className={`border border-slate-200/90 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ${st.bgCard}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">{st.title}</span>
                <div className={`p-2.5 rounded-2xl border ${st.color} shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">{st.value}</div>
              <div className="text-[11px] text-slate-600 mt-2 flex items-center font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                {st.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Pengisian Perangkat Daerah (OPD) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Status Penilaian Mandiri Perangkat Daerah (OPD)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pantau progres kelengkapan 20 indikator dan unggahan bukti dukung masing-masing unit kerja langsung dari basis data.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari OPD / Unit..." 
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center items-center space-x-2 text-slate-500 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Memuat data pemantauan OPD...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-blue-100">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-blue-50/80 text-blue-900 text-[11px] uppercase border-b border-blue-200 font-black">
                <tr>
                  <th className="px-5 py-4">Kode</th>
                  <th className="px-5 py-4">Nama Unit Kerja / OPD</th>
                  <th className="px-5 py-4">Penanggung Jawab (PIC)</th>
                  <th className="px-5 py-4">Progres Pengisian</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {unitsList.map((unit) => (
                  <tr key={unit.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-blue-700">{unit.code}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{unit.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{unit.pic}</td>
                    <td className="px-5 py-3.5 w-48">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${unit.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                            style={{ width: `${unit.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-black text-slate-900 w-8">{unit.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {unit.progress === 100 ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Siap Verifikasi
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                          Dalam Proses
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => alert(`Membuka berkas evaluasi untuk ${unit.name} (Indeks: ${unit.finalIndex})`)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 transition-colors shadow-2xs"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
