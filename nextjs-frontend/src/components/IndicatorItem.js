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
      activeBg: 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-700 shadow-lg shadow-blue-500/25 ring-2 ring-blue-200', 
      inactiveBg: 'bg-white text-blue-900 border-2 border-blue-100 hover:bg-blue-50/80 hover:border-blue-300' 
    },
    { 
      level: 2, 
      label: 'Cukup (Membangun)', 
      activeBg: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 ring-2 ring-blue-200', 
      inactiveBg: 'bg-white text-blue-900 border-2 border-blue-100 hover:bg-blue-50/80 hover:border-blue-300' 
    },
    { 
      level: 3, 
      label: 'Baik (Berkembang)', 
      activeBg: 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-sky-200', 
      inactiveBg: 'bg-white text-blue-900 border-2 border-blue-100 hover:bg-blue-50/80 hover:border-blue-300' 
    },
    { 
      level: 4, 
      label: 'Sangat Baik (Melembaga)', 
      activeBg: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-500 shadow-lg shadow-sky-500/30 ring-2 ring-cyan-200', 
      inactiveBg: 'bg-white text-blue-900 border-2 border-blue-100 hover:bg-blue-50/80 hover:border-blue-300' 
    },
    { 
      level: 5, 
      label: 'Memuaskan (Unggul)', 
      activeBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white border-blue-600 shadow-lg shadow-blue-500/35 ring-2 ring-white', 
      inactiveBg: 'bg-white text-blue-900 border-2 border-blue-100 hover:bg-blue-50/80 hover:border-blue-300' 
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
    <div className="bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 mb-6">
      {/* Header Banner */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-5 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-white flex items-center justify-between cursor-pointer select-none hover:from-blue-100/70 transition-colors border-b border-blue-100"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white font-black flex items-center justify-center font-mono text-base shadow-md shadow-blue-500/30 ring-2 ring-white">
            #{indicator.number}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black px-3.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                {aspect.name}
              </span>
              <span className="text-xs font-black px-3.5 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200 shadow-2xs">
                Bobot: {indicator.weight}%
              </span>
            </div>
            <h3 className="text-lg font-black text-blue-950 mt-1">
              {indicator.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-blue-700/80 block font-bold">Status Pilihan</span>
            <span className="text-sm font-black text-blue-700 bg-white px-3.5 py-1 rounded-xl border border-blue-200 shadow-2xs">
              Tingkat {selectedLevel} - {currentLevelData?.name.split(' ')[0]}
            </span>
          </div>
          <button className="p-2.5 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-white transition-colors border border-transparent hover:border-blue-200 cursor-pointer">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-white">
          {/* Metadata & Deskripsi */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-950 space-y-2.5">
            <p className="leading-relaxed">
              <strong className="text-blue-950 font-black">Deskripsi Indikator:</strong> {indicator.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-blue-100 text-xs">
              <div>
                <span className="text-blue-700/70 font-semibold">Instansi Pembina: </span>
                <span className="text-blue-700 font-extrabold">{indicator.supervisor}</span>
              </div>
              <div>
                <span className="text-blue-700/70 font-semibold">Fungsi Penanggung Jawab: </span>
                <span className="text-blue-950 font-bold">{indicator.roles}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Selector Level Kematangan */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-blue-950 mb-3 flex items-center">
              <Sparkles className="w-4.5 h-4.5 mr-1.5 text-blue-600" />
              1. Pilih Tingkat Level Kematangan (Permenpan RB 8/2026):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {levelOptions.map((opt) => {
                const isSelected = selectedLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => handleLevelSelect(opt.level)}
                    className={`py-4 px-3.5 rounded-2xl border text-sm font-black flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${opt.activeBg}`
                        : `${opt.inactiveBg}`
                    }`}
                  >
                    <span className="text-xs opacity-90 font-mono font-bold">Tingkat {opt.level}</span>
                    <span className="text-center font-black mt-1">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Teks Kriteria Kematangan Dinamis */}
          <div className="bg-gradient-to-br from-blue-50 via-sky-50/50 to-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200/60">
              <h4 className="text-sm font-black uppercase tracking-wider text-blue-950 flex items-center">
                <CheckCircle2 className="w-4.5 h-4.5 mr-1.5 text-blue-600" />
                Kriteria Kematangan: {currentLevelData?.name}
              </h4>
              <span className="text-xs font-mono text-blue-700 font-black bg-white px-3.5 py-1 rounded-full border border-blue-300 shadow-2xs">
                Nilai Bobot: {indicator.levels[selectedLevel]?.score.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="text-sm text-blue-950 leading-relaxed whitespace-pre-line font-medium">
              {currentLevelData?.criteria}
            </div>
          </div>

          {/* Section 3: Daftar Template Bukti Dukung (MS DOCS / EXCEL) */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-blue-950 mb-3 flex items-center">
              <Download className="w-4.5 h-4.5 mr-1.5 text-blue-600" />
              2. Template File Bukti Dukung ({currentLevelData?.name}):
            </h4>

            {currentLevelData?.templates && currentLevelData.templates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentLevelData.templates.map((tpl, idx) => {
                  const isExcel = tpl.type === 'xlsx';
                  return (
                    <div
                      key={idx}
                      className="bg-white border-2 border-blue-100 rounded-2xl p-4 flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3.5 overflow-hidden">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isExcel 
                            ? 'bg-sky-100 text-sky-700 border border-sky-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-black text-blue-950 truncate" title={tpl.title}>
                            {tpl.title}
                          </p>
                          <span className="text-xs text-blue-600 font-mono uppercase font-bold">
                            Format: {tpl.type}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`http://localhost:5001/storage${tpl.file.startsWith('/') ? tpl.file : '/' + tpl.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="ml-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-sm font-bold text-white shadow-sm flex items-center space-x-1 shrink-0 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Unduh</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl p-4 text-center text-sm text-blue-800/80 font-bold">
                Tidak ada format template khusus untuk tingkat kematangan ini (cukup dokumen internal).
              </div>
            )}
          </div>

          {/* Section 4: Upload Bukti Dukung */}
          <div className="pt-2 border-t border-blue-100">
            <h4 className="text-sm font-black uppercase tracking-wider text-blue-950 mb-3.5 flex items-center">
              <Upload className="w-4.5 h-4.5 mr-1.5 text-blue-600" />
              3. Unggah Dokumen Bukti Dukung (Sesuai Indikator & Level):
            </h4>

            {/* Form Upload */}
            <form onSubmit={handleFileSubmit} className="bg-blue-50/40 border-2 border-blue-100 rounded-2xl p-4.5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* File Input */}
                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1.5">
                    Pilih Berkas (Format: PDF, DOCX, XLSX - Max 25MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.xlsx,.doc,.xls"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="w-full text-xs text-blue-950 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer border-2 border-blue-100 rounded-xl bg-white p-2 shadow-2xs"
                  />
                </div>

                {/* Deskripsi Dokumen */}
                <div>
                  <label className="block text-xs font-black text-blue-950 mb-1.5">
                    Keterangan Dokumen / Nama Dokumen Bukti
                  </label>
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Contoh: SK Tim Pelaksana No. 12 Tahun 2026"
                    className="w-full text-sm text-blue-950 bg-white border-2 border-blue-100 rounded-xl px-3.5 py-2.5 placeholder-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedFile && !isUploading
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-md shadow-blue-500/25 active:scale-95'
                      : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Mengunggah Berkas...' : 'Unggah Bukti Dukung'}</span>
                </button>
              </div>
            </form>

            {/* Tabel Berkas Terunggah */}
            <div className="mt-4">
              <span className="text-xs font-black text-blue-950 block mb-2.5">
                Daftar Bukti Dukung Terverifikasi ({uploadedFiles?.length || 0} File):
              </span>

              {uploadedFiles && uploadedFiles.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border-2 border-blue-100 bg-white">
                  <table className="w-full text-left text-sm text-blue-950">
                    <thead className="bg-blue-50 text-blue-950 text-xs uppercase border-b border-blue-200 font-black">
                      <tr>
                        <th className="px-4 py-3">Nama File</th>
                        <th className="px-4 py-3">Ukuran</th>
                        <th className="px-4 py-3">Waktu Unggah</th>
                        <th className="px-4 py-3">Pengunggah</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-blue-950 flex items-center space-x-2">
                            <FileCheck className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                            <span className="truncate max-w-xs">{file.name}</span>
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-mono text-xs font-bold">{file.size}</td>
                          <td className="px-4 py-3 text-blue-800/70 text-xs">{file.uploadedAt}</td>
                          <td className="px-4 py-3 text-blue-950 font-bold text-xs">{file.uploader}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onDeleteFile(indicator.number, file.id)}
                              className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Bukti Dukung"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-blue-700/80 italic bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  Belum ada berkas bukti dukung yang diunggah untuk indikator ini.
                </p>
              )}
            </div>
          </div>

          {/* Section 5: Catatan Penjelasan Mandiri Pengguna */}
          <div className="pt-2 border-t border-blue-100">
            <label className="block text-sm font-black uppercase tracking-wider text-blue-950 mb-2">
              4. Penjelasan / Catatan Asesor Internal:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Tuliskan deskripsi implementasi nyata atau tautan sistem pendukung di instansi Anda..."
              className="w-full text-sm text-blue-950 bg-white border-2 border-blue-100 rounded-2xl p-3.5 placeholder-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs font-medium"
            />
          </div>
        </div>
      )}
    </div>
  );
}
