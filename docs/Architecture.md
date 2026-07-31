# System Architecture Document (Architecture.md)

Dokumen ini menjelaskan rancangan teknis dan arsitektur sistem secara *high-level* untuk Dashboard Komite TKIT Al Ikhlash Jatipadang.

## 1. Pendekatan Arsitektur: "Monolithic-SPA"
Sistem ini menggunakan arsitektur **Monolithic-SPA** (Single Page Application yang dibungkus dalam kerangka Monolitik). Arsitektur ini menggabungkan keandalan backend tradisional (Laravel) dengan interaktivitas tinggi dari frontend modern (React.js), yang dijembatani dengan mulus oleh **Inertia.js**. 

Berbeda dengan arsitektur *Decoupled* (di mana Frontend dan Backend terpisah sepenuhnya dan berkomunikasi via REST API), arsitektur ini memungkinkan pengerjaan yang jauh lebih cepat dan sederhana, sangat ideal untuk tim kecil atau *solo developer*, serta sangat bersahabat dengan lingkungan *Shared Hosting*.

## 2. Komponen Utama & Alur Data (Data Flow)
1.  **Frontend (Client-Side - Browser):**
    *   Dibangun dengan **React.js** dan di-*styling* menggunakan **Tailwind CSS** (dengan prinsip *Mobile-First*).
    *   Mengatur antarmuka pengguna (UI), transisi halaman tanpa *reload* (*SPA feel*), dan interaksi instan.
2.  **Penghubung (The Bridge):**
    *   **Inertia.js** bertindak sebagai "lem" antara React dan Laravel. Ia mencegat navigasi standar dan mengubahnya menjadi *request* XHR/AJAX (menggunakan Axios di belakang layar).
3.  **Backend (Server-Side - Hostinger):**
    *   Dibangun dengan **Laravel (PHP)**.
    *   Menangani *routing* keamanan, validasi *input*, logika bisnis (misal: kompresi gambar), dan memanipulasi data melalui *Eloquent ORM*.
4.  **Database:**
    *   **MySQL** standar untuk penyimpanan data terstruktur dan relasional.

## 3. Konsep Autentikasi & Sesi (Session Management)
Sistem **TIDAK menggunakan JWT (JSON Web Tokens)**. Sebagai gantinya, sistem menggunakan **Stateful Session-Based Authentication** yang jauh lebih tangguh untuk tipe arsitektur ini.

*   **Mekanisme Sesi (Cookies):** Saat pengguna berhasil login, Laravel akan membuat sebuah sesi aktif di server dan mengirimkan **Cookie terenkripsi** ke browser pengguna.
*   **Standar Keamanan:** Cookie ini ditandai dengan flag `HttpOnly` (tidak bisa dibaca/dicuri oleh *script Javascript* peretas - mencegah XSS) dan `Secure` (hanya dikirim via HTTPS).
*   **Validasi Berkelanjutan:** Setiap kali React (melalui Inertia) meminta halaman baru, Cookie tersebut otomatis terkirim. Backend membaca Cookie, memvalidasi sesi, dan memutuskan apakah data boleh dikirimkan kembali ke Frontend.
*   **Prevent Back History (No-Cache):** Untuk mencegah celah keamanan di mana pengguna yang sudah *logout* bisa menekan tombol "Back" di *browser* dan melihat halaman *dashboard* lama (karena halaman tersebut disimpan di *cache browser* lokal), sistem akan menerapkan *Middleware HTTP Headers*. *Header* seperti `Cache-Control: no-cache, no-store, must-revalidate` akan disuntikkan pada semua halaman internal, sehingga memaksa *browser* untuk selalu melakukan validasi sesi terbaru ke server, bukan memuat dari memori lokal.

## 4. Konsep Otorisasi (Role-Based Access Control - RBAC)
Otorisasi (*siapa yang boleh melakukan apa*) dikelola secara ganda untuk menjamin keamanan maksimal dan *User Experience* (UX) yang baik:

1.  **Proteksi Backend (Keamanan Utama):** Menggunakan *package* `spatie/laravel-permission`. Setiap *Routing* di Laravel dilindungi oleh *Middleware*. Jika "Anggota Biasa" mencoba mengakses rute "Simpan Keuangan", server akan langsung memblokirnya dengan status *403 Forbidden*.
2.  **Reaktivitas Frontend (UX):** Backend akan mengirimkan *object* `auth.user.permissions` (berisi daftar hak akses user yang sedang login) sebagai *props* global ke React. Frontend menggunakan data ini untuk mengatur UI. Misalnya: Tombol "Hapus Notulensi" otomatis tidak di-render di layar jika yang sedang login adalah Bendahara.

## 5. Arsitektur Deployment (Shared Hosting)
Deployment pada Hostinger Shared Hosting tidak memerlukan Node.js *runtime* aktif di server.
1.  **Proses Build:** Di komputer lokal (sebelum *upload*), *developer* menjalankan `npm run build` (melalui Vite). Ini akan mengkompilasi semua kode React (`.jsx`) menjadi *file* statis murni (`.js` dan `.css`).
2.  **Hosting:** *File-file* hasil kompilasi tersebut, beserta seluruh *file* inti PHP Laravel, diunggah ke *Shared Hosting*.
3.  **Eksekusi:** Server *hosting* (Apache/LiteSpeed) hanya perlu mengeksekusi PHP (Laravel) yang akan melayani *file* statis React tersebut kepada pengguna. Sangat ringan dan tidak membebani limitasi *resource* pada *Shared Hosting*.
