import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    login: 'admin@evalpemdi.go.id',
    password: 'password',
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  const quickLogins = [
    { role: 'Administrator', email: 'admin@evalpemdi.go.id', pass: 'password', badge: 'Admin Master' },
    { role: 'Koordinator', email: 'koordinator@evalpemdi.go.id', pass: 'password', badge: 'Monitoring' },
    { role: 'Asesor Internal', email: 'penilai@evalpemdi.go.id', pass: 'password', badge: 'Evaluasi Mandiri' },
    { role: 'Pelaksana Kominfo', email: 'pelaksana.kominfo@evalpemdi.go.id', pass: 'password', badge: 'Entry OPD' },
  ];

  const fillQuickLogin = (email, pass) => {
    setData((prev) => ({
      ...prev,
      login: email,
      password: pass,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50/50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title="Masuk Portal EVAL-PEMDI" />

      {/* Top Banner Identity */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white mb-4">
          <ShieldCheck className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">
          EVAL-PEMDI 2026
        </h2>
        <p className="mt-1 text-sm font-bold text-blue-700/80">
          Portal Evaluasi Kinerja Pemerintah Digital (PermenPANRB No. 8/2026)
        </p>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <span className="px-3 py-1 text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 rounded-full flex items-center shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Arsitektur: Laravel + Inertia.js + React
          </span>
        </div>
      </div>

      {/* Card Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-blue-500/5 rounded-3xl border-2 border-blue-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Login / NIP Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-blue-950 mb-1.5">
                Email Kedinasan / NIP
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={data.login}
                  onChange={(e) => setData('login', e.target.value)}
                  placeholder="admin@evalpemdi.go.id atau NIP"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-blue-100 rounded-xl text-blue-950 text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder-blue-300"
                />
              </div>
              {errors.login && (
                <p className="mt-1 text-xs text-rose-600 font-bold">{errors.login}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-blue-950 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-blue-100 rounded-xl text-blue-950 text-sm font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder-blue-300"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-bold">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>{processing ? 'Memproses Masuk...' : 'Masuk ke Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-blue-100">
            <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-2.5 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-blue-600" />
              Pintasan Akun Percobaan (1-Klik):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quickLogins.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillQuickLogin(acc.email, acc.pass)}
                  className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition-all cursor-pointer text-xs"
                >
                  <p className="font-black text-blue-950">{acc.role}</p>
                  <span className="text-blue-600 text-3xs font-mono truncate block">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link to Swagger */}
          <div className="mt-5 text-center">
            <a
              href="/api/documentation"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-sky-700 hover:text-sky-900 font-bold hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka OpenAPI / Swagger Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
