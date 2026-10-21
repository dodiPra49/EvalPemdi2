'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Building2, 
  FolderDown, 
  LogOut,
  Shield,
  Sparkles
} from 'lucide-react';
import AdminDashboardView from './AdminDashboardView';
import AdminUsersView from './AdminUsersView';
import AdminUnitsView from './AdminUnitsView';
import AdminTemplatesView from './AdminTemplatesView';

export default function AdminPanelLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard Pengawasan', icon: LayoutDashboard },
    { id: 'users', label: 'Master Data Pengguna', icon: Users, badge: '6 User' },
    { id: 'units', label: 'Master Unit Kerja (OPD)', icon: Building2, badge: '6 OPD' },
    { id: 'templates', label: 'Master Template Bukti Dukung', icon: FolderDown, badge: '21 File' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Colorful Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-500 to-teal-400" />

      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 border-b border-slate-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Admin Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25 ring-2 ring-blue-100">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    EVAL-PEMDI
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full tracking-wider uppercase shadow-xs">
                    Admin Panel
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Konsol Administrator & Pengawasan Evaluasi Pemdi Nasional (Permenpan 8/2026)
                </p>
              </div>
            </div>

            {/* Profile & Logout Action */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-extrabold text-slate-800 block">{user.name}</span>
                <span className="text-[11px] text-blue-700 font-bold">Administrator Utama</span>
              </div>

              <button
                onClick={onLogout}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center space-x-1.5 transition-colors shadow-2xs active:scale-95"
                title="Keluar dari Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-t border-slate-200 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex space-x-2 py-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-white border border-transparent hover:border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-800 text-white'
                          : 'bg-blue-100/80 text-blue-800 border border-blue-200'
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

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <AdminDashboardView onNavigateTab={(tab) => {
          if (tab === 'master-users') setActiveTab('users');
          if (tab === 'master-units') setActiveTab('units');
        }} />}
        {activeTab === 'users' && <AdminUsersView />}
        {activeTab === 'units' && <AdminUnitsView />}
        {activeTab === 'templates' && <AdminTemplatesView />}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-md py-5 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">EVAL-PEMDI Admin Console &bull; Permenpan RB Nomor 8 Tahun 2026</span>
          <span className="text-[11px] text-blue-800 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
            Hak Akses Super Administrator
          </span>
        </div>
      </footer>
    </div>
  );
}
