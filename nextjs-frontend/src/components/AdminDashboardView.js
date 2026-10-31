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
      color: 'text-blue-600 bg-blue-50 border-blue-200', 
      bgCard: 'bg-white border-2 border-blue-100 hover:border-blue-300' 
    },
    { 
      title: 'Pengguna Terdaftar', 
      value: summaryData?.totalUsers || '5 User', 
      subtext: '5 Role Berbeda (MySQL)', 
      icon: Users, 
      color: 'text-sky-600 bg-sky-50 border-sky-200', 
      bgCard: 'bg-white border-2 border-sky-100 hover:border-sky-300' 
    },
    { 
      title: 'Rata-Rata Indeks Pemdi', 
      value: summaryData?.averageIndex || '3.25', 
      subtext: `Predikat: ${summaryData?.predicate || 'Baik / Berkembang'}`, 
      icon: Award, 
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200', 
      bgCard: 'bg-white border-2 border-cyan-100 hover:border-cyan-300' 
    },
    { 
      title: 'Bukti Dukung Terverifikasi', 
      value: summaryData?.totalEvidences || '0 Berkas', 
      subtext: 'Tersimpan di Penyimpanan Sistem', 
      icon: FileCheck2, 
      color: 'text-blue-600 bg-blue-50 border-blue-200', 
      bgCard: 'bg-white border-2 border-blue-100 hover:border-blue-300' 
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-500/5">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-black mb-2.5 border border-blue-200">
            <Sparkles className="w-4 h-4 mr-1.5 text-sky-500" />
            Pusat Pengawasan Pemdi Nasional &bull; Realtime MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight flex items-center">
            Dashboard Pengawasan Evaluasi Pemdi
          </h1>
          <p className="text-sm text-blue-900/80 mt-2 font-bold max-w-2xl leading-relaxed">
            Ringkasan pemantauan indeks pemerintah digital dan progres penilaian mandiri seluruh perangkat daerah berdasarkan Permenpan RB No. 8/2026.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={loadDashboard}
            className="p-3 text-sm font-bold rounded-xl bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4.5 h-4.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => onNavigateTab('master-users')}
            className="px-4.5 py-2.5 text-sm font-black rounded-xl bg-white hover:bg-blue-50 text-blue-950 border-2 border-blue-200 transition-colors shadow-2xs active:scale-95 cursor-pointer"
          >
            Kelola User
          </button>
          <button 
            onClick={() => onNavigateTab('master-units')}
            className="px-5 py-2.5 text-sm font-black rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-700 hover:to-sky-600 text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
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
            <div key={i} className={`rounded-3xl p-5.5 shadow-sm hover:shadow-lg transition-all ${st.bgCard}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">{st.title}</span>
                <div className={`p-2.5 rounded-2xl border ${st.color} shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-blue-950 font-mono tracking-tight">{st.value}</div>
              <div className="text-xs text-blue-800/80 mt-2 flex items-center font-bold">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
                {st.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Pengisian Perangkat Daerah (OPD) */}
      <div className="bg-white/95 border-2 border-blue-100 rounded-3xl p-6 shadow-xl shadow-blue-500/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-lg font-black text-blue-950">
              Status Penilaian Mandiri Perangkat Daerah (OPD)
            </h2>
            <p className="text-sm text-blue-800/70 font-bold mt-1">
              Pantau progres kelengkapan 20 indikator dan unggahan bukti dukung masing-masing unit kerja langsung dari basis data.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-blue-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari OPD / Unit..." 
              className="w-full text-sm pl-10 pr-4 py-2.5 bg-blue-50/50 border-2 border-blue-100 rounded-xl text-blue-950 placeholder-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors font-medium"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center items-center space-x-2 text-blue-700 text-sm font-bold">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Memuat data pemantauan OPD...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-blue-100">
            <table className="w-full text-left text-sm text-blue-950">
              <thead className="bg-blue-50 text-blue-950 text-xs uppercase border-b-2 border-blue-100 font-black">
                <tr>
                  <th className="px-5 py-4">Kode</th>
                  <th className="px-5 py-4">Nama Unit Kerja / OPD</th>
                  <th className="px-5 py-4">Penanggung Jawab (PIC)</th>
                  <th className="px-5 py-4">Progres Pengisian</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {unitsList.map((unit) => (
                  <tr key={unit.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-black text-blue-600">{unit.code}</td>
                    <td className="px-5 py-3.5 font-black text-blue-950 text-sm">{unit.name}</td>
                    <td className="px-5 py-3.5 text-blue-800/80 font-bold text-sm">{unit.pic}</td>
                    <td className="px-5 py-3.5 w-48">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${unit.progress === 100 ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400'}`}
                            style={{ width: `${unit.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-black text-blue-950 w-8">{unit.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {unit.progress === 100 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-2xs">
                          Siap Verifikasi
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-blue-800 border border-sky-300">
                          Dalam Proses
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => alert(`Membuka berkas evaluasi untuk ${unit.name} (Indeks: ${unit.finalIndex})`)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
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
