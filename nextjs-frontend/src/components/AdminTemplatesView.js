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
      {/* Top Banner in Crystalline White */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-500/5">
        <div>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-500" />
            Standar Format Bukti Dukung &bull; MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight flex items-center">
            <FolderDown className="w-8 h-8 mr-2.5 text-blue-600" />
            Manajemen Master Template Bukti Dukung
          </h1>
          <p className="text-xs text-blue-900/80 mt-1.5 font-bold max-w-2xl leading-relaxed">
            Kelola template baku dokumen bukti dukung (Format Microsoft Word .docx dan Excel .xlsx) yang dapat diunduh oleh unit kerja pelaksana.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-700 hover:to-sky-600 text-white shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95 shrink-0 cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Template Baru</span>
        </button>
      </div>

      {notification.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-sm animate-in fade-in border-2 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> : <CheckCircle className="w-4 h-4 shrink-0 text-blue-600" />}
          <span className="font-extrabold">{notification.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/95 border-2 border-blue-100 rounded-3xl p-5 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xl shadow-blue-500/5">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-blue-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama template atau indikator..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-blue-50/50 border-2 border-blue-100 rounded-xl text-blue-950 placeholder-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs transition-colors font-medium"
          />
        </div>

        <div className="text-xs text-blue-900 font-bold">
          Total: <strong className="text-blue-600 font-black">{filtered.length}</strong> Berkas Template dari MySQL
        </div>
      </div>

      {/* Templates Table */}
      {isLoading ? (
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-12 flex justify-center items-center space-x-2 text-xs text-blue-700 font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data master template dari database...</span>
        </div>
      ) : (
        <div className="bg-white/95 border-2 border-blue-100 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-blue-950">
              <thead className="bg-blue-50 text-blue-950 text-xs uppercase border-b-2 border-blue-100 font-black">
                <tr>
                  <th className="px-5 py-4">Format</th>
                  <th className="px-5 py-4">Judul Template Dokumen</th>
                  <th className="px-5 py-4">Indikator Terkait</th>
                  <th className="px-5 py-4">Tingkat Kematangan</th>
                  <th className="px-5 py-4">File Berkas</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 bg-white">
                {filtered.map((tpl) => {
                  const isExcel = tpl.type === 'xlsx';
                  return (
                    <tr key={tpl.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${
                          isExcel 
                            ? 'bg-sky-100 text-sky-700 border border-sky-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-black text-blue-950 text-sm">
                        {tpl.title}
                      </td>
                      <td className="px-5 py-3.5 text-blue-950 max-w-xs truncate font-medium text-sm" title={tpl.indicatorName}>
                        <span className="font-mono text-blue-600 font-black mr-1">#{tpl.indicatorNumber}</span>
                        {tpl.indicatorName}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                          {tpl.levelName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-blue-600 font-mono text-xs font-bold">
                        {tpl.file}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <a
                          href={`http://localhost:5001/storage${tpl.file.startsWith('/') ? tpl.file : '/' + tpl.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-2 text-blue-600 hover:text-white rounded-xl hover:bg-blue-600 transition-colors shadow-2xs border border-blue-100 hover:border-blue-600 inline-block cursor-pointer"
                          title="Unduh Berkas"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(tpl.id)}
                          className="p-2 text-rose-500 hover:text-white rounded-xl hover:bg-rose-600 transition-colors shadow-2xs border border-rose-100 hover:border-rose-600 cursor-pointer"
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
                className="text-blue-400 hover:text-blue-700 p-1 rounded-xl hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-blue-950 font-black mb-1">Target Indikator (1 - 20)</label>
                <select
                  value={formData.indicatorNumber}
                  onChange={(e) => setFormData({ ...formData, indicatorNumber: parseInt(e.target.value, 10) })}
                  className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl px-3.5 py-2.5 text-blue-950 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs font-bold"
                >
                  {indicators.map(ind => (
                    <option key={ind.number} value={ind.number}>
                      #{ind.number} - {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-blue-950 font-black mb-1">Tingkat Level Kematangan</label>
                <select
                  value={formData.levelName}
                  onChange={(e) => setFormData({ ...formData, levelName: e.target.value })}
                  className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl px-3.5 py-2.5 text-blue-950 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs font-bold"
                >
                  <option value="Kurang (Merintis)">Tingkat 1 - Kurang (Merintis)</option>
                  <option value="Cukup (Membangun)">Tingkat 2 - Cukup (Membangun)</option>
                  <option value="Baik (Berkembang)">Tingkat 3 - Baik (Berkembang)</option>
                  <option value="Sangat Baik (Melembaga)">Tingkat 4 - Sangat Baik (Melembaga)</option>
                  <option value="Memuaskan (Unggul)">Tingkat 5 - Memuaskan (Unggul)</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-950 font-black mb-1">Judul / Nama Template</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Format Formulir Manajemen Risiko Layanan"
                  className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl px-3.5 py-2.5 text-blue-950 placeholder-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block text-blue-950 font-black mb-1">Format Dokumen</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl px-3.5 py-2.5 text-blue-950 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs font-bold"
                >
                  <option value="docx">Microsoft Word (.docx)</option>
                  <option value="xlsx">Microsoft Excel (.xlsx)</option>
                  <option value="pdf">Dokumen PDF (.pdf)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-700 hover:to-sky-600 text-white font-black shadow-md shadow-blue-500/25 transition-all disabled:opacity-75 cursor-pointer uppercase tracking-wider"
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
