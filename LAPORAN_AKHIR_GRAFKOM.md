LAPORAN AKHIR GRAFIKA KOMPUTER

Punakawan Journey: Virtual Tour Candi Jawa
Open World 3D Game dengan Karakter Wayang 2D

═══════════════════════════════════════════════════════════

[COVER PAGE - DESAIN BEBAS]
💡 Saran gambar cover:

- Screenshot gameplay terbaik (karakter di depan candi)
- Logo game (jika ada)
- Background bertema wayang/candi

═══════════════════════════════════════════════════════════

ANGGOTA KELOMPOK

Muhammad Baihaqi Dawanis 5025231177
[Nama Anggota 2] [NRP]

═══════════════════════════════════════════════════════════

DAFTAR ISI

BAB 1 PENDAHULUAN
1.1 Tujuan Pembuatan Dokumen
1.2 Deskripsi Aplikasi
1.3 Deskripsi Dokumen
1.4 Perangkat yang Dibutuhkan

BAB 2 USER MANUAL
2.1 Memulai Aplikasi
2.2 Kontrol Permainan
2.3 Menjelajahi Dunia
2.4 Fitur Day/Night Cycle
2.5 Menggunakan Minimap
2.6 Pause Menu & Settings

═══════════════════════════════════════════════════════════

BAB 1
PENDAHULUAN

═══════════════════════════════════════════════════════════

1.1 TUJUAN PEMBUATAN DOKUMEN

Dokumen user manual ini dibuat untuk memberikan gambaran dan penjelasan mengenai Punakawan Journey seperti cara penggunaan aplikasi bagi pengguna. Dokumen ini dirancang agar pengguna dapat dengan mudah memahami fitur-fitur aplikasi dan mengoptimalkan pengalaman virtual tour candi-candi bersejarah di Jawa.

1.2 DESKRIPSI APLIKASI

📷 INSERT GAMBAR: Screenshot gameplay utama first-person
(POV player melihat candi dengan HUD dan minimap)

Punakawan Journey adalah aplikasi virtual tour 3D berbasis web yang menggabungkan teknologi rendering modern dengan elemen budaya tradisional Indonesia. Dibangun dengan Three.js r160 dan didukung oleh WebGL, aplikasi ini memungkinkan pengguna menjelajahi 5 candi bersejarah di Jawa dalam lingkungan open world yang interaktif.

Dalam mode open world, pengguna dapat:
• Menjelajahi terrain seluas 1000x1000 unit dengan first-person controller
• Mengunjungi 5 landmark candi: Borobudur, Prambanan, Cetho, Trowulan, dan Parit
• Berinteraksi dengan 15+ Point of Interest (POI) untuk membaca informasi sejarah
• Menikmati dynamic day/night cycle dengan 5 fase waktu berbeda
• Memanjat struktur candi dengan sistem collision detection 3D

Hanya dengan membuka browser, pengguna akan mendapatkan pengalaman edukatif yang immersive tentang warisan budaya Indonesia, lengkap dengan background music gamelan tradisional.

Catatan: Aplikasi ini juga memiliki mode fighting terpisah dengan 4 karakter wayang Punakawan (Semar, Bagong, Gareng, Petruk) yang dapat dipilih untuk bertarung melawan Sengkuni.

1.3 DESKRIPSI DOKUMEN

Dalam dokumen ini, penjelasan penggunaan aplikasi dikategorikan sebagai berikut:

Bab 1 Pendahuluan:
Bagian ini memberikan informasi umum tentang Punakawan Journey, termasuk deskripsi aplikasi dan persyaratan perangkat untuk menggunakan sistem. Tujuannya adalah untuk memberikan pengguna pemahaman dasar tentang aplikasi sebelum memulai.

Bab 2 User Manual:
Bab ini menyediakan panduan langkah demi langkah tentang cara menggunakan Punakawan Journey, dibagi menjadi beberapa bagian:
• Bagian 2.1: Menjelaskan cara memulai aplikasi, loading screen, dan pemilihan karakter
• Bagian 2.2: Membahas kontrol permainan (keyboard dan mouse)
• Bagian 2.3: Panduan menjelajahi open world dan mengunjungi 5 landmark candi
• Bagian 2.4: Penjelasan tentang sistem day/night cycle dan cara menggunakannya
• Bagian 2.5: Cara membaca dan menggunakan minimap untuk navigasi
• Bagian 2.6: Penggunaan pause menu dan troubleshooting

1.4 PERANGKAT YANG DIBUTUHKAN

Komputer atau laptop dengan browser modern yang mendukung WebGL 2.0:
• Google Chrome (versi terbaru - direkomendasikan)
• Mozilla Firefox (versi terbaru)
• Microsoft Edge (versi terbaru)

Koneksi internet untuk loading aset 3D model GLTF saat pertama kali membuka aplikasi.

Perangkat input:
• Keyboard (untuk kontrol movement)
• Mouse (untuk kontrol kamera)

═══════════════════════════════════════════════════════════

BAB 2
USER MANUAL

═══════════════════════════════════════════════════════════

2.1 MEMULAI APLIKASI

CARA MENJALANKAN APLIKASI

📷 INSERT GAMBAR: Screenshot struktur folder project
(Tampilkan file index.html, main.js, textures/, dll)

Langkah-langkah:
① Clone atau download repository dari GitHub
② Buka folder project "Punakawan-Journey"
③ Klik kanan pada file index.html
④ Pilih "Open with" → Browser pilihan (Chrome/Firefox/Edge)
⚠️ Alternatif: Gunakan Live Server (VS Code extension) untuk performa terbaik

⚠️ Catatan:
• Pastikan koneksi internet stabil untuk loading model 3D GLTF
• Jangan buka file dengan cara double-click, gunakan Live Server atau http server

LOADING SCREEN

📷 INSERT GAMBAR: Screenshot loading screen
(Tampilan "PUNAKAWAN JOURNEY" dengan loading bar)

Proses Loading:
① Browser akan memuat semua aset 3D (5 model candi)
② Progress bar menunjukkan persentase loading
③ Tunggu hingga muncul teks "Tekan ENTER untuk mulai"
④ Tekan tombol ENTER untuk memulai open world

Estimasi waktu loading: 10-30 detik (tergantung kecepatan internet)

MEMULAI OPEN WORLD

📷 INSERT GAMBAR: Screenshot first spawn di open world
(POV player dengan HUD, minimap, dan candi terlihat di kejauhan)

Setelah loading selesai dan menekan ENTER:
• Player akan spawn di tengah map open world
• Tampilan first-person dengan HUD lengkap
• Minimap menunjukkan 5 lokasi candi
• Klik layar untuk mengunci pointer (mouse look aktif)

Langkah selanjutnya:
→ Jelajahi open world dengan kontrol WASD
→ Dekati salah satu candi yang terlihat di minimap
→ Saat dekat dengan candi, akan ada prompt interaksi
→ Masuk ke virtual tour candi spesifik

═══════════════════════════════════════════════════════════

2.2 KONTROL PERMAINAN

KEYBOARD CONTROLS

📷 INSERT GAMBAR: Diagram keyboard dengan annotations
(WASD, SHIFT, SPACE, E, ESC highlighted)

┌──────────┬────────────────────────────────────┐
│ Tombol │ Fungsi │
├──────────┼────────────────────────────────────┤
│ W │ Bergerak maju │
│ S │ Bergerak mundur │
│ A │ Bergerak ke kiri │
│ D │ Bergerak ke kanan │
│ SHIFT │ Berlari (Sprint) │
│ SPACE │ Melompat │
│ E │ Berinteraksi dengan POI │
│ ESC │ Pause menu │
└──────────┴────────────────────────────────────┘

MOUSE CONTROLS

📷 INSERT GAMBAR: Diagram mouse movement

┌──────────────────┬────────────────────────────────┐
│ Aksi │ Fungsi │
├──────────────────┼────────────────────────────────┤
│ Gerakkan Mouse │ Rotasi kamera 360° │
│ │ (saat pointer locked) │
│ Klik Layar │ Lock/Unlock pointer untuk │
│ │ kontrol kamera │
│ Scroll Wheel │ Tidak digunakan │
│ │ (First-person view) │
└──────────────────┴────────────────────────────────┘

═══════════════════════════════════════════════════════════

2.3 MENJELAJAHI DUNIA

NAVIGASI DASAR

📷 INSERT GAMBAR: Screenshot gameplay POV player
(First-person view menunjukkan terrain, minimap, HUD)

Bergerak di Open World:
• Gunakan WASD untuk bergerak ke segala arah
• Tahan SHIFT sambil bergerak untuk berlari lebih cepat
• Tekan SPACE untuk melompat melewati rintangan atau naik ke struktur
• Camera mengikuti arah mouse

Tips Navigasi:
✓ Gunakan minimap di pojok kanan bawah untuk orientasi
✓ Perhatikan landmark berwarna di minimap
✓ Marker kuning menunjukkan Point of Interest (POI)

MENGUNJUNGI CANDI & LANDMARK

📷 INSERT GAMBAR: Collage 5 candi dengan nama
Layout 2x3: Borobudur | Prambanan | Cetho
Trowulan | Parit | (Legend)

5 Landmark Utama:

╔══════════════════════════════════════════════════════════╗
║ 1. CANDI BOROBUDUR (Selatan Kanan) ║
╠══════════════════════════════════════════════════════════╣
║ • Candi Buddha terbesar di dunia ║
║ • Dapat dinaiki dengan melompat ║
║ • Multiple POI dengan info sejarah ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 2. CANDI PRAMBANAN (Selatan Kiri) ║
╠══════════════════════════════════════════════════════════╣
║ • Kompleks candi Hindu terbesar ║
║ • 3 candi utama: Siwa, Brahma, Wisnu ║
║ • Relief Ramayana ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 3. CANDI CETHO (Timur) ║
╠══════════════════════════════════════════════════════════╣
║ • Candi Hindu di lereng Gunung Lawu ║
║ • Arsitektur unik bertingkat ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 4. GERBANG TROWULAN (Utara) ║
╠══════════════════════════════════════════════════════════╣
║ • Gerbang bekas ibu kota Majapahit ║
║ • Arsitektur khas split gate ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 5. CANDI PARIT (Barat) ║
╠══════════════════════════════════════════════════════════╣
║ • Peninggalan era Majapahit ║
║ • Struktur candi sederhana ║
╚══════════════════════════════════════════════════════════╝

Cara Mencapai:
→ Ikuti jalan setapak berwarna cokelat
→ Gunakan lampu jalan sebagai penunjuk arah di malam hari
→ Referensi minimap untuk jarak dan posisi

INTERAKSI DENGAN POINT OF INTEREST (POI)

📷 INSERT GAMBAR: Sequence interaksi POI (3 step)
Step 1: Mendekati marker
Step 2: Prompt "Press E" muncul
Step 3: Panel info terbuka

Langkah-langkah Berinteraksi:

① MENDEKATI POI
• POI ditandai dengan pilar bercahaya dan orb kuning mengapung
• Saat mendekat (±8 meter), muncul prompt:
"Tekan E untuk berinteraksi"

② MEMBUKA INFO PANEL
• Tekan tombol E
• Info panel akan muncul dengan: - Judul lokasi - Deskripsi sejarah lengkap - Fakta menarik - Filosofi dan makna

③ MENUTUP INFO PANEL
• Klik tombol × di pojok kanan atas panel
• Atau tekan ESC

Contoh POI:
• Stupa Utama Borobudur
• Candi Siwa Prambanan
• Gates of Heaven Lempuyang
• Dan 12+ POI lainnya

═══════════════════════════════════════════════════════════

2.4 FITUR DAY/NIGHT CYCLE

SIKLUS WAKTU OTOMATIS

📷 INSERT GAMBAR: 5 fase waktu side-by-side
Night | Dawn | Day | Dusk | Evening

Fase Waktu:

┌─────────────┬──────────┬────────────────────────────────┐
│ Waktu │ Fase │ Karakteristik │
├─────────────┼──────────┼────────────────────────────────┤
│ 00:00-05:00 │ Night │ • Langit biru gelap (midnight) │
│ │ │ • Lampu jalan menyala │
│ │ │ • Moonlight aktif │
│ │ │ • Intensitas cahaya minimal │
├─────────────┼──────────┼────────────────────────────────┤
│ 05:00-07:00 │ Dawn │ • Sunrise orange-pink │
│ │ │ • Lampu mulai meredup │
│ │ │ • Transisi malam → siang │
├─────────────┼──────────┼────────────────────────────────┤
│ 07:00-17:00 │ Day │ • Langit biru cerah │
│ │ │ • Sunlight maksimal │
│ │ │ • Lampu mati │
│ │ │ • Shadow tajam │
├─────────────┼──────────┼────────────────────────────────┤
│ 17:00-19:00 │ Dusk │ • Sunset jingga kemerahan │
│ │ │ • Cahaya mulai meredup │
├─────────────┼──────────┼────────────────────────────────┤
│ 19:00-21:00 │ Evening │ • Langit senja gelap │
│ │ │ • Lampu mulai menyala │
│ │ │ • Transisi siang → malam │
└─────────────┴──────────┴────────────────────────────────┘

Pengaturan Waktu:
• Siklus berjalan otomatis: 5 menit real = 24 jam game
• Lihat jam digital di HUD (format 24 jam)
• Tombol ☀️/🌙 untuk toggle manual

Efek Visual:
✓ Perubahan warna langit yang smooth
✓ Posisi matahari/bulan berubah sesuai waktu
✓ Intensitas shadow menyesuaikan
✓ Fog density berubah per fase

═══════════════════════════════════════════════════════════

2.5 MENGGUNAKAN MINIMAP

📷 INSERT GAMBAR: Close-up minimap dengan annotations
(Tunjukkan player indicator, landmarks, POI markers)

Cara Membaca Minimap:

① BACKGROUND HIJAU GELAP
• Representasi area game world

② LANDMARK (Bulatan Berwarna)
• Borobudur: Biru (#4682B4)
• Prambanan: Cokelat (#8B4513)
• Gerbang Trowulan: Abu-abu (#6B6B5A)
• Cetho: Tan (#8B8B7A)
• Parit: Biru-hijau (#2E8B8B)

③ POI MARKERS (Titik Kuning)
• Menunjukkan lokasi Point of Interest
• Dapat diklik saat dekat

④ PLAYER INDICATOR (Segitiga Hijau)
• Menunjukkan posisi dan arah hadap player
• Berputar sesuai rotasi kamera

Tips Penggunaan:
✓ Minimap selalu aktif saat bermain
✓ Gunakan untuk navigasi jarak jauh
✓ Ukuran minimap: 150x150 pixels
✓ Scale: 1 unit game = 0.15 pixels

═══════════════════════════════════════════════════════════

2.6 PAUSE MENU & SETTINGS

MEMBUKA PAUSE MENU

📷 INSERT GAMBAR: Screenshot pause menu overlay
(Menu ditengah layar dengan 3 opsi)

Cara Pause:
• Tekan tombol ESC
• Atau klik tombol ☰ di pojok kanan atas HUD

Opsi Menu:

① LANJUTKAN (Resume)
• Kembali ke game
• Hotkey: ESC lagi

② GANTI KARAKTER (Change Character)
• Kembali ke layar pemilihan karakter
• Progress lokasi tetap tersimpan
• Karakter akan spawn di posisi terakhir

③ KELUAR (Exit)
• Reload halaman
• Progress akan hilang (tidak ada save system)

⚠️ Catatan: Saat pause, pointer lock otomatis dilepas

═══════════════════════════════════════════════════════════

TIPS & TROUBLESHOOTING

═══════════════════════════════════════════════════════════

TIPS BERMAIN

📷 INSERT GAMBAR: Screenshot player di atas candi
(Menunjukkan fitur climbing)

• Lompat (SPACE) untuk memanjat struktur candi
• Sprint + Jump untuk lompatan lebih jauh
• Gunakan minimap untuk navigasi
• Kunjungi semua 15+ POI untuk edukasi lengkap
• Screenshot terbaik di waktu Dawn/Dusk (golden hour)

TROUBLESHOOTING

Masalah Umum:
• Loading lama → Tunggu hingga 100%, refresh jika stuck
• FPS rendah → Tutup tab browser lain, gunakan Chrome
• Pointer tidak lock → Klik layar beberapa kali
• Audio tidak keluar → Klik layar terlebih dahulu (browser autoplay policy)

SYSTEM REQUIREMENTS

Browser: Chrome 90+, Firefox 88+, Edge 90+ (Recommended: Chrome latest)
RAM: Minimum 4 GB (Recommended: 8 GB)
GPU: WebGL 2.0 support
Internet: Minimum 5 Mbps

═══════════════════════════════════════════════════════════

TEKNOLOGI YANG DIGUNAKAN

═══════════════════════════════════════════════════════════

📷 INSERT GAMBAR: Logo/icon teknologi yang digunakan
(Three.js, JavaScript, HTML5, CSS3)

TEKNOLOGI UTAMA:

1. Three.js (r160)
   • 3D rendering engine berbasis WebGL
   • Scene management & material system
   • Shadow mapping & post-processing

2. JavaScript ES6+
   • Class-based OOP
   • Async/await untuk loading aset

3. HTML5 & CSS3
   • Canvas rendering
   • Responsive UI design

4. GLTFLoader
   • Import model 3D format GLTF
   • Texture & material support

FITUR TEKNIS:

• Custom collision detection system (3D AABB)
• Sprite animation system (frame-based)
• Day/night cycle dengan dynamic lighting
• Post-processing: FXAA anti-aliasing, tone mapping, fog
• Audio system: Web Audio API

STATISTIK PROYEK:

Code: ~2,700 lines (JavaScript: 2,100 | HTML: 100 | CSS: 500)
Assets: 5 GLTF models, 50+ sprite frames, 4 karakter
Objects: 50 trees, 30 rocks, 40+ lamps
Performance: Target 60 FPS, Average 45-60 FPS

═══════════════════════════════════════════════════════════

KONSEP GRAFIKA YANG DITERAPKAN

═══════════════════════════════════════════════════════════

📷 INSERT GAMBAR: Diagram konsep grafika
(Ilustrasi lighting, shadow, transformations)

KONSEP YANG DIIMPLEMENTASIKAN:

1. 3D Transformations
   • Translation, Rotation, Scaling objek
   • Matrix transformations untuk posisi candi & karakter

2. Lighting Models
   • Directional Light (sun/moon)
   • Point Light (lampu jalan, 40+ instances)
   • Ambient & Hemisphere Light
   • Dynamic intensity berdasarkan waktu

3. Shadow Mapping
   • Shadow map generation (2048x2048)
   • PCF shadow filtering
   • Real-time shadow casting dari sun/moon

4. Camera Systems
   • Perspective projection
   • First-person view dengan mouse look
   • Smooth camera interpolation (lerp)

5. Texturing & Materials
   • UV mapping untuk sprite karakter
   • PBR materials (roughness, metalness)
   • Color palette khas Jawa

6. Post-Processing Effects
   • FXAA anti-aliasing
   • ACES Filmic tone mapping
   • Distance fog rendering

═══════════════════════════════════════════════════════════

KESIMPULAN

═══════════════════════════════════════════════════════════

📷 INSERT GAMBAR: Screenshot terbaik gameplay
(Karakter di depan candi dengan lighting bagus)

Punakawan Journey berhasil menggabungkan teknologi rendering 3D modern (Three.js) dengan elemen budaya tradisional Indonesia (wayang & candi).

PENCAPAIAN PROYEK:

✅ Rendering 3D kompleks dengan 5 model candi, lighting, dan shadows
✅ Interaksi real-time dengan kontrol first-person yang smooth
✅ Optimasi performa untuk browser (45-60 FPS)
✅ UI/UX design yang user-friendly dan informatif
✅ Educational value: 15+ POI dengan info sejarah lengkap

PEMBELAJARAN:

Proyek ini membuktikan bahwa web browser modern mampu menjalankan aplikasi 3D yang kompleks dengan performa baik. Membuka peluang untuk virtual tour, edukasi interaktif, dan game berbasis browser yang mengangkat budaya Indonesia.

═══════════════════════════════════════════════════════════

© 2025 Punakawan Journey Team - Grafika Komputer Project

Dibuat dengan ❤️ untuk melestarikan budaya Indonesia melalui teknologi

═══════════════════════════════════════════════════════════
