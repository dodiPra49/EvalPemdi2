'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderDown, 
  FileText, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Search, 
  Trash2, 
  Plus, 
  X,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

export default function AdminTemplatesView() {
  const [templatesList, setTemplatesList] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    indicatorNumber: 1,
    levelName: 'Baik (Berkembang)',
    title: '',
    type: 'docx'
  });

  async function loadData() {
    try {
      setIsLoading(true);
      const [tplData, indData] = await Promise.all([
        api.getTemplates(),
        api.getIndicators()
      ]);
      setTemplatesList(tplData);
      setIndicators(indData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Gagal memuat template: ' + err.message });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      indicatorNumber: indicators[0]?.number || 1,
      levelName: 'Baik (Berkembang)',
      title: '',
      type: 'docx'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus master template ini dari database?')) {
      try {
        await api.deleteTemplate(id);
        setTemplatesList(templatesList.filter(t => t.id !== id));
        setNotification({ type: 'success', text: 'Master template berhasil dihapus.' });
        setTimeout(() => setNotification({ type: '', text: '' }), 3000);
      } catch (err) {
        alert('Gagal menghapus template: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createTemplate(formData);
      setNotification({ type: 'success', text: `Master template "${formData.title}" berhasil disimpan ke database!` });
      setIsSubmitting(false);
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setNotification({ type: '', text: '' }), 4000);
    } catch (err) {
      setIsSubmitting(false);
      alert('Gagal menyimpan template: ' + err.message);
    }
  };

  const filtered = templatesList.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.indicatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.file?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Standar Format Bukti Dukung &bull; MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <FolderDown className="w-8 h-8 mr-2.5 text-blue-600" />
            Manajemen Master Template Bukti Dukung
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium max-w-2xl">
            Kelola template baku dokumen bukti dukung (Format Microsoft Word .docx dan Excel .xlsx) yang dapat diunduh oleh unit kerja pelaksana.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Template Baru</span>
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
            placeholder="Cari berdasarkan nama template atau indikator..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors"
          />
        </div>

        <div className="text-xs text-slate-600 font-bold">
          Total: <strong className="text-blue-700 font-black">{filtered.length}</strong> Berkas Template dari MySQL
        </div>
      </div>

      {/* Templates Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 flex justify-center items-center space-x-2 text-xs text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data master template dari database...</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-blue-50/80 text-blue-900 text-[11px] uppercase border-b border-blue-200 font-black">
                <tr>
                  <th className="px-5 py-4">Format</th>
                  <th className="px-5 py-4">Judul Template Dokumen</th>
                  <th className="px-5 py-4">Indikator Terkait</th>
                  <th className="px-5 py-4">Tingkat Kematangan</th>
                  <th className="px-5 py-4">File Berkas</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((tpl) => {
                  const isExcel = tpl.type === 'xlsx';
                  return (
                    <tr key={tpl.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${
                          isExcel 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {isExcel ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">
                        {tpl.title}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 max-w-xs truncate" title={tpl.indicatorName}>
                        <span className="font-mono text-blue-700 font-black mr-1">#{tpl.indicatorNumber}</span>
                        {tpl.indicatorName}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {tpl.levelName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-blue-700 font-mono text-[11px] font-semibold">
                        {tpl.file}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <a
                          href={`http://localhost:5001/storage${tpl.file.startsWith('/') ? tpl.file : '/' + tpl.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-2 text-blue-600 hover:text-white rounded-xl hover:bg-blue-600 transition-colors shadow-2xs border border-blue-100 hover:border-blue-600 inline-block"
                          title="Unduh Berkas"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(tpl.id)}
                          className="p-2 text-rose-600 hover:text-white rounded-xl hover:bg-rose-600 transition-colors shadow-2xs border border-rose-100 hover:border-rose-600"
                          title="Hapus Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 flex items-center">
                <Upload className="w-4 h-4 mr-2 text-blue-600" />
                Upload Template Bukti Dukung Baru
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
                <label className="block text-slate-700 font-bold mb-1">Target Indikator (1 - 20)</label>
                <select
                  value={formData.indicatorNumber}
                  onChange={(e) => setFormData({ ...formData, indicatorNumber: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                >
                  {indicators.map(ind => (
                    <option key={ind.number} value={ind.number}>
                      #{ind.number} - {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tingkat Level Kematangan</label>
                <select
                  value={formData.levelName}
                  onChange={(e) => setFormData({ ...formData, levelName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                >
                  <option value="Kurang (Merintis)">Tingkat 1 - Kurang (Merintis)</option>
                  <option value="Cukup (Membangun)">Tingkat 2 - Cukup (Membangun)</option>
                  <option value="Baik (Berkembang)">Tingkat 3 - Baik (Berkembang)</option>
                  <option value="Sangat Baik (Melembaga)">Tingkat 4 - Sangat Baik (Melembaga)</option>
                  <option value="Memuaskan (Unggul)">Tingkat 5 - Memuaskan (Unggul)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Judul / Nama Template</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Format Formulir Manajemen Risiko Layanan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Format Dokumen</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                >
                  <option value="docx">Microsoft Word (.docx)</option>
                  <option value="xlsx">Microsoft Excel (.xlsx)</option>
                  <option value="pdf">Dokumen PDF (.pdf)</option>
                </select>
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Master Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
