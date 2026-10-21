'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  X,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

export default function AdminUsersView() {
  const [usersList, setUsersList] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    password: '',
    role: 'pelaksana_entri',
    unit_id: 1,
    status: 'active'
  });

  async function loadData() {
    try {
      setIsLoading(true);
      const [usersData, unitsData] = await Promise.all([
        api.getUsers(),
        api.getWorkUnits()
      ]);
      setUsersList(usersData);
      setWorkUnits(unitsData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Gagal memuat pengguna dari database: ' + err.message });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      nip: '',
      email: '',
      password: '',
      role: 'pelaksana_entri',
      unit_id: workUnits[0]?.id || 1,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      nip: user.nip === '-' ? '' : user.nip,
      email: user.email,
      password: '',
      role: user.role,
      unit_id: user.unit_id || 1,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini dari database MySQL?')) {
      try {
        await api.deleteUser(id);
        setUsersList(usersList.filter(u => u.id !== id));
        setNotification({ type: 'success', text: 'Pengguna berhasil dihapus dari database.' });
        setTimeout(() => setNotification({ type: '', text: '' }), 3000);
      } catch (err) {
        alert('Gagal menghapus pengguna: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
        setNotification({ type: 'success', text: `Data pengguna "${formData.name}" berhasil diperbarui!` });
      } else {
        await api.createUser(formData);
        setNotification({ type: 'success', text: `Pengguna baru "${formData.name}" berhasil ditambahkan ke database!` });
      }
      setIsSubmitting(false);
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setNotification({ type: '', text: '' }), 4000);
    } catch (err) {
      setIsSubmitting(false);
      alert('Gagal menyimpan data pengguna: ' + err.message);
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.nip?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Manajemen Akun dan Otoritas &bull; MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <Users className="w-8 h-8 mr-2.5 text-blue-600" />
            Manajemen Master Pengguna
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium max-w-2xl">
            Kelola akun pengguna, hak akses peran (*roles*), dan penugasan unit kerja perangkat daerah dalam sistem evaluasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {notification.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-sm animate-in fade-in ${
          notification.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> : <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, NIP, email, atau unit..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors"
          />
        </div>

        <div className="text-xs text-slate-600 font-bold">
          Menampilkan <strong className="text-blue-700 font-black">{filteredUsers.length}</strong> pengguna dari basis data MySQL
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 flex justify-center items-center space-x-2 text-xs text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data pengguna dari database...</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-blue-50/80 text-blue-900 text-[11px] uppercase border-b border-blue-200 font-black">
                <tr>
                  <th className="px-5 py-4">Nama & NIP</th>
                  <th className="px-5 py-4">Email Akses</th>
                  <th className="px-5 py-4">Unit Kerja / OPD</th>
                  <th className="px-5 py-4">Peran (Role)</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-extrabold text-slate-900 text-xs">{user.name}</p>
                      <p className="font-mono text-[11px] text-slate-500 font-semibold">{user.nip}</p>
                    </td>
                    <td className="px-5 py-3.5 text-blue-700 font-mono text-[11px] font-semibold">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 font-bold">
                      {user.unit}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                        {user.roleLabel || user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 text-blue-600 hover:text-white rounded-xl hover:bg-blue-600 transition-colors shadow-2xs border border-blue-100 hover:border-blue-600"
                        title="Edit Pengguna"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-rose-600 hover:text-white rounded-xl hover:bg-rose-600 transition-colors shadow-2xs border border-rose-100 hover:border-rose-600"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dodi Agusri, S.Kom"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="198501012010..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Resmi</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@pemdi.go.id"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kata Sandi {editingUser && <span className="text-[10px] text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Default: password123'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Unit Kerja / OPD</label>
                <select
                  value={formData.unit_id}
                  onChange={(e) => setFormData({ ...formData, unit_id: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                >
                  {workUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Peran (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  >
                    <option value="admin">Admin Sistem</option>
                    <option value="koordinator">Koordinator Pemdi (Sekda)</option>
                    <option value="penanggung_jawab">Penanggung Jawab Pejabat</option>
                    <option value="pelaksana_entri">Pelaksana Entri Data</option>
                    <option value="pelaksana_unit">Pelaksana Unit Kerja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/25 transition-all disabled:opacity-75"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
