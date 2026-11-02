# Panduan Menjalankan Aplikasi EVAL-PEMDI (Post-Cloning)

Dokumen ini berisi panduan langkah demi langkah untuk mengkonfigurasi dan menjalankan aplikasi **EVAL-PEMDI** (Portal Evaluasi Kinerja Pemerintah Digital berbasis Laravel 11 + Inertia.js + React.js) setelah Anda melakukan `git clone` dari repositori GitHub.

---

## 📁 Struktur Direktori Penting

Perlu diperhatikan bahwa kode utama aplikasi Laravel dan antarmuka React berada di dalam folder **`laravel-db/`**:

```text
EvalPemdi2/
├── docker-compose.yml          # Konfigurasi container Docker (MariaDB, Redis, App)
├── .env.example                # Template env untuk Docker Compose
├── laravel-db/                 # DIRECTORY UTAMA APLIKASI LARAVEL + REACT
│   ├── app/                    # Controller, Model, Policies, Resources
│   ├── database/               # Migrasi tabel dan Seeder data awal
│   ├── resources/              # Inertia React SPA (Pages, Components, CSS)
│   ├── routes/                 # Routing web.php & api.php
│   ├── composer.json           # Dependensi Backend PHP
│   ├── package.json            # Dependensi Frontend (React 19, Tailwind, Vite)
│   └── .env.example            # Template env untuk Laravel
└── jalan_post_cloning.md       # File panduan ini
```

---

## 🛠️ Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terpasang:
- **PHP** versi 8.2 atau lebih baru (dengan ekstensi `pdo_mysql`, `mbstring`, `fileinfo`, `curl`, `bcmath`).
- **Composer** versi 2.x.
- **Node.js** (rekomendasi LTS v18 / v20 / v22) dan **NPM**.
- **MySQL** atau **MariaDB** (dapat menggunakan Laragon, XAMPP, atau Docker).

---

## 🚀 Pilihan Metode Menjalankan Aplikasi

Tersedia 2 (dua) metode untuk menjalankan aplikasi:
1. **[Metode 1: Menjalankan Langsung di Lokal (Laragon / XAMPP / PHP CLI)](#metode-1-menjalankan-langsung-di-lokal-rekomendasi-cepat)** *(Rekomendasi Cepat & Mudah di Windows)*
2. **[Metode 2: Menggunakan Docker Compose](#metode-2-menggunakan-docker-compose)**

---

### METODE 1: Menjalankan Langsung di Lokal (Rekomendasi Cepat)

Buka terminal (PowerShell / Command Prompt / Git Bash) di root folder proyek:

#### 1. Masuk ke Direktori Aplikasi Laravel
```bash
cd laravel-db
```

#### 2. Buat Database Baru di MySQL / MariaDB
Buka MySQL Client Anda (HeidiSQL / phpMyAdmin / Laragon / Terminal) lalu buat database baru:
```sql
CREATE DATABASE evalpemdi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Salin dan Sesuaikan Konfigurasi `.env`
Salin template konfigurasi `.env.example` menjadi `.env`:
```bash
# Windows PowerShell / CMD:
copy .env.example .env

# Atau di Linux / Git Bash:
# cp .env.example .env
```

Buka file `laravel-db/.env` dengan editor teks, pastikan konfigurasi database sesuai dengan pengaturan MySQL lokal Anda:
```env
APP_NAME=EVAL-PEMDI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=evalpemdi_db
DB_USERNAME=root
DB_PASSWORD=
```
*(Catatan: Jika MySQL Anda menggunakan password, isi `DB_PASSWORD` sesuai password akun root Anda).*

#### 4. Pasang Dependensi Backend (Composer)
```bash
composer install
```

#### 5. Generate Application Key Laravel
```bash
php artisan key:generate
```

#### 6. Pasang Dependensi Frontend (Node.js & NPM)
```bash
npm install
```

#### 7. Build Asset Frontend (Vite)
Pilih salah satu sesuai kebutuhan:
- **Opsi A (Build sekali untuk produksi/preview):**
  ```bash
  npm run build
  ```
- **Opsi B (Hot-reload development server - buka terminal terpisah):**
  ```bash
  npm run dev
  ```

#### 8. Jalankan Migrasi Database dan Data Awal (Seeder)
Perintah ini akan membuat semua tabel (aspek, 20 indikator, kriteria kematangan, akun pengguna, unit kerja) serta mengisi data awal:
```bash
php artisan migrate:fresh --seed
```

#### 9. Buat Symbolic Link untuk Storage Publik
Perintah ini penting agar template bukti dukung dan file unggahan dapat diakses:
```bash
php artisan storage:link
```

#### 10. Jalankan Web Server Laravel
```bash
php artisan serve
```
Aplikasi sekarang berjalan dan siap diakses di browser: **[http://localhost:8000](http://localhost:8000)**.

---

### METODE 2: Menggunakan Docker Compose

Jika Anda ingin menjalankan database MariaDB, Redis, dan Laravel secara terisolasi di dalam container:

#### 1. Siapkan Konfigurasi Lingkungan
Dari root folder `EvalPemdi2`:
```bash
# Salin env untuk docker-compose di root folder
copy .env.example .env

# Salin env untuk aplikasi Laravel
copy laravel-db\.env.example laravel-db\.env
```

Sesuaikan `laravel-db/.env` agar mengarah ke hostname service docker dan collation MariaDB:
```env
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=evalpemdi_db
DB_USERNAME=evalpemdi_user
DB_PASSWORD=evalpemdi_password
DB_COLLATION=utf8mb4_unicode_ci

REDIS_HOST=redis
REDIS_PORT=6379
```
*(Catatan: Jika port 3310 terblokir oleh Windows Hyper-V, pada root `.env` port host MariaDB telah dialihkan ke `HOST_DB_PORT=3406`).*

#### 2. Bangun dan Jalankan Container
```bash
docker compose up -d --build
```

#### 3. Setup Aplikasi di Dalam Container
Jalankan perintah berikut satu per satu:
```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app npm install
docker compose exec app npm run build
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan storage:link
```

Aplikasi dapat diakses di: **[http://localhost:8000](http://localhost:8000)**.

---

## 👥 Akun Login Default (Hasil Seeder)

Data pengguna uji coba yang telah dibuat oleh seeder (`UserSeeder.php`):

| Peran (Role) | Nama Pengguna | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Administrator Portal Pemdi | `admin@pemdi.go.id` | `password123` | Dashboard Admin, Master Pengguna, Master Unit Kerja, Kelola Template Indikator |
| **Koordinator** | Koordinator Pemdi (Sekda) | `koordinator@pemdi.go.id` | `password123` | Monitoring & Pengawasan Evaluasi Seluruh OPD |
| **Operator Entri** | Operator Evaluasi Diskominfo | `operator@pemdi.go.id` | `password123` | Pengisian Mandiri 20 Indikator & Unggah Bukti Dukung |
| **Penanggung Jawab** | Penanggung Jawab Diskominfo | `pejabat@pemdi.go.id` | `password123` | Validasi & Pengesahan Hasil Evaluasi Unit |
| **Operator OPD Lain** | Operator BAPPEDA | `operator.bappeda@pemdi.go.id` | `password123` | Evaluasi Unit BAPPEDA |
| **Operator OPD Lain** | Operator Inspektorat | `operator.inspektorat@pemdi.go.id` | `password123` | Evaluasi Unit Inspektorat |

---

## 🌐 URL Penting Aplikasi

- **Portal Utama**: [http://localhost:8000](http://localhost:8000)
- **Halaman Login**: [http://localhost:8000/login](http://localhost:8000/login)
- **Form Evaluasi Mandiri (Setelah Login)**: [http://localhost:8000/evaluasi](http://localhost:8000/evaluasi)
- **Dashboard Admin (Role Admin)**: [http://localhost:8000/admin/dashboard](http://localhost:8000/admin/dashboard)
- **Interactive Swagger UI (Dokumentasi API)**: [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)
- **Spesifikasi OpenAPI 3.0 (JSON)**: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## ❓ Masalah Umum & Solusi (Troubleshooting)

1. **Error: *Target class [DatabaseSeeder] does not exist* atau Class not found**
   - **Solusi**: Jalankan `composer dump-autoload` di dalam folder `laravel-db`.

2. **Error: *No application encryption key has been specified***
   - **Solusi**: Pastikan Anda telah membuat `.env` dan menjalankan `php artisan key:generate`.

3. **Tampilan antarmuka berantakan atau *Vite manifest not found***
   - **Solusi**: Jalankan `npm run build` di dalam folder `laravel-db` atau biarkan `npm run dev` tetap aktif di jendela terminal terpisah saat mengembangkan aplikasi.

4. **Error: *Access denied for user 'root'@'localhost'***
   - **Solusi**: Periksa kredensial database di file `laravel-db/.env`. Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan konfigurasi MySQL/MariaDB lokal Anda.

5. **Error: *SQLSTATE[HY000] [1049] Unknown database 'evalpemdi_db'***
   - **Solusi**: Buat database `evalpemdi_db` terlebih dahulu melalui phpMyAdmin, HeidiSQL, atau jalankan perintah SQL `CREATE DATABASE evalpemdi_db;`.
