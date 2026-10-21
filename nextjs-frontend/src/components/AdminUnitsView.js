'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Mail, 
  UserCheck, 
  X,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

export default function AdminUnitsView() {
  const [unitsList, setUnitsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Daerah',
    pic: '',
    contact: ''
  });

  async function loadData() {
    try {
      setIsLoading(true);
      const unitsData = await api.getWorkUnits();
      setUnitsList(unitsData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Gagal memuat unit kerja: ' + err.message });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setFormData({
      code: '',
      name: '',
      category: 'Daerah',
      pic: '',
      contact: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      code: unit.code,
      name: unit.name,
      category: unit.category,
      pic: unit.pic === 'Belum Ditentukan' ? '' : unit.pic,
      contact: unit.contact
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit kerja ini dari database?')) {
      try {
        await api.deleteWorkUnit(id);
        setUnitsList(unitsList.filter(u => u.id !== id));
        setNotification({ type: 'success', text: 'Unit kerja berhasil dihapus.' });
        setTimeout(() => setNotification({ type: '', text: '' }), 3000);
      } catch (err) {
        alert('Gagal menghapus unit kerja: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUnit) {
        await api.updateWorkUnit(editingUnit.id, formData);
        setNotification({ type: 'success', text: `Perangkat daerah "${formData.name}" berhasil diperbarui!` });
      } else {
        await api.createWorkUnit(formData);
        setNotification({ type: 'success', text: `Perangkat daerah baru "${formData.name}" berhasil ditambahkan ke database!` });
      }
      setIsSubmitting(false);
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setNotification({ type: '', text: '' }), 4000);
    } catch (err) {
      setIsSubmitting(false);
      alert('Gagal menyimpan unit kerja: ' + err.message);
    }
  };

  const filteredUnits = unitsList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.pic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Kelembagaan & Entitas Kerja &bull; MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <Building2 className="w-8 h-8 mr-2.5 text-blue-600" />
            Manajemen Master Unit Kerja / OPD
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium max-w-2xl">
            Kelola daftar Organisasi Perangkat Daerah (OPD), sekretariat, badan, dan dinas pelaksana evaluasi SPBE/Pemdi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Kerja Baru</span>
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
            placeholder="Cari berdasarkan nama OPD, kode, atau PIC..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors"
          />
        </div>

        <div className="text-xs text-slate-600 font-bold">
          Total: <strong className="text-blue-700 font-black">{filteredUnits.length}</strong> Perangkat Daerah dari MySQL
        </div>
      </div>

      {/* Units Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 flex justify-center items-center space-x-2 text-xs text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data perangkat daerah dari database...</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-blue-50/80 text-blue-900 text-[11px] uppercase border-b border-blue-200 font-black">
                <tr>
                  <th className="px-5 py-4">Kode OPD</th>
                  <th className="px-5 py-4">Nama Perangkat Daerah</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Penanggung Jawab (PIC)</th>
                  <th className="px-5 py-4">Email Kontak</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-blue-700">
                      {unit.code}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">
                      {unit.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {unit.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 font-bold flex items-center">
                      <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      {unit.pic}
                    </td>
                    <td className="px-5 py-3.5 text-blue-700 font-mono text-[11px] font-semibold">
                      <span className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {unit.contact}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(unit)}
                        className="p-2 text-blue-600 hover:text-white rounded-xl hover:bg-blue-600 transition-colors shadow-2xs border border-blue-100 hover:border-blue-600"
                        title="Edit Unit Kerja"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="p-2 text-rose-600 hover:text-white rounded-xl hover:bg-rose-600 transition-colors shadow-2xs border border-rose-100 hover:border-rose-600"
                        title="Hapus Unit Kerja"
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

      {/* Modal Add / Edit Unit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                {editingUnit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kode OPD</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="DINAS-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white uppercase font-mono shadow-2xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  >
                    <option value="Daerah">Instansi Daerah (OPD Kabupaten/Kota/Provinsi)</option>
                    <option value="Pusat">Instansi Pusat (Kementerian/Lembaga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Resmi Unit Kerja / OPD</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dinas Kesehatan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Penanggung Jawab (PIC / Kepala)</label>
                <input
                  type="text"
                  required
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  placeholder="Nama Kepala Dinas / Kepala Bagian..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Kontak Resmi</label>
                <input
                  type="email"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="kontak@dinas.go.id"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Unit Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
