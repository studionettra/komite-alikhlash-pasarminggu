# Panduan Implementasi & Setup Cloudflare Turnstile

Dokumen ini berisi rencana implementasi dan panduan setup Cloudflare Turnstile untuk mengamankan halaman login aplikasi ini. Turnstile adalah alternatif CAPTCHA yang gratis dan berfokus pada privasi.

---

## 1. Rencana Implementasi

Implementasi Turnstile pada aplikasi Laravel + React/Inertia akan dibagi menjadi 3 tahap utama:

### Tahap A: Persiapan Kunci (API Keys)
1. Mendaftar ke dashboard Cloudflare Turnstile.
2. Membuat widget Turnstile baru.
3. Mengatur domain yang diizinkan (sangat penting untuk membedakan *Local* dan *Production*).
4. Mendapatkan `Site Key` (untuk Frontend) dan `Secret Key` (untuk Backend).

### Tahap B: Implementasi Frontend (React / Inertia)
1. Menginstal library React untuk Turnstile (opsional tapi direkomendasikan, misalnya `@marsidev/react-turnstile`).
2. Menambahkan komponen Turnstile ke dalam form login di `resources/js/pages/Auth/Login.tsx` (atau file serupa).
3. Menangkap token hasil validasi Turnstile dan menyertakannya saat form di-submit (biasanya dikirim sebagai input `cf-turnstile-response`).

### Tahap C: Implementasi Backend (Laravel)
1. Menambahkan kunci rahasia ke file `.env`.
2. Menambahkan logika validasi di controller login (misal `AuthenticatedSessionController.php`).
3. Backend akan memvalidasi token yang dikirim frontend ke server Cloudflare. Jika valid, proses login dilanjutkan. Jika tidak, login ditolak.

---

## 2. Panduan Setup (Langkah-demi-Langkah)

### Langkah 1: Dapatkan Keys di Cloudflare
1. Buka dan login ke [Dashboard Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Klik tombol **Add Site**.
3. Isi form sebagai berikut:
   - **Site name:** `Komite Al-Ikhlash` (atau nama lain untuk identifikasi).
   - **Domain:** Masukkan domain *production* Anda nanti (misal: `komite-alikhlash.com`).
   - **PENTING UNTUK LOCALHOST:** Tambahkan juga domain `localhost` dan `127.0.0.1` ke dalam daftar domain. **Jika ini tidak ditambahkan, widget tidak akan muncul saat Anda menjalankan `npm run dev` di komputer lokal Anda.**
   - **Widget Mode:** Pilih `Managed` (disarankan) atau `Invisible`.
4. Klik **Create**.
5. Anda akan mendapatkan **Site Key** dan **Secret Key**. Salin kedua kunci tersebut.

### Langkah 2: Konfigurasi `.env`
Buka file `.env` di komputer lokal Anda, dan tambahkan baris berikut di bagian bawah:

```env
TURNSTILE_SITE_KEY=isi_dengan_site_key_anda
TURNSTILE_SECRET_KEY=isi_dengan_secret_key_anda
```

*Catatan: Nanti saat deploy ke production, Anda harus memasukkan variabel yang sama ke dalam pengaturan Environment Variables di server/hosting Anda.*

### Langkah 3: Setup Frontend (React)
Anda bisa menggunakan library pihak ketiga agar lebih mudah. Jalankan perintah ini di terminal:
```bash
npm install @marsidev/react-turnstile
```

Kemudian, di komponen form Login Anda, import dan gunakan:
```tsx
import { Turnstile } from '@marsidev/react-turnstile';

// Di dalam komponen form:
<Turnstile 
    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} // Pastikan key di .env diekspos ke Vite jika perlu
    onSuccess={(token) => setData('cf-turnstile-response', token)} // Simpan token ke state form (misal pakai useForm Inertia)
/>
```
*(Jangan lupa tambahkan `VITE_TURNSTILE_SITE_KEY=...` di `.env` agar terbaca oleh Vite/React).*

### Langkah 4: Setup Backend (Laravel)
Saat form disubmit, Laravel harus memvalidasi token tersebut ke API Cloudflare.

Anda bisa melakukan validasi manual menggunakan `Http` facade Laravel di dalam metode yang memproses login:

```php
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

// Di dalam fungsi login (sebelum Auth::attempt):
$turnstileResponse = $request->input('cf-turnstile-response');
$secretKey = env('TURNSTILE_SECRET_KEY');

$verify = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
    'secret' => $secretKey,
    'response' => $turnstileResponse,
    'remoteip' => $request->ip(),
]);

if (!$verify->json('success')) {
    throw ValidationException::withMessages([
        'cf-turnstile-response' => 'Validasi keamanan gagal. Silakan coba lagi.',
    ]);
}
// Jika sukses, lanjutkan proses login...
```

*(Alternatif: Anda juga bisa menggunakan package Laravel seperti `romanzipp/Laravel-Turnstile` jika ingin validasi yang lebih otomatis menggunakan rules validator bawaan Laravel).*

---

## 3. Catatan Penting Perbedaan Local vs Deployment

1. **Domain Allowlist:** Seperti disebutkan di Langkah 1, pastikan `localhost` terdaftar di Cloudflare. Jika tidak, widget tidak akan me-render di lokal dan akan muncul error CORS atau "Domain not allowed".
2. **Environment Variables:** Kunci `TURNSTILE_SITE_KEY` dan `TURNSTILE_SECRET_KEY` harus dimasukkan secara manual ke server production Anda (misal via cPanel, Forge, atau Cloud Vercel/Render settings), karena file `.env` lokal tidak (dan tidak boleh) ikut ter-upload.
3. **Dummy Keys untuk Testing (Opsional):** Jika Anda ingin menjalankan *automated testing* (misal pakai Pest/PHPUnit), Cloudflare menyediakan "Dummy Site Keys" yang selalu lulus validasi atau selalu gagal validasi. Anda bisa mencari *Cloudflare Turnstile testing keys* di dokumentasi resmi mereka untuk digunakan khusus di environment `testing`.
