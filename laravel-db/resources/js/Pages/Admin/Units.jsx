import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  X,
  Phone,
  UserCheck
} from 'lucide-react';

export default function UnitsPage({ initialUnits = [] }) {
  const [unitsList, setUnitsList] = useState(initialUnits);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Daerah',
    pic_name: '',
    pic_contact: '',
  });

  const filteredUnits = unitsList.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.code?.toLowerCase().includes(search.toLowerCase()) ||
    u.pic_name?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingUnit(null);
    setFormData({
      name: '',
      code: '',
      category: 'Daerah',
      pic_name: '',
      pic_contact: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      code: unit.code,
      category: unit.category,
      pic_name: unit.pic_name || '',
      pic_contact: unit.pic_contact || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUnit ? `/api/v1/master/units/${editingUnit.id}` : '/api/v1/master/units';
    const method = editingUnit ? 'PUT' : 'POST';

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
        if (editingUnit) {
          setUnitsList(prev => prev.map(u => u.id === editingUnit.id ? json.data : u));
        } else {
          setUnitsList(prev => [...prev, json.data]);
        }
        setIsModalOpen(false);
      } else {
        alert(json.message || 'Gagal menyimpan unit kerja.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus unit kerja ini?')) return;

    try {
      const res = await fetch(`/api/v1/master/units/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json();
      if (json.success) {
        setUnitsList(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-16">
      <Head title="Manajemen Master Unit Kerja - EVAL-PEMDI" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center">
              <Building2 className="w-7 h-7 mr-2.5 text-blue-600" />
              Master Perangkat Daerah / Unit Kerja
            </h1>
            <p className="text-sm text-blue-700/80 font-bold mt-1">
              Daftar dinas, badan, bagian, dan unit kerja pelaksana evaluasi SPBE/Pemdi.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit Kerja</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Nama OPD atau Kode..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-blue-50/50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
              />
            </div>
            <span className="text-xs font-bold text-blue-600 hidden sm:inline">
              Total: {filteredUnits.length} Unit
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-blue-100">
            <table className="w-full text-left text-sm text-blue-950">
              <thead className="bg-blue-50 text-blue-950 text-xs uppercase font-black border-b border-blue-200">
                <tr>
                  <th className="px-5 py-3.5">Kode OPD</th>
                  <th className="px-5 py-3.5">Nama Perangkat Daerah</th>
                  <th className="px-5 py-3.5">Kategori</th>
                  <th className="px-5 py-3.5">PIC / Kontak</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-black text-blue-700">
                      {u.code}
                    </td>
                    <td className="px-5 py-3.5 font-black text-blue-950">
                      {u.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                        {u.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <p className="font-bold text-blue-950 flex items-center">
                        <UserCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                        {u.pic_name || '-'}
                      </p>
                      <span className="text-blue-600 flex items-center mt-0.5">
                        <Phone className="w-3 h-3 mr-1" />
                        {u.pic_contact || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Unit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Unit"
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
                {editingUnit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Nama Perangkat Daerah</label>
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
                    <label className="block text-xs font-black text-blue-950 mb-1">Kode Singkat (Huruf Kapital)</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-mono font-bold focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-bold bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="Daerah">Daerah</option>
                      <option value="Pusat">Pusat</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Nama PIC</label>
                    <input
                      type="text"
                      value={formData.pic_name}
                      onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1">Kontak PIC</label>
                    <input
                      type="text"
                      value={formData.pic_contact}
                      onChange={(e) => setFormData({ ...formData, pic_contact: e.target.value })}
                      className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
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
