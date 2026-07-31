# Database Schema (SCHEMA.md)

Dokumen ini mendeskripsikan struktur awal database untuk Dashboard Komite.

## 1. Tabel `users`
Menyimpan data pengurus komite yang memiliki akses ke sistem (Login).
- `id` (PK)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `timestamps`

## 1A. Tabel Terkait RBAC (Roles & Permissions)
Untuk mengelola hak akses dinamis (Superadmin, Bendahara, dsb) beserta izin menunya. Biasanya ditangani otomatis oleh *package* pihak ketiga.
- `roles` (id, name, timestamps)
- `permissions` (id, name, timestamps)
- `role_has_permissions` (role_id, permission_id)
- `model_has_roles` (role_id, model_id/user_id)

## 2. Tabel `programs`
Menyimpan daftar program kerja komite. Program diinisiasi melalui dashboard.
- `id` (PK)
- `title` (String) - Nama program
- `description` (Text) - Deskripsi program
- `frequency` (Enum: 'monthly', 'holiday', 'incidental') - Frekuensi/kategori program
- `status` (Enum: 'planned', 'ongoing', 'completed')
- `start_date` (Date, Nullable)
- `end_date` (Date, Nullable)
- `timestamps`

## 3. Tabel `meetings`
Menyimpan data notulensi rapat.
- `id` (PK)
- `date` (Date) - Tanggal rapat
- `agenda` (String) - Topik/Agenda utama
- `attendees` (Text) - Daftar hadir (bisa disederhanakan dengan text CSV atau JSON)
- `decisions` (Text) - Hasil keputusan rapat
- `follow_up` (Text, Nullable) - Tindak lanjut
- `timestamps`

## 4. Tabel `transactions` (Laporan Keuangan)
Menyimpan kas masuk dan keluar, direlasikan ke tabel `programs` jika merupakan dana program.
- `id` (PK)
- `type` (Enum: 'income', 'expense') - Pemasukan / Pengeluaran
- `amount` (Decimal/BigInt) - Nominal uang
- `description` (String) - Keterangan transaksi
- `date` (Date) - Tanggal transaksi
- `program_id` (FK, Nullable) - Relasi ke tabel `programs`. Jika null, berarti kas umum/rutin.
- `receipt_path` (String, Nullable) - Path/URL file bukti transaksi (kwitansi).
- `timestamps`

## 5. Tabel `documents` (Dokumentasi/Galeri)
Menyimpan file foto atau dokumen terkait program atau rapat.
- `id` (PK)
- `program_id` (FK, Nullable)
- `meeting_id` (FK, Nullable)
- `file_path` (String) - Path file di storage
- `file_type` (String) - image/pdf/docx
- `timestamps`

---

## 6. Tabel `committee_members` (Struktur Pengurus)
Menyimpan data struktur kepengurusan untuk ditampilkan di Web Publik.
- `id` (PK)
- `name` (String) - Nama pengurus
- `position` (String) - Jabatan (contoh: Ketua, Bendahara)
- `photo_path` (String, Nullable) - Foto profil
- `order` (Integer) - Urutan tampil di struktur
- `timestamps`

---
**Catatan Relasi:**
- `Program` memiliki banyak `Transaction` (One-to-Many).
- `Program` memiliki banyak `Document` (One-to-Many).
- `Meeting` memiliki banyak `Document` (One-to-Many).
