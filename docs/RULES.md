# Project Rules & Conventions (.cursorrules / RULES.md)

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Laravel (PHP)
- **Integrasi (Penghubung):** Inertia.js
- **Database:** MySQL
- **Styling:** Tailwind CSS

## Alasan Pemilihan Stack:
Stack **Laravel + Inertia.js + React** dipilih karena memberikan pengalaman Single Page Application (SPA) yang sangat mulus bagi pengguna, namun proses pengerjaannya sangat sederhana bagi developer (seperti mengerjakan aplikasi monolitik konvensional). Selain itu, Laravel berjalan sempurna di **Hostinger Shared Hosting**.

## Coding Standards & Rules

### Backend (Laravel)
1. **Arsitektur MVC:** Tetap gunakan pola Model-View-Controller standar Laravel. Controller akan mereturn response via Inertia: `return Inertia::render('PageName', $data);`
2. **Manajemen Hak Akses (RBAC):** Wajib menggunakan *package* standar `spatie/laravel-permission` untuk menangani pembuatan Role dan Permission secara dinamis. Hindari membuat logika RBAC manual dari nol.
3. **Penamaan Model:** Gunakan *PascalCase* singular (contoh: `Program`, `Meeting`, `Transaction`).
4. **Penamaan Tabel:** Gunakan *snake_case* plural (contoh: `programs`, `meetings`, `transactions`).
5. **Validasi:** Selalu gunakan FormRequest Laravel untuk memvalidasi input sebelum memproses data di Controller.
6. **Keamanan Sesi (Prevent Back History):** Wajib membuat dan mengaplikasikan *Middleware* `PreventBackHistory` yang memodifikasi *header HTTP* (`Cache-Control: no-store, no-cache, must-revalidate`) pada seluruh rute yang membutuhkan autentikasi (di dalam *dashboard*).
7. **Konsep Query & Performa Database:**
   - **Eloquent ORM First:** Prioritaskan penggunaan Eloquent ORM dibanding *Raw SQL* agar kode bersih dan mudah dirawat.
   - **Eager Loading (Cegah N+1 Problem):** Wajib menggunakan fungsi `with()` saat memanggil data relasi. Contoh: `Program::with('transactions')->paginate(10);`. Dilarang keras memanggil relasi database di dalam *looping*.
   - **Pagination Wajib:** Untuk data yang dinamis (Notulensi, Keuangan, Program), dilarang menggunakan `->get()` atau `->all()`. Wajib menggunakan `->paginate(n)`.
   - **Payload Minimalis:** Inertia mengirim data ke React dalam bentuk JSON. Pastikan hanya mengirim kolom yang benar-benar dipakai di UI. Jangan mengirim *password* atau *data rahasia* ke *frontend*. Gunakan *Laravel API Resources* atau `->select()` untuk menyaring data.
8. **Keamanan Transaksi Data (DB::beginTransaction):** Setiap fungsi di *Controller* yang melakukan perubahan/penyimpanan data (khususnya yang menyangkut lebih dari satu tabel, misal: menyimpan `User` sekaligus merelasikan `Role`), **WAJIB** menggunakan blok `try...catch` yang diapit oleh `DB::beginTransaction()`, `DB::commit()`, dan `DB::rollBack()`. Hal ini menjamin integritas data agar tidak ada data yang tersimpan setengah-setengah jika terjadi *error*.

### Frontend (React & Inertia)
1. **Mobile-First Design:** Rancang UI dari ukuran layar terkecil (mobile/smartphone) terlebih dahulu. Gunakan *base class* Tailwind untuk mobile, dan prefix seperti `md:`, `lg:` untuk menyesuaikan layout di layar yang lebih besar (tablet/desktop).
2. **Struktur Folder:** Halaman React (Pages) diletakkan di `resources/js/Pages/`, sedangkan komponen yang bisa dipakai ulang (Components) diletakkan di `resources/js/Components/`.
3. **Penamaan File React:** Gunakan *PascalCase* (contoh: `Dashboard.jsx`, `ProgramList.jsx`).
4. **Styling:** Gunakan utility classes dari Tailwind CSS secara langsung. Hindari custom CSS kecuali sangat terpaksa.
5. **State Management:** Manfaatkan *props* yang dikirim dari Laravel (via Inertia) sebagai state utama. Gunakan `useState` React hanya untuk state lokal pada komponen (misal: modal buka/tutup).
6. **Flash Messages & Alerts (Alert Facade):**
   - **Backend:** Mengadopsi gaya penulisan bersih (seperti contoh `Alert::success()` atau `Alert::error()`). Kita akan membuat sebuah kelas pembantu (*Helper/Facade*) `Alert` di Laravel. Di dalam Controller, cukup panggil `Alert::success('Title', 'Message')` sebelum me-return `redirect()`. Kelas `Alert` ini secara otomatis akan memasukkan data pesan tersebut ke dalam *Session Flash* Laravel.
   - **Inertia Middleware:** Konfigurasi *middleware* `HandleInertiaRequests.php` agar menangkap *session* yang dibuat oleh `Alert` tersebut dan membagikannya secara global ke React (melalui variabel `$page.props.flash`).
   - **Frontend:** Gunakan `react-hot-toast` yang diletakkan secara statis di *Layout* utama React. Komponen ini akan terus memantau `$page.props.flash` dan otomatis memunculkan notifikasi setiap kali *backend* memanggil fungsi `Alert::...`.
7. **Design Taste & Anti-Slop (Estetika Premium):** Wajib mematuhi pedoman *skill* `design-taste-frontend`. Hindari desain standar bawaan AI yang terlihat murahan atau pasaran (seperti gradasi ungu mencolok, *glassmorphism* berlebihan, atau struktur kaku 3 kolom). Desain Web Publik dan Dashboard harus mencerminkan identitas yang elegan, profesional, dan bersih. Fokus pada hierarki tipografi yang tajam, proporsi *white-space* yang lega, serta *micro-animation* yang bertujuan jelas (bukan sekadar kosmetik).

### Git & Deployment
- Gunakan branch `main` untuk versi yang siap rilis.
- Saat melakukan deploy ke Hostinger Shared Hosting:
  - Jalankan `npm run build` sebelum memindahkan file ke hosting.
  - Pastikan konfigurasi `.env` (Database, App URL) diubah sesuai dengan parameter Hostinger.
  - Folder `public` pada proyek Laravel dijadikan sebagai document root (atau isi foldernya disalin ke folder `public_html` di Hostinger).

### Manajemen Media & Optimasi Gambar (Performance)
Mengingat aplikasi berjalan di *Shared Hosting*, gambar (dokumentasi & kwitansi) harus dikelola secara efisien untuk menghemat *storage* dan menjaga kecepatan:
1. **Kompresi & Resize Backend:** Setiap gambar yang di-upload harus otomatis di-resize (misal: maks lebar 1200px) dan dikompresi di sisi backend (Laravel) sebelum disimpan, menggunakan library seperti `Intervention Image`.
2. **Format WebP:** Konversi gambar yang di-upload menjadi format **WebP** untuk ukuran file yang jauh lebih kecil tanpa mengurangi kualitas secara signifikan.
3. **Thumbnail Generator:** Untuk tampilan *grid* (galeri program) dan *list* (daftar transaksi), buat dan simpan versi *thumbnail* (resolusi kecil) dari gambar asli. Gunakan *thumbnail* untuk pratinjau, dan hanya *load* gambar asli jika user meng-klik gambar tersebut.
4. **Lazy Loading Frontend:** Seluruh elemen `<img>` di React harus dipastikan menggunakan properti `loading="lazy"` agar browser hanya mengunduh gambar yang benar-benar terlihat di layar (*viewport*) pengguna.
