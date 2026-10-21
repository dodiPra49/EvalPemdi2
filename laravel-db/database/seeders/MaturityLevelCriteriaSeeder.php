<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaturityLevelCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indicatorMap = DB::table('indicators')->pluck('id', 'indicator_number');

        $levelsData = [
            // ==========================================
            // INDIKATOR 1: Tata Kelola Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 1,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah di tingkat mikro telah disusun.\n2. Pelaksanaan Rencana Aksi Pemdi dan penerapan Arsitektur Pemdi pada tingkat mikro telah dilakukan pada sebagian Layanan Digital Instansi Pemerintah, untuk mendukung transformasi tata kelola Pemdi dan pembangunan di lingkungan Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Langkah-langkah atau kegiatan nyata telah dilaksanakan, sesuai Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah.\n2. Telah memanfaatkan Arsitektur Pemdi, pada seluruh Layanan Digital Pemerintah prioritas dan/atau Layanan Digital Pemerintah tematik, untuk mendukung transformasi tata kelola pelayanan publik dan pembangunan di lingkungan Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Telah dilakukan reviu atas Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah; dan\n2. Telah memanfaatkan Arsitektur Pemdi, pada seluruh Layanan Digital Pemerintah prioritas dan/atau Layanan Digital Pemerintah tematik, serta telah dilakukan reviu, untuk mendukung transformasi tata kelola pelayanan publik dan pembangunan nasional.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Langkah-langkah atau kegiatan nyata telah dilaksanakan sesuai reviu atas Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah; dan\n2. Telah memanfaatkan reviu Arsitektur Pemdi, pada seluruh Layanan Digital Pemerintah prioritas dan/atau Layanan Digital Pemerintah tematik, untuk mendukung transformasi tata kelola pelayanan publik dan pembangunan nasional.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 2: Manajemen Layanan Digital
            // ==========================================
            [
                'indicator_number' => 2,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah telah menjadi referensi arah pelaksanaan Manajemen Layanan Digital Pemerintah sesuai dengan pedoman Manajemen Layanan Digital Pemerintah, pada sebagian Layanan Digital Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah telah menjadi referensi arah pelaksanaan Manajemen Layanan Digital Pemerintah sesuai dengan pedoman Manajemen Layanan Digital Pemerintah, pada seluruh Layanan Digital Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "Pelaksanaan Manajemen Layanan Digital Instansi Pemerintah telah dilakukan reviu secara menyeluruh.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Penerapan tindak lanjut sesuai reviu telah dilakukan secara menyeluruh pada Layanan Digital Instansi Pemerintah.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 3: SDM Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 3,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Telah melaksanakan peningkatan kompetensi digital kepada lebih dari 90% ASN pengelola untuk mencapai kompetensi digital optimal.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Telah melaksanakan peningkatan kompetensi digital kepada lebih dari 90% ASN pengelola maupun pengguna layanan digital, serta sumber daya lainnya secara menyeluruh untuk mencapai kompetensi digital optimal.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "Telah memiliki kompetensi digital ASN untuk dapat memanfaatkan AI dan Analisis Data secara intensif dalam meningkatkan kinerja dan produktivitas Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Telah memiliki kompetensi digital ASN untuk dapat memanfaatkan AI, Analisis Data, dan teknologi mutakhir secara intensif dalam meningkatkan kinerja dan produktivitas Instansi Pemerintah, dalam rangka mendukung transformasi tata kelola Pemdi untuk pembangunan nasional.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 4: Kolaborasi Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 4,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah telah menjadi referensi dalam pelaksanaan kolaborasi antar Instansi Pemerintah hingga kolaborasi di tingkat nasional, dalam rangka peningkatan kualitas pelaksanaan Pemdi.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah telah menjadi referensi dalam pelaksanaan kolaborasi antar Instansi Pemerintah, bersama dan tidak terbatas kepada akademisi, lembaga penelitian, pelaku usaha, industri, media, komunitas, dan organisasi masyarakat baik dalam negeri maupun luar negeri dalam penerapan Pemdi, serta bersifat partisipasi aktif para pihak (co-creation).",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Kolaborasi antar Instansi Pemerintah bersama dan tidak terbatas kepada akademisi, lembaga penelitian, pelaku usaha, industri, media, komunitas, dan organisasi masyarakat baik dalam negeri maupun luar negeri dalam penerapan Pemdi telah dilaksanakan secara terarah di tingkat Instansi Pemerintah, serta telah dilakukan reviu; dan/atau\n2. Kolaborasi antar Instansi Pemerintah dalam rangka koordinasi dan konsolidasi untuk memberikan layanan kepada Presiden melalui Dasbor Presiden.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Penerapan tindak lanjut sesuai reviu secara menyeluruh pada kegiatan kolaborasi Pemdi.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 5: Tata Kelola Data
            // ==========================================
            [
                'indicator_number' => 5,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI.\n2. Dalam tahap penyiapan mekanisme koordinasi atau regulasi internal dan berproses untuk pemanfaatan data pada Layanan Digital Pemerintah.\n3. 0 < Nilai SDI <= 12,5",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Sudah terbentuk penyelenggara SDI untuk inisiatif tata kelola data yang diproduksi oleh instansi, sesuai prinsip SDI.\n2. Sudah mulai menyusun metadata atau pembahasan standar data, namun belum terdokumentasi dengan baik atau belum berjalan konsisten.\n3. Sudah terdapat inisiatif pemanfaatan data untuk Layanan Digital Pemerintah.\n4. 12,5 < Nilai SDI <= 37,5",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Struktur kelembagaan dan regulasi dasar tata kelola data sudah tersedia.\n2. Sebagian besar data sudah memiliki standar data dan metadata.\n3. Memiliki sistem berbagi pakai data, namun interoperabilitas dan pemanfaatan data lintas sektor masih terbatas.\n4. 37,5 < Nilai SDI <= 62,5",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Hampir seluruh prinsip SDI telah diterapkan dengan baik dan konsisten dalam data yang diproduksi Instansi.\n2. Terdapat integrasi sistem, data digunakan lintas instansi.\n3. Telah dilakukan evaluasi pemanfaatan data dalam kebijakan.\n4. 62,5 < Nilai SDI <= 75; dan/atau\n5. Data sesuai yang dimiliki oleh Instansi Pemerintah telah dikelola dan dikonsolidasikan untuk mendukung Dasbor Presiden; dan/atau\n6. Dilakukan evaluasi pada Data yang telah dikelola dan dikonsolidasikan untuk mendukung Dasbor Presiden.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Seluruh prinsip SDI telah diterapkan dengan baik, konsisten, dan berkelanjutan dalam data yang diproduksi Instansi.\n2. Kelembagaan dan sistem sudah kuat.\n3. Integrasi sistem secara menyeluruh, dan telah memanfaatkan interoperabilitas data lintas instansi.\n4. Sudah dilakukan evaluasi secara menyeluruh dalam pemanfaatan data untuk Layanan Digital Pemerintah.\n5. Tata Kelola Data sesuai prinsip SDI telah menjadi bagian dari budaya kerja instansi;\n6. 75 < Nilai SDI <= 100; dan/atau\n7. Dilakukan tindak lanjut hasil reviu pada Data yang telah dikelola dan dikonsolidasikan untuk mendukung Dasbor Presiden.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 6: Penyelenggaraan Informasi Geospasial
            // ==========================================
            [
                'indicator_number' => 6,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus.\n2. Berbagi pakai data geospasial dengan dibangun geoportal sebagai platform integrasi dan berbagi pakai data pada layanan digital pemerintah.\n3. Dalam tahap penyiapan mekanisme koordinasi atau regulasi internal dan berproses untuk pelaksanaan penyelenggaraan pada Layanan Digital Pemerintah.\n4. 1 < SJIG <= 1,50",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Tata kelola dan kelembagaan penyelenggaraan telah ditetapkan melalui regulasi resmi.\n2. SDM pendukung berbagi pakai dan pemanfaatan telah ditetapkan melalui regulasi internal dan masih bersifat sementara.\n3. Sistem berbagi pakai dan pemanfaatan masih bersifat informasional dan telah dikelola secara mandiri.\n4. Sebagian yang dibagipakaikan telah memiliki metadata dan memenuhi standar serta telah digunakan dan terintegrasi dalam layanan dan proses perencanaan untuk sebagian Layanan Digital Pemerintah.\n5. 1,50 < SJIG <= 2,50",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Sudah terdapat SOP penyelenggaraan dengan mengutamakan pemanfaatan teknologi digital.\n2. Mekanisme koordinasi antar unit penyelenggara telah ditetapkan melalui forum data.\n3. Telah memiliki SDM berlatar belakang kebumian atau TI yang ditugaskan dalam penyelenggaraan.\n4. Telah memiliki perangkat produksi data geospasial, perangkat keras dan lunak khusus.\n5. Seluruh IG yang dibagipakaikan memiliki metadata dan sesuai standar untuk seluruh Layanan Digital prioritas/tematik.\n6. 2,50 < SJIG <= 3,50",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Memiliki roadmap penyelenggaraan IG mencakup berbagi pakai dan kolaborasi eksternal.\n2. Memiliki SDM Surveyor Pemetaan (ASN) dan profesional (non ASN).\n3. Menerapkan manajemen kualitas tata kelola.\n4. Memiliki aplikasi lain yang terintegrasi IG.\n5. Pemanfaatan IG telah dievaluasi.\n6. Evaluasi SOP IG telah ada.\n7. Evaluasi pada sistem IG.\n8. 3,50 < SJIG <= 4,00",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Review berkala terhadap regulasi dan kelembagaan Simpul Jaringan IG.\n2. Dianggarkan rutin pemeliharaan perangkat pendukung.\n3. Berbagi pakai IG menjadi bagian dari budaya kerja instansi.\n4. 4,00 < SJIG <= 5,00",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 7: Pembangunan Statistik
            // ==========================================
            [
                'indicator_number' => 7,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Proses statistik sektoral bersifat ad-hoc, tidak terorganisasi, tidak dipantau.\n2. Kebijakan internal belum ada atau masih konsep.\n3. Indeks Pembangunan Statistik (IPS) < 1,80.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Proses statistik sektoral didefinisikan dengan dasar manajemen per unit kerja.\n2. Belum ada keterpaduan antar unit.\n3. 1,80 <= IPS < 2,60.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Proses statistik sektoral telah diharmonisasi di seluruh unit kerja.\n2. Pimpinan mengendalikan keterpaduan namun keselarasan proses masih berproses.\n3. 2,60 <= IPS < 3,50.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Proses statistik terpadu di seluruh unit kerja.\n2. Terdapat proses integrasi keselarasan antarproses statistik.\n3. 3,50 <= IPS < 4,20.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Terpadu dan berkontribusi langsung pada kinerja organisasi.\n2. Terintegrasi menyeluruh dan dilakukan peningkatan kualitas berkelanjutan berdasar reviu.\n3. 4,20 <= IPS <= 5,00.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 8: Pelindungan Data Pribadi (PDP)
            // ==========================================
            [
                'indicator_number' => 8,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP).",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Penerapan tata kelola PDP dilaksanakan sesuai rencana aksi implementasi PDP pada Layanan Digital Instansi.\n2. Penerapan teknis PDP dilaksanakan sesuai perencanaan pada sebagian Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Substansi implementasi PDP termasuk dalam Rencana Aksi Pemdi.\n2. Penerapan tata kelola PDP dan teknis PDP dilaksanakan sesuai perencanaan pada seluruh Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Evaluasi menyeluruh pada penerapan tata kelola PDP pada Layanan Digital Pemerintah.\n2. Evaluasi menyeluruh terhadap penerapan teknis PDP pada Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Tindak lanjut evaluasi tata kelola dan teknis PDP dilakukan secara menyeluruh.\n2. Tata kelola PDP telah menjadi budaya kerja dalam menyelenggarakan Layanan Digital Pemerintah.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 9: Audit Keamanan Pemdi & Teknologi
            // ==========================================
            [
                'indicator_number' => 9,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai substansi Rencana Aksi Nasional Pemdi serta Arsitektur Keamanan dan Teknologi Pemdi.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Instansi Pemerintah telah melakukan Audit Keamanan Pemdi dan Teknologi Pemdi Internal dalam penyelenggaraan sebagian Layanan Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Instansi Pemerintah telah melakukan Audit Keamanan Internal dalam penyelenggaraan sebagian Layanan Pemerintah.\n2. Tindak Lanjut hasil Audit Keamanan Internal telah dilaksanakan.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "Audit Eksternal Keamanan Pemdi dan Teknologi Pemdi untuk layanan digital prioritas Instansi Pemerintah telah dilaksanakan.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Tindak Lanjut atas hasil Audit Eksternal Keamanan Pemdi dan Teknologi Pemdi dalam penyelenggaraan Layanan Pemerintah telah dilaksanakan.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 10: Keamanan Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 10,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Dalam tahap penyusunan tata kelola dan manajemen keamanan informasi.\n2. Dalam tahap identifikasi Infrastruktur Informasi Vital oleh Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Telah menerapkan tata kelola manajemen keamanan informasi sesuai pedoman.\n2. Penerapan tata kelola sesuai Rencana Aksi Pemdi.\n3. Telah melakukan identifikasi Infrastruktur Informasi Vital.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Instansi telah menerapkan tata kelola manajemen keamanan informasi sesuai pedoman.\n2. Telah melaksanakan implementasi kontrol teknis berdasarkan hasil kematangan keamanan siber (IKASANDI).",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "Tata kelola manajemen keamanan Instansi telah terorganisir, terkelola terpadu, optimal, serta dilaksanakan reviu secara berkala.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Penerapan tindak lanjut sesuai reviu atas Keamanan Pemdi Instansi Pemerintah melalui proses otomasi.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 11: Kriptografi untuk Keamanan Data
            // ==========================================
            [
                'indicator_number' => 11,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Dalam tahap penyiapan penerapan teknologi kriptografi untuk keamanan data, sesuai peraturan perundang-undangan.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Sudah menerapkan teknologi kriptografi sesuai peraturan perundang-undangan pada sebagian Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Teknologi kriptografi telah diterapkan pada sebagian Layanan Digital Pemerintah di 2 (dua) siklus data (at-rest, in-use, in-transit).",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Teknologi kriptografi diterapkan pada seluruh Layanan prioritas/tematik di 2 siklus data.\n2. Telah dilakukan evaluasi penerapan teknologi kriptografi.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Penyelenggaraan Persandian terorganisir dan terkelola baik secara menyeluruh berdasarkan IKASANDI.\n2. Telah melakukan tindak lanjut hasil evaluasi penerapan teknologi kriptografi.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 12: Kapabilitas Penanganan Insiden Siber
            // ==========================================
            [
                'indicator_number' => 12,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah.\n2. Penanganan Insiden Siber dilaksanakan sesuai kebutuhan sementara.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Instansi telah membentuk TTIS (CSIRT) sesuai pedoman dan perencanaan terarah.\n2. Penanganan insiden siber telah dilakukan oleh TTIS pada sebagian Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Instansi telah melaksanakan Penanganan Insiden Siber melalui TTIS.\n2. Penanganan insiden dilakukan pada seluruh Layanan prioritas dan/atau tematik.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Kapabilitas Penanganan Insiden Siber melalui TTIS telah direviu secara berkala.\n2. TTIS berpartisipasi aktif berbagi informasi/sumber daya dengan TTIS lainnya lingkup nasional.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Pelaksanaan penanganan insiden dievaluasi untuk perbaikan berkelanjutan.\n2. Optimalisasi penanganan insiden memberikan dampak terhadap kapabilitas keamanan Pemdi nasional.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 13: Aplikasi Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 13,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Substansi Rencana Aksi Pemdi dan Arsitektur Teknologi Pemdi mikro dalam tahap penyusunan, sebagai referensi arah pembangunan aplikasi.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Arsitektur Teknologi Pemdi telah menjadi referensi arah pengembangan aplikasi instansi pada sebagian Layanan Digital Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Arsitektur Teknologi Pemdi menjadi referensi pengembangan aplikasi pada seluruh Layanan prioritas/tematik Instansi.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Pengembangan aplikasi telah mengintegrasikan seluruh aplikasi instansi serta mendukung Layanan Digital Pemerintah.\n2. Pelaksanaan pengembangan terorganisir, terkelola terpadu, optimal, serta direviu berkala.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Mengintegrasikan seluruh aplikasi instansi, mendukung Layanan Digital, serta menerapkan seluruh manajemen Layanan Digital Pemerintah.\n2. Tindak Lanjut atas hasil reviu pelaksanaan aplikasi telah dilaksanakan.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 14: Infrastruktur Pemerintah Digital
            // ==========================================
            [
                'indicator_number' => 14,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Substansi Rencana Aksi dan Arsitektur Teknologi tingkat mikro dalam tahapan penyusunan referensi pemanfaatan infrastruktur.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Sebagian Layanan Digital Instansi Pemerintah telah berbasis teknologi awan (Cloud) sesuai peraturan perundang-undangan.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Seluruh Layanan Digital Pemerintah prioritas dan/atau tematik telah berbasis teknologi awan (Cloud Technology).",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Penyediaan Infrastruktur Digital terintegrasi dengan Infrastruktur Digital Pemerintah Nasional (Pusat Data Nasional / PDN).\n2. Terkelola secara terpadu, optimal, dan direviu berkala.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Terintegrasi dan memanfaatkan PDN Nasional untuk menjamin keberlangsungan layanan digital.\n2. Tindak lanjut hasil reviu pemanfaatan infrastruktur telah dilaksanakan.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 15: Keterpaduan Proses Bisnis Lintas Sektor
            // ==========================================
            [
                'indicator_number' => 15,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi proses bisnis.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Keterpaduan proses bisnis Pemdi telah diterapkan pada sebagian Layanan Digital Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "Keterpaduan proses bisnis Pemdi diterapkan pada seluruh Layanan prioritas dan/atau tematik.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Menjadi bagian dari proses bisnis Pemdi lintas sektor tingkat nasional (Human-Based).\n2. Diterapkan pada seluruh aplikasi instansi.\n3. Terkelola optimal dan direviu berkala.\n4. Mendukung budaya tertib arsip digital sebagai basis Analisis Data.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Bagian proses bisnis lintas sektor nasional.\n2. Tindak lanjut atas hasil reviu keterpaduan proses bisnis telah dilaksanakan untuk transformasi pelayanan publik personal dan humanis.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 16: Integrasi Aplikasi
            // ==========================================
            [
                'indicator_number' => 16,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Arsitektur Teknologi Pemdi mikro dalam tahapan penyusunan referensi integrasi aplikasi.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Integrasi aplikasi telah menjadi referensi pada sebagian Layanan Digital Instansi Pemerintah.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Integrasi aplikasi pada seluruh Layanan prioritas/tematik.\n2. Mengintegrasikan aplikasi proses bisnis utama dengan Dasbor Presiden.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Diterapkan pada seluruh Layanan prioritas/tematik dan terkelola optimal secara berkala.\n2. Mengintegrasikan aplikasi sesuai kebutuhan Dasbor Presiden dan telah direviu.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Tindak lanjut reviu integrasi aplikasi telah dilaksanakan secara menyeluruh.\n2. Optimalisasi pelaksanaan integrasi aplikasi untuk pengambilan keputusan pada Dasbor Presiden.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 17: Portal Layanan Digital Pemerintah
            // ==========================================
            [
                'indicator_number' => 17,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Arsitektur Layanan Digital dalam tahap penyusunan referensi portal layanan terpadu.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Penerapan Portal Layanan Digital pada sebagian layanan digital berbasis siklus hidup.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Penerapan Portal Layanan pada seluruh Layanan prioritas/tematik berbasis siklus hidup.\n2. Portal layanan untuk proses bisnis utama terintegrasi dengan Dasbor Presiden.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Mendukung Portal Layanan Digital Pemerintah Nasional (SSO).\n2. Terkelola optimal dan direviu berkala.\n3. Terintegrasi dengan Dasbor Presiden untuk seluruh proses bisnis.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Terintegrasi penuh dengan Portal Layanan Digital Nasional.\n2. Peningkatan kualitas integrasi Portal Layanan dengan Dasbor Presiden.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 18: Interoperabilitas Data
            // ==========================================
            [
                'indicator_number' => 18,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "Arsitektur Data Pemdi tingkat mikro dalam tahap penyusunan referensi interoperabilitas.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "Penerapan interoperabilitas data pada sebagian Layanan Digital Pemerintah Instansi.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Penerapan interoperabilitas data pada seluruh Layanan prioritas/tematik.\n2. Interoperabilitas data untuk mendukung Dasbor Presiden.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Mendukung Satu Data Indonesia.\n2. Memungkinkan pertukaran data waktu nyata (real-time) lintas sektor.\n3. Seluruh data terhubung ke Dasbor Presiden dan telah direviu.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Interoperabilitas data komprehensif, terintegrasi, adaptif, menjadi rujukan instansi lain, serta peningkatan kualitas integrasi Dasbor Presiden berkelanjutan.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 19: Fasilitas Dukungan Pengguna (SLA)
            // ==========================================
            [
                'indicator_number' => 19,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital.\n2. Penyusunan SOP Layanan dengan rincian SLA.\n3. Pengembangan sistem pemantauan SLA otomatis.",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Telah memiliki Fasilitas Dukungan Pengguna Layanan Digital (Helpdesk/Kontak Layanan).\n2. Memiliki SOP Layanan dengan rincian SLA baku.\n3. Memiliki sistem pemantauan SLA yang terotomasi.",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Fasilitas Dukungan Pengguna terintegrasi dengan dukungan layanan di tingkat nasional.\n2. Memiliki SLA layanan yang selaras standar nasional.\n3. Sistem pemantauan pemenuhan SLA terintegrasi secara nasional.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "Pelaksanaan reviu dan evaluasi berkala terhadap pemenuhan SLA Layanan Digital dan fasilitas dukungan pengguna.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "Tindak lanjut atas hasil reviu pelaksanaan pemenuhan SLA dan sistem pemantauan SLA telah dilaksanakan secara menyeluruh.",
                    ],
                ]
            ],

            // ==========================================
            // INDIKATOR 20: Pengelolaan Kepuasan Pengguna
            // ==========================================
            [
                'indicator_number' => 20,
                'levels' => [
                    [
                        'level_number' => 1,
                        'level_name' => 'Kurang (Merintis/Initiate)',
                        'score_range_min' => 1.00,
                        'score_range_max' => 1.50,
                        'criteria_description' => "1. Memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai pedoman Menteri.\n2. Hasil kepuasan disebarkan melalui kanal resmi digital.\n3. Kanal umpan balik dua arah tersedia (email, formulir saran).\n4. Survei menyasar minimal 1 kelompok rentan (disabilitas/lansia).",
                    ],
                    [
                        'level_number' => 2,
                        'level_name' => 'Cukup (Membangun/Emerging)',
                        'score_range_min' => 1.51,
                        'score_range_max' => 2.50,
                        'criteria_description' => "1. Tersedia widget/fitur umpan balik sederhana (pop-up rating, bintang, tombol saran).\n2. Skor kepuasan digunakan untuk perbaikan layanan.\n3. Masukan diproses berkala (minimal triwulanan).\n4. Mulai diterapkan penilaian mandiri kepuasan pengguna.\n5. Pelibatan kelompok masyarakat sipil (CSO).",
                    ],
                    [
                        'level_number' => 3,
                        'level_name' => 'Baik (Berkembang/Developing)',
                        'score_range_min' => 2.51,
                        'score_range_max' => 3.50,
                        'criteria_description' => "1. Membentuk tim teknis pengelolaan kepuasan pengguna.\n2. Semua layanan memiliki mekanisme umpan balik langsung (widget, chatbot, ulasan).\n3. Survei kepuasan dipublikasikan online dalam dasbor publik.\n4. Dilaksanakan mystery guest/mystery shopper oleh instansi.\n5. Data survei dilaporkan berkala ke publik.",
                    ],
                    [
                        'level_number' => 4,
                        'level_name' => 'Sangat Baik (Melembaga/Embedded)',
                        'score_range_min' => 3.51,
                        'score_range_max' => 4.00,
                        'criteria_description' => "1. Desain ulang layanan periodik berbasis survei pengguna.\n2. Log perubahan layanan dipublikasikan.\n3. Forum Konsultasi Publik daring berkala tiap semester.\n4. Dilaksanakan mystery guest/shopper audit terkoordinasi instansi pembina.\n5. Pemanfaatan Artificial Intelligence (AI) dan Analisis Data untuk analisis sentimen pengguna.",
                    ],
                    [
                        'level_number' => 5,
                        'level_name' => 'Memuaskan (Unggul/Leading)',
                        'score_range_min' => 4.01,
                        'score_range_max' => 5.00,
                        'criteria_description' => "1. Memanfaatkan pengukuran kepuasan dengan mekanisme tepercaya untuk menjaga kredibilitas penilaian di seluruh layanan digital.\n2. Riwayat data perubahan layanan berbasis kebutuhan pengguna digunakan dan dilaporkan publik berkala.",
                    ],
                ]
            ],
        ];

        foreach ($levelsData as $data) {
            $indicatorId = $indicatorMap[$data['indicator_number']] ?? null;
            if (!$indicatorId) {
                continue;
            }

            foreach ($data['levels'] as $level) {
                DB::table('maturity_levels')->updateOrInsert(
                    [
                        'indicator_id' => $indicatorId,
                        'level_number' => $level['level_number'],
                    ],
                    array_merge($level, [
                        'indicator_id' => $indicatorId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ])
                );
            }
        }
    }
}
