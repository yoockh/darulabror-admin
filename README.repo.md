# darulabror-admin

## Desktop app (Electron)

App ini bisa dijalankan sebagai aplikasi desktop (Linux/Windows) dengan server Next.js lokal (tanpa buka browser), jadi lebih aman dari masalah CORS.

### Dev (desktop)

- Jalankan: `npm run desktop:dev`

### Build installer

Sebelum build, icon desktop akan otomatis dibuat dari `assets/logo.png`.

- Linux (AppImage): `npm run desktop:dist:linux`
- Windows (NSIS): `npm run desktop:dist:win`

Output ada di folder `release/`.

### Upload ke GitHub Releases

Cara manual (paling gampang):

1. Jalankan build (Linux/Windows) sampai file installer keluar di `release/`.
2. Buka GitHub repo → tab **Releases** → **Draft a new release**.
3. Isi tag versi (mis. `v0.1.1`) + release notes.
4. Upload file dari `release/` (mis. `.AppImage` untuk Linux, `.exe` untuk Windows).
5. Publish.

Cara otomatis (optional):

- `electron-builder` sudah dikonfigurasi `publish: github`. Kalau kamu nanti pakai GitHub Actions, cukup set `GITHUB_TOKEN` dan jalankan `electron-builder --publish always` untuk upload otomatis.