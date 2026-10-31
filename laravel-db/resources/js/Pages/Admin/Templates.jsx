import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { 
  FolderDown, 
  Upload, 
  Download, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  X,
  FileCheck
} from 'lucide-react';

export default function TemplatesPage({ initialTemplates = [], aspects = [] }) {
  const [templatesList, setTemplatesList] = useState(initialTemplates);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    indicator_id: '',
    maturity_level_id: '',
    title: '',
    description: '',
  });

  // Extract all indicators across aspects
  const allIndicators = aspects.flatMap(a => a.indicators || []);

  const filteredTemplates = templatesList.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.document_type?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !formData.indicator_id) return;

    const data = new FormData();
    data.append('indicator_id', formData.indicator_id);
    if (formData.maturity_level_id) {
      data.append('maturity_level_id', formData.maturity_level_id);
    }
    data.append('title', formData.title || selectedFile.name);
    data.append('description', formData.description);
    data.append('file', selectedFile);

    try {
      const res = await fetch('/api/v1/master/templates', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setTemplatesList(prev => [json.data, ...prev]);
        setIsModalOpen(false);
        setSelectedFile(null);
      } else {
        alert(json.message || 'Gagal mengunggah template.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus template dokumen ini?')) return;

    try {
      const res = await fetch(`/api/v1/master/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json();
      if (json.success) {
        setTemplatesList(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-16">
      <Head title="Manajemen Master Template - EVAL-PEMDI" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center">
              <FolderDown className="w-7 h-7 mr-2.5 text-blue-600" />
              Master Template Bukti Dukung Resmi
            </h1>
            <p className="text-sm text-blue-700/80 font-bold mt-1">
              Template formulir Word (.docx) dan matriks Excel (.xlsx) sesuai Permenpan RB 8/2026 yang dapat diunduh instansi.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({
                indicator_id: allIndicators[0]?.id || '',
                maturity_level_id: '',
                title: '',
                description: '',
              });
              setSelectedFile(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Template Baru</span>
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
                placeholder="Cari Template atau Tipe Berkas..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-blue-50/50 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-600 font-bold"
              />
            </div>
            <span className="text-xs font-bold text-blue-600 hidden sm:inline">
              Total: {filteredTemplates.length} Template Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => {
              const isExcel = tpl.document_type === 'xlsx';
              return (
                <div 
                  key={tpl.id}
                  className="bg-white border-2 border-blue-100 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isExcel ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <span className="text-2xs font-mono font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {tpl.document_type}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-blue-950 line-clamp-2" title={tpl.title}>
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-blue-600 font-bold mt-1">
                      {tpl.indicator ? `Indikator #${tpl.indicator.indicator_number}` : 'Umum'}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-blue-50 flex items-center justify-between">
                    <a
                      href={tpl.download_url || `/${tpl.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>

                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Upload */}
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
                Unggah Master Template Bukti Dukung
              </h3>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Target Indikator</label>
                  <select
                    value={formData.indicator_id}
                    onChange={(e) => setFormData({ ...formData, indicator_id: e.target.value })}
                    className="w-full text-xs p-2.5 border-2 border-blue-100 rounded-xl font-bold bg-white focus:border-blue-600 outline-none"
                    required
                  >
                    <option value="">-- Pilih Indikator --</option>
                    {allIndicators.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        #{ind.indicator_number} - {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Nama / Judul Template</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: DOKUMEN_SOP_LAYANAN.docx"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-sm p-2.5 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1">Berkas (.docx, .xlsx, .pdf)</label>
                  <input
                    type="file"
                    required
                    accept=".docx,.xlsx,.pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="w-full text-xs p-2 border-2 border-blue-100 rounded-xl font-medium focus:border-blue-600 outline-none"
                  />
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
                    Unggah
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
