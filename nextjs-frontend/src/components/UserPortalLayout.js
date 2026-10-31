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
    <div 
      className="min-h-screen flex flex-col font-sans bg-[#f0f7ff] text-[#0c2340]"
      style={{ backgroundColor: '#f0f7ff', color: '#0c2340' }}
    >
      {/* Top Colorful Accent Ribbon in vivid electric blues */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-sky-400 to-cyan-300" />

      {/* User Header in Crystalline White */}
      <header className="sticky top-0 z-50 bg-white/95 border-b border-blue-100 shadow-sm shadow-blue-500/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* User Identity & Portal Name */}
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/30 ring-2 ring-blue-100">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-xl tracking-tight text-blue-950">
                    EVAL-PEMDI
                  </span>
                  <span className="px-3 py-1 text-xs font-black bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full tracking-wider uppercase shadow-xs">
                    Portal Pengguna
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-900/80 font-bold">
                  <span className="flex items-center text-blue-700 font-extrabold">
                    <Building2 className="w-4 h-4 mr-1 text-blue-600" />
                    {user.unit || 'Dinas Komunikasi dan Informatika'}
                  </span>
                  <span className="text-blue-300">&bull;</span>
                  <span className="flex items-center text-sky-700 font-bold">
                    <Calendar className="w-4 h-4 mr-1 text-sky-500" />
                    Tahun Anggaran 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Profile & Logout Action */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-sm font-black text-blue-950 block">{user.name}</span>
                <span className="text-xs text-blue-600 font-mono font-bold">NIP. {user.nip}</span>
              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2.5 text-sm font-bold rounded-xl border-2 border-rose-200 bg-white hover:bg-rose-50 text-rose-600 flex items-center space-x-1.5 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                title="Keluar dari Portal Pengguna"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub Header Ribbon with vivid, cheerful blue & white tone */}
        <div className="bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-white border-t border-blue-100 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-blue-950 font-bold">
              <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <span>
                {user?.unit_code?.toUpperCase().includes('BKPSDM') || user?.unit?.toUpperCase().includes('BKPSDM') || user?.unit?.toLowerCase().includes('kepegawaian')
                  ? 'Instrumen Penilaian Mandiri BKPSDM: Indikator 3 (SDM Pemerintah Digital) • Permenpan RB No. 8/2026'
                  : 'Instrumen Penilaian Mandiri 20 Indikator Kinerja Pemerintah Digital (Permenpan RB No. 8/2026)'}
              </span>
            </div>
            <div className="text-xs font-bold text-blue-900 hidden sm:block">
              Peran: <span className="uppercase text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-2xs font-extrabold">{user.role?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Evaluasi Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserEvaluasiView user={user} />
      </main>

      {/* User Footer in clean white with bright blue accents */}
      <footer className="border-t border-blue-100 bg-white/95 backdrop-blur-md py-6 text-center text-sm text-blue-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-blue-950">EVAL-PEMDI Portal &bull; Permenpan RB Nomor 8 Tahun 2026</span>
          <span className="text-xs text-blue-700 font-extrabold bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full shadow-2xs">
            Unit Pelaksana: {user.unit}
          </span>
        </div>
      </footer>
    </div>
  );
}
