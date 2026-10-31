import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import IndicatorItem from '@/Components/IndicatorItem';
import { 
  Award, 
  Send, 
  BarChart3, 
  CheckCircle2, 
  HelpCircle,
  Building,
  RefreshCw
} from 'lucide-react';

export default function Evaluasi({ initialAspects = [], initialEvaluation = {} }) {
  const [aspects] = useState(initialAspects);
  const [evaluation, setEvaluation] = useState(initialEvaluation);
  const [activeAspectId, setActiveAspectId] = useState(aspects[0]?.id || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const activeAspect = aspects.find(a => a.id === activeAspectId) || aspects[0] || {};
  const currentDetails = evaluation.details || [];

  // Helper to show flash notification
  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Answer change (level selection / notes)
  const handleAnswerChange = async (indicatorId, payload) => {
    try {
      const res = await fetch('/api/v1/evaluations/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          evaluation_id: evaluation.id,
          indicator_id: indicatorId,
          selected_level_id: payload.selected_level_id,
          assessed_score: payload.assessed_score,
          explanation_notes: payload.explanation_notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Update local state
        setEvaluation(prev => {
          const updatedDetails = [...(prev.details || [])];
          const idx = updatedDetails.findIndex(d => d.indicator_id === indicatorId);
          if (idx >= 0) {
            updatedDetails[idx] = {
              ...updatedDetails[idx],
              ...json.data,
            };
          } else {
            updatedDetails.push(json.data);
          }
          return {
            ...prev,
            details: updatedDetails,
            final_index_pemdi: json.score_summary?.final_index_pemdi ?? prev.final_index_pemdi,
            predicate: json.score_summary?.predicate ?? prev.predicate,
          };
        });
        showNotif('Tingkat kematangan indikator berhasil diperbarui!');
      }
    } catch (err) {
      console.error(err);
      showNotif('Gagal menyimpan jawaban.', 'error');
    }
  };

  // Handle Upload Evidence File
  const handleUploadFile = async (indicatorId, file, description) => {
    const formData = new FormData();
    formData.append('evaluation_id', evaluation.id);
    formData.append('indicator_id', indicatorId);
    formData.append('file', file);
    formData.append('description', description);

    try {
      const res = await fetch('/api/v1/evaluations/upload-evidence', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        // Update local evidence file in detail
        setEvaluation(prev => {
          const updatedDetails = [...(prev.details || [])];
          const idx = updatedDetails.findIndex(d => d.indicator_id === indicatorId);
          if (idx >= 0) {
            const currentFiles = updatedDetails[idx].evidence_files || [];
            updatedDetails[idx] = {
              ...updatedDetails[idx],
              evidence_files: [...currentFiles, json.data],
            };
          }
          return { ...prev, details: updatedDetails };
        });
        showNotif('File bukti dukung berhasil diunggah.');
      } else {
        showNotif(json.message || 'Gagal mengunggah file.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotif('Terjadi kesalahan saat mengunggah.', 'error');
    }
  };

  // Handle Delete Evidence File
  const handleDeleteFile = async (fileId) => {
    if (!confirm('Hapus bukti dukung ini?')) return;

    try {
      const res = await fetch(`/api/v1/evaluations/evidence/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json();
      if (json.success) {
        setEvaluation(prev => {
          const updatedDetails = (prev.details || []).map(detail => ({
            ...detail,
            evidence_files: (detail.evidence_files || []).filter(f => f.id !== fileId),
          }));
          return { ...prev, details: updatedDetails };
        });
        showNotif('Bukti dukung berhasil dihapus.');
      }
    } catch (err) {
      console.error(err);
      showNotif('Gagal menghapus bukti dukung.', 'error');
    }
  };

  // Final submit
  const handleSubmitEvaluation = async () => {
    if (!confirm('Apakah Anda yakin ingin mengirimkan seluruh evaluasi ke tahap verifikasi?')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/evaluations/${evaluation.id}/submit`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const json = await res.json();
      if (json.success) {
        setEvaluation(prev => ({ ...prev, status: 'submitted' }));
        showNotif('Penilaian mandiri berhasil dikirim ke tahap verifikasi!');
      }
    } catch (err) {
      console.error(err);
      showNotif('Gagal mengirimkan evaluasi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-16">
      <Head title="Portal Evaluasi Mandiri 20 Indikator" />
      <Navbar />

      {/* Floating Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border font-bold text-sm flex items-center space-x-2 animate-bounce ${
          notification.type === 'error' 
            ? 'bg-rose-50 text-rose-800 border-rose-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification.msg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Score Overview Card */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/10 via-sky-300/10 to-transparent rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Info Instansi */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  Tahun Anggaran {evaluation.year || 2026}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  evaluation.status === 'submitted' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  Status: {evaluation.status || 'Draft'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center">
                <Building className="w-7 h-7 mr-2.5 text-blue-600" />
                {evaluation.work_unit?.name || 'Unit Kerja Pemerintah'}
              </h1>
              <p className="text-sm text-blue-700/80 font-bold max-w-xl">
                Instrumen Evaluasi Kinerja Pemerintah Digital (EVAL-PEMDI) sesuai Peraturan Menteri PANRB No. 8 Tahun 2026.
              </p>
            </div>

            {/* Score & Predicate Badge */}
            <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-sky-50/60 border-2 border-blue-200/80 rounded-2xl p-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs uppercase font-black tracking-wider text-blue-700">
                  Indeks Pemdi Simulasi
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black text-blue-950 font-mono">
                    {(evaluation.final_index_pemdi || 1.0).toFixed(2)}
                  </span>
                  <span className="text-xs text-blue-600 font-bold">/ 5.00</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-2xs">
                    {evaluation.predicate || 'Kurang / Merintis'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Aspect Tabs Selector */}
        <div className="mb-8">
          <label className="block text-xs font-black uppercase tracking-wider text-blue-950 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1.5 text-blue-600" />
            Pilih Aspek Evaluasi (7 Aspek PermenPANRB 8/2026):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {aspects.map((asp) => {
              const isSelected = asp.id === activeAspectId;
              return (
                <button
                  key={asp.id}
                  onClick={() => setActiveAspectId(asp.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600 to-sky-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-200'
                      : 'bg-white text-blue-950 border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="text-xs font-mono font-bold opacity-80">{asp.code}</span>
                  <p className="text-xs font-black mt-1 line-clamp-2 leading-tight">
                    {asp.name}
                  </p>
                  <span className={`text-2xs font-extrabold mt-2 px-2 py-0.5 rounded-full inline-block w-fit ${
                    isSelected ? 'bg-blue-900/60 text-white' : 'bg-blue-50 text-blue-700'
                  }`}>
                    Bobot: {asp.weight}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Aspect Heading */}
        <div className="mb-6 flex items-center justify-between pb-3 border-b-2 border-blue-200">
          <div>
            <span className="text-xs font-bold text-blue-600 font-mono uppercase">{activeAspect.code}</span>
            <h2 className="text-xl sm:text-2xl font-black text-blue-950">
              {activeAspect.name}
            </h2>
          </div>
          <span className="text-sm font-black text-blue-800 bg-white px-4 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
            Bobot Aspek: {activeAspect.weight}%
          </span>
        </div>

        {/* List of Indicators in Active Aspect */}
        <div className="space-y-6">
          {(activeAspect.indicators || []).map((indicator) => {
            const currentAnswer = currentDetails.find(d => d.indicator_id === indicator.id);
            const uploadedFiles = currentAnswer?.evidence_files || [];

            return (
              <IndicatorItem
                key={indicator.id}
                indicator={indicator}
                aspect={activeAspect}
                currentAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                uploadedFiles={uploadedFiles}
                onUploadFile={handleUploadFile}
                onDeleteFile={handleDeleteFile}
              />
            );
          })}
        </div>

        {/* Bottom Submission Bar */}
        <div className="mt-12 bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-blue-950">
                Selesaikan Penilaian Mandiri
              </h4>
              <p className="text-xs text-blue-700/80 font-bold">
                Pastikan seluruh 20 indikator dan berkas bukti dukung telah dilengkapi sebelum finalisasi.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmitEvaluation}
            disabled={isSubmitting || evaluation.status === 'submitted'}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{evaluation.status === 'submitted' ? 'Sudah Terkirim' : 'Kirim Penilaian Mandiri'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
