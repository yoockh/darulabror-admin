# Darul Abror Admin

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Admin panel untuk Darul Abror yang terhubung ke backend API dan bisa dijalankan sebagai aplikasi desktop (Electron) tanpa membuka browser.

## Fitur

- **Auth + RBAC**: role `admin` vs `superadmin`
	- `superadmin` punya akses halaman **Manage Admins**
	- Akses tanpa izin menampilkan **Akses Ditolak**
- **Dashboard**, **Registrations**, **Contacts**: list/detail + update status
- **Articles**: create/edit dengan Editor.js + multipart upload
- **Theme toggle**: Dark (metal) / Light (siang)
- **Same-origin proxy** untuk request API (mengurangi masalah CORS)
- **Desktop mode**: Next server lokal + UI via Electron

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS (tanpa MUI)
- Editor.js (+ tools)
- Sonner (toast)
- Electron + electron-builder (desktop packaging)

## Environment Variables

Buat `.env.local` (untuk dev) atau set env sebelum build.

Wajib:

- `NEXT_PUBLIC_API_BASE_URL` — base URL backend API

Opsional (override path endpoint jika backend berbeda):

- `API_LOGIN_PATH`
- `API_PROFILE_PATH`
- `API_PROFILE_PASSWORD_PATH`
- `API_REGISTRATIONS_PATH`
- `API_REGISTRATION_STATUS_PATH`
- `API_CONTACTS_PATH`
- `API_CONTACT_STATUS_PATH`
- `API_ARTICLES_PATH`
- `API_ARTICLE_EDIT_PATH`
- `API_ADMINS_PATH`
- `API_ADMIN_EDIT_PATH`

Contoh ada di `.env.example`.

Catatan untuk desktop build: nilai `NEXT_PUBLIC_*` dibundle saat build — pastikan env sudah benar sebelum build installer.

## Jalankan (Web)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Jalankan (Desktop / Electron)

```bash
npm install
npm run desktop:dev
```

## Build Desktop Installer

Logo desktop diambil dari `assets/logo.png`.

Linux (AppImage):

```bash
npm run desktop:dist:linux
```

Windows (NSIS installer):

```bash
npm run desktop:dist:win
```

Output ada di folder `release/`.

## Upload ke GitHub Releases

Cara manual:

1. Build installer sampai file keluar di `release/`.
2. GitHub repo → **Releases** → **Draft a new release**.
3. Isi tag versi (mis. `v0.1.0`) + release notes.
4. Upload file installer (Linux: `.AppImage`, Windows: `.exe`).
5. Publish, lalu share link `.../releases/latest` ke admin lain.

Cara otomatis (recommended untuk Windows):

1. GitHub repo → **Settings** → **Variables and secrets** → **Actions** → **Variables**
2. Tambah variable: `NEXT_PUBLIC_API_BASE_URL` (mis. `https://darulabror-717070183986.asia-southeast2.run.app`)
3. Buat tag versi dan push:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Workflow GitHub Actions akan build **Windows (.exe NSIS)** + **Linux (.AppImage)** lalu upload otomatis ke **Releases**.

## License

MIT — lihat [LICENSE](LICENSE).
