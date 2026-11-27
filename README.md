# Simulasi Timbangan Amal — React + Vite

Aplikasi refleksi harian untuk mencatat amal baik dan hal-hal yang ingin diperbaiki. Angka dan grafik adalah ringkasan catatan pribadi, bukan ukuran pasti dosa atau pahala.

## Jalankan lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

1. Upload folder project ini ke repository GitHub.
2. Di Vercel pilih **Add New → Project** lalu import repository.
3. Framework Preset: **Vite** (otomatis terdeteksi).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Klik **Deploy**.

Tidak membutuhkan API, database, atau environment variable. Catatan disimpan di `localStorage` browser masing-masing perangkat. Gunakan tombol Export Data untuk membuat backup JSON.
