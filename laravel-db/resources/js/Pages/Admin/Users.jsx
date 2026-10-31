import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  X,
  Shield,
  Building2
} from 'lucide-react';

export default function UsersPage({ initialUsers = [], workUnits = [] }) {
  const [usersList, setUsersList] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nip: '',
    password: '',
    role: 'pelaksana_entri',
    status: 'active',
    work_unit_id: '',
  });

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.nip?.includes(search)
  );

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      nip: '',
      password: '',
      role: 'pelaksana_entri',
      status: 'active',
      work_unit_id: workUnits[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      nip: user.nip || '',
      password: '',
      role: user.role,
      status: user.status,
      work_unit_id: user.work_unit_id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser ? `/api/v1/master/users/${editingUser.id}` : '/api/v1/master/users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        if (editingUser) {
          setUsersList(prev => prev.map(u => u.id === editingUser.id ? json.data : u));
        } else {
          setUsersList(prev => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Gagal menyimpan pengguna.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    try {
      const res = await fetch(`/api/v1/master/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json();
      if (json.success) {
        setUsersList(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-16">
      <Head title="Manajemen Master Pengguna - EVAL-PEMDI" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center">
              <Users className="w-7 h-7 mr-2.5 text-blue-600" />
              Manajemen Master Pengguna
            </h1>
            <p className="text-sm text-blue-700/80 font-bold mt-1">
              Kelola akun administrator, koordinator pengawas, dan penilai unit kerja.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Table & Search */}
        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Nama, NIP, atau Email..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-blue-50/50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
              />
            </div>
            <span className="text-xs font-bold text-blue-600 hidden sm:inline">
              Total: {filteredUsers.length} Pengguna
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-blue-100">
            <table className="w-full text-left text-sm text-blue-950">
              <thead className="bg-blue-50 text-blue-950 text-xs uppercase font-black border-b border-blue-200">
                <tr>
                  <th className="px-5 py-3.5">Nama & NIP</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Unit Kerja</th>
                  <th className="px-5 py-3.5">Peran (Role)</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-black text-blue-950">{u.name}</p>
                      <span className="text-xs font-mono text-blue-600 font-bold">
                        NIP: {u.nip || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-xs text-blue-800">
                      {u.email}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-blue-950">
                      {u.work_unit?.name || '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-2xs font-black uppercase ${
                        u.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Pengguna"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-blue-950 mb-4">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">NIP</label>
                    <input
                      type="text"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">
                    Kata Sandi {editingUser ? '(Kosongkan jika tidak diubah)' : ''}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Peran (Role)</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-bold bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="koordinator">Koordinator</option>
                      <option value="penanggung_jawab">Penanggung Jawab</option>
                      <option value="pelaksana_entri">Pelaksana Entri</option>
                      <option value="pelaksana_unit">Pelaksana Unit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-bold bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Unit Kerja / OPD</label>
                  <select
                    value={formData.work_unit_id}
                    onChange={(e) => setFormData({ ...formData, work_unit_id: e.target.value })}
                    className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-bold bg-white focus:border-blue-600 outline-none"
                  >
                    <option value="">-- Tanpa Unit Kerja --</option>
                    {workUnits.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
