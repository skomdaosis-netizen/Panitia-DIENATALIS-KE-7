# Twibbon Dies Natalis ke-7 SMK Telkom Sidoarjo

Website twibbon berbasis Vite + React (pakai preact-compat, ringan & cepat).
Fitur:
- Upload foto, geser & zoom (mouse scroll / pinch di HP)
- Rotate foto
- Frame Dies Natalis ke-7 otomatis nempel
- Download hasil sebagai `TWIBBON-DIESNATALIS-7.png`
- Tombol salin caption siap pakai

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview   # opsional, buat cek hasil build
```

Hasil build ada di folder `dist/`.

## Deploy ke Vercel

**Cara paling gampang (tanpa install apa-apa):**
1. Buka https://vercel.com/new
2. Upload folder project ini (atau push dulu ke GitHub lalu import repo-nya)
3. Vercel otomatis mendeteksi Vite. Pastikan settingnya:
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
4. Klik **Deploy**, tunggu sampai selesai, dan website langsung online.

**Lewat CLI:**
```bash
npm i -g vercel
vercel login
vercel        # deploy preview
vercel --prod # deploy ke production
```

File `vercel.json` sudah disiapkan supaya routing tetap aman.

## Halaman khusus Panitia

Ada halaman terpisah untuk panitia — tanpa layar pilih lomba, langsung ke upload foto
& caption yang sudah tetap (fixed, tidak berubah-ubah seperti versi peserta lomba).

- **URL setelah deploy**: `https://domain-kamu.vercel.app/panitia`
- **Lokal**: `http://localhost:5173/panitia.html` (pas `npm run dev`)
- Frame: `public/frame-panitia.png`
- Isi caption & konfigurasi: `src/panitia.jsx`

Ini kerja lewat entry point terpisah (`panitia.html` + `src/main-panitia.jsx`),
jadi kode halaman peserta lomba (`index.html`) sama sekali tidak tersentuh/berubah.

## Ganti-ganti konten

- Frame twibbon (peserta lomba): `public/frame-diesnatalis.png`
- Frame twibbon (panitia): `public/frame-panitia.png`
- Logo header: `public/logo-diesnatalis.png`
- Judul, subtitle, caption, nama file download (peserta lomba): `src/app.jsx`
- Judul, caption, nama file download (panitia): `src/panitia.jsx`
- Komponen editor foto (dipakai bersama oleh kedua halaman): `src/TwibbonEditor.jsx`
- Komponen kartu caption (dipakai bersama oleh kedua halaman): `src/CaptionCard.jsx`
- Warna tema (teal): `src/app.css` (bagian `:root`)

## Setelah deploy — jangan lupa

Ganti URL placeholder `https://ganti-dengan-domain-kamu.vercel.app` di `index.html`
(bagian `og:image`) dengan domain asli project kamu di Vercel, supaya preview link
di WhatsApp/Instagram menampilkan gambar logo dengan benar.

## Changelog perbaikan

- ✅ Tambah `.gitignore` (supaya `node_modules` tidak ikut ter-commit ke GitHub).
- ✅ Ganti keterangan lomba **SYNC** menjadi *"Skomda Youth Narative Cinema"* (ikon diganti 🎬, caption disesuaikan).
- ✅ Tombol **Reset** posisi & zoom foto (tanpa perlu upload ulang).
- ✅ Notifikasi (toast) setelah berhasil download.
- ✅ Penanganan error saat upload (file bukan gambar, lebih dari 15MB, atau gagal dibaca).
- ✅ Slider "Putar" disembunyikan di balik "Pengaturan lanjutan" biar tampilan lebih simpel.
- ✅ Tombol "Ganti Lomba" diperbesar (target tap lebih ramah jempol di HP).
- ✅ Step indicator ("Langkah 1/2/3 dari 3") di tiap kartu.
- ✅ Meta tag Open Graph di `index.html` untuk preview link yang lebih menarik saat dibagikan.
- ✅ Tambah halaman khusus **Panitia** (`/panitia`) — langsung ke editor+caption tanpa pilih lomba, pakai frame & caption sendiri.
