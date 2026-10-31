<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OpenApiController extends Controller
{
    /**
     * Return OpenAPI 3.0 Specification JSON.
     */
    public function spec()
    {
        $spec = [
            'openapi' => '3.0.0',
            'info' => [
                'title' => 'EVAL-PEMDI API Documentation',
                'description' => 'Dokumentasi RESTful API Portal Evaluasi Kinerja Pemerintah Digital (PermenPANRB Nomor 8 Tahun 2026). Didesain menggunakan standar Laravel Eloquent API Resources.',
                'version' => '1.0.7',
                'contact' => [
                    'name' => 'Tim Pengembang EVAL-PEMDI',
                    'email' => 'admin@evalpemdi.go.id',
                ],
            ],
            'servers' => [
                [
                    'url' => url('/'),
                    'description' => 'Current Environment Server',
                ],
            ],
            'components' => [
                'securitySchemes' => [
                    'bearerAuth' => [
                        'type' => 'http',
                        'scheme' => 'bearer',
                        'bearerFormat' => 'SanctumToken',
                        'description' => 'Masukkan Bearer Sanctum Token hasil login',
                    ],
                ],
                'schemas' => [
                    'UserResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'name' => ['type' => 'string', 'example' => 'Dodi Administrator'],
                            'email' => ['type' => 'string', 'example' => 'admin@evalpemdi.go.id'],
                            'nip' => ['type' => 'string', 'example' => '198501012010011001'],
                            'role' => ['type' => 'string', 'example' => 'admin'],
                            'status' => ['type' => 'string', 'example' => 'active'],
                            'work_unit' => ['$ref' => '#/components/schemas/WorkUnitResource'],
                        ],
                    ],
                    'WorkUnitResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'name' => ['type' => 'string', 'example' => 'Dinas Komunikasi dan Informatika'],
                            'code' => ['type' => 'string', 'example' => 'DISKOMINFO'],
                            'category' => ['type' => 'string', 'example' => 'Daerah'],
                            'pic_name' => ['type' => 'string', 'example' => 'Budi Santoso'],
                            'pic_contact' => ['type' => 'string', 'example' => '081234567890'],
                        ],
                    ],
                    'AspectResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'code' => ['type' => 'string', 'example' => 'ASPEK_1'],
                            'name' => ['type' => 'string', 'example' => 'Tata Kelola dan Manajemen'],
                            'weight' => ['type' => 'number', 'example' => 10.00],
                            'order_index' => ['type' => 'integer', 'example' => 1],
                            'indicators' => [
                                'type' => 'array',
                                'items' => ['$ref' => '#/components/schemas/IndicatorResource'],
                            ],
                        ],
                    ],
                    'IndicatorResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'indicator_number' => ['type' => 'integer', 'example' => 1],
                            'name' => ['type' => 'string', 'example' => 'Tingkat Kematangan Tata Kelola Pemdi'],
                            'weight' => ['type' => 'number', 'example' => 5.00],
                            'supervisor_agency' => ['type' => 'string', 'example' => 'KemenPANRB, Komdigi, Bappenas, BSSN'],
                            'maturity_levels' => [
                                'type' => 'array',
                                'items' => ['$ref' => '#/components/schemas/MaturityLevelResource'],
                            ],
                        ],
                    ],
                    'MaturityLevelResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'level_number' => ['type' => 'integer', 'example' => 2],
                            'level_name' => ['type' => 'string', 'example' => 'Cukup / Membangun'],
                            'score_range_min' => ['type' => 'number', 'example' => 1.51],
                            'score_range_max' => ['type' => 'number', 'example' => 2.50],
                            'criteria_description' => ['type' => 'string', 'example' => 'Teks kriteria kematangan regulasi Permenpan 8/2026...'],
                        ],
                    ],
                    'MaturityTemplateResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'title' => ['type' => 'string', 'example' => 'DOKUMEN_SDLC_APLIKASI.docx'],
                            'document_type' => ['type' => 'string', 'example' => 'docx'],
                            'download_url' => ['type' => 'string', 'example' => '/storage/templates/DOKUMEN_SDLC_APLIKASI.docx'],
                        ],
                    ],
                    'EvaluationResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'work_unit_id' => ['type' => 'integer', 'example' => 1],
                            'year' => ['type' => 'integer', 'example' => 2026],
                            'final_index_pemdi' => ['type' => 'number', 'example' => 3.85],
                            'predicate' => ['type' => 'string', 'example' => 'Sangat Baik / Melembaga'],
                            'status' => ['type' => 'string', 'example' => 'draft'],
                            'details' => [
                                'type' => 'array',
                                'items' => ['$ref' => '#/components/schemas/EvaluationDetailResource'],
                            ],
                        ],
                    ],
                    'EvaluationDetailResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'indicator_id' => ['type' => 'integer', 'example' => 1],
                            'selected_level_id' => ['type' => 'integer', 'example' => 3],
                            'assessed_score' => ['type' => 'number', 'example' => 3.00],
                            'explanation_notes' => ['type' => 'string'],
                        ],
                    ],
                    'EvidenceFileResource' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'original_name' => ['type' => 'string', 'example' => 'Bukti_Dukung.pdf'],
                            'file_url' => ['type' => 'string', 'example' => '/storage/evidences/evidence-123.pdf'],
                            'file_size' => ['type' => 'integer', 'example' => 1048576],
                        ],
                    ],
                ],
            ],
            'tags' => [
                ['name' => 'Authentication', 'description' => 'Autentikasi dan sesi pengguna'],
                ['name' => 'Master Data', 'description' => '7 Aspek dan 20 Indikator Kematangan'],
                ['name' => 'Work Units', 'description' => 'Manajemen Perangkat Daerah / Unit Kerja'],
                ['name' => 'Users Management', 'description' => 'Manajemen Akun dan Peran Pengguna'],
                ['name' => 'Templates', 'description' => 'Manajemen Master Template Bukti Dukung'],
                ['name' => 'Evaluations', 'description' => 'Penilaian Mandiri 20 Indikator dan Unggah Bukti Dukung'],
            ],
            'paths' => [
                '/api/v1/auth/login' => [
                    'post' => [
                        'tags' => ['Authentication'],
                        'summary' => 'Login pengguna menggunakan Email atau NIP',
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['login', 'password'],
                                        'properties' => [
                                            'login' => ['type' => 'string', 'example' => 'admin@evalpemdi.go.id'],
                                            'password' => ['type' => 'string', 'example' => 'password'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '200' => [
                                'description' => 'Login Berhasil',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'success' => ['type' => 'boolean', 'example' => true],
                                                'token' => ['type' => 'string', 'example' => '1|abcdef123456...'],
                                                'user' => ['$ref' => '#/components/schemas/UserResource'],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/api/v1/auth/me' => [
                    'get' => [
                        'tags' => ['Authentication'],
                        'summary' => 'Mendapatkan profil pengguna yang sedang login',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Profil Pengguna',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'success' => ['type' => 'boolean', 'example' => true],
                                                'user' => ['$ref' => '#/components/schemas/UserResource'],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/api/v1/master/aspects' => [
                    'get' => [
                        'tags' => ['Master Data'],
                        'summary' => 'Daftar 7 Aspek & 20 Indikator Permenpan RB 8/2026 lengkap beserta kriteria level kematangan',
                        'responses' => [
                            '200' => [
                                'description' => 'Daftar Aspek',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'success' => ['type' => 'boolean', 'example' => true],
                                                'data' => [
                                                    'type' => 'array',
                                                    'items' => ['$ref' => '#/components/schemas/AspectResource'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/api/v1/master/units' => [
                    'get' => [
                        'tags' => ['Work Units'],
                        'summary' => 'Daftar Perangkat Daerah / Unit Kerja',
                        'responses' => [
                            '200' => [
                                'description' => 'Daftar Unit Kerja',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'success' => ['type' => 'boolean', 'example' => true],
                                                'data' => [
                                                    'type' => 'array',
                                                    'items' => ['$ref' => '#/components/schemas/WorkUnitResource'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'post' => [
                        'tags' => ['Work Units'],
                        'summary' => 'Tambah Unit Kerja baru',
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['name', 'code', 'category'],
                                        'properties' => [
                                            'name' => ['type' => 'string'],
                                            'code' => ['type' => 'string'],
                                            'category' => ['type' => 'string', 'enum' => ['Pusat', 'Daerah']],
                                            'pic_name' => ['type' => 'string'],
                                            'pic_contact' => ['type' => 'string'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => ['201' => ['description' => 'Unit berhasil dibuat']],
                    ],
                ],
                '/api/v1/master/users' => [
                    'get' => [
                        'tags' => ['Users Management'],
                        'summary' => 'Daftar Akun Pengguna',
                        'responses' => ['200' => ['description' => 'Daftar User']],
                    ],
                    'post' => [
                        'tags' => ['Users Management'],
                        'summary' => 'Buat Akun Pengguna baru',
                        'responses' => ['201' => ['description' => 'User berhasil dibuat']],
                    ],
                ],
                '/api/v1/master/templates' => [
                    'get' => [
                        'tags' => ['Templates'],
                        'summary' => 'Daftar Template Dokumen Bukti Dukung (.docx, .xlsx)',
                        'responses' => ['200' => ['description' => 'Daftar Template']],
                    ],
                    'post' => [
                        'tags' => ['Templates'],
                        'summary' => 'Unggah Master Template Bukti Dukung baru',
                        'responses' => ['201' => ['description' => 'Template berhasil diunggah']],
                    ],
                ],
                '/api/v1/evaluations/current' => [
                    'get' => [
                        'tags' => ['Evaluations'],
                        'summary' => 'Mendapatkan sesi evaluasi aktif instansi/unit kerja',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Sesi Evaluasi Aktif',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'success' => ['type' => 'boolean', 'example' => true],
                                                'data' => ['$ref' => '#/components/schemas/EvaluationResource'],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/api/v1/evaluations/save-answer' => [
                    'post' => [
                        'tags' => ['Evaluations'],
                        'summary' => 'Menyimpan pilihan tingkat kematangan dan catatan penjelasan indikator',
                        'security' => [['bearerAuth' => []]],
                        'responses' => ['200' => ['description' => 'Jawaban tersimpan']],
                    ],
                ],
                '/api/v1/evaluations/upload-evidence' => [
                    'post' => [
                        'tags' => ['Evaluations'],
                        'summary' => 'Mengunggah file bukti dukung indikator',
                        'security' => [['bearerAuth' => []]],
                        'responses' => ['201' => ['description' => 'File bukti terunggah']],
                    ],
                ],
                '/api/v1/evaluations/{id}/calculate-score' => [
                    'get' => [
                        'tags' => ['Evaluations'],
                        'summary' => 'Menghitung skor indeks aspek dan indeks total secara real-time',
                        'responses' => ['200' => ['description' => 'Skor Indeks terhitung']],
                    ],
                ],
                '/api/v1/evaluations/{id}/submit' => [
                    'post' => [
                        'tags' => ['Evaluations'],
                        'summary' => 'Finalisasi pengiriman evaluasi ke tahap verifikasi',
                        'security' => [['bearerAuth' => []]],
                        'responses' => ['200' => ['description' => 'Evaluasi terkirim']],
                    ],
                ],
            ],
        ];

        return response()->json($spec, 200, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Render interactive Swagger UI page.
     */
    public function ui()
    {
        return view('swagger');
    }
}
