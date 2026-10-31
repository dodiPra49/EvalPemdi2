'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Send, 
  Save, 
  Filter, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Building2,
  Award
} from 'lucide-react';
import IndicatorItem from './IndicatorItem';
import { api } from '../lib/api';

export default function UserEvaluasiView({ user }) {
  const [aspects, setAspects] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedAspectId, setSelectedAspectId] = useState('all');
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [evaluationHeader, setEvaluationHeader] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const workUnitId = user?.work_unit_id || 1;
  const currentYear = 2026;

  // Logika pengecekan apakah unit kerja adalah BKPSDM
  const isBKPSDM = Boolean(
    user?.unit_code?.toUpperCase().includes('BKPSDM') ||
    user?.unit?.toUpperCase().includes('BKPSDM') ||
    user?.unit?.toLowerCase().includes('kepegawaian')
  );

  // Load real data from MySQL via Express API on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const indicatorParams = isBKPSDM 
          ? { unit_code: user?.unit_code || 'BKPSDM-01', unit: user?.unit || 'BKPSDM' } 
          : null;

        const [aspectsData, indicatorsData, evalData] = await Promise.all([
          api.getAspects(),
          api.getIndicators(indicatorParams),
          api.getCurrentEvaluation(workUnitId, currentYear)
        ]);

        setAspects(aspectsData);
        
        // Pastikan jika BKPSDM, hanya indikator 3 yang diproses
        const filteredByUnit = isBKPSDM
          ? indicatorsData.filter(ind => ind.number === 3 || ind.indicator_number === 3)
          : indicatorsData;

        setIndicators(filteredByUnit);
        setEvaluationHeader(evalData.evaluation || {});
        
        // Inisialisasi answers jika kosong dari database
        const loadedAnswers = evalData.answers || {};
        filteredByUnit.forEach(ind => {
          const indNum = ind.number || ind.indicator_number;
          if (!loadedAnswers[indNum]) {
            loadedAnswers[indNum] = { level: 3, notes: '' };
          }
        });

        setAnswers(loadedAnswers);
        setUploadedFiles(evalData.uploadedFiles || {});
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching evaluation data:', err);
        setStatusMessage({ type: 'error', text: 'Gagal memuat data dari database: ' + err.message });
        setIsLoading(false);
      }
    }

    loadData();
  }, [workUnitId, isBKPSDM, user?.unit_code, user?.unit]);

  const handleAnswerChange = (indicatorNumber, updatedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [indicatorNumber]: updatedAnswer
    }));
  };

  const handleUploadFile = async (indicatorNumber, fileObj, nativeFile) => {
    try {
      const formData = new FormData();
      formData.append('file', nativeFile);
      formData.append('indicator_number', indicatorNumber);
      formData.append('description', fileObj.description || 'Bukti dukung pemenuhan indikator');
      formData.append('work_unit_id', workUnitId);
      formData.append('year', currentYear);
      formData.append('user_id', user?.id || 4);

      const res = await api.uploadEvidence(formData);
      const newFile = res.data;

      setUploadedFiles(prev => ({
        ...prev,
        [indicatorNumber]: [...(prev[indicatorNumber] || []), newFile]
      }));

      setStatusMessage({ type: 'success', text: `Berkas "${newFile.name}" berhasil diunggah dan disimpan ke database!` });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      alert('Gagal mengunggah berkas: ' + err.message);
    }
  };

  const handleDeleteFile = async (indicatorNumber, fileId) => {
    if (confirm('Apakah Anda yakin ingin menghapus berkas bukti dukung ini dari database?')) {
      try {
        await api.deleteEvidence(fileId);
        setUploadedFiles(prev => ({
          ...prev,
          [indicatorNumber]: (prev[indicatorNumber] || []).filter(f => f.id !== fileId)
        }));
        setStatusMessage({ type: 'success', text: 'Berkas bukti dukung berhasil dihapus.' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        alert('Gagal menghapus berkas: ' + err.message);
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      const res = await api.saveDraft(workUnitId, currentYear, answers);
      setIsSaving(false);
      setStatusMessage({ 
        type: 'success', 
        text: `Draf penilaian berhasil disimpan ke database! Indeks Pemdi saat ini: ${res.data?.finalIndex || '3.25'}` 
      });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setIsSaving(false);
      setStatusMessage({ type: 'error', text: 'Gagal menyimpan draf: ' + err.message });
    }
  };

  const handleSubmitEvaluation = async () => {
    if (confirm('Kirim hasil Penilaian Mandiri kepada Koordinator Pemdi (Sekda)? Status penilaian akan dikunci untuk verifikasi dokumen.')) {
      try {
        await api.saveDraft(workUnitId, currentYear, answers);
        await api.submitEvaluation(workUnitId, currentYear);
        setStatusMessage({ 
          type: 'success', 
          text: 'Penilaian Mandiri Berhasil Dikirim ke Koordinator Pemdi (Sekda)!' 
        });
      } catch (err) {
        alert('Gagal mengirim penilaian: ' + err.message);
      }
    }
  };

  // Filter daftar indikator: jika BKPSDM, pastikan hanya indikator 3
  const baseIndicators = isBKPSDM
    ? indicators.filter(ind => ind.number === 3 || ind.indicator_number === 3)
    : indicators;

  const filteredIndicators = selectedAspectId === 'all'
    ? baseIndicators
    : baseIndicators.filter(ind => ind.aspectId === parseInt(selectedAspectId, 10));

  // Aspek yang relevan untuk filter
  const relevantAspects = isBKPSDM
    ? aspects.filter(asp => asp.id === 2 || asp.code === 'ASPEK_2' || asp.name.toLowerCase().includes('penyelenggara'))
    : aspects;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">
          {isBKPSDM 
            ? 'Memuat data Indikator 3 (SDM Pemdi) untuk BKPSDM...' 
            : 'Memuat instrumen indikator evaluasi dari basis data...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner Penugasan Spesifik BKPSDM */}
      {isBKPSDM && (
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-white border-2 border-sky-300 text-sky-950 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-500/30 shrink-0">
              #3
            </div>
            <div>
              <div className="inline-flex items-center text-xs font-black text-sky-700 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-500" />
                Penugasan Khusus Instansi BKPSDM
              </div>
              <h3 className="font-extrabold text-base text-blue-950 leading-snug">
                Indikator 3: Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital
              </h3>
              <p className="text-xs text-blue-800/80 font-semibold mt-1">
                Sesuai Peraturan Menteri PANRB No. 8 Tahun 2026, Badan Kepegawaian dan Pengembangan SDM (BKPSDM) bertanggung jawab penuh pada evaluasi kompetensi, literasi, dan kepemimpinan digital ASN.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-blue-700 text-xs font-extrabold border-2 border-blue-200 shadow-xs">
            Aspek 2: Penyelenggara (Bobot: 5%)
          </span>
        </div>
      )}

      {/* Page Header in Crystalline White */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-500/5">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-black mb-2.5 border border-blue-200">
            <Sparkles className="w-4 h-4 mr-1.5 text-sky-500" />
            Evaluasi Berbasis Permenpan RB No. 8/2026 &bull; Realtime MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight flex items-center">
            <FileCheck2 className="w-8 h-8 mr-2.5 text-blue-600" />
            Penilaian Mandiri Pemerintah Digital
          </h1>
          <p className="text-sm text-blue-900/80 mt-2 font-bold max-w-2xl leading-relaxed">
            Unit Kerja: <strong className="text-blue-600 font-extrabold">{user?.unit || 'Badan Kepegawaian dan Pengembangan SDM'}</strong>.
            {isBKPSDM ? (
              <span> Anda ditugaskan khusus untuk mengisi penilaian mandiri <strong>Indikator 3: Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital</strong>.</span>
            ) : (
              <span> Tentukan tingkat kematangan pada setiap indikator, tinjau kriteria kualitatif, unduh template resmi, dan unggah berkas bukti dukung.</span>
            )}
          </p>
        </div>

        {/* Action Buttons in vibrant energetic blues */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-black rounded-xl bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 flex items-center space-x-2 transition-all shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Save className="w-4 h-4 text-blue-500" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Draf'}</span>
          </button>
          <button
            onClick={handleSubmitEvaluation}
            className="px-6 py-2.5 text-sm font-black rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-700 hover:to-sky-600 text-white flex items-center space-x-2 transition-all shadow-md shadow-blue-500/30 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Penilaian</span>
          </button>
        </div>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-2 shadow-sm animate-in fade-in border-2 ${
          statusMessage.type === 'error' 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <span className="font-extrabold text-sm">{statusMessage.text}</span>
        </div>
      )}

      {/* Filter Aspek */}
      <div className="bg-white/95 border-2 border-blue-100 rounded-3xl p-5 shadow-sm shadow-blue-500/5">
        <div className="flex items-center space-x-2 mb-3.5 text-sm font-black text-blue-950 px-1 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>
            {isBKPSDM 
              ? 'Lingkup Aspek Evaluasi Unit Kerja BKPSDM:' 
              : 'Filter Menurut 7 Aspek Evaluasi Pemdi:'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedAspectId('all')}
            className={`px-4.5 py-2.5 text-sm font-black rounded-xl transition-all cursor-pointer ${
              selectedAspectId === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-white'
                : 'bg-white hover:bg-blue-50 text-blue-950 border-2 border-blue-100 hover:border-blue-300'
            }`}
          >
            {isBKPSDM ? 'Semua (Indikator 3 BKPSDM)' : `Semua (${indicators.length} Indikator)`}
          </button>

          {relevantAspects.map(asp => {
            const isSelected = selectedAspectId === asp.id.toString();
            return (
              <button
                key={asp.id}
                onClick={() => setSelectedAspectId(asp.id.toString())}
                className={`px-4.5 py-2.5 text-sm font-black rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-white'
                    : 'bg-white hover:bg-blue-50 text-blue-950 border-2 border-blue-100 hover:border-blue-300'
                }`}
              >
                <span>Aspek {asp.order_index || asp.id}: {asp.name}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-black ${
                  isSelected ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {asp.weight}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daftar Indikator (Hanya Indikator 3 jika BKPSDM) */}
      <div className="space-y-4">
        {filteredIndicators.map((indicator) => {
          const aspect = aspects.find(a => a.id === indicator.aspectId) || { name: indicator.aspectName || 'Aspek 2: Penyelenggara' };
          return (
            <IndicatorItem
              key={indicator.number}
              indicator={indicator}
              aspect={aspect}
              currentAnswer={answers[indicator.number]}
              onAnswerChange={handleAnswerChange}
              uploadedFiles={uploadedFiles[indicator.number] || []}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
            />
          );
        })}
      </div>
    </div>
  );
}
