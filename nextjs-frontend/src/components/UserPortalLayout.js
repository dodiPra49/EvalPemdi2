'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  LogOut, 
  FileCheck2, 
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import UserEvaluasiView from './UserEvaluasiView';

export default function UserPortalLayout({ user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Colorful Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-teal-500 via-indigo-500 to-emerald-500" />

      {/* User Header */}
      <header className="sticky top-0 z-50 bg-white/95 border-b border-slate-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* User Identity & Portal Name */}
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center shadow-md shadow-teal-500/25 ring-2 ring-teal-100">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    EVAL-PEMDI
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full tracking-wider uppercase shadow-xs">
                    Portal Pengguna
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center text-teal-700 font-bold">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    {user.unit || 'Dinas Komunikasi dan Informatika'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                    Tahun Anggaran 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Profile & Logout Action */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-extrabold text-slate-800 block">{user.name}</span>
                <span className="text-[11px] text-teal-700 font-mono font-bold">NIP. {user.nip}</span>
              </div>

              <button
                onClick={onLogout}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center space-x-1.5 transition-colors shadow-2xs active:scale-95"
                title="Keluar dari Portal Pengguna"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub Header Ribbon with vivid, cheerful pastel tone */}
        <div className="bg-gradient-to-r from-blue-50/90 via-teal-50/70 to-indigo-50/90 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instrumen Penilaian Mandiri 20 Indikator Kinerja Pemerintah Digital (Permenpan RB No. 8/2026)</span>
            </div>
            <div className="text-[11px] font-bold text-slate-700 hidden sm:block">
              Peran: <span className="uppercase text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-teal-200 shadow-2xs font-extrabold">{user.role?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Evaluasi Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserEvaluasiView user={user} />
      </main>

      {/* User Footer */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-md py-5 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Portal Evaluasi Kinerja Pemerintah Digital &bull; Permenpan RB Nomor 8 Tahun 2026</span>
          <span className="text-[11px] text-teal-800 font-bold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
            Unit Pelaksana: {user.unit}
          </span>
        </div>
      </footer>
    </div>
  );
}
