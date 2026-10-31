import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  Building2, 
  FolderDown, 
  LayoutDashboard,
  CheckCircle2,
  BookOpen,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { url, props } = usePage();
  const user = props.auth?.user;

  const tabs = [
    { href: '/evaluasi', label: 'Evaluasi Mandiri (User)', icon: FileText, badge: '20 Indikator' },
    { href: '/admin/dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Master User', icon: Users, badge: 'Akun' },
    { href: '/admin/units', label: 'Master Unit Kerja', icon: Building2, badge: 'OPD' },
    { href: '/admin/templates', label: 'Master Template', icon: FolderDown, badge: '21 File' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-blue-100 text-blue-950 shadow-md shadow-blue-500/5 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Identity */}
          <Link href="/evaluasi" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/30 ring-2 ring-blue-100 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-blue-950">
                  EVAL-PEMDI
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-blue-600" /> Permenpan RB 8/2026
                </span>
              </div>
              <p className="text-xs text-blue-800/80 font-bold hidden sm:block">
                Portal Evaluasi Kinerja Pemerintah Digital Terpadu (Inertia + React)
              </p>
            </div>
          </Link>

          {/* User Profile & Swagger Link & Logout */}
          <div className="flex items-center space-x-3">
            {/* Swagger UI Documentation Link */}
            <a
              href="/api/documentation"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Buka Swagger / OpenAPI Documentation"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Swagger API Docs</span>
            </a>

            {user && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-black text-blue-950">
                  {user.name}
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  {user.role?.toUpperCase()} {user.work_unit ? `• ${user.work_unit.code}` : ''}
                </span>
              </div>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all flex items-center space-x-1 cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-blue-50/50 border-t border-blue-100 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = url.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
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
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
