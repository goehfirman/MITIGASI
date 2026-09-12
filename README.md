# Toothpick Tower — Lab Gempa

Aplikasi STEM kelas 6 berbahasa Indonesia untuk Papan Interaktif Digital.

- Menara 3D dengan pengeditan titik, sambungan, kamera sentuh, dan undo/redo.
- Simulasi rigid-body sederhana memakai cannon-es; tingkat guncangan bukan magnitudo gempa nyata.
- Sesi kelas, dashboard guru, riwayat percobaan, refleksi, dan ekspor CSV.
- Penyimpanan D1 dengan migrasi Drizzle pada folder drizzle.

Buka aplikasi di browser dengan WebGL. Pilih Layar penuh untuk penggunaan di papan. Mulai dari contoh berpenguat atau tanpa penguat, lalu bandingkan hasil pada tingkat guncangan yang sama.

Nilai simulasi ini hanya untuk pembelajaran; bukan penilaian keselamatan bangunan.

## Pengembangan

Gunakan Node.js 22.13 atau lebih baru. Jalankan npm ci, npm run dev untuk pengembangan, dan npm run build untuk hasil Cloudflare Worker. Deklarasi hosting berada di .openai/hosting.json. Skema database berada di db/schema.ts.
