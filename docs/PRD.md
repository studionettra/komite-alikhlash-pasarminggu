# Product Requirements Document (PRD)
## Nama Proyek: Dashboard Komite TKIT Al Ikhlash Jatipadang
**Periode:** 2026 - 2027

### 1. Tujuan Proyek (Objective)
Membangun sebuah sistem berbasis web yang terdiri dari dua bagian utama: **Dashboard Internal** (untuk merekap, mengelola, dan memonitoring urusan komite) dan **Web Publik/Portal** (sebagai sarana transparansi informasi ke publik). Sistem ini harus mudah digunakan, berkinerja cepat (SPA), dirancang dengan pendekatan *Mobile-First*, dan dapat di-hosting di layanan shared hosting standar.

### 2. Fitur Utama (Core Features)
Sistem ini akan memiliki beberapa modul utama:

#### A. Web Publik (Portal Transparansi)
- Menampilkan daftar Program Kerja yang sedang berlangsung (Ongoing) dan yang akan datang (Upcoming).
- Menampilkan Struktur Pengurus Komite.
- Menampilkan infografis laporan keuangan per program yang ringkas dan mudah dipahami.
- Menampilkan galeri/dokumentasi kegiatan dari setiap program.

#### B. Modul Dashboard: Manajemen Program
- Pencatatan dan inisiasi program kerja baru secara kustom.
- Kategori frekuensi program: Bulanan (Monthly), Peringatan Hari Besar (Holiday), dan Insidental (Incidental).
- Update status program (Rencana, Sedang Berjalan, Selesai).
- Upload galeri foto/dokumen untuk setiap program.

#### C. Modul Dashboard: Notulensi Rapat
- CRUD (Create, Read, Update, Delete) catatan rapat.
- Field wajib: Tanggal rapat, agenda, daftar hadir, hasil keputusan, dan tindak lanjut.

#### D. Modul Dashboard: Laporan Keuangan Berbasis Program
- Pencatatan Pemasukan dan Pengeluaran kas komite.
- Tautan (linking) setiap transaksi pengeluaran/pemasukan ke Program Kerja tertentu.
- Generate data untuk infografis keuangan yang akan ditampilkan di Web Publik.

#### E. Modul Dashboard: Manajemen Pengguna & Hak Akses (RBAC)
- Khusus diakses oleh Superadmin/Ketua Komite.
- CRUD data akun pengguna (pengurus komite).
- Pembuatan Role baru secara kustom (Create New Role) dan pengaturan Permission (hak akses menu) per Role. Dibuat untuk memudahkan proses *handover* saat pergantian pengurus.

### 3. Target Pengguna (User Personas) & Hak Akses
Sistem menggunakan konsep RBAC (*Role-Based Access Control*) dinamis. Role *default* meliputi:
- **Superadmin (Ketua Komite):** Memiliki akses penuh ke seluruh sistem, termasuk menu Manajemen Pengguna & Role.
- **Bendahara:** Akses khusus ke Modul Laporan Keuangan.
- **Sekretaris:** Akses khusus ke Modul Notulensi Rapat dan Dokumentasi Program.
- **Anggota Komite (Pengurus Biasa):** Akses *Read-Only* ke dashboard internal (bisa melihat notulensi dan ringkasan keuangan, tidak bisa input/edit data).
- **Publik/Masyarakat Umum:** Akses *Read-Only* ke Web Publik.

### 4. Batasan & Lingkungan (Constraints & Environment)
- **Desain UI/UX:** Wajib menggunakan pendekatan **Mobile-First** agar operasional dashboard dan akses web publik sangat mudah dilakukan melalui smartphone.
- **Hosting:** Hostinger Shared Hosting (Mendukung PHP & MySQL). Karena keterbatasan *resource* pada shared hosting, **manajemen file media (terutama gambar)** harus dioptimasi dengan ketat agar tidak membebani server storage dan mempercepat waktu tunggu (*loading time*).
- **Arsitektur:** Single Page Application (SPA).
- **Pengembangan:** Sederhana secara pengerjaan (tidak kompleks untuk di-maintenance).
