# EVAL-PEMDI: Portal Evaluasi Kinerja Pemerintah Digital
> **Berdasarkan Peraturan Menteri PANRB Nomor 8 Tahun 2026**

Aplikasi portal terpadu untuk evaluasi kematangan Pemerintah Digital (pengganti SPBE PermenPANRB 59/2020) yang mencakup 7 Aspek, 20 Indikator Kematangan (Level 1–5), pengunduhan template bukti dukung resmi, dan perhitungan indeks otomatis secara real-time.

---

## 🏗️ Arsitektur Sistem Baru (Laravel + Inertia.js + React.js)

Aplikasi telah direfaktor menjadi arsitektur monolitik modern menggunakan **Laravel 11 + Inertia.js + React.js**:

```mermaid
graph TD
    User([Pengguna / Asesor / Admin]) -->|HTTP :8000| LaravelApp[Laravel 11 + Inertia.js App]
    LaravelApp -->|Inertia Rendering| ReactUI[React 19 SPA Pages & Components]
    LaravelApp -->|Eloquent API Resources| APIEndpoints[RESTful API v1 Endpoints]
    LaravelApp -->|OpenAPI 3.0 / Swagger UI| SwaggerDocs[/api/documentation]
    LaravelApp -->|Read / Write| MariaDB[(MariaDB 10.11)]
    LaravelApp -->|Cache & Session| Redis[(Redis 7)]
    LaravelApp -->|File Storage| StoragePublic[storage/app/public/templates & evidences]
```

### Karakteristik & Komponen Teknologi:
1. **Frontend & UX**:
   - **Inertia.js v2** + **React 19**
   - **Tailwind CSS v4** + Lucide Icons
   - Single Page Application (SPA) experience tanpa overhead client-side state routing manual.
2. **Backend & RESTful API**:
   - **Laravel 11** dengan PHP 8.2+
   - **Laravel Eloquent API Resources** (`JsonResource`) untuk standarisasi output respons JSON relasional.
   - **Laravel Sanctum** untuk keamanan token API.
3. **Dokumentasi API Standar Industri**:
   - **OpenAPI 3.0** JSON Specification (`/api/v1/openapi.json`)
   - **Interactive Swagger UI** terintegrasi langsung di `/api/documentation`
4. **Penyimpanan Data**:
   - **MariaDB 10.11**: RDBMS relasional ACID untuk 9 tabel inti.
   - **Redis 7**: Cache indikator, performa query, dan sesi.

---

## 📋 7 Aspek & 20 Indikator (PermenPANRB 8/2026)

| No | Aspek | Indikator | Bobot Aspek |
|:---|:---|:---|:---:|
| 1 | **Tata Kelola dan Manajemen** | Indikator 1 - 2 | 10% |
| 2 | **Penyelenggara** | Indikator 3 - 4 | 10% |
| 3 | **Data** | Indikator 5 - 8 | 15% |
| 4 | **Keamanan Pemdi** | Indikator 9 - 12 | 15% |
| 5 | **Teknologi Pemdi** | Indikator 13 - 14 | 10% |
| 6 | **Keterpaduan Layanan Digital** | Indikator 15 - 18 | 15% |
| 7 | **Kepuasan Pengguna** | Indikator 19 - 20 | 25% |

---

## 🚀 Panduan Menjalankan Aplikasi

### Opsi A: Menggunakan Laragon / PHP Lokal & Vite (Rekomendasi Cepat)
```bash
cd laravel-db
composer install
npm install
npm run build   # atau npm run dev untuk live reload
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

### Opsi B: Menggunakan Docker Compose
```bash
docker compose up -d --build
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan storage:link
```

---

## 🌐 Akses Layanan & URL Penting

- **Portal Aplikasi (Inertia + React)**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger UI / OpenAPI**: [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## 👥 Akun Percobaan (Seeded)

| Peran (Role) | Email / NIP | Password Default | Akses |
|:---|:---|:---|:---|
| **Administrator** | `admin@evalpemdi.go.id` | `password` | Manajemen Master User, Unit Kerja, Template Bukti Dukung |
| **Koordinator** | `koordinator@evalpemdi.go.id` | `password` | Monitoring Pengawasan Kematangan Pemdi Seluruh OPD |
| **Asesor Internal** | `penilai@evalpemdi.go.id` | `password` | Pengisian Evaluasi Mandiri 20 Indikator & Unggah Bukti Dukung |
| **Pelaksana Kominfo** | `pelaksana.kominfo@evalpemdi.go.id` | `password` | Penilaian Mandiri Unit Khusus |

---

## 📄 Lisensi & Regulasi
Aplikasi ini dikembangkan mengacu pada standar resmi instrumen evaluasi **Peraturan Menteri PANRB Nomor 8 Tahun 2026 tentang Evaluasi Kinerja Pemerintah Digital**.
