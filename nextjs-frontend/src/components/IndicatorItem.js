'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Trash2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  Sparkles,
  Info
} from 'lucide-react';

export default function IndicatorItem({ 
  indicator, 
  aspect, 
  currentAnswer, 
  onAnswerChange, 
  uploadedFiles, 
  onUploadFile, 
  onDeleteFile 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState(currentAnswer?.notes || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const selectedLevel = currentAnswer?.level || 3;
  const currentLevelData = indicator.levels[selectedLevel];

  const levelOptions = [
    { 
      level: 1, 
      label: 'Kurang (Merintis)', 
      activeBg: 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-500 shadow-lg shadow-rose-500/25 ring-2 ring-rose-200', 
      inactiveBg: 'bg-rose-50/70 text-rose-700 border-rose-200 hover:bg-rose-100' 
    },
    { 
      level: 2, 
      label: 'Cukup (Membangun)', 
      activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg shadow-amber-500/25 ring-2 ring-amber-200', 
      inactiveBg: 'bg-amber-50/70 text-amber-800 border-amber-200 hover:bg-amber-100' 
    },
    { 
      level: 3, 
      label: 'Baik (Berkembang)', 
      activeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 ring-2 ring-blue-200', 
      inactiveBg: 'bg-sky-50/70 text-blue-800 border-sky-200 hover:bg-sky-100' 
    },
    { 
      level: 4, 
      label: 'Sangat Baik (Melembaga)', 
      activeBg: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-200', 
      inactiveBg: 'bg-indigo-50/70 text-indigo-800 border-indigo-200 hover:bg-indigo-100' 
    },
    { 
      level: 5, 
      label: 'Memuaskan (Unggul)', 
      activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-200', 
      inactiveBg: 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
    },
  ];

  const handleLevelSelect = (lvl) => {
    onAnswerChange(indicator.number, {
      level: lvl,
      notes: notes
    });
  };

  const handleNotesBlur = () => {
    onAnswerChange(indicator.number, {
      level: selectedLevel,
      notes: notes
    });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUploadFile(
        indicator.number,
        {
          name: selectedFile.name,
          description: fileDescription || 'Bukti dukung pemenuhan indikator'
        },
        selectedFile
      );
      setSelectedFile(null);
      setFileDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 mb-6">
      {/* Header Banner */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4.5 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-white flex items-center justify-between cursor-pointer select-none hover:from-sky-100/70 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black flex items-center justify-center font-mono text-sm shadow-md shadow-blue-500/25 ring-2 ring-white">
            #{indicator.number}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {aspect.name}
              </span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Bobot: {indicator.weight}%
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              {indicator.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500 block font-medium">Status Pilihan</span>
            <span className="text-xs font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-2xs">
              Tingkat {selectedLevel} - {currentLevelData?.name.split(' ')[0]}
            </span>
          </div>
          <button className="p-2 rounded-xl text-slate-500 hover:text-blue-700 hover:bg-white transition-colors border border-transparent hover:border-slate-200">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white">
          {/* Metadata & Deskripsi */}
          <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4.5 text-xs text-slate-700 space-y-2">
            <p className="leading-relaxed">
              <strong className="text-slate-900 font-extrabold">Deskripsi Indikator:</strong> {indicator.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2.5 border-t border-sky-200/60 text-[11px]">
              <div>
                <span className="text-slate-500 font-medium">Instansi Pembina: </span>
                <span className="text-blue-700 font-bold">{indicator.supervisor}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Fungsi Penanggung Jawab: </span>
                <span className="text-slate-800 font-semibold">{indicator.roles}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Selector Level Kematangan */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-blue-600" />
              1. Pilih Tingkat Level Kematangan (Permenpan RB 8/2026):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {levelOptions.map((opt) => {
                const isSelected = selectedLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => handleLevelSelect(opt.level)}
                    className={`py-3.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? `${opt.activeBg}`
                        : `${opt.inactiveBg}`
                    }`}
                  >
                    <span className="text-[10px] opacity-80 font-mono">Tingkat {opt.level}</span>
                    <span className="text-center font-bold mt-0.5">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Teks Kriteria Kematangan Dinamis */}
          <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200/70">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
                Kriteria Kematangan: {currentLevelData?.name}
              </h4>
              <span className="text-[11px] font-mono text-blue-800 font-black bg-white px-3 py-1 rounded-full border border-blue-300 shadow-2xs">
                Nilai Bobot: {indicator.levels[selectedLevel]?.score.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
              {currentLevelData?.criteria}
            </div>
          </div>

          {/* Section 3: Daftar Template Bukti Dukung (MS DOCS / EXCEL) */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center">
              <Download className="w-4 h-4 mr-1.5 text-emerald-600" />
              2. Template File Bukti Dukung ({currentLevelData?.name}):
            </h4>

            {currentLevelData?.templates && currentLevelData.templates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLevelData.templates.map((tpl, idx) => {
                  const isExcel = tpl.type === 'xlsx';
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isExcel 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate" title={tpl.title}>
                            {tpl.title}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">
                            Format: {tpl.type}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`http://localhost:5001/storage${tpl.file.startsWith('/') ? tpl.file : '/' + tpl.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-2xs flex items-center space-x-1 shrink-0 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unduh</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-sky-50/50 border border-dashed border-sky-200 rounded-2xl p-4 text-center text-xs text-slate-500 font-medium">
                Tidak ada format template khusus untuk tingkat kematangan ini (cukup dokumen perencanaan/SK internal).
              </div>
            )}
          </div>

          {/* Section 4: Upload Bukti Dukung */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-1.5 text-blue-600" />
              3. Unggah Dokumen Bukti Dukung (Sesuai Indikator & Level):
            </h4>

            {/* Form Upload */}
            <form onSubmit={handleFileSubmit} className="bg-sky-50/40 border border-sky-100 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pilih Berkas (Format: PDF, DOCX, XLSX - Max 25MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.xlsx,.doc,.xls"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="w-full text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer border border-slate-300 rounded-xl bg-white p-1.5 shadow-2xs"
                  />
                </div>

                {/* Deskripsi Dokumen */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Keterangan Dokumen / Nama Dokumen Bukti
                  </label>
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Contoh: SK Tim Pelaksana No. 12 Tahun 2026"
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    selectedFile && !isUploading
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Mengunggah Berkas...' : 'Unggah Bukti Dukung'}</span>
                </button>
              </div>
            </form>

            {/* Tabel Berkas Terunggah */}
            <div className="mt-4">
              <span className="text-[11px] font-bold text-slate-700 block mb-2">
                Daftar Bukti Dukung Terverifikasi ({uploadedFiles?.length || 0} File):
              </span>

              {uploadedFiles && uploadedFiles.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-blue-50/80 text-blue-900 text-[11px] uppercase border-b border-blue-200 font-extrabold">
                      <tr>
                        <th className="px-4 py-2.5">Nama File</th>
                        <th className="px-4 py-2.5">Ukuran</th>
                        <th className="px-4 py-2.5">Waktu Unggah</th>
                        <th className="px-4 py-2.5">Pengunggah</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-slate-800 flex items-center space-x-2">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-xs">{file.name}</span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{file.size}</td>
                          <td className="px-4 py-2.5 text-slate-500 text-[11px]">{file.uploadedAt}</td>
                          <td className="px-4 py-2.5 text-slate-600 font-medium text-[11px]">{file.uploader}</td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              onClick={() => onDeleteFile(indicator.number, file.id)}
                              className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Hapus Bukti Dukung"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-sky-50/50 p-3.5 rounded-xl border border-sky-100">
                  Belum ada berkas bukti dukung yang diunggah untuk indikator ini.
                </p>
              )}
            </div>
          </div>

          {/* Section 5: Catatan Penjelasan Mandiri Pengguna */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
              4. Penjelasan / Catatan Asesor Internal:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Tuliskan deskripsi implementasi nyata atau tautan sistem pendukung di instansi Anda..."
              className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-2xl p-3 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
