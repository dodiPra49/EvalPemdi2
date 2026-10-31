import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { 
  Building2, 
  Users, 
  FileCheck2, 
  Award, 
  Search, 
  Sparkles,
  ArrowRight,
  FolderDown
} from 'lucide-react';

export default function Dashboard({ stats = {}, recentEvaluations = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const statCards = [
    { 
      title: 'Total Unit Kerja / OPD', 
      value: `${stats.total_units || 0} OPD`, 
      subtext: 'Terdaftar di Database Eloquent', 
      icon: Building2, 
      color: 'text-blue-600 bg-blue-50 border-blue-200' 
    },
    { 
      title: 'Pengguna Terdaftar', 
      value: `${stats.total_users || 0} Pengguna`, 
      subtext: 'Role Admin, Koordinator & Asesor', 
      icon: Users, 
      color: 'text-sky-600 bg-sky-50 border-sky-200' 
    },
    { 
      title: 'Master Template Bukti', 
      value: `${stats.total_templates || 0} Berkas`, 
      subtext: 'Format Resmi .DOCX & .XLSX', 
      icon: FolderDown, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200' 
    },
    { 
      title: 'Evaluasi Instansi Aktif', 
      value: `${stats.active_evaluations || 0} Sesi`, 
      subtext: 'PermenPANRB No. 8/2026', 
      icon: Award, 
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200' 
    },
  ];

  const filteredEvaluations = recentEvaluations.filter(ev => 
    ev.work_unit?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.predicate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-16">
      <Head title="Admin Dashboard - EVAL-PEMDI" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner Title */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black mb-2 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
              Pusat Pengawasan Evaluasi Pemdi Nasional 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950">
              Dashboard Administrator
            </h1>
            <p className="text-sm text-blue-800/80 font-bold mt-1 max-w-2xl">
              Pemantauan indeks pemerintah digital dan progres penilaian mandiri perangkat daerah berbasis Laravel + Inertia.js.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            >
              Kelola Pengguna
            </Link>
            <Link
              href="/admin/units"
              className="px-4 py-2 text-xs font-bold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            >
              Kelola Unit Kerja
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-blue-950">{card.title}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-950">{card.value}</div>
                <p className="text-xs text-blue-600 font-bold mt-1">{card.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Evaluations Table */}
        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-blue-950">
                Daftar Penilaian Mandiri Perangkat Daerah
              </h3>
              <p className="text-xs text-blue-700 font-bold">
                Status evaluasi tahun anggaran 2026
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari OPD atau Predikat..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-blue-50/50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-blue-100">
            <table className="w-full text-left text-sm text-blue-950">
              <thead className="bg-blue-50 text-blue-950 text-xs uppercase font-black border-b border-blue-200">
                <tr>
                  <th className="px-5 py-3.5">Perangkat Daerah / OPD</th>
                  <th className="px-5 py-3.5">Tahun</th>
                  <th className="px-5 py-3.5">Indeks Simulasi</th>
                  <th className="px-5 py-3.5">Predikat Kematangan</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredEvaluations.length > 0 ? (
                  filteredEvaluations.map((ev) => (
                    <tr key={ev.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-black text-blue-950">
                        {ev.work_unit?.name || 'Unit Kerja'}
                      </td>
                      <td className="px-5 py-3.5 font-bold font-mono text-xs text-blue-600">
                        {ev.year}
                      </td>
                      <td className="px-5 py-3.5 font-black font-mono text-base text-blue-900">
                        {ev.final_index_pemdi?.toFixed(2) || '1.00'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                          {ev.predicate || 'Kurang / Merintis'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-2xs font-black uppercase ${
                          ev.status === 'submitted' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href="/evaluasi"
                          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <span>Buka Evaluasi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-blue-600/70 font-bold italic">
                      Belum ada data evaluasi yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
