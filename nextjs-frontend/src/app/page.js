'use client';

import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import AdminPanelLayout from '../components/AdminPanelLayout';
import UserPortalLayout from '../components/UserPortalLayout';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  // Muat sesi tersimpan dari localStorage saat halaman dibuka di browser
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('evalpemdi_session_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn('Gagal membaca sesi:', e);
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
    api.logout();
    setCurrentUser(null);
    try {
      localStorage.removeItem('evalpemdi_session_user');
    } catch (e) {
      console.warn('Gagal menghapus sesi:', e);
    }
  };

  // 1. Jika belum login -> Tampilkan Halaman Login Berbasis Password
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
