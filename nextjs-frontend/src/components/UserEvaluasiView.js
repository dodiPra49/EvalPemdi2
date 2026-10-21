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
  AlertCircle
} from 'lucide-react';
import ScoreOverviewCard from './ScoreOverviewCard';
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

  // Load real data from MySQL via Express API on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [aspectsData, indicatorsData, evalData] = await Promise.all([
          api.getAspects(),
          api.getIndicators(),
          api.getCurrentEvaluation(workUnitId, currentYear)
        ]);

        setAspects(aspectsData);
        setIndicators(indicatorsData);
        setEvaluationHeader(evalData.evaluation || {});
        
        // Inisialisasi answers jika kosong dari database
        const loadedAnswers = evalData.answers || {};
        // Pastikan setiap indikator memiliki nilai default (level 3) jika belum pernah disimpan
        indicatorsData.forEach(ind => {
          if (!loadedAnswers[ind.number]) {
            loadedAnswers[ind.number] = { level: 3, notes: '' };
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
  }, [workUnitId]);

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
        // Simpan draf terakhir terlebih dahulu
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

  const filteredIndicators = selectedAspectId === 'all'
    ? indicators
    : indicators.filter(ind => ind.aspectId === parseInt(selectedAspectId, 10));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">
          Memuat instrumen 20 indikator dan data evaluasi dari basis data MySQL...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Evaluasi Berbasis Permenpan RB No. 8/2026 &bull; Data Real MySQL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <FileCheck2 className="w-8 h-8 mr-2.5 text-blue-600" />
            Penilaian Mandiri Pemerintah Digital
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium max-w-2xl leading-relaxed">
            Unit Kerja: <strong className="text-blue-700 font-bold">{user?.unit || 'Dinas Komunikasi dan Informatika'}</strong>. Tentukan tingkat kematangan pada setiap indikator, tinjau kriteria kualitatif, unduh template, dan unggah dokumen bukti dukung.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-2xs active:scale-95 disabled:opacity-75"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Save className="w-4 h-4 text-slate-500" />
            )}
            <span>{isSaving ? 'Menyimpan ke DB...' : 'Simpan Draf'}</span>
          </button>
          <button
            onClick={handleSubmitEvaluation}
            className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center space-x-2 transition-all shadow-md shadow-blue-500/25 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Penilaian</span>
          </button>
        </div>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-2 shadow-sm animate-in fade-in ${
          statusMessage.type === 'error' 
            ? 'bg-rose-50 border border-rose-200 text-rose-800' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-bold text-xs">{statusMessage.text}</span>
        </div>
      )}

      {/* Realtime Score & Aspect Breakdown Card */}
      <ScoreOverviewCard answers={answers} aspects={aspects} indicators={indicators} />

      {/* Filter 7 Aspek */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center space-x-2 mb-3 text-xs font-black text-slate-700 px-1 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Menurut 7 Aspek Evaluasi Pemdi:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedAspectId('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedAspectId === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200'
            }`}
          >
            Semua ({indicators.length} Indikator)
          </button>

          {aspects.map(asp => {
            const isSelected = selectedAspectId === asp.id.toString();
            return (
              <button
                key={asp.id}
                onClick={() => setSelectedAspectId(asp.id.toString())}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>Aspek {asp.order_index || asp.id}: {asp.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {asp.weight}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daftar Indikator */}
      <div className="space-y-4">
        {filteredIndicators.map((indicator) => {
          const aspect = aspects.find(a => a.id === indicator.aspectId) || { name: indicator.aspectName || 'Aspek Pemdi' };
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
