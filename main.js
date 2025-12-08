import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// WAYANG OPEN WORLD - JAWA & BALI
// 3D Open World with 2D Sprite Characters
// Featuring: Borobudur, Prambanan, Lempuyang, Danau Batur
// ==========================================

// ===== GAME STATE =====
const gameState = {
  status: 'loading', // loading, charSelect, playing, paused
  selectedCharacter: 'bagong',
  isPointerLocked: false,
  currentLocation: 'Borobudur Temple',
  isNight: false,
  currentTime: 12.0, // Current time in hours (0-24)
  timeAutoPlay: true, // Auto increment time
  timeCycleDuration: 300 // 5 minutes in seconds for full 24h cycle
};

// ===== COLLISION BOXES & OBJECTS =====
const collisionBoxes = [];
const lamps = []; // Store lamp lights to toggle them
const buildingModels = []; // Store building models to rotate them toward player

// ===== CHARACTER DATA WITH LORE =====
const characterData = {
  bagong: {
    name: 'Bagong',
    title: 'Si Jenaka Bijaksana',
    lore: 'Bagong adalah putra bungsu Semar dan adik dari Gareng serta Petruk. Meski bertubuh gemuk dan tampak lamban, Bagong memiliki kecerdasan luar biasa. Ia sering berpura-pura bodoh namun selalu memberikan nasihat bijak melalui humor. Dalam pewayangan, Bagong melambangkan kejujuran dan keberanian menyuarakan kebenaran tanpa takut.',
    idle: ['./textures/bagong/idle/idle 1.png', './textures/bagong/idle/idle 2.png', './textures/bagong/idle/idle 3.png', './textures/bagong/idle/idle 4.png'],
    walk: ['./textures/bagong/walk/walk 1.png', './textures/bagong/walk/walk 2.png', './textures/bagong/walk/walk 3.png', './textures/bagong/walk/walk 4.png', './textures/bagong/walk/walk 5.png', './textures/bagong/walk/walk 6.png']
  },
  gareng: {
    name: 'Gareng',
    title: 'Si Cacat yang Setia',
    lore: 'Gareng atau Nala Gareng adalah putra sulung Semar. Tubuhnya penuh cacat: mata juling, tangan bengkok, dan kaki pincang. Namun setiap cacatnya melambangkan filosofi mendalam - mata juling berarti melihat kebenaran sejati, tangan bengkok berarti tidak suka mengambil yang bukan haknya, kaki pincang berarti berhati-hati dalam melangkah. Gareng adalah simbol kesetiaan dan kesabaran.',
    idle: ['./textures/gareng/idle/grng idle 1.png', './textures/gareng/idle/grng idle 2.png', './textures/gareng/idle/grng idle 3.png', './textures/gareng/idle/grng idle 4.png', './textures/gareng/idle/grng idle 5.png'],
    walk: ['./textures/gareng/walk/grng walk 1.png', './textures/gareng/walk/grng walk 2.png', './textures/gareng/walk/grng walk 3.png', './textures/gareng/walk/grng walk 4.png', './textures/gareng/walk/grng walk 5.png']
  },
  petruk: {
    name: 'Petruk',
    title: 'Si Hidung Panjang',
    lore: 'Petruk atau Kanthong Bolong adalah putra kedua Semar. Ciri khasnya adalah hidung panjang dan tubuh tinggi kurus. Ia paling humoris dan suka bergurau, namun di balik candaannya tersimpan kebijaksanaan. Nama Kanthong Bolong (kantong berlubang) melambangkan sifat dermawan yang tidak menyimpan harta untuk diri sendiri. Petruk adalah simbol kegembiraan dan kedermawanan.',
    idle: ['./textures/petruk/idle/petrul idle 1.png', './textures/petruk/idle/petrul idle 2.png', './textures/petruk/idle/petrul idle 3.png', './textures/petruk/idle/petrul idle 4.png'],
    walk: ['./textures/petruk/walk/petruk walk 1.png', './textures/petruk/walk/petruk walk 2.png', './textures/petruk/walk/petruk walk 3.png', './textures/petruk/walk/petruk walk 4.png', './textures/petruk/walk/petruk walk 5.png']
  },
  semar: {
    name: 'Semar',
    title: 'Sang Pamomong Agung',
    lore: 'Semar atau Batara Ismaya adalah dewa yang turun ke dunia menjadi pamomong (pengasuh) para kesatria Pandawa. Ia adalah kakak Batara Guru namun memilih hidup sederhana di bumi. Tubuhnya gemuk dengan wajah tua namun seperti bayi, melambangkan kebijaksanaan yang melampaui usia. Semar adalah penjaga kebenaran dan keadilan, sosok suci yang menyamar sebagai rakyat jelata. Ia adalah simbol kebijaksanaan tertinggi dalam pewayangan Jawa.',
    idle: ['./textures/semar/idle/semar idle 1.png', './textures/semar/idle/semar idle 2.png', './textures/semar/idle/semar idle 3.png', './textures/semar/idle/semar idle 4.png'],
    walk: ['./textures/semar/walk/semar walk 1.png', './textures/semar/walk/semar walk 2.png', './textures/semar/walk/semar walk 3.png', './textures/semar/walk/semar walk 4.png', './textures/semar/walk/semar walk 5.png', './textures/semar/walk/semar walk 6.png']
  }
};

// ===== LANDMARK LOCATIONS =====
const landmarks = {
  gerbangTrowulan: {
    position: { x: 0, y: 0, z: 300 },
    name: 'Gerbang Trowulan',
    color: 0x708090
  },
  candiCetho: {
    position: { x: 300, y: 0, z: 0 },
    name: 'Candi Cetho',
    color: 0x8B8B7A
  },
  candiParit: {
    position: { x: -300, y: 0, z: 0 },
    name: 'Candi Parit',
    color: 0xA0826D
  },
  prambanan: {
    position: { x: -200, y: 0, z: -300 },
    name: 'Candi Prambanan',
    color: 0x9B7653
  },
  borobudur: {
    position: { x: 200, y: 0, z: -300 },
    name: 'Candi Borobudur',
    color: 0x4682B4
  }
};

// ===== POI (Points of Interest) WITH HISTORY =====
const pointsOfInterest = [
  // === BOROBUDUR ===
  {
    id: 'borobudur-main',
    position: { x: 0, y: 0, z: 45 },
    title: 'Candi Borobudur',
    description: `Candi Borobudur adalah candi Buddha terbesar di dunia, dibangun pada abad ke-8 oleh Dinasti Syailendra. Nama "Borobudur" berasal dari "Vihara Buddha Uhr" yang berarti biara Buddha di atas bukit.

SEJARAH:
Dibangun sekitar tahun 750-850 Masehi, candi ini ditinggalkan setelah pusat kerajaan Jawa pindah ke Jawa Timur akibat letusan Gunung Merapi. Candi terkubur abu vulkanik selama berabad-abad hingga ditemukan kembali oleh Sir Thomas Stamford Raffles pada tahun 1814.

FILOSOFI:
Candi memiliki 10 tingkat yang melambangkan perjalanan spiritual menuju pencerahan:
• Kamadhatu (dasar): Alam nafsu duniawi
• Rupadhatu (5 tingkat persegi): Alam peralihan
• Arupadhatu (3 tingkat bundar): Alam tanpa bentuk
• Stupa utama: Pencerahan tertinggi (Nirvana)

FAKTA MENARIK:
- Terdapat 2.672 panel relief dan 504 arca Buddha
- Merupakan Situs Warisan Dunia UNESCO sejak 1991
- Panjang total relief jika direntangkan mencapai 6 km`
  },
  {
    id: 'borobudur-stupa',
    position: { x: 0, y: 0, z: -5 },
    title: 'Stupa Berlubang (Arupadhatu)',
    description: `Stupa-stupa berlubang di tingkat Arupadhatu memiliki makna filosofis mendalam.

MAKNA LUBANG:
Lubang-lubang berbentuk belah ketupat pada stupa melambangkan:
• Tingkat pertama: Lubang berbentuk persegi (masih terikat dunia)
• Tingkat kedua: Lubang berbentuk belah ketupat (transisi)  
• Tingkat ketiga: Lubang lebih besar (hampir bebas)

Di dalam setiap stupa terdapat arca Buddha dalam posisi Dharmachakra Mudra (memutar roda dharma).

MISTERI:
Konon, jika seseorang dapat menyentuh tangan Buddha di dalam stupa melalui lubang, ia akan mendapat keberuntungan. Namun praktik ini kini dilarang untuk menjaga kelestarian candi.`
  },

  // === PRAMBANAN ===
  {
    id: 'prambanan-main',
    position: { x: 200, y: 0, z: 245 },
    title: 'Candi Prambanan',
    description: `Candi Prambanan adalah kompleks candi Hindu terbesar di Indonesia, dibangun pada abad ke-9 oleh Raja Rakai Pikatan dari Dinasti Sanjaya.

SEJARAH:
Dibangun sekitar tahun 850 Masehi sebagai tandingan Candi Borobudur yang Buddhist. Candi ini didedikasikan untuk Trimurti - tiga dewa utama Hindu:
• Candi Siwa (tengah, tertinggi - 47 meter)
• Candi Brahma (selatan)
• Candi Wisnu (utara)

LEGENDA RORO JONGGRANG:
Konon candi ini dibangun oleh Bandung Bondowoso untuk memenuhi syarat menikahi Roro Jonggrang. Ia harus membangun 1.000 candi dalam semalam. Dengan bantuan jin, hampir selesai, namun Roro Jonggrang menipu dengan menumbuk padi agar ayam berkokok pertanda pagi. Marah, Bandung Bondowoso mengutuk Roro Jonggrang menjadi arca - yang kini dikenal sebagai Arca Durga Mahisasuramardini.

ARSITEKTUR:
- 240 candi dalam kompleks (8 candi utama + 232 candi perwara)
- Relief menceritakan kisah Ramayana
- Merupakan Situs Warisan Dunia UNESCO sejak 1991`
  },
  {
    id: 'prambanan-siwa',
    position: { x: 200, y: 0, z: 200 },
    title: 'Candi Siwa (Candi Utama)',
    description: `Candi Siwa adalah candi tertinggi dan terbesar di kompleks Prambanan dengan tinggi 47 meter.

RUANGAN:
Candi ini memiliki 4 ruangan:
• Ruang utama: Arca Siwa Mahadewa setinggi 3 meter
• Ruang utara: Arca Durga Mahisasuramardini (Roro Jonggrang)
• Ruang selatan: Arca Agastya (guru para dewa)
• Ruang barat: Arca Ganesha (dewa kebijaksanaan)

RELIEF:
Dinding candi dihiasi 42 panel relief yang menceritakan kisah Ramayana, dilanjutkan ke Candi Brahma.

MAKNA ARSITEKTUR:
Bentuk candi yang menjulang tinggi melambangkan Gunung Meru, tempat bersemayamnya para dewa dalam kosmologi Hindu.`
  },

  // === LEMPUYANG ===
  {
    id: 'lempuyang-main',
    position: { x: -200, y: 0, z: 245 },
    title: 'Pura Lempuyang Luhur',
    description: `Pura Lempuyang Luhur adalah salah satu pura tertua dan tersucri di Bali, terletak di lereng Gunung Lempuyang pada ketinggian 1.175 meter.

SEJARAH:
Pura ini dipercaya sudah ada sejak zaman prasejarah, sebelum agama Hindu masuk ke Bali. Awalnya merupakan tempat pemujaan roh leluhur dan kekuatan alam.

KOMPLEKS PURA:
Pura Lempuyang terdiri dari 7 pura yang tersebar dari kaki hingga puncak gunung:
1. Pura Penataran Agung (paling bawah)
2. Pura Telaga Mas
3. Pura Telaga Sawang  
4. Pura Lempuyang Madya
5. Pura Puncak Bisbis
6. Pura Pasar Agung
7. Pura Lempuyang Luhur (puncak)

GATES OF HEAVEN:
Gerbang terkenal yang memperlihatkan pemandangan Gunung Agung di kejauhan, menjadi salah satu spot foto paling ikonik di Bali.

RITUAL:
Untuk mencapai puncak, umat harus menaiki 1.700 anak tangga sambil bersembahyang di setiap pura.`
  },
  {
    id: 'lempuyang-gate',
    position: { x: -200, y: 0, z: 200 },
    title: 'Gates of Heaven (Gerbang Surga)',
    description: `"Gates of Heaven" adalah nama populer untuk Candi Bentar (gerbang terbelah) di Pura Penataran Agung Lempuyang.

FILOSOFI CANDI BENTAR:
Gerbang yang terbelah dua melambangkan:
• Dualitas alam semesta (baik-buruk, terang-gelap)
• Pemisahan dunia profan dengan dunia sakral
• Gunung kosmis yang terbelah untuk memberi jalan

FENOMENA VIRAL:
Pada 2018, foto dengan refleksi di depan gerbang ini viral di media sosial. Refleksi tersebut sebenarnya berasal dari cermin yang diletakkan fotografer lokal, bukan air. Meski begitu, keindahan pemandangan Gunung Agung di kejauhan tetap nyata dan menakjubkan.

TIPS BERKUNJUNG:
- Datang pagi hari untuk cuaca cerah
- Hormati aturan berpakaian (kain & selendang)
- Antre untuk foto bisa memakan waktu berjam-jam`
  },

  // === DANAU BATUR ===
  {
    id: 'batur-main',
    position: { x: 0, y: 0, z: -295 },
    title: 'Danau Batur & Gunung Batur',
    description: `Danau Batur adalah danau kawah terbesar di Bali, terletak di dalam kaldera raksasa Gunung Batur pada ketinggian 1.050 meter.

GEOLOGI:
Danau ini terbentuk dari letusan dahsyat Gunung Batur purba sekitar 29.000 tahun lalu yang menciptakan kaldera selebar 13,8 x 10 km - salah satu yang terbesar di dunia.

GUNUNG BATUR:
Gunung Batur (1.717 m) adalah gunung berapi aktif yang telah meletus lebih dari 20 kali sejak 1800. Letusan terakhir terjadi tahun 2000. Pendakian ke puncak untuk melihat sunrise sangat populer.

KEPERCAYAAN:
Dalam kepercayaan Hindu Bali, Danau Batur adalah tempat bersemayamnya Dewi Danu - dewi air dan kesuburan. Air danau ini mengairi sawah-sawah di seluruh Bali melalui sistem Subak.

PURA ULUN DANU BATUR:
Pura kedua terpenting di Bali (setelah Pura Besakih), didedikasikan untuk Dewi Danu. Pura asli tenggelam dalam letusan 1917 dan dibangun kembali di tepi kaldera.

DESA TRUNYAN:
Di tepi danau terdapat desa Trunyan dengan tradisi unik - jenazah tidak dikubur atau dikremasi, melainkan diletakkan di bawah pohon Taru Menyan.`
  },
  {
    id: 'batur-lake',
    position: { x: 30, y: 0, z: -250 },
    title: 'Danau Kawah Batur',
    description: `Danau Batur memiliki luas 16 km² dengan kedalaman maksimum 88 meter, menjadikannya danau terbesar di Bali.

EKOLOGI:
Danau ini adalah habitat ikan mujair yang diintroduksi dari Afrika pada 1939. Kini ikan mujair menjadi sumber protein penting bagi masyarakat sekitar dan diolah menjadi berbagai hidangan khas.

SUBAK:
Air Danau Batur mengalir melalui sistem irigasi tradisional Subak yang telah berusia lebih dari 1.000 tahun. Sistem Subak adalah warisan dunia UNESCO yang mengatur distribusi air secara adil ke seluruh sawah di Bali.

PEMANDIAN AIR PANAS:
Di tepi danau terdapat pemandian air panas alami Toya Bungkah yang dipercaya memiliki khasiat menyembuhkan berbagai penyakit.

LEGENDA:
Konon Danau Batur dan Danau Bratan (di Bedugul) dulunya satu. Ketika Dewa Wisnu membelah gunung untuk mengairi Bali, terbentuklah dua danau terpisah.`
  },

  // === CANDI PARIT ===
  {
    id: 'candiparit-main',
    position: { x: 150, y: 0, z: -105 },
    title: 'Candi Parit (Candi Apit)',
    description: `Candi Parit atau Candi Apit adalah salah satu candi yang merupakan bagian dari kompleks percandian di Jawa Tengah.

SEJARAH:
Candi ini dibangun pada masa kejayaan kerajaan Hindu-Buddha di Jawa. Nama "Parit" atau "Apit" mengacu pada posisinya yang mengapit atau berada di samping struktur utama kompleks candi.

ARSITEKTUR:
Candi Parit menampilkan arsitektur khas periode klasik Jawa dengan:
• Struktur batu andesit yang kokoh
• Ornamen relief yang mendetail
• Proporsi harmonis khas percandian Jawa

FUNGSI:
Sebagai candi perwara (candi pendamping), Candi Parit berfungsi sebagai pelengkap candi utama dalam kompleks percandian. Candi-candi perwara biasanya digunakan untuk menyimpan arca atau sebagai tempat pemujaan tambahan.

PELESTARIAN:
Candi ini telah mengalami beberapa kali pemugaran untuk menjaga kelestariannya sebagai warisan budaya Indonesia.`
  },

  // === PUNAKAWAN INFO ===
  {
    id: 'punakawan-info',
    position: { x: 50, y: 0, z: 50 },
    title: 'Punakawan - Pengawal Setia',
    description: `PUNAKAWAN adalah kelompok empat abdi dalam pewayangan Jawa yang mengawal para kesatria Pandawa. Mereka adalah ciptaan asli budaya Jawa yang tidak ada dalam Mahabharata India asli.

ANGGOTA PUNAKAWAN:

SEMAR (Sang Pamomong)
• Nama asli: Batara Ismaya
• Status: Dewa yang memilih hidup sebagai rakyat jelata
• Filosofi: Kebijaksanaan sejati datang dari kesederhanaan

GARENG (Si Setia)
• Nama asli: Nala Gareng
• Ciri: Mata juling, tangan bengkok, kaki pincang
• Filosofi: Kecacatan fisik bukan penghalang berbuat baik

PETRUK (Si Dermawan)
• Nama asli: Kanthong Bolong
• Ciri: Hidung panjang, tubuh tinggi kurus
• Filosofi: Berbagi tanpa pamrih

BAGONG (Si Jujur)
• Status: Putra bungsu Semar
• Ciri: Tubuh gemuk, wajah polos
• Filosofi: Keberanian berkata benar

PERAN DALAM PEWAYANGAN:
Punakawan muncul dalam adegan "Goro-goro" sebagai selingan humor sekaligus kritik sosial. Melalui candaan, mereka menyampaikan pesan moral dan sindiran terhadap ketidakadilan.`
  }
];

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loading-screen');
const charSelection = document.getElementById('char-selection');
const charOptions = document.getElementById('char-options');
const startExploreBtn = document.getElementById('start-explore-btn');
const gameHud = document.getElementById('game-hud');
const playerAvatar = document.getElementById('player-avatar');
const playerNameEl = document.getElementById('player-name');
const locationNameEl = document.getElementById('location-name');
const menuBtn = document.getElementById('menu-btn');
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const changeCharBtn = document.getElementById('change-char-btn');
const exitBtn = document.getElementById('exit-btn');
const interactionPrompt = document.getElementById('interaction-prompt');
const infoPanel = document.getElementById('info-panel');
const closeInfoBtn = document.getElementById('close-info-btn');
const infoTitle = document.getElementById('info-title');
const infoDescription = document.getElementById('info-description');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

// ===== THREE.JS SETUP =====
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.FogExp2(0x87CEEB, 0.0008); // Reduced fog for larger world

// Perspective camera for 3D world - extended far plane
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
// ★ POSISI SPAWN KAMERA - Kamera di belakang karakter
camera.position.set(0, 15, 30);

// ===== LIGHTING =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
sunLight.position.set(100, 200, 100);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -300;
sunLight.shadow.camera.right = 300;
sunLight.shadow.camera.top = 300;
sunLight.shadow.camera.bottom = -300;
scene.add(sunLight);

// Hemisphere light for natural outdoor lighting
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x3d5c3d, 0.5);
scene.add(hemiLight);

// ===== MATERIALS =====
const stoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x8B8B7A,
  roughness: 0.9,
  metalness: 0.1
});

const darkStoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x5a5a4a,
  roughness: 0.95,
  metalness: 0.05
});

const redStoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x8B4513,
  roughness: 0.85,
  metalness: 0.1
});

const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a7c4e,
  roughness: 1.0
});

const pathMaterial = new THREE.MeshStandardMaterial({
  color: 0x8B7355,
  roughness: 0.8
});

const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x2E8B8B,
  roughness: 0.1,
  metalness: 0.3,
  transparent: true,
  opacity: 0.8
});

// ===== COLLISION SYSTEM =====
function addCollisionBox(x, z, width, depth, height = 50) {
  collisionBoxes.push({
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2,
    height: height
  });
}

function checkCollision(x, z, radius = 1.5) {
  for (const box of collisionBoxes) {
    // Find closest point on box to player
    const closestX = Math.max(box.minX, Math.min(x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    
    // Calculate distance
    const distX = x - closestX;
    const distZ = z - closestZ;
    const distance = Math.sqrt(distX * distX + distZ * distZ);
    
    if (distance < radius) {
      return { collision: true, box, closestX, closestZ, distX, distZ, distance };
    }
  }
  return { collision: false };
}

// ===== TERRAIN HEIGHT FUNCTION =====
function getTerrainHeight(x, z) {
  // Simple wave pattern matching createWorld
  return Math.sin(x * 0.01) * Math.cos(z * 0.01) * 3;
}

// ===== CREATE WORLD =====
function createWorld() {
  // Ground plane (grass) - much larger
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
  const ground = new THREE.Mesh(groundGeometry, grassMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // Add terrain variation
  const vertices = ground.geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 1];
    // Use the deterministic height function
    vertices[i + 2] = getTerrainHeight(x, -z); // Note: z is inverted due to rotation? Let's just use x, z from geometry which maps to world x, z
    // Actually, PlaneGeometry is on XY plane. 
    // When rotated -90 deg on X:
    // Local X -> World X
    // Local Y -> World -Z
    // Local Z -> World Y
    // So we want height (Local Z) to be function of World X and World Z.
    // World X = Local X
    // World Z = -Local Y => Local Y = -World Z
    vertices[i + 2] = getTerrainHeight(x, -z);
  }
  ground.geometry.attributes.position.needsUpdate = true;
  ground.geometry.computeVertexNormals();

  // Create all landmarks
  // Layout: Karakter di tengah (0, 0)
  // Utara (Z positif): Gerbang Trowulan
  // Timur (X positif): Candi Cetho  
  // Barat (X negatif): Candi Parit
  // Selatan (Z negatif): Prambanan & Borobudur
  createGerbangTrowulan(0, 300);        // Utara, 100 meter
  createCandiCetho(300, 0);             // Timur, 100 meter
  loadCandiParit(-300, 0);              // Barat, 100 meter
  createPrambananTemple(-200, -300);     // Selatan kiri, 100 meter
  createBorobudurTemple(200, -300);      // Selatan kanan, 100 meter

  // Create paths connecting landmarks
  createAllPaths();

  // Create trees (avoiding landmarks)
  createTrees();
  
  // Create rocks for detail
  createRocks();

  // Create lamps along paths
  createLamps();

  // Create POI markers
  createPOIMarkers();
}

// ===== CANDI CETHO =====
function createCandiCetho(offsetX, offsetZ) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './candicetho/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN CANDI CETHO - Ubah angka untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 38; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(7, 7, 7);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Store model reference for rotation
      model.userData.isBuilding = true;
      buildingModels.push(model);
      
      // Add to scene
      scene.add(model);
      
      console.log('Candi Cetho 3D model loaded successfully');
    },
    function (xhr) {
      console.log('Candi Cetho: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading Candi Cetho model:', error);
    }
  );
  
  // Add collision box around the model
  addCollisionBox(offsetX, offsetZ, 64, 64);
}

// ===== PRAMBANAN TEMPLE =====
function createPrambananTemple(offsetX, offsetZ) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './prambanan/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN PRAMBANAN - Ubah angka -6 untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 80; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(200, 200, 200);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Store model reference for rotation
      model.userData.isBuilding = true;
      buildingModels.push(model);
      
      // Add to scene
      scene.add(model);
      
      console.log('Prambanan 3D model loaded successfully');
    },
    function (xhr) {
      console.log('Prambanan: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading Prambanan model:', error);
    }
  );
  
  // Add collision box around the model
  addCollisionBox(offsetX, offsetZ, 80, 80);
}

function createPrambananSpire(height) {
  const group = new THREE.Group();

  // Base
  const baseSize = height * 0.3;
  const baseGeom = new THREE.BoxGeometry(baseSize, height * 0.15, baseSize);
  const base = new THREE.Mesh(baseGeom, redStoneMaterial);
  base.position.y = height * 0.075;
  base.castShadow = true;
  group.add(base);

  // Body with relief panels
  const bodyGeom = new THREE.BoxGeometry(baseSize * 0.8, height * 0.4, baseSize * 0.8);
  const body = new THREE.Mesh(bodyGeom, redStoneMaterial);
  body.position.y = height * 0.35;
  body.castShadow = true;
  group.add(body);

  // Roof tiers
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const tierSize = baseSize * (0.7 - i * 0.1);
    const tierHeight = height * 0.08;
    const tierGeom = new THREE.ConeGeometry(tierSize / 2, tierHeight, 4);
    const tier = new THREE.Mesh(tierGeom, redStoneMaterial);
    tier.position.y = height * 0.55 + i * tierHeight * 0.8;
    tier.rotation.y = Math.PI / 4;
    tier.castShadow = true;
    group.add(tier);
  }

  // Top finial
  const finialGeom = new THREE.ConeGeometry(0.5, height * 0.1, 8);
  const finial = new THREE.Mesh(finialGeom, redStoneMaterial);
  finial.position.y = height * 0.95;
  finial.castShadow = true;
  group.add(finial);

  return group;
}

// ===== LEMPUYANG TEMPLE =====
// ===== GERBANG TROWULAN =====
function createGerbangTrowulan(offsetX, offsetZ) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './gerbang/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN GERBANG TROWULAN - Ubah angka untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 10; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(12, 12, 12);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Store model reference for rotation
      model.userData.isBuilding = true;
      buildingModels.push(model);
      
      // Add to scene
      scene.add(model);
      
      console.log('Gerbang Trowulan 3D model loaded successfully');
    },
    function (xhr) {
      console.log('Gerbang Trowulan: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading Gerbang Trowulan model:', error);
    }
  );
  
  // Add collision box around the model
  addCollisionBox(offsetX, offsetZ, 44, 34);
}

function createGatePart(height, width, depth) {
  const group = new THREE.Group();

  // Main body - tapered
  for (let i = 0; i < 5; i++) {
    const tierWidth = width - i * 0.3;
    const tierHeight = height / 5;
    const tierGeom = new THREE.BoxGeometry(tierWidth, tierHeight, depth - i * 0.2);
    const tier = new THREE.Mesh(tierGeom, stoneMaterial);
    tier.position.y = -height / 2 + tierHeight / 2 + i * tierHeight;
    tier.position.x = -tierWidth / 4;
    tier.castShadow = true;
    group.add(tier);
  }

  // Decorative top
  const topGeom = new THREE.ConeGeometry(width / 2, height * 0.2, 4);
  const top = new THREE.Mesh(topGeom, stoneMaterial);
  top.position.y = height / 2 + height * 0.1;
  top.position.x = -width / 4;
  top.rotation.y = Math.PI / 4;
  top.castShadow = true;
  group.add(top);

  return group;
}

function createMeru(height) {
  const group = new THREE.Group();

  // Base
  const baseGeom = new THREE.BoxGeometry(4, 2, 4);
  const base = new THREE.Mesh(baseGeom, stoneMaterial);
  base.position.y = 1;
  base.castShadow = true;
  group.add(base);

  // Tiered roofs (ijuk style)
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 1 });
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const roofSize = 3.5 - i * 0.4;
    const roofGeom = new THREE.ConeGeometry(roofSize, 1.5, 4);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.y = 3 + i * 1.2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
  }

  return group;
}

function createGuardianStatue() {
  const group = new THREE.Group();

  // Base
  const baseGeom = new THREE.BoxGeometry(2, 1, 2);
  const base = new THREE.Mesh(baseGeom, stoneMaterial);
  base.position.y = 0.5;
  group.add(base);

  // Body
  const bodyGeom = new THREE.CylinderGeometry(0.8, 1, 3, 8);
  const body = new THREE.Mesh(bodyGeom, stoneMaterial);
  body.position.y = 2.5;
  body.castShadow = true;
  group.add(body);

  // Head
  const headGeom = new THREE.SphereGeometry(0.7, 8, 8);
  const head = new THREE.Mesh(headGeom, stoneMaterial);
  head.position.y = 4.5;
  head.castShadow = true;
  group.add(head);

  return group;
}

// ===== BOROBUDUR TEMPLE =====
function createBorobudurTemple(offsetX, offsetZ) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './borobudur/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN BOROBUDUR - Ubah angka untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 40; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // ★ UKURAN MODEL BOROBUDUR - Ubah angka untuk memperbesar/memperkecil
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(200, 200, 200); // Diperbesar dari 12 ke 50
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Store model reference for rotation
      model.userData.isBuilding = true;
      buildingModels.push(model);
      
      // Add to scene
      scene.add(model);
      
      console.log('Borobudur 3D model loaded successfully');
    },
    function (xhr) {
      console.log('Borobudur: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading Borobudur model:', error);
    }
  );
  
  // Add collision box around the model
  addCollisionBox(offsetX, offsetZ, 120, 120);
}

// ===== CANDI PARIT (3D GLTF MODEL) =====
function loadCandiParit(offsetX, offsetZ) {
  const loader = new GLTFLoader();
  
  loader.load(
    './candiparit/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN CANDI - Ubah angka -6 untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = -70; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(12, 12, 12);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Store model reference for rotation
      model.userData.isBuilding = true;
      buildingModels.push(model);
      
      // Add to scene
      scene.add(model);
      
      // Add collision box around the model
      addCollisionBox(offsetX, offsetZ, 40, 40);
      
      console.log('Candi Parit loaded successfully');
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading Candi Parit:', error);
    }
  );
}

function createBoat() {
  const group = new THREE.Group();

  const boatMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
  
  // Hull
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-2, 0);
  hullShape.quadraticCurveTo(-2.5, 0.5, -2, 1);
  hullShape.lineTo(2, 1);
  hullShape.quadraticCurveTo(2.5, 0.5, 2, 0);
  hullShape.lineTo(-2, 0);

  const extrudeSettings = { depth: 1, bevelEnabled: false };
  const hullGeom = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  const hull = new THREE.Mesh(hullGeom, boatMat);
  hull.rotation.x = -Math.PI / 2;
  hull.position.y = 0.2;
  group.add(hull);

  return group;
}

function createStupa(scale = 1) {
  const group = new THREE.Group();

  // Base
  const baseGeom = new THREE.BoxGeometry(1.2 * scale, 0.3 * scale, 1.2 * scale);
  const base = new THREE.Mesh(baseGeom, stoneMaterial);
  base.position.y = 0.15 * scale;
  base.castShadow = true;
  group.add(base);

  // Body (bell shape)
  const bodyGeom = new THREE.SphereGeometry(0.5 * scale, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const body = new THREE.Mesh(bodyGeom, stoneMaterial);
  body.position.y = 0.3 * scale;
  body.castShadow = true;
  group.add(body);

  // Top spire
  const spireGeom = new THREE.ConeGeometry(0.15 * scale, 0.6 * scale, 8);
  const spire = new THREE.Mesh(spireGeom, stoneMaterial);
  spire.position.y = 1 * scale;
  spire.castShadow = true;
  group.add(spire);

  return group;
}

function createPerforatedStupa(scale = 1) {
  const group = new THREE.Group();

  // Base
  const baseGeom = new THREE.CylinderGeometry(0.8 * scale, 1 * scale, 0.3 * scale, 16);
  const base = new THREE.Mesh(baseGeom, stoneMaterial);
  base.position.y = 0.15 * scale;
  base.castShadow = true;
  group.add(base);

  // Perforated bell (use wireframe for now, can be improved with lattice geometry)
  const bellGeom = new THREE.SphereGeometry(1 * scale, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.7);
  const bellMat = stoneMaterial.clone();
  const bell = new THREE.Mesh(bellGeom, bellMat);
  bell.position.y = 0.5 * scale;
  bell.castShadow = true;
  group.add(bell);

  // Diamond-shaped holes (represented by darker insets)
  const holeGeom = new THREE.PlaneGeometry(0.3 * scale, 0.4 * scale);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
  const holesCount = 8;
  for (let i = 0; i < holesCount; i++) {
    const angle = (i / holesCount) * Math.PI * 2;
    const hole = new THREE.Mesh(holeGeom, holeMat);
    hole.position.set(
      Math.cos(angle) * 0.95 * scale,
      0.8 * scale,
      Math.sin(angle) * 0.95 * scale
    );
    hole.rotation.y = -angle + Math.PI / 2;
    hole.rotation.z = Math.PI / 4;
    group.add(hole);
  }

  // Top
  const topGeom = new THREE.ConeGeometry(0.2 * scale, 0.5 * scale, 8);
  const top = new THREE.Mesh(topGeom, stoneMaterial);
  top.position.y = 1.8 * scale;
  top.castShadow = true;
  group.add(top);

  return group;
}

function createMainStupa() {
  const group = new THREE.Group();

  // Large base
  const baseGeom = new THREE.CylinderGeometry(4, 5, 2, 32);
  const base = new THREE.Mesh(baseGeom, stoneMaterial);
  base.position.y = 1;
  base.castShadow = true;
  group.add(base);

  // Bell
  const bellGeom = new THREE.SphereGeometry(3.5, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const bell = new THREE.Mesh(bellGeom, stoneMaterial);
  bell.position.y = 2;
  bell.castShadow = true;
  group.add(bell);

  // Spire rings
  for (let i = 0; i < 9; i++) {
    const ringGeom = new THREE.TorusGeometry(1.5 - i * 0.12, 0.15, 8, 16);
    const ring = new THREE.Mesh(ringGeom, stoneMaterial);
    ring.position.y = 5.5 + i * 0.5;
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    group.add(ring);
  }

  // Top finial
  const finialGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const finial = new THREE.Mesh(finialGeom, stoneMaterial);
  finial.position.y = 10.5;
  finial.castShadow = true;
  group.add(finial);

  return group;
}

const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.8,
  metalness: 0.1
});

function createAllPaths() {
  // Create paths connecting all landmarks
  const pathConnections = [
    // From Borobudur center
    { start: { x: 0, z: 40 }, end: { x: 0, z: 100 } },
    { start: { x: 40, z: 0 }, end: { x: 100, z: 100 } },      // To Prambanan
    { start: { x: -40, z: 0 }, end: { x: -100, z: 100 } },    // To Lempuyang
    { start: { x: 0, z: -40 }, end: { x: 0, z: -150 } },      // To Danau Batur
    
    // Cross paths
    { start: { x: 100, z: 100 }, end: { x: 200, z: 200 } },   // Continue to Prambanan
    { start: { x: -100, z: 100 }, end: { x: -200, z: 200 } }, // Continue to Lempuyang
    { start: { x: 0, z: -150 }, end: { x: 0, z: -250 } },     // Continue to Danau Batur
    
    // Connecting paths between landmarks
    { start: { x: 200, z: 200 }, end: { x: -200, z: 200 } },  // Prambanan to Lempuyang
    { start: { x: 200, z: 200 }, end: { x: 100, z: -150 } },  // Prambanan to Danau Batur
    { start: { x: -200, z: 200 }, end: { x: -100, z: -150 } }, // Lempuyang to Danau Batur
    
    // Paths to Candi Parit
    { start: { x: 40, z: -40 }, end: { x: 150, z: -150 } },   // Borobudur to Candi Parit
    { start: { x: 200, z: 150 }, end: { x: 150, z: -150 } },  // Prambanan to Candi Parit
    { start: { x: 50, z: -250 }, end: { x: 150, z: -150 } },  // Danau Batur to Candi Parit
  ];

  pathConnections.forEach(path => {
    const dx = path.end.x - path.start.x;
    const dz = path.end.z - path.start.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    
    // Create segmented path to follow terrain
    const segments = Math.ceil(length / 2); // 1 segment per 2 units
    const pathGeom = new THREE.PlaneGeometry(6, length, 2, segments);
    
    // Adjust vertices to match terrain height
    const posAttribute = pathGeom.attributes.position;
    const vertex = new THREE.Vector3();
    
    // We need to transform local vertices to world space to get height, then apply height
    // But PlaneGeometry is created at origin. We will position it later.
    // So we need to calculate what the world position WOULD be.
    
    // Center of path in world space
    const centerX = (path.start.x + path.end.x) / 2;
    const centerZ = (path.start.z + path.end.z) / 2;
    
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      
      // Transform local vertex to world space manually
      // Rotation: -90 deg around X, -angle around Z
      // Position: centerX, 0, centerZ
      
      // 1. Apply rotation -Math.PI/2 around X (standard for ground plane)
      // Local (x, y, z) -> (x, z, -y) ? No.
      // Plane is XY. Rotated X -90 -> XZ plane.
      // Local X -> World X (relative to center, rotated by angle)
      // Local Y -> World Z (relative to center, rotated by angle)
      // Local Z -> World Y (Height)
      
      // Let's simplify: Iterate along the line in world space
      // The plane is created with width along X and height along Y.
      // When we rotate X -90, width is along X, height is along -Z.
      // Then we rotate Z -angle.
      
      // Let's just place small segments instead of one big warped plane.
      // It's easier and less math-heavy.
    }
    
    // Alternative: Place small segments
    const segmentLength = 4;
    const numSegments = Math.ceil(length / segmentLength);
    
    for (let i = 0; i < numSegments; i++) {
      const t = i / numSegments;
      const nextT = (i + 1) / numSegments;
      
      const x1 = path.start.x + dx * t;
      const z1 = path.start.z + dz * t;
      const x2 = path.start.x + dx * nextT;
      const z2 = path.start.z + dz * nextT;
      
      const segCenterX = (x1 + x2) / 2;
      const segCenterZ = (z1 + z2) / 2;
      
      const h1 = getTerrainHeight(x1, z1);
      const h2 = getTerrainHeight(x2, z2);
      const avgH = (h1 + h2) / 2;
      
      // Calculate rotation to match slope
      const slopeAngle = Math.atan2(h2 - h1, segmentLength);
      
      const segGeom = new THREE.PlaneGeometry(6, segmentLength);
      const segMesh = new THREE.Mesh(segGeom, asphaltMaterial);
      
      segMesh.position.set(segCenterX, avgH + 0.05, segCenterZ);
      segMesh.rotation.x = -Math.PI / 2 + slopeAngle; // Tilt to match slope
      segMesh.rotation.z = -angle;
      segMesh.rotation.order = 'YXZ'; // Important for combining rotations
      
      segMesh.receiveShadow = true;
      scene.add(segMesh);
    }
  });
}

function createTrees() {
  const treePositions = [];
  
  // Landmark positions to avoid
  const exclusionZones = [
    { x: 0, z: 0, radius: 80 },       // Borobudur
    { x: 200, z: 200, radius: 100 },  // Prambanan
    { x: -200, z: 200, radius: 60 },  // Lempuyang
    { x: 0, z: -250, radius: 100 },   // Danau Batur
  ];

  // Generate random tree positions
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 900;
    const z = (Math.random() - 0.5) * 900;
    
    // Check if position is in any exclusion zone
    let inExclusionZone = false;
    for (const zone of exclusionZones) {
      const dist = Math.sqrt((x - zone.x) ** 2 + (z - zone.z) ** 2);
      if (dist < zone.radius) {
        inExclusionZone = true;
        break;
      }
    }
    
    if (!inExclusionZone) {
      treePositions.push({ x, z });
    }
  }

  treePositions.forEach(pos => {
    const h = getTerrainHeight(pos.x, pos.z);
    const tree = createTree();
    tree.position.set(pos.x, h, pos.z);
    scene.add(tree);
  });
}

function createTree() {
  const group = new THREE.Group();

  // Trunk - slightly curved for natural look
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.2, 2, 0.1),
    new THREE.Vector3(-0.1, 4, 0)
  ]);
  const trunkGeom = new THREE.TubeGeometry(trunkCurve, 4, 0.4, 8, false);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 1 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.castShadow = true;
  group.add(trunk);

  // Foliage - Tropical style (palm-ish or banyan-ish)
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.8 });
  
  // Main canopy
  const canopyGeom = new THREE.DodecahedronGeometry(2.5);
  const canopy = new THREE.Mesh(canopyGeom, foliageMat);
  canopy.position.set(0, 4.5, 0);
  canopy.scale.y = 0.8;
  canopy.castShadow = true;
  group.add(canopy);

  // Smaller clumps
  for(let i=0; i<5; i++) {
    const size = 1 + Math.random();
    const clump = new THREE.Mesh(new THREE.DodecahedronGeometry(size), foliageMat);
    clump.position.set(
      (Math.random() - 0.5) * 3,
      4 + Math.random() * 2,
      (Math.random() - 0.5) * 3
    );
    clump.castShadow = true;
    group.add(clump);
  }

  // Random scale variation
  const scale = 0.8 + Math.random() * 0.6;
  group.scale.set(scale, scale, scale);

  return group;
}

function createRocks() {
  const rockGeom = new THREE.DodecahedronGeometry(1);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.9 });

  for (let i = 0; i < 100; i++) {
    const rock = new THREE.Mesh(rockGeom, rockMat);
    
    // Random position
    const x = (Math.random() - 0.5) * 900;
    const z = (Math.random() - 0.5) * 900;
    
    // Avoid center
    if (Math.abs(x) < 50 && Math.abs(z) < 50) continue;

    const h = getTerrainHeight(x, z);
    rock.position.set(x, h + 0.5, z);
    
    // Random scale and rotation
    const s = 0.5 + Math.random() * 1.5;
    rock.scale.set(s, s * 0.6, s);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
  }
}

function createLamps() {
  // Place lamps along the main paths
  const pathPoints = [
    // Borobudur to Prambanan
    { start: { x: 20, z: 20 }, end: { x: 180, z: 180 }, count: 20 },
    // Borobudur to Lempuyang
    { start: { x: -20, z: 20 }, end: { x: -180, z: 180 }, count: 20 },
    // Borobudur to Danau Batur
    { start: { x: 0, z: -20 }, end: { x: 0, z: -230 }, count: 25 },
    // Around Borobudur
    { start: { x: -35, z: -35 }, end: { x: 35, z: -35 }, count: 8 },
    { start: { x: -35, z: 35 }, end: { x: 35, z: 35 }, count: 8 },
  ];

  pathPoints.forEach(path => {
    for (let i = 0; i <= path.count; i++) {
      const t = i / path.count;
      const x = path.start.x + (path.end.x - path.start.x) * t;
      const z = path.start.z + (path.end.z - path.start.z) * t;
      
      const h = getTerrainHeight(x, z);
      
      // Offset slightly from path center
      createLamp(x + 4, z, h);
      createLamp(x - 4, z, h);
    }
  });
}

function createLamp(x, z, h) {
  const group = new THREE.Group();
  group.position.set(x, h, z);

  // Post
  const postGeom = new THREE.CylinderGeometry(0.1, 0.15, 3, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x2c1a0e, roughness: 0.9 });
  const post = new THREE.Mesh(postGeom, postMat);
  post.position.y = 1.5;
  post.castShadow = true;
  group.add(post);

  // Lantern holder
  const holderGeom = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const holder = new THREE.Mesh(holderGeom, postMat);
  holder.position.y = 2.8;
  group.add(holder);

  // Lantern glass/paper
  const lanternGeom = new THREE.BoxGeometry(0.4, 0.6, 0.4);
  const lanternMat = new THREE.MeshStandardMaterial({ 
    color: 0xffaa00, 
    emissive: 0xff5500,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.9
  });
  const lantern = new THREE.Mesh(lanternGeom, lanternMat);
  lantern.position.y = 2.5;
  group.add(lantern);

  // Light source
  const light = new THREE.PointLight(0xffaa00, 0, 15); // Start with intensity 0 (Day)
  light.position.y = 2.5;
  group.add(light);
  
  // Store light reference for toggling
  lamps.push({ light: light, mesh: lantern });

  scene.add(group);
}

function createPOIMarkers() {
  pointsOfInterest.forEach(poi => {
    // Create a glowing marker
    const markerGroup = new THREE.Group();
    markerGroup.userData = { poi };

    // Pillar
    const pillarGeom = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ 
      color: 0xffcc00, 
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    pillar.position.y = 1;
    markerGroup.add(pillar);

    // Floating orb
    const orbGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffcc00,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);
    orb.position.y = 2.5;
    orb.userData.isOrb = true;
    markerGroup.add(orb);

    // Point light
    const light = new THREE.PointLight(0xffcc00, 1, 10);
    light.position.y = 2.5;
    markerGroup.add(light);

    const h = getTerrainHeight(poi.position.x, poi.position.z);
    markerGroup.position.set(poi.position.x, h, poi.position.z);
    scene.add(markerGroup);
  });
}

// ===== PLAYER (2D SPRITE IN 3D WORLD) =====
class Player {
  constructor() {
    // ★ POSISI SPAWN PLAYER - First-person view
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3();
    this.rotation = 0;
    this.speed = 18;
    this.runSpeed = 30;
    this.jumpForce = 12;
    this.gravity = 30;
    this.isGrounded = true;
    this.isMoving = false;
    this.isRunning = false;
    
    // Player light (aura/lantern)
    this.light = new THREE.PointLight(0xffaa00, 1, 20);
    this.light.position.set(0, 5, 0);
    scene.add(this.light);
  }

  update(delta, keys, cameraAngle) {
    // Movement input
    let moveX = 0;
    let moveZ = 0;
    this.isMoving = false;
    this.isRunning = keys['ShiftLeft'] || keys['ShiftRight'];

    // Get input direction (relative to camera view)
    if (keys['KeyW'] || keys['ArrowUp']) { moveZ = -1; this.isMoving = true; }
    if (keys['KeyS'] || keys['ArrowDown']) { moveZ = 1; this.isMoving = true; }
    if (keys['KeyA'] || keys['ArrowLeft']) { moveX = -1; this.isMoving = true; }
    if (keys['KeyD'] || keys['ArrowRight']) { moveX = 1; this.isMoving = true; }

    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
      const factor = 1 / Math.sqrt(2);
      moveX *= factor;
      moveZ *= factor;
    }

    // Transform movement direction based on camera orientation (first-person)
    if (this.isMoving) {
      const sin = Math.sin(cameraAngle);
      const cos = Math.cos(cameraAngle);
      
      // Transform to world space - camera-relative movement
      const worldX = moveX * cos + moveZ * sin;
      const worldZ = -moveX * sin + moveZ * cos;
      
      const currentSpeed = this.isRunning ? this.runSpeed : this.speed;
      this.velocity.x = worldX * currentSpeed;
      this.velocity.z = worldZ * currentSpeed;
    } else {
      // Decelerate smoothly when no input
      this.velocity.x *= 0.85;
      this.velocity.z *= 0.85;
      
      // Stop completely if very slow
      if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.1) this.velocity.z = 0;
    }

    // Jump
    if ((keys['Space']) && this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }

    // Apply gravity
    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * delta;
    }

    // ===== COLLISION DETECTION =====
    const playerRadius = 2.5;
    
    // Try X movement first
    let newX = this.position.x + this.velocity.x * delta;
    let newZ = this.position.z;
    
    if (checkCollision(newX, newZ, playerRadius).collision) {
      // X blocked, keep original X
      newX = this.position.x;
      this.velocity.x = 0;
    }
    
    // Then try Z movement
    newZ = this.position.z + this.velocity.z * delta;
    
    if (checkCollision(newX, newZ, playerRadius).collision) {
      // Z blocked, keep original Z
      newZ = this.position.z;
      this.velocity.z = 0;
    }
    
    // Final check - if still colliding, don't move at all
    if (checkCollision(newX, newZ, playerRadius).collision) {
      newX = this.position.x;
      newZ = this.position.z;
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    // Apply final position
    this.position.x = newX;
    this.position.y += this.velocity.y * delta;
    this.position.z = newZ;

    // Ground check with terrain height
    const terrainHeight = getTerrainHeight(this.position.x, this.position.z);
    if (this.position.y <= terrainHeight) {
      this.position.y = terrainHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // World bounds - larger world
    const worldBound = 480;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -worldBound, worldBound);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -worldBound, worldBound);

    // Update light position
    if (this.light) {
      this.light.position.copy(this.position);
      this.light.position.y += 5;
    }
  }
}

// ===== CAMERA CONTROLLER =====
class CameraController {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;
    this.distance = 0; // First-person: camera at player position
    this.eyeHeight = 1.7; // Human eye height in meters
    this.rotationX = 0; // Horizontal rotation (yaw)
    this.rotationY = 0; // Vertical rotation (pitch)
    this.minRotationY = -Math.PI / 2 + 0.1; // Look down limit
    this.maxRotationY = Math.PI / 2 - 0.1; // Look up limit
    this.mouseSensitivity = 0.003;
    this.smoothing = 0.15;
    this.targetPosition = new THREE.Vector3();
  }

  update(playerPosition) {
    // First-person: camera at player position + eye height
    const targetPos = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + this.eyeHeight,
      playerPosition.z
    );

    // Smooth camera movement
    this.camera.position.lerp(targetPos, this.smoothing);

    // Calculate look direction from rotation angles
    const lookDistance = 10; // Distance to look-at point
    this.targetPosition.set(
      this.camera.position.x - Math.sin(this.rotationX) * Math.cos(this.rotationY) * lookDistance,
      this.camera.position.y + Math.sin(this.rotationY) * lookDistance,
      this.camera.position.z - Math.cos(this.rotationX) * Math.cos(this.rotationY) * lookDistance
    );
    
    this.camera.lookAt(this.targetPosition);
  }

  handleMouseMove(movementX, movementY) {
    this.rotationX -= movementX * this.mouseSensitivity;
    this.rotationY -= movementY * this.mouseSensitivity;
    this.rotationY = THREE.MathUtils.clamp(this.rotationY, this.minRotationY, this.maxRotationY);
  }

  getHorizontalAngle() {
    return this.rotationX;
  }
}

// ===== INPUT HANDLING =====
const keys = {};
let mouseMovement = { x: 0, y: 0 };

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  
  // Handle pause
  if (e.code === 'Escape' && gameState.status === 'playing') {
    togglePause();
  }
  
  // Handle interaction
  if (e.code === 'KeyE' && gameState.status === 'playing') {
    handleInteraction();
  }
  
  // Handle loading screen - ENTER to start virtual tour
  if (e.code === 'Enter' && gameState.status === 'loading') {
    console.log('ENTER pressed - starting virtual tour');
    startGame();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

canvas.addEventListener('click', () => {
  if (gameState.status === 'playing' && !gameState.isPointerLocked) {
    canvas.requestPointerLock();
  }
});

document.addEventListener('pointerlockchange', () => {
  gameState.isPointerLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', (e) => {
  if (gameState.isPointerLocked && gameState.status === 'playing') {
    mouseMovement.x = e.movementX;
    mouseMovement.y = e.movementY;
  }
});

canvas.addEventListener('wheel', (e) => {
  if (gameState.status === 'playing' && cameraController) {
    cameraController.handleWheel(e.deltaY);
  }
});

// ===== UI FUNCTIONS =====
function updateSunPosition(timeValue) {
  // timeValue: 0-24 (hours)
  // 0 = midnight, 6 = sunrise, 12 = noon, 18 = sunset, 24 = midnight
  
  // Update time display
  const hours = Math.floor(timeValue);
  const minutes = Math.floor((timeValue % 1) * 60);
  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) {
    timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Calculate sun angle (0° at horizon east, 180° at horizon west)
  const sunAngle = (timeValue / 24) * Math.PI * 2 - Math.PI / 2;
  const sunHeight = Math.sin(sunAngle);
  const sunX = Math.cos(sunAngle) * 200;
  const sunY = Math.max(10, sunHeight * 200 + 50); // Keep sun above ground
  const sunZ = Math.sin(sunAngle) * 100;
  
  sunLight.position.set(sunX, sunY, sunZ);
  
  // Determine time of day phase
  let phase;
  if (timeValue < 5 || timeValue >= 21) {
    phase = 'night';
  } else if (timeValue >= 5 && timeValue < 7) {
    phase = 'dawn';
  } else if (timeValue >= 7 && timeValue < 17) {
    phase = 'day';
  } else if (timeValue >= 17 && timeValue < 19) {
    phase = 'dusk';
  } else {
    phase = 'evening';
  }
  
  // Smooth interpolation factor
  let t = 0;
  
  switch(phase) {
    case 'night':
      // Midnight blues
      scene.background = new THREE.Color(0x050520);
      scene.fog.color.setHex(0x050520);
      scene.fog.density = 0.002;
      sunLight.intensity = 0.2;
      sunLight.color.setHex(0x8888ff); // Moonlight
      ambientLight.intensity = 0.15;
      hemiLight.intensity = 0.15;
      hemiLight.groundColor.setHex(0x111111);
      // Turn on lamps
      lamps.forEach(lamp => {
        lamp.light.intensity = 2.0;
        lamp.mesh.material.emissiveIntensity = 1.0;
      });
      break;
      
    case 'dawn':
      // Sunrise colors
      t = (timeValue - 5) / 2; // 0 to 1
      scene.background = new THREE.Color().lerpColors(
        new THREE.Color(0x1a2332),
        new THREE.Color(0xff9966),
        t
      );
      scene.fog.color.copy(scene.background);
      scene.fog.density = 0.0015;
      sunLight.intensity = 0.3 + (t * 0.7);
      sunLight.color.setHex(0xffaa66);
      ambientLight.intensity = 0.2 + (t * 0.2);
      hemiLight.intensity = 0.2 + (t * 0.3);
      hemiLight.groundColor.setHex(0x332211);
      // Gradually turn off lamps
      lamps.forEach(lamp => {
        lamp.light.intensity = 2.0 * (1 - t);
        lamp.mesh.material.emissiveIntensity = 0.2 + (0.8 * (1 - t));
      });
      break;
      
    case 'day':
      // Bright daylight
      scene.background = new THREE.Color(0x87CEEB);
      scene.fog.color.setHex(0x87CEEB);
      scene.fog.density = 0.0008;
      sunLight.intensity = 1.2;
      sunLight.color.setHex(0xfff5e6);
      ambientLight.intensity = 0.4;
      hemiLight.intensity = 0.5;
      hemiLight.groundColor.setHex(0x3d5c3d);
      // Turn off lamps
      lamps.forEach(lamp => {
        lamp.light.intensity = 0;
        lamp.mesh.material.emissiveIntensity = 0.2;
      });
      break;
      
    case 'dusk':
      // Sunset colors
      t = (timeValue - 17) / 2; // 0 to 1
      scene.background = new THREE.Color().lerpColors(
        new THREE.Color(0xff9966),
        new THREE.Color(0x1a2332),
        t
      );
      scene.fog.color.copy(scene.background);
      scene.fog.density = 0.0015;
      sunLight.intensity = 1.0 - (t * 0.7);
      sunLight.color.setHex(0xff8844);
      ambientLight.intensity = 0.4 - (t * 0.2);
      hemiLight.intensity = 0.5 - (t * 0.3);
      hemiLight.groundColor.setHex(0x332211);
      // Gradually turn on lamps
      lamps.forEach(lamp => {
        lamp.light.intensity = 2.0 * t;
        lamp.mesh.material.emissiveIntensity = 0.2 + (0.8 * t);
      });
      break;
      
    case 'evening':
      // Early night
      scene.background = new THREE.Color(0x0a1020);
      scene.fog.color.setHex(0x0a1020);
      scene.fog.density = 0.0018;
      sunLight.intensity = 0.25;
      sunLight.color.setHex(0x9999ff);
      ambientLight.intensity = 0.18;
      hemiLight.intensity = 0.18;
      hemiLight.groundColor.setHex(0x111122);
      // Lamps fully on
      lamps.forEach(lamp => {
        lamp.light.intensity = 2.0;
        lamp.mesh.material.emissiveIntensity = 1.0;
      });
      break;
  }
}

const sunSlider = document.getElementById('sun-slider');
const timePlayPauseBtn = document.getElementById('time-play-pause');

if (sunSlider) {
  sunSlider.addEventListener('input', (e) => {
    const timeValue = parseFloat(e.target.value);
    gameState.currentTime = timeValue;
    updateSunPosition(timeValue);
  });
  // Initialize sun position
  gameState.currentTime = 12;
  updateSunPosition(gameState.currentTime);
}

if (timePlayPauseBtn) {
  timePlayPauseBtn.addEventListener('click', () => {
    gameState.timeAutoPlay = !gameState.timeAutoPlay;
    timePlayPauseBtn.textContent = gameState.timeAutoPlay ? '⏸️' : '▶️';
    timePlayPauseBtn.title = gameState.timeAutoPlay ? 'Pause Time' : 'Play Time';
  });
}

// Character selection removed - using first-person view

function startGame() {
  loadingScreen.style.display = 'none';
  gameHud.style.display = 'block';
  gameState.status = 'playing';
  
  // Request pointer lock for first-person controls
  setTimeout(() => {
    canvas.requestPointerLock();
  }, 100);
}

function togglePause() {
  if (gameState.status === 'playing') {
    gameState.status = 'paused';
    pauseMenu.style.display = 'flex';
    document.exitPointerLock();
  } else if (gameState.status === 'paused') {
    gameState.status = 'playing';
    pauseMenu.style.display = 'none';
    canvas.requestPointerLock();
  }
}

function handleInteraction() {
  // Check for nearby landmark first (for fighting game)
  const nearbyLandmark = findNearbyLandmark();
  if (nearbyLandmark) {
    enterFightingGame(nearbyLandmark);
    return;
  }
  
  // Check for nearby POI (for information)
  const nearbyPOI = findNearbyPOI();
  if (nearbyPOI) {
    showInfoPanel(nearbyPOI);
  }
}

function findNearbyLandmark() {
  const interactionDistance = 100; // 100 meter radius untuk interaksi dengan bangunan
  
  for (const [key, landmark] of Object.entries(landmarks)) {
    const dx = player.position.x - landmark.position.x;
    const dz = player.position.z - landmark.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < interactionDistance) {
      return { key, ...landmark };
    }
  }
  return null;
}

function enterFightingGame(landmark) {
  console.log('Entering fighting game at:', landmark.name);
  
  // Set flag to indicate coming from virtual tour
  localStorage.setItem('fightingGameMode', 'fromVirtualTour');
  
  // Save current game state to return later
  localStorage.setItem('virtualTourReturnPoint', JSON.stringify({
    character: gameState.selectedCharacter,
    position: { x: player.position.x, y: player.position.y, z: player.position.z },
    landmark: landmark.name,
    currentTime: gameState.currentTime
  }));
  
  // Navigate to fighting game (dalam folder yang sama dengan index.html)
  window.location.href = './fighting.html';
}

function findNearbyPOI() {
  const interactionDistance = 8;
  
  for (const poi of pointsOfInterest) {
    const dx = player.position.x - poi.position.x;
    const dz = player.position.z - poi.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < interactionDistance) {
      return poi;
    }
  }
  return null;
}

function showInfoPanel(poi) {
  infoTitle.textContent = poi.title;
  infoDescription.textContent = poi.description;
  infoPanel.style.display = 'block';
  gameState.status = 'paused';
  document.exitPointerLock();
}

function closeInfoPanelFn() {
  infoPanel.style.display = 'none';
  gameState.status = 'playing';
  canvas.requestPointerLock();
}

function updateInteractionPrompt() {
  if (gameState.status !== 'playing') {
    interactionPrompt.style.display = 'none';
    return;
  }
  
  const nearbyLandmark = findNearbyLandmark();
  const nearbyPOI = findNearbyPOI();
  
  if (nearbyLandmark) {
    interactionPrompt.textContent = `Tekan E - Masuk ke Arena ${nearbyLandmark.name}`;
    interactionPrompt.style.display = 'block';
  } else if (nearbyPOI) {
    interactionPrompt.textContent = 'Tekan E - Lihat Informasi';
    interactionPrompt.style.display = 'block';
  } else {
    interactionPrompt.style.display = 'none';
  }
}

function updateMinimap() {
  if (!minimapCtx) return;
  
  const size = 150;
  const scale = 0.15; // Adjusted for larger world
  
  // Clear
  minimapCtx.fillStyle = 'rgba(0, 30, 0, 0.9)';
  minimapCtx.fillRect(0, 0, size, size);
  
  // Draw landmarks
  const landmarkColors = {
    borobudur: '#8B8B7A',
    prambanan: '#8B4513',
    lempuyang: '#6B6B5A',
    batur: '#2E8B8B',
    candiparit: '#A0826D'
  };
  
  Object.entries(landmarks).forEach(([key, landmark]) => {
    const x = size/2 + landmark.position.x * scale;
    const z = size/2 + landmark.position.z * scale;
    if (x > 5 && x < size - 5 && z > 5 && z < size - 5) {
      minimapCtx.fillStyle = landmarkColors[key] || '#888888';
      minimapCtx.beginPath();
      minimapCtx.arc(x, z, key === 'batur' ? 8 : 6, 0, Math.PI * 2);
      minimapCtx.fill();
      
      // Label
      minimapCtx.fillStyle = '#ffffff';
      minimapCtx.font = '7px Arial';
      minimapCtx.textAlign = 'center';
      minimapCtx.fillText(landmark.name.split(' ')[0], x, z - 8);
    }
  });
  
  // Draw POI markers
  minimapCtx.fillStyle = '#ffcc00';
  pointsOfInterest.forEach(poi => {
    const x = size/2 + poi.position.x * scale;
    const z = size/2 + poi.position.z * scale;
    if (x > 0 && x < size && z > 0 && z < size) {
      minimapCtx.beginPath();
      minimapCtx.arc(x, z, 2, 0, Math.PI * 2);
      minimapCtx.fill();
    }
  });
  
  // Draw player position
  const playerX = size/2 + player.position.x * scale;
  const playerZ = size/2 + player.position.z * scale;
  
  // Player direction indicator
  minimapCtx.save();
  minimapCtx.translate(playerX, playerZ);
  minimapCtx.rotate(player.rotation);
  minimapCtx.fillStyle = '#00ff00';
  minimapCtx.beginPath();
  minimapCtx.moveTo(0, -6);
  minimapCtx.lineTo(-4, 4);
  minimapCtx.lineTo(4, 4);
  minimapCtx.closePath();
  minimapCtx.fill();
  minimapCtx.restore();
}

// ===== EVENT LISTENERS =====
if (startExploreBtn) {
  startExploreBtn.addEventListener('click', startGame);
}

if (menuBtn) {
  menuBtn.addEventListener('click', togglePause);
}

if (resumeBtn) {
  resumeBtn.addEventListener('click', togglePause);
}

// Character change removed - first-person mode only

if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    location.reload();
  });
}

if (closeInfoBtn) {
  closeInfoBtn.addEventListener('click', closeInfoPanelFn);
}

// ===== INITIALIZE =====
const player = new Player();
let cameraController = null;

// Create world
createWorld();

// Debug: visualize collision boxes (set to true to see them)
const DEBUG_COLLISION = false;
if (DEBUG_COLLISION) {
  collisionBoxes.forEach(box => {
    const width = box.maxX - box.minX;
    const depth = box.maxZ - box.minZ;
    const centerX = (box.minX + box.maxX) / 2;
    const centerZ = (box.minZ + box.maxZ) / 2;
    
    const debugGeom = new THREE.BoxGeometry(width, 5, depth);
    const debugMat = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true
    });
    const debugBox = new THREE.Mesh(debugGeom, debugMat);
    debugBox.position.set(centerX, 2.5, centerZ);
    scene.add(debugBox);
  });
  console.log('Collision boxes:', collisionBoxes);
}

// Initialize camera controller
cameraController = new CameraController(camera, player.position);

// Loading screen waits for user to press ENTER
console.log('[Virtual Tour] Loading complete - waiting for ENTER key');

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // Auto-increment time (5 minutes for full 24h cycle)
  if (gameState.timeAutoPlay && gameState.status === 'playing') {
    const timeIncrement = (24 / gameState.timeCycleDuration) * delta;
    gameState.currentTime += timeIncrement;
    
    // Wrap around after 24 hours
    if (gameState.currentTime >= 24) {
      gameState.currentTime -= 24;
    }
    
    // Update sun position and slider
    updateSunPosition(gameState.currentTime);
    const sunSlider = document.getElementById('sun-slider');
    if (sunSlider) {
      sunSlider.value = gameState.currentTime;
    }
  }
  
  if (gameState.status === 'playing') {
    // Update player
    player.update(delta, keys, cameraController.getHorizontalAngle());
    
    // Update camera
    if (cameraController) {
      cameraController.handleMouseMove(mouseMovement.x, mouseMovement.y);
      cameraController.update(player.position);
    }
    
    // Reset mouse movement
    mouseMovement.x = 0;
    mouseMovement.y = 0;
    
    // Update UI
    updateInteractionPrompt();
    updateMinimap();
    
    // Rotate buildings to face player
    buildingModels.forEach(building => {
      if (building && building.position) {
        const dx = player.position.x - building.position.x;
        const dz = player.position.z - building.position.z;
        const angle = Math.atan2(dx, dz);
        building.rotation.y = angle;
      }
    });
    
    // Animate POI orbs
    scene.traverse(obj => {
      if (obj.userData && obj.userData.isOrb) {
        obj.position.y = 2.5 + Math.sin(clock.elapsedTime * 2) * 0.3;
      }
      // Animate smoke from volcano
      if (obj.userData && obj.userData.isSmoke) {
        obj.position.y = obj.userData.baseY + Math.sin(clock.elapsedTime * 0.5 + obj.position.x) * 2;
        obj.material.opacity = 0.3 + Math.sin(clock.elapsedTime + obj.position.z) * 0.15;
      }
      // Animate boats on lake
      if (obj.userData && obj.userData.isBoat) {
        const newAngle = obj.userData.angle + clock.elapsedTime * 0.02;
        obj.position.x = Math.cos(newAngle) * obj.userData.radius;
        obj.position.z = Math.sin(newAngle) * obj.userData.radius;
        obj.position.y = 0.3 + Math.sin(clock.elapsedTime * 2) * 0.1;
        obj.rotation.y = newAngle + Math.PI / 2;
      }
    });
  }
  
  renderer.render(scene, camera);
}

// ===== WINDOW RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
