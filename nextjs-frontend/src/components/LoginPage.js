'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Loader2,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { api } from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [workUnits, setWorkUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedRole, setSelectedRole] = useState('pelaksana_entri');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);

  // Ambil daftar unit kerja terdaftar saat halaman dimuat
  useEffect(() => {
    async function loadUnits() {
      try {
        setIsLoadingUnits(true);
        const data = await api.getWorkUnitsForLogin();
        setWorkUnits(data);
      } catch (err) {
        console.warn('Gagal memuat unit kerja:', err);
      } finally {
        setIsLoadingUnits(false);
      }
    }
    loadUnits();
  }, []);

  // Temukan objek unit kerja terpilih
  const selectedUnit = workUnits.find(u => String(u.id) === String(selectedUnitId));

  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    setSelectedUnitId(unitId);
    setErrorMsg('');

    if (unitId === 'admin') {
      setSelectedRole('admin');
    } else {
      setSelectedRole('pelaksana_entri');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedUnitId) {
      setErrorMsg('Silakan pilih unit kerja / perangkat daerah dari combobox terlebih dahulu.');
      return;
    }

    if (!password) {
      setErrorMsg('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        work_unit_id: selectedUnitId,
        role: selectedUnitId === 'admin' ? 'admin' : selectedRole,
        password: password
      };

      const result = await api.login(payload);
      setIsLoading(false);
      onLogin(result.user);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Unit kerja atau kata sandi tidak sesuai!');
    }
  };

  const handleQuickSelect = (type) => {
    setErrorMsg('');
    if (type === 'admin') {
      setSelectedUnitId('admin');
      setSelectedRole('admin');
      setPassword('password123');
    } else if (type === 'bkpsdm') {
      const bkpsdm = workUnits.find(u => (u.code && u.code.includes('BKPSDM')) || (u.name && u.name.includes('BKPSDM')));
      if (bkpsdm) {
        setSelectedUnitId(bkpsdm.id);
        setSelectedRole('pelaksana_entri');
        setPassword('password123');
      }
    } else {
      const diskominfo = workUnits.find(u => u.code && u.code.includes('DISKOMINFO')) || workUnits[0];
      if (diskominfo) {
        setSelectedUnitId(diskominfo.id);
        setSelectedRole('pelaksana_entri');
        setPassword('password123');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50/60 to-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-10">
      {/* Energetic Radiant Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-sky-400/25 via-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-blue-400/20 via-sky-300/30 to-white rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-gradient-to-br from-cyan-300/25 to-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="max-w-lg w-full space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 shadow-xl shadow-blue-500/35 ring-4 ring-white mb-3 animate-glow">
            <ShieldCheck className="w-11 h-11 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
            EVAL-PEMDI
          </h1>
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-white text-blue-700 text-xs font-black tracking-wide mt-2 border-2 border-blue-200 shadow-sm shadow-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Permenpan RB No. 8 Tahun 2026
          </div>
          <p className="text-sm text-blue-900/80 mt-2 font-bold tracking-wide">
            Portal Evaluasi Kinerja Pemerintah Digital Terpadu
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/95 border-2 border-blue-100 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-blue-500/15 backdrop-blur-xl">
          <div className="mb-5 pb-4 border-b border-blue-50 text-center">
            <h2 className="text-lg font-extrabold text-blue-950">
              Selamat Datang di Portal Evaluasi 👋
            </h2>
            <p className="text-xs sm:text-sm text-blue-800/75 mt-1 font-semibold">
              Pilih unit kerja terdaftar Anda dan masukkan kata sandi untuk masuk
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border-2 border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-2xl flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-bold text-xs sm:text-sm">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* COMBOBOX UNIT KERJA */}
            <div>
              <label className="block text-xs font-black text-blue-950 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Unit Kerja / Perangkat Daerah
                </span>
                {isLoadingUnits && (
                  <span className="text-[10px] text-blue-500 flex items-center font-normal lowercase">
                    <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" /> memuat data...
                  </span>
                )}
              </label>

              <div className="relative">
                <select
                  required
                  value={selectedUnitId}
                  onChange={handleUnitChange}
                  className="w-full text-sm pl-4 pr-10 py-3.5 bg-blue-50/50 hover:bg-white focus:bg-white border-2 border-blue-200 focus:border-blue-600 rounded-2xl text-blue-950 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Unit Kerja / Perangkat Daerah Terdaftar --</option>
                  
                  {/* Pilihan Administrator Utama */}
                  <option value="admin" className="font-bold text-blue-700 bg-blue-50/50 py-1">
                    🛡️ Administrator Sistem (Portal Utama / Super Admin)
                  </option>
                  
                  {/* Daftar Unit Kerja / OPD Daerah */}
                  <optgroup label="🏛️ Perangkat Daerah Terdaftar (Permenpan 8/2026)">
                    {workUnits.map((unit) => (
                      <option key={unit.id} value={unit.id} className="py-1">
                        🏢 {unit.name} {unit.code ? `(${unit.code})` : ''}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* PREVIEW KARTU UNIT KERJA TERPILIH */}
            {selectedUnit && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-2xl animate-in fade-in slide-in-from-top-1 text-xs">
                <div className="flex items-center justify-between font-bold text-blue-950 mb-1">
                  <span className="truncate max-w-[280px]">{selectedUnit.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px]">
                    {selectedUnit.code}
                  </span>
                </div>
                <div className="flex items-center text-[11px] text-blue-700 font-medium">
                  <Briefcase className="w-3 h-3 mr-1 text-blue-500 shrink-0" />
                  <span>PIC: {selectedUnit.pic || 'Pejabat Penanggung Jawab'}</span>
                </div>

                {/* Switch Role jika unit kerja memiliki beberapa akun/peran */}
                {selectedUnit.users && selectedUnit.users.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-blue-100 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Peran:</span>
                    {selectedUnit.users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedRole(u.role)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                          selectedRole === u.role 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        {u.roleLabel || u.role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedUnitId === 'admin' && (
              <div className="p-3 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-300 rounded-2xl animate-in fade-in text-xs">
                <div className="flex items-center text-blue-950 font-bold">
                  <UserCheck className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
                  <span>Akses Administrator Pusat</span>
                </div>
                <p className="text-[11px] text-blue-800/80 mt-0.5 font-medium">
                  Akses penuh ke manajemen master data 20 indikator, unit kerja, dan akun pengguna.
                </p>
              </div>
            )}

            {/* INPUT KATA SANDI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-blue-950 uppercase tracking-wider flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Kata Sandi
                </label>
                <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full text-sm pl-4 pr-11 py-3 bg-blue-50/40 hover:bg-white focus:bg-white border-2 border-blue-100 focus:border-blue-600 rounded-2xl text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 cursor-pointer p-1"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* TOMBOL MASUK KE PORTAL */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-4 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-700 hover:to-sky-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-75 cursor-pointer uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
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

          {/* Akses Cepat Pengujian Database */}
          <div className="mt-5 pt-4 border-t border-blue-50">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-2.5 text-center flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-500" />
              Pintas Cepat Pengujian:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSelect('admin')}
                className="p-2.5 rounded-2xl border-2 border-blue-200 bg-white hover:bg-blue-50/80 text-left transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-blue-400 disabled:opacity-60 cursor-pointer"
              >
                <div>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider block">
                    Admin
                  </span>
                  <span className="text-[11px] font-black text-blue-950 block mt-0.5 group-hover:text-blue-600 leading-tight">
                    Admin Panel
                  </span>
                </div>
                <span className="text-[9px] text-blue-700/80 font-bold mt-1.5 block">
                  Pusat
                </span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSelect('user')}
                className="p-2.5 rounded-2xl border-2 border-sky-200 bg-white hover:bg-sky-50/80 text-left transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-sky-400 disabled:opacity-60 cursor-pointer"
              >
                <div>
                  <span className="text-[9px] font-black text-sky-600 uppercase tracking-wider block">
                    Diskominfo
                  </span>
                  <span className="text-[11px] font-black text-blue-950 block mt-0.5 group-hover:text-sky-600 leading-tight">
                    20 Indikator
                  </span>
                </div>
                <span className="text-[9px] text-sky-700/80 font-bold mt-1.5 block">
                  Semua OPD
                </span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSelect('bkpsdm')}
                className="p-2.5 rounded-2xl border-2 border-amber-200 bg-white hover:bg-amber-50/80 text-left transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-amber-400 disabled:opacity-60 cursor-pointer"
              >
                <div>
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">
                    BKPSDM
                  </span>
                  <span className="text-[11px] font-black text-blue-950 block mt-0.5 group-hover:text-amber-600 leading-tight">
                    Indikator 3
                  </span>
                </div>
                <span className="text-[9px] text-amber-700/80 font-bold mt-1.5 block">
                  SDM Pemdi
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-blue-900/70 font-bold">
          Republik Indonesia &bull; Evaluasi Kinerja Pemerintah Digital &copy; 2026
        </p>
      </div>
    </div>
  );
}
