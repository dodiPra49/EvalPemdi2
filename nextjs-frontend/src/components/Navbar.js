'use client';

import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  Building2, 
  FolderDown, 
  LayoutDashboard,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole }) {
  const tabs = [
    { id: 'evaluasi', label: 'Evaluasi Mandiri (User)', icon: FileText, badge: '20 Indikator' },
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'master-users', label: 'Master User', icon: Users, badge: '6 Akun' },
    { id: 'master-units', label: 'Master Unit Kerja', icon: Building2, badge: '6 OPD' },
    { id: 'master-templates', label: 'Master Template', icon: FolderDown, badge: '21 File' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  EVAL-PEMDI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" /> Permenpan RB No. 8/2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Portal Evaluasi Kinerja Pemerintah Digital Terpadu
              </p>
            </div>
          </div>

          {/* Role Switcher & User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">
                {currentRole === 'admin' ? 'Dodi Agusri, S.Kom' : 'Rahmat Pratama, S.STP'}
              </span>
              <span className="text-[11px] text-slate-400">
                {currentRole === 'admin' ? 'Administrator Sistem' : 'Operator Dinas Kominfo'}
              </span>
            </div>

            {/* Switch Role Button */}
            <button
              onClick={() => {
                const nextRole = currentRole === 'admin' ? 'user' : 'admin';
                setCurrentRole(nextRole);
                if (nextRole === 'admin' && activeTab === 'evaluasi') {
                  setActiveTab('admin-dashboard');
                } else if (nextRole === 'user' && activeTab.startsWith('master') || activeTab === 'admin-dashboard') {
                  setActiveTab('evaluasi');
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300 hover:text-white hover:border-indigo-500 shadow-sm"
              title="Klik untuk beralih perspektif Role"
            >
              <span>Mode: <strong className="text-white uppercase">{currentRole}</strong></span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-md font-bold ${
                      isActive
                        ? 'bg-indigo-800/60 text-indigo-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
