<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaturityTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // Indikator 1: Tata Kelola Pemdi
            [
                'indicator_number' => 1,
                'level_number' => 2,
                'title' => 'Template Dokumen Rencana Aksi Pemdi Instansi Tingkat Mikro',
                'document_type' => 'docx',
                'file_path' => '/templates/TEMPLATE_RENCANA_AKSI_PEMDI.docx',
                'description' => 'Format baku dokumen perencanaan aksi implementasi arsitektur Pemdi instansi.',
            ],
            [
                'indicator_number' => 1,
                'level_number' => 3,
                'title' => 'Matriks Peta Keterpaduan Layanan Tematik Arsitektur Pemdi',
                'document_type' => 'xlsx',
                'file_path' => '/templates/MATRIKS_ARSITEKTUR_LAYANAN_TEMATIK.xlsx',
                'description' => 'Format excel pemetaan arsitektur layanan prioritas dan tematik.',
            ],
            [
                'indicator_number' => 1,
                'level_number' => 4,
                'title' => 'Laporan Hasil Reviu Arsitektur dan Rencana Aksi Pemdi',
                'document_type' => 'docx',
                'file_path' => '/templates/LAPORAN_REVIU_ARSITEKTUR_PEMDI.docx',
                'description' => 'Template dokumen berita acara evaluasi dan reviu berkala arsitektur.',
            ],

            // Indikator 2: Manajemen Layanan Digital
            [
                'indicator_number' => 2,
                'level_number' => 2,
                'title' => 'Formulir Identifikasi Risiko & Perubahan Layanan Digital',
                'document_type' => 'xlsx',
                'file_path' => '/templates/FORM_MANAJEMEN_RISIKO_LAYANAN.xlsx',
                'description' => 'Format penilaian risiko dan mitigasi kegagalan layanan digital.',
            ],
            [
                'indicator_number' => 2,
                'level_number' => 3,
                'title' => 'SOP Manajemen Keberlangsungan & Pengetahuan Layanan',
                'document_type' => 'docx',
                'file_path' => '/templates/SOP_MANAJEMEN_KEBERLANGSUNGAN.docx',
                'description' => 'Standar operasional prosedur penanganan insiden dan keberlangsungan sistem.',
            ],

            // Indikator 3: SDM Pemdi
            [
                'indicator_number' => 3,
                'level_number' => 2,
                'title' => 'Daftar Rekapitulasi Pelatihan & Kompetensi Digital ASN (>90%)',
                'document_type' => 'xlsx',
                'file_path' => '/templates/REKAP_KOMPETENSI_DIGITAL_ASN.xlsx',
                'description' => 'Daftar ASN yang telah mengikuti sertifikasi / pelatihan digital.',
            ],
            [
                'indicator_number' => 3,
                'level_number' => 4,
                'title' => 'Dokumentasi Portofolio Pemanfaatan AI & Data Analytics oleh ASN',
                'document_type' => 'docx',
                'file_path' => '/templates/PORTOFOLIO_AI_DATA_ANALYTICS.docx',
                'description' => 'Bukti implementasi kecerdasan buatan dalam produktivitas kerja.',
            ],

            // Indikator 4: Kolaborasi Pemdi
            [
                'indicator_number' => 4,
                'level_number' => 3,
                'title' => 'Perjanjian Kerja Sama / MoU Kemitraan Co-Creation Digital',
                'document_type' => 'docx',
                'file_path' => '/templates/TEMPLATE_PKS_KEMITRAAN_DIGITAL.docx',
                'description' => 'Format naskah kesepakatan kolaborasi lintas sektor dan akademisi.',
            ],

            // Indikator 5: Tata Kelola Data (SDI)
            [
                'indicator_number' => 5,
                'level_number' => 3,
                'title' => 'Katalog Standar Data dan Kamus Metadata SDI',
                'document_type' => 'xlsx',
                'file_path' => '/templates/STANDAR_DATA_DAN_METADATA_SDI.xlsx',
                'description' => 'Format pengisian metadata Satu Data Indonesia sesuai standar Bappenas.',
            ],

            // Indikator 8: Pelindungan Data Pribadi (PDP)
            [
                'indicator_number' => 8,
                'level_number' => 2,
                'title' => 'Surat Keputusan (SK) Pejabat Pelindung Data Pribadi (PPDP)',
                'document_type' => 'docx',
                'file_path' => '/templates/SK_PENETAPAN_PPDP.docx',
                'description' => 'Template penetapan petugas pelindung data pribadi instansi.',
            ],
            [
                'indicator_number' => 8,
                'level_number' => 3,
                'title' => 'SOP Pemrosesan Data Pribadi & Pemenuhan Hak Subjek Data',
                'document_type' => 'docx',
                'file_path' => '/templates/SOP_PEMROSESAN_DATA_PRIBADI.docx',
                'description' => 'Prosedur pemrosesan data, persetujuan (consent), dan pemenuhan hak subjek data.',
            ],

            // Indikator 9 & 10: Keamanan Pemdi
            [
                'indicator_number' => 9,
                'level_number' => 3,
                'title' => 'Laporan Hasil Audit Keamanan Sistem Informasi Internal',
                'document_type' => 'docx',
                'file_path' => '/templates/LAPORAN_AUDIT_KEAMANAN_INTERNAL.docx',
                'description' => 'Format laporan temuan audit dan rekomendasi perbaikan keamanan.',
            ],
            [
                'indicator_number' => 10,
                'level_number' => 3,
                'title' => 'Kuesioner Matriks Pengukuran Kematangan IKASANDI BSSN',
                'document_type' => 'xlsx',
                'file_path' => '/templates/MATRIKS_EVALUASI_IKASANDI.xlsx',
                'description' => 'Lembar kerja pengukuran indeks keamanan siber dan sandi.',
            ],

            // Indikator 12: Penanganan Insiden Siber (CSIRT)
            [
                'indicator_number' => 12,
                'level_number' => 2,
                'title' => 'SK Pembentukan Tim Tanggap Insiden Siber (CSIRT / TTIS)',
                'document_type' => 'docx',
                'file_path' => '/templates/SK_TIM_CSIRT_INSTANSI.docx',
                'description' => 'Format surat keputusan penetapan tim respons tanggap darurat siber.',
            ],

            // Indikator 13: Aplikasi Pemdi (SDLC)
            [
                'indicator_number' => 13,
                'level_number' => 3,
                'title' => 'Dokumen Spesifikasi Kebutuhan & Uji Kelaikan Aplikasi (SDLC)',
                'document_type' => 'docx',
                'file_path' => '/templates/DOKUMEN_SDLC_APLIKASI.docx',
                'description' => 'Format dokumentasi perancangan, testing, dan deployment aplikasi.',
            ],

            // Indikator 17: Portal Layanan Digital
            [
                'indicator_number' => 17,
                'level_number' => 3,
                'title' => 'Inventarisasi Integrasi Single Sign-On (SSO) Portal Layanan',
                'document_type' => 'xlsx',
                'file_path' => '/templates/INVENTARIS_SSO_PORTAL_LAYANAN.xlsx',
                'description' => 'Daftar aplikasi yang telah terhubung ke portal satu pintu terpadu.',
            ],

            // Indikator 19: Dukungan Pengguna & SLA
            [
                'indicator_number' => 19,
                'level_number' => 2,
                'title' => 'Dokumen Service Level Agreement (SLA) Layanan Digital',
                'document_type' => 'docx',
                'file_path' => '/templates/DOKUMEN_SLA_LAYANAN_DIGITAL.docx',
                'description' => 'Standar batas waktu respons tiket helpdesk dan target uptime server.',
            ],
            [
                'indicator_number' => 19,
                'level_number' => 3,
                'title' => 'Rekapitulasi Tiket & Monitoring Kepatuhan SLA Layanan',
                'document_type' => 'xlsx',
                'file_path' => '/templates/LOG_MONITORING_TIKET_SLA.xlsx',
                'description' => 'Format tracking tiket pengaduan layanan dan waktu penyelesaian.',
            ],

            // Indikator 20: Kepuasan Pengguna
            [
                'indicator_number' => 20,
                'level_number' => 2,
                'title' => 'Kuesioner Baku Survei Kepuasan Masyarakat (SKM) Online',
                'document_type' => 'docx',
                'file_path' => '/templates/KUESIONER_SKM_ONLINE.docx',
                'description' => 'Daftar pertanyaan survei kepuasan 9 unsur sesuai pedoman MenPANRB.',
            ],
            [
                'indicator_number' => 20,
                'level_number' => 3,
                'title' => 'Laporan Rekapitulasi Indeks Kepuasan Pengguna (IKM/SKM)',
                'document_type' => 'xlsx',
                'file_path' => '/templates/REKAP_NILAI_SURVEI_KEPUASAN.xlsx',
                'description' => 'Lembar hitung nilai indeks kepuasan layanan per triwulan.',
            ],
            [
                'indicator_number' => 20,
                'level_number' => 4,
                'title' => 'Laporan Audit Mystery Guest / Mystery Shopper Layanan Digital',
                'document_type' => 'docx',
                'file_path' => '/templates/LAPORAN_MYSTERY_SHOPPER.docx',
                'description' => 'Format laporan pengujian rahasia kualitas pengalaman pengguna.',
            ],
        ];

        foreach ($templates as $tpl) {
            $indicatorId = DB::table('indicators')->where('indicator_number', $tpl['indicator_number'])->value('id');
            if (!$indicatorId) {
                continue;
            }

            $maturityLevelId = null;
            if (isset($tpl['level_number'])) {
                $maturityLevelId = DB::table('maturity_levels')
                    ->where('indicator_id', $indicatorId)
                    ->where('level_number', $tpl['level_number'])
                    ->value('id');
            }

            DB::table('maturity_templates')->updateOrInsert(
                [
                    'indicator_id' => $indicatorId,
                    'title' => $tpl['title']
                ],
                [
                    'indicator_id' => $indicatorId,
                    'maturity_level_id' => $maturityLevelId,
                    'title' => $tpl['title'],
                    'document_type' => $tpl['document_type'],
                    'file_path' => $tpl['file_path'],
                    'description' => $tpl['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
