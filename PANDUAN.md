# Panduan Menjalankan Aplikasi Xionco Store

## Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Menjalankan Test](#menjalankan-test)
6. [Troubleshooting](#troubleshooting)

---

## Persyaratan Sistem

Sebelum memulai, pastikan sistem Anda memiliki software berikut:

### Software yang Diperlukan:
- **Node.js** versi 18 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** (biasanya sudah included dengan Node.js)
- **Podman** atau **Docker** untuk menjalankan database PostgreSQL ([Download Podman](https://podman.io/docs/installation))
- **Git** untuk version control ([Download](https://git-scm.com/))

### Versi yang Direkomendasikan:
```
Node.js: v18.0.0 atau lebih tinggi
npm: v9.0.0 atau lebih tinggi
Podman: v4.0.0 atau lebih tinggi
PostgreSQL: 15 (akan dijalankan melalui container)
```

---

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd xionco_store
```

### 2. Instalasi Dependencies Backend

```bash
cd backend
npm install
```

### 3. Instalasi Dependencies Frontend

```bash
cd ../frontend
npm install
```

---

## Konfigurasi

### 1. Konfigurasi Database (PostgreSQL dengan Podman)

**Jalankan PostgreSQL menggunakan podman-compose:**

```bash
# Dari root directory xionco_store
podman-compose up -d
```

Ini akan menjalankan PostgreSQL dengan konfigurasi:
- **Username**: xionco
- **Password**: xionco_pass
- **Database**: xionco_store
- **Port**: 5432

**Verifikasi database berjalan:**
```bash
podman-compose ps
```

### 2. Setup Database Backend

**Buat tabel database:**
```bash
cd backend
npm run migrate
```

**Seed data awal (10 produk furniture):**
```bash
npm run seed
```

### 3. File Konfigurasi Environment Backend

Buat file `.env` di folder `backend/`:

```bash
# Database
DATABASE_URL=postgresql://xionco:xionco_pass@localhost:5432/xionco_store

# JWT
JWT_SECRET=your_secret_key_here_min_32_characters_long

# Server
PORT=3001
NODE_ENV=development

# OAuth - Google (Opsional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth - Facebook (Opsional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

**Catatan**: Untuk testing lokal, Anda dapat menggunakan nilai dummy untuk OAuth keys.

### 4. File Konfigurasi Environment Frontend

Buat file `.env.local` di folder `frontend/`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here_min_32_characters

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# OAuth - Google (Opsional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth - Facebook (Opsional)
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

**Catatan**: Untuk development, aplikasi memiliki login bypass menggunakan endpoint `/api/auth/dev-login`.

---

## Menjalankan Aplikasi

### Cara Paling Mudah (Terminal Terpisah)

**Terminal 1 - Pastikan Database Berjalan:**
```bash
cd xionco_store
podman-compose up
```

**Terminal 2 - Jalankan Backend:**
```bash
cd backend
npm start
```

Backend akan berjalan di: `http://localhost:3001`

**Terminal 3 - Jalankan Frontend:**
```bash
cd frontend
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

### Akses Aplikasi

1. Buka browser ke: `http://localhost:3000`
2. Anda akan diarahkan ke halaman login
3. Untuk development/testing, gunakan login dengan cara klik tombol "Login (Dev Mode)"

### Fitur Aplikasi

Setelah login, Anda dapat mengakses:

- **Dashboard** - Ringkasan statistik penjualan, stok, dan produk
- **Produk** - Kelola produk (tambah, edit, hapus)
- **Stok** - Kelola tingkat stok dan pencatatan pergerakan stok
- **Penjualan** - Catat transaksi penjualan

---

## Menjalankan Test

### Backend Unit Tests

```bash
cd backend
npm test
```

Ini akan menjalankan semua test untuk API:
- Product endpoints
- Stock endpoints
- Sales endpoints

### Frontend Unit Tests

```bash
cd frontend
npm test
```

Ini akan menjalankan test untuk React components:
- ProductTable component
- SalesTable component

### Test dengan Coverage

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

---

## Struktur Project

```
xionco_store/
├── backend/                          # Express.js REST API
│   ├── src/
│   │   ├── config/                   # Konfigurasi database & passport
│   │   ├── controllers/              # Business logic untuk setiap resource
│   │   ├── middleware/               # Middleware authentication
│   │   ├── routes/                   # API routes
│   │   ├── db/                       # Database migrations & seed
│   │   └── app.js                    # Entry point Express
│   ├── tests/                        # Unit tests
│   ├── .env                          # Environment variables (jangan commit)
│   └── package.json
│
├── frontend/                         # Next.js Admin Panel
│   ├── src/
│   │   ├── app/                      # App router pages
│   │   ├── components/               # React components
│   │   └── lib/                      # Utility & API client
│   ├── tests/                        # Component tests
│   ├── .env.local                    # Environment variables (jangan commit)
│   ├── tailwind.config.js            # Tailwind CSS config
│   └── package.json
│
├── podman-compose.yml                # Docker compose untuk PostgreSQL
├── PANDUAN.md                        # File ini
└── README.md                         # README bahasa Inggris
```

---

## Troubleshooting

### Error: "Port 3000 is already in use"

**Masalah**: Port 3000 sudah digunakan aplikasi lain.

**Solusi**:
```bash
# Temukan process yang menggunakan port 3000
lsof -i :3000

# Atau matikan dan jalankan di port lain
# Next.js akan otomatis mencari port yang tersedia
```

### Error: "Cannot connect to database"

**Masalah**: Database PostgreSQL tidak berjalan.

**Solusi**:
```bash
# Pastikan Podman running
podman-compose up -d

# Verifikasi koneksi
psql postgresql://xionco:xionco_pass@localhost:5432/xionco_store
```

### Error: "JWT Secret is not configured"

**Masalah**: Environment variable tidak disetting.

**Solusi**:
1. Pastikan file `.env` ada di folder `backend/`
2. Pastikan file `.env.local` ada di folder `frontend/`
3. Restart server setelah mengubah environment variables

### Error: "Failed to authenticate"

**Masalah**: Token JWT tidak valid atau expired.

**Solusi**:
1. Logout dan login kembali
2. Cek console browser untuk error detail
3. Pastikan `NEXTAUTH_SECRET` dan `JWT_SECRET` sudah dikonfigurasi

### Frontend Loading Lambat

**Penyebab Umum**:
- Backend tidak berjalan
- Network request timeout

**Solusi**:
1. Verifikasi backend berjalan di `http://localhost:3001`
2. Buka DevTools (F12) dan lihat Network tab
3. Restart frontend dengan `npm run dev`

### Database Migration Error

**Solusi**:
```bash
# Reset database (hati-hati - akan menghapus semua data)
npm run migrate:reset

# Jalankan migration dan seed ulang
npm run migrate
npm run seed
```

---

## Perintah Penting

### Backend Commands
```bash
npm start              # Jalankan server (production mode)
npm run dev            # Jalankan server (development mode dengan auto-reload)
npm test               # Jalankan unit tests
npm run migrate        # Jalankan database migrations
npm run seed           # Seed initial data (10 products)
npm run test:coverage  # Jalankan tests dengan coverage report
```

### Frontend Commands
```bash
npm run dev            # Jalankan development server
npm run build          # Build untuk production
npm start              # Jalankan production build
npm test               # Jalankan unit tests
npm run test:coverage  # Jalankan tests dengan coverage report
npm run lint           # Check code quality
```

### Database Commands
```bash
# Dari root directory
podman-compose up -d       # Jalankan database
podman-compose down        # Hentikan database
podman-compose logs postgres  # Lihat database logs
podman-compose ps          # Lihat status container
```

---

## Informasi Produk Awal

Aplikasi dilengkapi dengan 10 produk furniture lokal sebagai data awal:

1. Sofa Ruang Tamu
2. Meja Makan
3. Ranjang Queen
4. Rak Buku
5. Meja Kopi
6. Lemari Pakaian
7. Kursi Kantor
8. Meja TV
9. Meja Samping
10. Lemari Laci

Semua harga dalam **Rupiah Indonesia (IDR)**.

---

## Support & Bantuan

Jika mengalami masalah:

1. Cek log terminal/console untuk error messages
2. Buka browser DevTools (F12) untuk melihat client-side errors
3. Verifikasi semua environment variables sudah tersetting
4. Coba restart aplikasi

---

## Lisensi

Xionco Store © 2024. Semua hak dilindungi.

---

**Terakhir diupdate**: Agustus 2024

**Status**: ✅ Ready for Development & Testing

screenshoot app

