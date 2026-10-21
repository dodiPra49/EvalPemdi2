'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await api.login(email.trim(), password);
      setIsLoading(false);
      onLogin(result.user);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Email atau kata sandi tidak sesuai!');
    }
  };

  const handleQuickLogin = async (roleType) => {
    setErrorMsg('');
    setIsLoading(true);

    const targetEmail = roleType === 'admin' ? 'admin@pemdi.go.id' : 'operator@pemdi.go.id';
    setEmail(targetEmail);
    setPassword('password123');

    try {
      const result = await api.login(targetEmail, 'password123');
      setIsLoading(false);
      onLogin(result.user);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Gagal login pengujian.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50/60 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      {/* Decorative Warm & Luminous Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-200/40 via-blue-200/40 to-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-10 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 shadow-xl shadow-blue-500/30 ring-4 ring-white mb-3">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            EVAL-PEMDI
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black tracking-wide mt-1.5 border border-blue-200 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Permenpan RB No. 8 Tahun 2026
          </div>
          <p className="text-xs text-slate-600 mt-2 font-semibold">
            Portal Evaluasi Kinerja Pemerintah Digital Terpadu
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
          <div className="mb-6 pb-4 border-b border-slate-100 text-center">
            <h2 className="text-base font-extrabold text-slate-900">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Silakan masukkan akun resmi instansi Anda untuk melanjutkan
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Akun Resmi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pemdi.go.id atau operator@pemdi.go.id"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-blue-700 font-mono font-bold">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses ke Database...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-3 text-center flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Akses Cepat Database:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('admin')}
                className="p-3.5 rounded-2xl border-2 border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-left transition-all duration-200 flex flex-col justify-between group shadow-2xs disabled:opacity-60"
              >
                <div>
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">
                    Mode Admin
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5 group-hover:text-blue-700">
                    Admin Panel
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 font-semibold mt-1.5 block">
                  Administrator Portal
                </span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('user')}
                className="p-3.5 rounded-2xl border-2 border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-left transition-all duration-200 flex flex-col justify-between group shadow-2xs disabled:opacity-60"
              >
                <div>
                  <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider block">
                    Mode Pengguna
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5 group-hover:text-teal-700">
                    Pengguna OPD
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 font-semibold mt-1.5 block">
                  Operator Diskominfo
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 font-semibold">
          Republik Indonesia &bull; Evaluasi Kinerja Pemerintah Digital &copy; 2026
        </p>
      </div>
    </div>
  );
}
