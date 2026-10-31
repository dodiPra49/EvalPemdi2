'use client';

import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import AdminPanelLayout from '../components/AdminPanelLayout';
import UserPortalLayout from '../components/UserPortalLayout';
import { api } from '../lib/api';

export default function Home() {
  // Sesi awal selalu null agar aplikasi selalu menampilkan Halaman Login saat pertama kali dibuka
  const [currentUser, setCurrentUser] = useState(null);

  // Pastikan sesi lama dibersihkan saat pertama kali aplikasi dibuka di browser
  useEffect(() => {
    try {
      localStorage.removeItem('evalpemdi_session_user');
      api.logout();
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('evalpemdi_session_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Gagal menyimpan sesi:', e);
    }
  };

  const handleLogout = () => {
    try {
      if (typeof api !== 'undefined' && typeof api.logout === 'function') {
        api.logout();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('evalpemdi_session_user');
        localStorage.removeItem('evalpemdi_token');
        localStorage.removeItem('evalpemdi_user');
      }
    } catch (e) {
      console.warn('Gagal menghapus sesi:', e);
    }
    setCurrentUser(null);
  };

  // 1. Tampilkan Halaman Login Berbasis Password & Akses Cepat saat pertama kali dibuka
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Jika login sebagai Admin -> Masuk ke Admin Panel Eksklusif
  if (currentUser.role === 'admin') {
    return <AdminPanelLayout user={currentUser} onLogout={handleLogout} />;
  }

  // 3. Jika login sebagai Pengguna OPD -> Masuk ke Portal Evaluasi Mandiri Pengguna
  return <UserPortalLayout user={currentUser} onLogout={handleLogout} />;
}
