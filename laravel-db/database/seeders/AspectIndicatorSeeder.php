<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AspectIndicatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Data 7 Aspek Berdasarkan Permenpan RB Nomor 8 Tahun 2026
        $aspects = [
            [
                'code' => 'ASPEK_1',
                'name' => 'Tata Kelola dan Manajemen',
                'weight' => 10.00,
                'order_index' => 1,
            ],
            [
                'code' => 'ASPEK_2',
                'name' => 'Penyelenggara',
                'weight' => 10.00,
                'order_index' => 2,
            ],
            [
                'code' => 'ASPEK_3',
                'name' => 'Data',
                'weight' => 15.00,
                'order_index' => 3,
            ],
            [
                'code' => 'ASPEK_4',
                'name' => 'Keamanan Pemdi',
                'weight' => 15.00,
                'order_index' => 4,
            ],
            [
                'code' => 'ASPEK_5',
                'name' => 'Teknologi Pemdi',
                'weight' => 10.00,
                'order_index' => 5,
            ],
            [
                'code' => 'ASPEK_6',
                'name' => 'Keterpaduan Layanan Digital Pemerintah',
                'weight' => 15.00,
                'order_index' => 6,
            ],
            [
                'code' => 'ASPEK_7',
                'name' => 'Kepuasan Pengguna Layanan Digital Pemerintah',
                'weight' => 25.00,
                'order_index' => 7,
            ],
        ];

        foreach ($aspects as $aspect) {
            DB::table('aspects')->updateOrInsert(
                ['code' => $aspect['code']],
                array_merge($aspect, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        // Mapping ID Aspek
        $aspectMap = DB::table('aspects')->pluck('id', 'code');

        // 2. Data 20 Indikator Evaluasi Kinerja Pemdi Permenpan RB 8/2026
        $indicators = [
            // Aspek 1: Tata Kelola dan Manajemen (10%)
            [
                'aspect_id' => $aspectMap['ASPEK_1'],
                'indicator_number' => 1,
                'name' => 'Tingkat Kematangan Tata Kelola Pemerintah Digital',
                'weight' => 5.00,
                'description' => 'Tata kelola Pemdi adalah kerangka kerja yang memastikan terlaksananya perencanaan, pelaksanaan, dan pengendalian dalam penerapan Pemdi secara terpadu (Rencana Aksi Nasional Pemdi dan Arsitektur Pemdi).',
                'supervisor_agency' => 'Kementerian PANRB, Komdigi, Bappenas, BSSN',
                'responsible_functions' => 'Fungsi Perencanaan, Organisasi & Tata Laksana, SDM, TIK, Pengelola Layanan Digital, Pemilik Layanan, Pengawasan Intern',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_1'],
                'indicator_number' => 2,
                'name' => 'Tingkat Kematangan Manajemen Layanan Digital Pemerintah',
                'weight' => 5.00,
                'description' => 'Manajemen Layanan Digital Pemerintah adalah serangkaian proses untuk mendukung penyelenggaraan Layanan Digital Pemerintah yang berkualitas (Manajemen Risiko, Manajemen Perubahan, Manajemen Pengetahuan, Manajemen Keberlangsungan, dan Manajemen Relasi Pengguna).',
                'supervisor_agency' => 'Kementerian PANRB, Bappenas, BSSN, BRIN, BPKP',
                'responsible_functions' => 'Fungsi Perencanaan, Organisasi & Tata Laksana, SDM, TIK, Pengelola Layanan Digital, Pemilik Layanan, Pengawasan Intern',
            ],

            // Aspek 2: Penyelenggara (10%)
            [
                'aspect_id' => $aspectMap['ASPEK_2'],
                'indicator_number' => 3,
                'name' => 'Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital',
                'weight' => 5.00,
                'description' => 'Kompetensi SDM Pemdi adalah Kompetensi Digital ASN yang mencakup Kepemimpinan Digital, Kemahiran Digital, dan Literasi Digital.',
                'supervisor_agency' => 'Kementerian PANRB, Komdigi, Kemendagri, BKN, LAN',
                'responsible_functions' => 'Fungsi Organisasi & Tata Laksana, SDM, TIK',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_2'],
                'indicator_number' => 4,
                'name' => 'Tingkat Kematangan Kolaborasi Pemerintah Digital',
                'weight' => 5.00,
                'description' => 'Forum Koordinasi Pemdi merupakan wadah pertukaran informasi, peningkatan kapasitas pelaksanaan Pemdi bersama lintas sektor (akademisi, industri, komunitas), dan konsolidasi Dasbor Presiden.',
                'supervisor_agency' => 'Kementerian PANRB, Kemendagri',
                'responsible_functions' => 'Fungsi Organisasi & Tata Laksana, TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],

            // Aspek 3: Data (15%)
            [
                'aspect_id' => $aspectMap['ASPEK_3'],
                'indicator_number' => 5,
                'name' => 'Tingkat Kematangan Tata Kelola Data',
                'weight' => 5.00,
                'description' => 'Kapabilitas instansi dalam menerapkan Tata Kelola Data melalui Satu Data Indonesia (SDI) untuk data yang akurat, mutakhir, terpadu, dan dapat diakses.',
                'supervisor_agency' => 'Kementerian PPN/Bappenas',
                'responsible_functions' => 'Fungsi Perencanaan, TIK, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_3'],
                'indicator_number' => 6,
                'name' => 'Tingkat Kematangan Penyelenggaraan Informasi Geospasial',
                'weight' => 3.00,
                'description' => 'Kemampuan berbagi pakai dan pemanfaatan data dan Informasi Geospasial (IG) diselaraskan dengan Evaluasi Simpul Jaringan Informasi Geospasial (SJIG).',
                'supervisor_agency' => 'Badan Informasi Geospasial (BIG)',
                'responsible_functions' => 'Fungsi Perencanaan, TIK, Statistik, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_3'],
                'indicator_number' => 7,
                'name' => 'Tingkat Kematangan Pembangunan Statistik',
                'weight' => 3.00,
                'description' => 'Kapabilitas pemanfaatan data statistik sektoral diselaraskan dengan Evaluasi Penyelenggaraan Statistik Sektoral (EPSS/IPS).',
                'supervisor_agency' => 'Badan Pusat Statistik (BPS)',
                'responsible_functions' => 'Fungsi Perencanaan, TIK, Statistik, Persandian, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_3'],
                'indicator_number' => 8,
                'name' => 'Tingkat Kematangan Pelindungan Data Pribadi',
                'weight' => 4.00,
                'description' => 'Tata kelola dan kontrol teknis kepatuhan amanat regulasi UU PDP (Petugas PPDP, SOP Pemrosesan, hak subjek data, dan manajemen risiko PDP).',
                'supervisor_agency' => 'Kementerian Komunikasi dan Digital',
                'responsible_functions' => 'Fungsi Perencanaan, TIK, Pengelola Layanan Digital, Pemilik Layanan, Pengawasan Intern',
            ],

            // Aspek 4: Keamanan Pemdi (15%)
            [
                'aspect_id' => $aspectMap['ASPEK_4'],
                'indicator_number' => 9,
                'name' => 'Tingkat Kematangan Pelaksanaan Audit Keamanan Pemerintah Digital dan Teknologi Pemerintah Digital',
                'weight' => 4.00,
                'description' => 'Kapabilitas instansi dalam pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (Internal & Eksternal) sesuai standar BSSN.',
                'supervisor_agency' => 'Badan Siber dan Sandi Negara (BSSN)',
                'responsible_functions' => 'Fungsi Pengawasan Intern, TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_4'],
                'indicator_number' => 10,
                'name' => 'Tingkat Kematangan Keamanan Pemerintah Digital',
                'weight' => 4.00,
                'description' => 'Penyelenggaraan keamanan Pemdi mencakup tata kelola keamanan informasi dan kontrol teknis berbasis instrumen IKASANDI.',
                'supervisor_agency' => 'Badan Siber dan Sandi Negara (BSSN)',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_4'],
                'indicator_number' => 11,
                'name' => 'Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data',
                'weight' => 3.00,
                'description' => 'Proteksi kerahasiaan data melalui kriptografi bersesuaian standar nasional untuk data at-rest, in-use, dan in-transit.',
                'supervisor_agency' => 'Badan Siber dan Sandi Negara (BSSN)',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_4'],
                'indicator_number' => 12,
                'name' => 'Tingkat Kematangan Kapabilitas Penanganan Insiden Siber',
                'weight' => 4.00,
                'description' => 'Penanganan insiden siber terstruktur melalui Tim Tanggap Insiden Siber (TTIS / CSIRT) instansi hingga kolaborasi TTIS Nasional.',
                'supervisor_agency' => 'Badan Siber dan Sandi Negara (BSSN)',
                'responsible_functions' => 'Fungsi Organisasi & Tata Laksana, SDM, TIK, Pengelola Layanan Digital',
            ],

            // Aspek 5: Teknologi Pemdi (10%)
            [
                'aspect_id' => $aspectMap['ASPEK_5'],
                'indicator_number' => 13,
                'name' => 'Tingkat Kematangan Aplikasi Pemerintah Digital',
                'weight' => 5.00,
                'description' => 'Pembangunan/pengembangan aplikasi berbasis SDLC selaras Arsitektur Teknologi Pemdi dan integrasi sistem.',
                'supervisor_agency' => 'Kementerian Komunikasi dan Digital',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_5'],
                'indicator_number' => 14,
                'name' => 'Tingkat Kematangan Infrastruktur Pemerintah Digital',
                'weight' => 5.00,
                'description' => 'Penyelenggaraan infrastruktur mengutamakan Cloud Technology melalui Pusat Data Nasional (PDN) dan Jaringan Intra Pemerintah.',
                'supervisor_agency' => 'Kementerian Komunikasi dan Digital',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital',
            ],

            // Aspek 6: Keterpaduan Layanan Digital Pemerintah (15%)
            [
                'aspect_id' => $aspectMap['ASPEK_6'],
                'indicator_number' => 15,
                'name' => 'Keterpaduan Proses Bisnis Pemerintah Digital Lintas Unit dan Instansi',
                'weight' => 4.00,
                'description' => 'Keterpaduan proses bisnis Pemdi berorientasi Human-Based Governance, penyederhanaan birokrasi, dan tertib arsip digital.',
                'supervisor_agency' => 'Kementerian PANRB, Bappenas, Kemendagri, ANRI',
                'responsible_functions' => 'Fungsi Organisasi & Tata Laksana, TIK, Pengelola Layanan Digital, Pemilik Layanan, Kearsipan Nasional',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_6'],
                'indicator_number' => 16,
                'name' => 'Integrasi Aplikasi',
                'weight' => 4.00,
                'description' => 'Integrasi sistem perangkat lunak untuk menghilangkan silo layanan dan integrasi dengan Dasbor Presiden.',
                'supervisor_agency' => 'Kementerian Komunikasi dan Digital',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_6'],
                'indicator_number' => 17,
                'name' => 'Portal Layanan Digital Pemerintah',
                'weight' => 4.00,
                'description' => 'Penyelenggaraan Portal Pelayanan Publik terkonsolidasi berbasis siklus hidup dan terintegrasi Portal Nasional (SSO).',
                'supervisor_agency' => 'Kementerian Komunikasi dan Digital, BSSN',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_6'],
                'indicator_number' => 18,
                'name' => 'Interoperabilitas Data',
                'weight' => 3.00,
                'description' => 'Keterpaduan pertukaran data secara waktu nyata (real-time), pengurangan redundansi data, dan dukungan Dasbor Presiden.',
                'supervisor_agency' => 'Kementerian PPN/Bappenas',
                'responsible_functions' => 'Fungsi Perencanaan, TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],

            // Aspek 7: Kepuasan Pengguna Layanan Digital Pemerintah (25%)
            [
                'aspect_id' => $aspectMap['ASPEK_7'],
                'indicator_number' => 19,
                'name' => 'Fasilitas Dukungan Pengguna Layanan Digital Pemerintah',
                'weight' => 10.00,
                'description' => 'Pemenuhan Kualitas Layanan Digital (Service Level Agreement/SLA), helpdesk, serta sistem pemantauan SLA otomatis.',
                'supervisor_agency' => 'Kementerian PANRB',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],
            [
                'aspect_id' => $aspectMap['ASPEK_7'],
                'indicator_number' => 20,
                'name' => 'Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah',
                'weight' => 15.00,
                'description' => 'Pencapaian survei kepuasan (SKM Online), widget umpan balik langsung, mystery guest/shopper audit, dan analisis sentimen berbasis AI.',
                'supervisor_agency' => 'Kementerian PANRB',
                'responsible_functions' => 'Fungsi TIK, Pengelola Layanan Digital, Pemilik Layanan',
            ],
        ];

        foreach ($indicators as $ind) {
            DB::table('indicators')->updateOrInsert(
                ['indicator_number' => $ind['indicator_number']],
                array_merge($ind, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
