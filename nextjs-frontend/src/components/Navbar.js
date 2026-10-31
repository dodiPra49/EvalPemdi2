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
    <header className="sticky top-0 z-50 bg-white/95 border-b border-blue-100 text-blue-950 shadow-md shadow-blue-500/5 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/30 ring-2 ring-blue-100">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-blue-950">
                  EVAL-PEMDI
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-blue-600" /> Permenpan RB No. 8/2026
                </span>
              </div>
              <p className="text-xs text-blue-800/80 font-bold hidden sm:block">
                Portal Evaluasi Kinerja Pemerintah Digital Terpadu
              </p>
            </div>
          </div>

          {/* Role Switcher & User Profile */}
          <div className="flex items-center space-x-3.5">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-black text-blue-950">
                {currentRole === 'admin' ? 'Dodi Agusri, S.Kom' : 'Rahmat Pratama, S.STP'}
              </span>
              <span className="text-xs text-blue-600 font-bold">
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
              className="px-3.5 py-2 text-xs font-bold rounded-xl border-2 transition-all duration-200 flex items-center space-x-1.5 bg-blue-50/80 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-sm cursor-pointer"
              title="Klik untuk beralih perspektif Role"
            >
              <span>Mode: <strong className="text-blue-950 uppercase">{currentRole}</strong></span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-blue-50/50 border-t border-blue-100 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 text-sm font-black rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-white'
                    : 'text-blue-950 hover:text-blue-700 hover:bg-white border border-transparent hover:border-blue-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1.5 px-2 py-0.5 text-xs rounded-full font-black ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
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
