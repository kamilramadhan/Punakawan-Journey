import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

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

// ===== Model downscaling helpers =====
function downscaleTexture(tex, maxSize = 512) {
  if (!tex || !tex.image) return tex;
  const img = tex.image;
  const iw = img.naturalWidth || img.width || img.videoWidth || 0;
  const ih = img.naturalHeight || img.height || img.videoHeight || 0;
  if (Math.max(iw, ih) <= maxSize) return tex;

  const scale = maxSize / Math.max(iw, ih);
  const cw = Math.max(1, Math.floor(iw * scale));
  const ch = Math.max(1, Math.floor(ih * scale));

  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');
  try { ctx.drawImage(img, 0, 0, cw, ch); } catch (e) { return tex; }

  const newTex = new THREE.CanvasTexture(canvas);
  newTex.wrapS = tex.wrapS; newTex.wrapT = tex.wrapT;
  if (tex.repeat) newTex.repeat.copy(tex.repeat);
  if (tex.offset) newTex.offset.copy(tex.offset);
  newTex.rotation = tex.rotation || 0;
  // three.js updated texture encoding -> colorSpace
  if (typeof newTex.colorSpace !== 'undefined') {
    newTex.colorSpace = tex.colorSpace !== undefined ? tex.colorSpace : (THREE.SRGBColorSpace || null);
  } else if (typeof newTex.encoding !== 'undefined') {
    try { newTex.encoding = tex.encoding; } catch (e) {}
  }
  newTex.minFilter = THREE.LinearMipMapLinearFilter;
  newTex.magFilter = THREE.LinearFilter;
  newTex.anisotropy = 1;
  newTex.needsUpdate = true;
  return newTex;
}

function reduceModelResolution(gltf, opts = {}) {
  const maxSize = opts.maxSize || 1024;
  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (let m of mats) {
      if (!m) continue;
      if (m.map) m.map = downscaleTexture(m.map, maxSize);
      if (m.emissiveMap) m.emissiveMap = downscaleTexture(m.emissiveMap, maxSize);
      if (m.normalMap) m.normalMap = downscaleTexture(m.normalMap, maxSize);
      if (m.roughnessMap) m.roughnessMap = downscaleTexture(m.roughnessMap, maxSize);
      if (m.metalnessMap) m.metalnessMap = downscaleTexture(m.metalnessMap, maxSize);

      if (typeof m.roughness === 'number') m.roughness = Math.min(1, (m.roughness || 0.4) + 0.25);
      if (typeof m.metalness === 'number') m.metalness = Math.max(0, (m.metalness || 0) - 0.2);

      if (m.normalScale && m.normalScale instanceof THREE.Vector2) {
        m.normalScale.multiplyScalar(0.6);
      } else if (typeof m.normalScale === 'number') {
        m.normalScale = m.normalScale * 0.6;
      }

      const texs = [m.map, m.normalMap, m.roughnessMap, m.metalnessMap, m.emissiveMap];
      for (const t of texs) if (t) { try { t.anisotropy = 1; t.needsUpdate = true; } catch (e) {} }
    }
  });
}

// Per-model downscale configuration. Set `enabled` to false to skip downscaling for a model.
const MODEL_DOWNSCALE_CONFIG = {
  candicetho: { enabled: true, maxSize: 2056 },
  prambanan: { enabled: true, maxSize: 2056 },
  borobudur: { enabled: false, maxSize: 2056 },
  gerbang: { enabled: false, maxSize: 2056 },
  candiparit: { enabled: false, maxSize: 2056 }
};

function setTempleDownscale(id, enabled, maxSize) {
  if (!MODEL_DOWNSCALE_CONFIG[id]) MODEL_DOWNSCALE_CONFIG[id] = {};
  MODEL_DOWNSCALE_CONFIG[id].enabled = !!enabled;
  if (typeof maxSize === 'number') MODEL_DOWNSCALE_CONFIG[id].maxSize = maxSize;
}

function getTempleDownscaleConfig(id) {
  return MODEL_DOWNSCALE_CONFIG[id] || { enabled: true, maxSize: 1024 };
}

// Flat material helper (optional): replace PBR materials with simpler Lambert materials
function replaceWithFlatMaterials(gltf) {
  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;
    const oldMat = child.material;
    const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
    const newMats = mats.map(m => {
      if (!m) return m;
      const color = (m.color && m.color.getHex) ? m.color.getHex() : 0x999999;
      const emissive = (m.emissive && m.emissive.getHex) ? m.emissive.getHex() : 0x000000;
      const mat = new THREE.MeshLambertMaterial({ color, emissive });
      if (m.map) mat.map = downscaleTexture(m.map, 512);
      mat.needsUpdate = true;
      return mat;
    });
    child.material = Array.isArray(oldMat) ? newMats : newMats[0];
  });
}

// Simple LOD registry for models we want to manage
const MODEL_LOD_REGISTRY = [];

function registerModelLOD(highObj, lowObj, position, threshold = 200) {
  MODEL_LOD_REGISTRY.push({ high: highObj, low: lowObj, pos: position.clone ? position.clone() : new THREE.Vector3(position.x || 0, position.y || 0, position.z || 0), threshold });
}

function updateModelLODs(cameraOrPlayerPos) {
  if (!MODEL_LOD_REGISTRY.length) return;
  const p = cameraOrPlayerPos || (player ? player.position : null);
  if (!p) return;
  for (const entry of MODEL_LOD_REGISTRY) {
    const d2 = entry.pos.distanceToSquared(p);
    if (d2 > entry.threshold * entry.threshold) {
      // far -> show low, hide high
      if (entry.high.visible) entry.high.visible = false;
      if (!entry.low.visible) entry.low.visible = true;
    } else {
      if (!entry.high.visible) entry.high.visible = true;
      if (entry.low.visible) entry.low.visible = false;
    }
  }
}

function makeLowQualityClone(model, options = {}) {
  const maxSize = options.maxSize || 256;
  const low = model.clone(true);
  low.traverse(child => {
    if (!child.isMesh) return;
    const oldMat = child.material;
    const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
    const newMats = mats.map(m => {
      if (!m) return m;
      const color = (m.color && m.color.getHex) ? m.color.getHex() : 0x9a9a9a;
      const newMat = new THREE.MeshLambertMaterial({ color });
      if (m.map) newMat.map = downscaleTexture(m.map, maxSize);
      newMat.needsUpdate = true;
      return newMat;
    });
    child.material = Array.isArray(oldMat) ? newMats : newMats[0];
  });
  return low;
}

// ===== Deterministic RNG for procedural generation =====
// Simple seeded RNG (mulberry32) so tree placement can be reproducible
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Default tree seed - change this to get a different deterministic forest
let TREE_SEED = 192736;
function setTreeSeed(seed) { TREE_SEED = seed >>> 0; }

function randomBetween(rng, min, max) {
  return min + (rng() * (max - min));
}

// ===== Glow sprite helper (radial gradient sprite for sun/moon/lensglow) =====
function makeGlowSprite(hexColor = 0xffffff, size = 256, innerAlpha = 1.0, outerAlpha = 0.0) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = new THREE.Color(hexColor);
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const inner = `rgba(${r},${g},${b},${innerAlpha})`;
  const mid = `rgba(${r},${g},${b},${Math.max(0, innerAlpha * 0.6)})`;
  const outer = `rgba(${r},${g},${b},${outerAlpha})`;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, mid);
  grad.addColorStop(1, outer);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, depthTest: false, depthWrite: false });
  const spr = new THREE.Sprite(mat);
  return spr;
}

// Night fill color helpers
const NIGHT_FILL_COOL = 0x99bbff; // bluish
const NIGHT_FILL_WARM = 0xffddcc; // warm sunset tint

/**
 * Set night fill color directly (hex number or string acceptable)
 * Example: setNightFillColor(0xffaa88) or setNightFillColor('#ffaa88')
 */
function setNightFillColor(hex) {
  try {
    if (!nightFillLight) return;
    const c = new THREE.Color(hex);
    nightFillLight.color.copy(c);
  } catch (e) { console.warn('setNightFillColor failed', e); }
}

/**
 * Set night fill "temperature" between cool and warm.
 * t: -1 (cool) ... 0 (neutral) ... +1 (warm)
 * Example: setNightFillTemperature(1) => warm; setNightFillTemperature(-1) => cool
 */
function setNightFillTemperature(t) {
  try {
    if (!nightFillLight) return;
    const tt = Math.max(-1, Math.min(1, t));
    const factor = (tt + 1) / 2; // map -1..1 to 0..1
    const cool = new THREE.Color(NIGHT_FILL_COOL);
    const warm = new THREE.Color(NIGHT_FILL_WARM);
    const out = cool.clone().lerp(warm, factor);
    nightFillLight.color.copy(out);
  } catch (e) { console.warn('setNightFillTemperature failed', e); }
}

function toggleNightFill(enabled) {
  try { if (nightFillLight) { nightFillLight.visible = !!enabled; } } catch (e) {}
}

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
// Enable MSAA where available and increase pixel ratio cap for crisper edges.
const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  antialias: false,             // Disable MSAA - we'll use FXAA postprocess instead (cheaper on many platforms)
  powerPreference: "high-performance",
  preserveDrawingBuffer: false
});
// Cap pixel ratio to avoid excessive GPU cost on very high-DPI displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
// Use sRGB outputColorSpace for more correct colors when using sRGB textures
// Note: newer three.js replaces outputEncoding with outputColorSpace
if (typeof renderer.outputColorSpace !== 'undefined') {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} else {
  // Fallback for older three.js
  try { renderer.outputEncoding = THREE.sRGBEncoding; } catch (e) {}
}
// Use physically correct light units so directional light intensities behave predictably
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Improve shadow quality: use PCF soft shadows and keep enabled
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer, less jagged shadows
renderer.shadowMap.autoUpdate = true;
console.log('[Renderer] Shadow map enabled:', renderer.shadowMap.enabled, '| Type:', renderer.shadowMap.type);

// Post-processing placeholders — initialize after `scene` and `camera` exist
let composer;
let renderPass;
let fxaaPass;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.FogExp2(0x87CEEB, 0.0012); // Increase fog density to hide far objects

// Perspective camera for 3D world - extended far plane
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
// ★ POSISI SPAWN KAMERA - Kamera di belakang karakter
camera.position.set(0, 15, 30);

// Post-processing: FXAA (cheap antialiasing) setup - initialize now that `scene` and `camera` exist
try {
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatioInit = Math.max(1, renderer.getPixelRatio());
  if (fxaaPass && fxaaPass.material && fxaaPass.material.uniforms && fxaaPass.material.uniforms['resolution']) {
    fxaaPass.material.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatioInit), 1 / (window.innerHeight * pixelRatioInit));
  }
  composer.addPass(fxaaPass);
} catch (e) {
  console.warn('Postprocessing init failed, continuing without FXAA', e);
  composer = undefined;
  fxaaPass = undefined;
}

// ===== LIGHTING =====
let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
let sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
let hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x3d5c3d, 0.5);
let moonLight = new THREE.DirectionalLight(0xaaaaff, 0);
let sunMesh, moonMesh, sunSprite, sunHalo, moonSprite, moonHalo, nightFillLight;

// Helper to rebuild the main lights. Call this if lights appear broken.
function rebuildLighting() {
  // Remove old lights if present
  try {
    [ambientLight, sunLight, hemiLight, moonLight, nightFillLight].forEach(l => {
      if (!l) return;
      try { scene.remove(l); } catch (e) {}
      if (l.target) try { scene.remove(l.target); } catch (e) {}
      if (l.dispose) try { l.dispose(); } catch (e) {}
    });
  } catch (e) {}

  // Ambient light - moderate base illumination
  ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Sun (directional) - daylight main source
  sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  // Place sun far from the scene so it appears distant (less parallax)
  sunLight.position.set(1000, 800, 1000);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 4096;  // Increased from 2048
  sunLight.shadow.mapSize.height = 4096; // Increased from 2048
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 3500;     // Increased for far objects
  // Initial orthographic camera bounds (will be updated in animate loop to follow player)
  sunLight.shadow.camera.left = -350;    // Much wider coverage
  sunLight.shadow.camera.right = 350;    // Much wider coverage
  sunLight.shadow.camera.top = 350;      // Much wider coverage
  sunLight.shadow.camera.bottom = -350;  // Much wider coverage
  sunLight.shadow.bias = -0.0005;        // Adjusted for better visibility (less acne)
  sunLight.shadow.normalBias = 0.05;     // Adjusted to reduce peter-panning
  scene.add(sunLight);
  scene.add(sunLight.target);
  
  console.log('[SunLight] Shadow settings:', {
    castShadow: sunLight.castShadow,
    mapSize: sunLight.shadow.mapSize.width + 'x' + sunLight.shadow.mapSize.height,
    camera: {
      left: sunLight.shadow.camera.left,
      right: sunLight.shadow.camera.right,
      top: sunLight.shadow.camera.top,
      bottom: sunLight.shadow.camera.bottom,
      near: sunLight.shadow.camera.near,
      far: sunLight.shadow.camera.far
    }
  });

  // Optional: Add shadow camera helper for debugging (uncomment to visualize shadow frustum)
  // const sunShadowHelper = new THREE.CameraHelper(sunLight.shadow.camera);
  // scene.add(sunShadowHelper);
  // globalThis.sunShadowHelper = sunShadowHelper; // Store for updates

  // Visible sun mesh (simple emissive sphere) - represents the sun in the sky
  try {
    if (sunMesh) { scene.remove(sunMesh); sunMesh.geometry?.dispose(); sunMesh.material?.dispose(); }
    const sunGeom = new THREE.SphereGeometry(30, 32, 32); // Increased from 12 to 30, more segments for smoother appearance
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff4d6, emissive: 0xffee88, emissiveIntensity: 1.0 }); // Added emissive for glow
    sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.renderOrder = 999;
    sunMesh.visible = true;
    sunMesh.position.copy(sunLight.position);
    scene.add(sunMesh);
  } catch (e) { console.warn('sunMesh creation failed', e); }
  // Create additive glow sprites for sun (core + halo)
  try {
    if (sunSprite) { try { scene.remove(sunSprite); sunSprite.material.map?.dispose(); sunSprite.material?.dispose(); } catch(e){} }
    if (sunHalo) { try { scene.remove(sunHalo); sunHalo.material.map?.dispose(); sunHalo.material?.dispose(); } catch(e){} }
    sunSprite = makeGlowSprite(0xffee88, 512, 1.0, 0.0); // Increased texture size from 256 to 512
    sunSprite.scale.set(80, 80, 1); // Increased from 32 to 80
    sunSprite.renderOrder = 1001;
    sunSprite.position.copy(sunLight.position);
    scene.add(sunSprite);

    sunHalo = makeGlowSprite(0xffaa66, 512, 0.7, 0.0); // Increased texture size and alpha
    sunHalo.scale.set(250, 250, 1); // Increased from 140 to 250
    sunHalo.renderOrder = 999;
    sunHalo.position.copy(sunLight.position);
    scene.add(sunHalo);
  } catch (e) { console.warn('sun sprite creation failed', e); }

  // Hemisphere light for fill
  hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x3d5c3d, 0.6);
  scene.add(hemiLight);

  // Moon directional (used at night)
  moonLight = new THREE.DirectionalLight(0xaaddff, 0.0);
  // Place moon far opposite the sun
  moonLight.position.set(-1000, 800, -1000);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 2048;  // Increased from 1024
  moonLight.shadow.mapSize.height = 2048; // Increased from 1024
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 3500;     // Increased for far objects
  moonLight.shadow.camera.left = -350;    // Much wider coverage
  moonLight.shadow.camera.right = 350;    // Much wider coverage
  moonLight.shadow.camera.top = 350;      // Much wider coverage
  moonLight.shadow.camera.bottom = -350;  // Much wider coverage
  moonLight.shadow.bias = -0.0005;        // Adjusted for better visibility
  moonLight.shadow.normalBias = 0.05;     // Adjusted to reduce peter-panning
  scene.add(moonLight);
  scene.add(moonLight.target);

  // Visible moon mesh (dim sphere) - appears at night
  try {
    if (moonMesh) { scene.remove(moonMesh); moonMesh.geometry?.dispose(); moonMesh.material?.dispose(); }
    const moonGeom = new THREE.SphereGeometry(20, 32, 32); // Increased from 8 to 20, more segments
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe8f4ff, emissive: 0xaaddff, emissiveIntensity: 0.8 }); // Added emissive
    moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonMesh.visible = false;
    moonMesh.position.copy(moonLight.position);
    scene.add(moonMesh);
  } catch (e) { console.warn('moonMesh creation failed', e); }
  // Create moon glow sprites
  try {
    if (moonSprite) { try { scene.remove(moonSprite); moonSprite.material.map?.dispose(); moonSprite.material?.dispose(); } catch(e){} }
    if (moonHalo) { try { scene.remove(moonHalo); moonHalo.material.map?.dispose(); moonHalo.material?.dispose(); } catch(e){} }
    moonSprite = makeGlowSprite(0xddeeff, 512, 1.0, 0.0); // Increased texture size and alpha from 0.9 to 1.0
    moonSprite.scale.set(50, 50, 1); // Increased from 20 to 50
    moonSprite.renderOrder = 1001;
    moonSprite.visible = false;
    moonSprite.position.copy(moonLight.position);
    scene.add(moonSprite);

    moonHalo = makeGlowSprite(0x99bbff, 512, 0.5, 0.0); // Increased texture size and alpha
    moonHalo.scale.set(150, 150, 1); // Increased from 72 to 150
    moonHalo.renderOrder = 999;
    moonHalo.visible = false;
    moonHalo.position.copy(moonLight.position);
    scene.add(moonHalo);
  } catch (e) { console.warn('moon sprite creation failed', e); }

  // Night fill ambient - bluish soft fill to keep scene readable at night
  try {
    if (nightFillLight) { try { scene.remove(nightFillLight); nightFillLight.dispose?.(); } catch (e) {} }
    nightFillLight = new THREE.AmbientLight(0x99bbff, 0.0);
    nightFillLight.visible = false;
    scene.add(nightFillLight);
  } catch (e) { console.warn('nightFillLight creation failed', e); }

  // Ensure visibility flags reflect time-of-day
  sunLight.visible = true;
  moonLight.visible = false;
}

// Create initial lighting
rebuildLighting();
// Re-sync sun/moon based on current time
try { updateSunPosition(gameState.currentTime || 12); } catch (e) { /* updateSunPosition may be declared later; if so it will run during init */ }
console.log('[Lighting] rebuilt and synced to time:', gameState.currentTime);

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
  return { collision: false, box: null };
}

// ===== TERRAIN HEIGHT FUNCTION =====
function getTerrainHeight(x, z) {
  // Simple wave pattern matching createWorld
  return Math.sin(x * 0.01) * Math.cos(z * 0.01) * 3;
}

// ===== CREATE WORLD =====
function createWorld() {
  // Ground plane (grass) - reduced segments for better performance
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50); // Reduced from 100x100 to 50x50
  const ground = new THREE.Mesh(groundGeometry, grassMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);
  
  console.log('[Ground] Created with receiveShadow:', ground.receiveShadow);

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

  // POI markers removed - no story markers in virtual tour
  // createPOIMarkers();
}

// ===== CANDI CETHO =====
function createCandiCetho(offsetX, offsetZ, opts = {}) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './candicetho/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
        // Reduce texture resolution and material sharpness for performance/visual comfort
        try {
          const base = getTempleDownscaleConfig('candicetho');
          const cfg = Object.assign({}, base, (opts.downscale !== undefined ? { enabled: !!opts.downscale } : {}), (typeof opts.maxSize === 'number' ? { maxSize: opts.maxSize } : {}));
          if (cfg.enabled) reduceModelResolution(gltf, { maxSize: cfg.maxSize || 1024 });
        } catch (e) { console.warn('reduceModelResolution failed', e); }
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN CANDI CETHO - Ubah angka untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 0; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(600, 600, 600);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Calculate initial rotation to face center (spawn point at 0,0)
      const dx = 400 - offsetX;
      const dz = 550 - offsetZ;
      const angle = Math.atan2(dx, dz);
      model.rotation.y = angle;
      
      // Store model reference
      model.userData.isBuilding = true;
      buildingModels.push(model);
      // Create a low-quality clone for LOD (flat material + smaller textures)
      try {
        const lowModel = makeLowQualityClone(model, { maxSize: 256 });
        lowModel.position.copy(model.position);
        lowModel.rotation.copy(model.rotation);
        lowModel.scale.copy(model.scale);
        lowModel.visible = false;
        scene.add(lowModel);
        // Register LOD (threshold ~500 units)
        registerModelLOD(model, lowModel, model.position, 500);
      } catch (e) { console.warn('Failed to create low-quality clone for Candi Cetho', e); }

      // Add high-quality model to scene
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
  
  // Add collision box around the model with height
  addCollisionBox(offsetX, offsetZ, 64, 64, 50); // Height = 50 units70); // Height = 70 units
}

// ===== PRAMBANAN TEMPLE =====
function createPrambananTemple(offsetX, offsetZ, opts = {}) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './prambanan/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
        try {
          const base = getTempleDownscaleConfig('prambanan');
          const cfg = Object.assign({}, base, (opts.downscale !== undefined ? { enabled: !!opts.downscale } : {}), (typeof opts.maxSize === 'number' ? { maxSize: opts.maxSize } : {}));
          if (cfg.enabled) reduceModelResolution(gltf, { maxSize: cfg.maxSize || 1024 });
        } catch (e) { console.warn('reduceModelResolution failed', e); }
      
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
      
      // Calculate initial rotation to face center (spawn point at 0,0)
      const dx = 0 - offsetX;
      const dz = 0 - offsetZ;
      const angle = Math.atan2(dx, dz);
      model.rotation.y = angle;
      
      // Store model reference
      model.userData.isBuilding = true;
      buildingModels.push(model);
      // Create low-quality clone for LOD
      try {
        const lowModel = makeLowQualityClone(model, { maxSize: 256 });
        lowModel.position.copy(model.position);
        lowModel.rotation.copy(model.rotation);
        lowModel.scale.copy(model.scale);
        lowModel.visible = false;
        scene.add(lowModel);
        registerModelLOD(model, lowModel, model.position, 500);
      } catch (e) { console.warn('Failed to create low-quality clone for Prambanan', e); }

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
  
  // Add collision box around the model with height
  addCollisionBox(offsetX, offsetZ, 80, 80, 150); // Height = 150 units
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
function createGerbangTrowulan(offsetX, offsetZ, opts = {}) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './gerbang/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      try {
        const base = getTempleDownscaleConfig('gerbang');
        const cfg = Object.assign({}, base, (opts.downscale !== undefined ? { enabled: !!opts.downscale } : {}), (typeof opts.maxSize === 'number' ? { maxSize: opts.maxSize } : {}));
        if (cfg.enabled) reduceModelResolution(gltf, { maxSize: cfg.maxSize || 1024 });
      } catch (e) { console.warn('reduceModelResolution failed', e); }
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN GERBANG TROWULAN - Ubah angka untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = 0; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(100, 100, 100);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Calculate initial rotation to face center (spawn point at 0,0)
      const dx = 350 - offsetX;
      const dz = 400 - offsetZ;
      const angle = Math.atan2(dx, dz);
      model.rotation.y = angle;
      
      // Store model reference
      model.userData.isBuilding = true;
      buildingModels.push(model);
      // Create low-quality clone for LOD
      try {
        const lowModel = makeLowQualityClone(model, { maxSize: 256 });
        lowModel.position.copy(model.position);
        lowModel.rotation.copy(model.rotation);
        lowModel.scale.copy(model.scale);
        lowModel.visible = false;
        scene.add(lowModel);
        registerModelLOD(model, lowModel, model.position, 500);
      } catch (e) { console.warn('Failed to create low-quality clone for Gerbang Trowulan', e); }

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
  
  // Add collision box around the model with height
  addCollisionBox(offsetX, offsetZ, 44, 34, 40); // Height = 40 units
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
function createBorobudurTemple(offsetX, offsetZ, opts = {}) {
  // Load 3D GLTF model instead of procedural geometry
  const loader = new GLTFLoader();
  
  loader.load(
    './borobudur/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      try {
        const base = getTempleDownscaleConfig('borobudur');
        const cfg = Object.assign({}, base, (opts.downscale !== undefined ? { enabled: !!opts.downscale } : {}), (typeof opts.maxSize === 'number' ? { maxSize: opts.maxSize } : {}));
        if (cfg.enabled) reduceModelResolution(gltf, { maxSize: cfg.maxSize || 1024 });
      } catch (e) { console.warn('reduceModelResolution failed', e); }
      
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
      
      // Calculate initial rotation to face center (spawn point at 0,0)
      const dx = 0 - offsetX;
      const dz = 0 - offsetZ;
      const angle = Math.atan2(dx, dz);
      model.rotation.y = angle;
      
      // Store model reference
      model.userData.isBuilding = true;
      buildingModels.push(model);
      // Create low-quality clone for LOD
      try {
        const lowModel = makeLowQualityClone(model, { maxSize: 256 });
        lowModel.position.copy(model.position);
        lowModel.rotation.copy(model.rotation);
        lowModel.scale.copy(model.scale);
        lowModel.visible = false;
        scene.add(lowModel);
        registerModelLOD(model, lowModel, model.position, 500);
      } catch (e) { console.warn('Failed to create low-quality clone for Borobudur', e); }

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
  
  // Add collision box around the model with height
  addCollisionBox(offsetX, offsetZ, 120, 120, 100); // Height = 100 units
}

// ===== CANDI PARIT (3D GLTF MODEL) =====
function loadCandiParit(offsetX, offsetZ, opts = {}) {
  const loader = new GLTFLoader();
  
  loader.load(
    './candiparit/scene.gltf',
    function (gltf) {
      const model = gltf.scene;
      try {
        const base = getTempleDownscaleConfig('candiparit');
        const cfg = Object.assign({}, base, (opts.downscale !== undefined ? { enabled: !!opts.downscale } : {}), (typeof opts.maxSize === 'number' ? { maxSize: opts.maxSize } : {}));
        if (cfg.enabled) reduceModelResolution(gltf, { maxSize: cfg.maxSize || 1024 });
      } catch (e) { console.warn('reduceModelResolution failed', e); }
      
      // Get terrain height at this position
      const terrainY = getTerrainHeight(offsetX, offsetZ);
      
      // ★ POSISI KETINGGIAN CANDI - Ubah angka -6 untuk menyesuaikan ketinggian
      // Angka negatif = lebih ke bawah, angka positif = lebih ke atas
      const heightOffset = -30; // Sesuaikan nilai ini jika masih melayang
      
      // Position the model on the terrain
      model.position.set(offsetX, terrainY + heightOffset, offsetZ);
      
      // Scale the model (adjust as needed based on visual appearance)
      model.scale.set(100, 100, 100);
      
      // Enable shadows for all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Calculate initial rotation to face center (spawn point at 0,0)
      const dx = 0 - offsetX;
      const dz = 0 - offsetZ;
      const angle = Math.atan2(dx, dz);
      model.rotation.y = angle;
      
      // Store model reference
      model.userData.isBuilding = true;
      buildingModels.push(model);
      // Create low-quality clone for LOD
      try {
        const lowModel = makeLowQualityClone(model, { maxSize: 256 });
        lowModel.position.copy(model.position);
        lowModel.rotation.copy(model.rotation);
        lowModel.scale.copy(model.scale);
        lowModel.visible = false;
        scene.add(lowModel);
        registerModelLOD(model, lowModel, model.position, 500);
      } catch (e) { console.warn('Failed to create low-quality clone for Candi Parit', e); }

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
  // Create paths from center (spawn point at 0,0) to each building
  const centerSpawn = { x: 0, z: 0 };
  
  const pathConnections = [
    // From center spawn to each landmark
    { start: centerSpawn, end: { x: 0, z: 300 } },        // To Gerbang Trowulan (North)
    { start: centerSpawn, end: { x: 300, z: 0 } },        // To Candi Cetho (East)
    { start: centerSpawn, end: { x: -300, z: 0 } },       // To Candi Parit (West)
    { start: centerSpawn, end: { x: -200, z: -300 } },    // To Prambanan (Southwest)
    { start: centerSpawn, end: { x: 200, z: -300 } },     // To Borobudur (Southeast)
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
  // Use deterministic RNG for trees so world is reproducible
  const rng = mulberry32(TREE_SEED);
  
  // Updated landmark positions based on actual building locations
  const exclusionZones = [
    { x: 0, z: 300, radius: 70 },       // Gerbang Trowulan (North)
    { x: 300, z: 0, radius: 70 },       // Candi Cetho (East)
    { x: -300, z: 0, radius: 70 },      // Candi Parit (West)
    { x: -200, z: -300, radius: 90 },   // Prambanan (Southwest)
    { x: 200, z: -300, radius: 90 },    // Borobudur (Southeast)
  ];

  // Generate random tree positions around buildings and roads
  for (let i = 0; i < 150; i++) { // Increased tree count
    const x = (rng() - 0.5) * 900;
    const z = (rng() - 0.5) * 900;
    
    // Check if position is in any exclusion zone (not too close to buildings)
    let inExclusionZone = false;
    for (const zone of exclusionZones) {
      const dist = Math.sqrt((x - zone.x) ** 2 + (z - zone.z) ** 2);
      if (dist < zone.radius) {
        inExclusionZone = true;
        break;
      }
    }
    
    // Also avoid placing trees directly on roads (within 3 units of road center)
    const roadPaths = [
      { start: { x: 0, z: 0 }, end: { x: 0, z: 300 } },
      { start: { x: 0, z: 0 }, end: { x: 300, z: 0 } },
      { start: { x: 0, z: 0 }, end: { x: -300, z: 0 } },
      { start: { x: 0, z: 0 }, end: { x: -200, z: -300 } },
      { start: { x: 0, z: 0 }, end: { x: 200, z: -300 } },
    ];
    
    let onRoad = false;
    for (const road of roadPaths) {
      const dx = road.end.x - road.start.x;
      const dz = road.end.z - road.start.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      
      // Check distance to road line
      for (let t = 0; t <= 1; t += 0.05) {
        const roadX = road.start.x + dx * t;
        const roadZ = road.start.z + dz * t;
        const distToRoad = Math.sqrt((x - roadX) ** 2 + (z - roadZ) ** 2);
        if (distToRoad < 3) {
          onRoad = true;
          break;
        }
      }
      if (onRoad) break;
    }
    
    if (!inExclusionZone && !onRoad) {
      treePositions.push({ x, z });
    }
  }

  treePositions.forEach(pos => {
    const h = getTerrainHeight(pos.x, pos.z);
    const tree = createTree(rng);
    tree.position.set(pos.x, h, pos.z);
    scene.add(tree);
  });
  
  console.log('[Trees] Created', treePositions.length, 'trees with shadow support');
}

function createTree(rng) {
  const group = new THREE.Group();

  // Trunk - slightly curved for natural look (small random offsets)
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3((rng() - 0.5) * 0.4, 2, (rng() - 0.5) * 0.4),
    new THREE.Vector3((rng() - 0.5) * 0.3, 4, (rng() - 0.5) * 0.3)
  ]);
  const trunkGeom = new THREE.TubeGeometry(trunkCurve, 4, 0.4, 8, false);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 1 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.castShadow = true;
  trunk.receiveShadow = true; // Also receive shadows
  group.add(trunk);

  // Foliage - Tropical style (palm-ish or banyan-ish)
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.8 });
  
  // Main canopy
  const canopyGeom = new THREE.DodecahedronGeometry(2.5);
  const canopy = new THREE.Mesh(canopyGeom, foliageMat);
  canopy.position.set(0, 4.5, 0);
  canopy.scale.y = 0.8;
  canopy.castShadow = true;
  canopy.receiveShadow = true; // Also receive shadows
  group.add(canopy);

  // Smaller clumps (deterministic)
  for (let i = 0; i < 5; i++) {
    const size = 1 + rng();
    const clump = new THREE.Mesh(new THREE.DodecahedronGeometry(size), foliageMat);
    clump.position.set(
      (rng() - 0.5) * 3,
      4 + rng() * 2,
      (rng() - 0.5) * 3
    );
    clump.castShadow = true;
    clump.receiveShadow = true; // Also receive shadows
    group.add(clump);
  }

  // Random scale variation (deterministic)
  const scale = 0.8 + rng() * 0.6;
  group.scale.set(scale, scale, scale);

  return group;
}

function createRocks() {
  const rockGeom = new THREE.DodecahedronGeometry(1);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.9 });

  // Reduced from 100 to 30 rocks for better performance
  for (let i = 0; i < 30; i++) {
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
  // Paths from center (0,0) to each building - place lamps along the roads
  // Only generate 6 pairs per road; distribute evenly and avoid exact endpoints
  const pathPoints = [
    // To Gerbang Trowulan (North)
    { start: { x: 0, z: 0 }, end: { x: 0, z: 300 }, count: 2 },
    // To Candi Cetho (East)
    { start: { x: 0, z: 0 }, end: { x: 300, z: 0 }, count: 2 },
    // To Candi Parit (West)
    { start: { x: 0, z: 0 }, end: { x: -300, z: 0 }, count: 2 },
    // To Prambanan (Southwest)
    { start: { x: 0, z: 0 }, end: { x: -200, z: -300 }, count: 2 },
    // To Borobudur (Southeast)
    { start: { x: 0, z: 0 }, end: { x: 200, z: -300 }, count: 2 },
  ];

  pathPoints.forEach(path => {
    // Use count+1 to space lamps evenly between center and temple (excludes exact endpoints)
    for (let i = 1; i <= path.count; i++) {
      const t = i / (path.count + 1);
      const x = path.start.x + (path.end.x - path.start.x) * t;
      const z = path.start.z + (path.end.z - path.start.z) * t;
      
      const h = getTerrainHeight(x, z);
      
      // Calculate perpendicular offset for road sides
      const dx = path.end.x - path.start.x;
      const dz = path.end.z - path.start.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const perpX = -dz / length; // Perpendicular vector
      const perpZ = dx / length;
      
      const offset = 4; // 4 units from road center
      
      // Place lamps on both sides of the road
      createLamp(x + perpX * offset, z + perpZ * offset, h);
      createLamp(x - perpX * offset, z - perpZ * offset, h);
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
  post.receiveShadow = true; // Also receive shadows
  group.add(post);

  // Lantern holder
  const holderGeom = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const holder = new THREE.Mesh(holderGeom, postMat);
  holder.position.y = 2.8;
  holder.castShadow = true;
  holder.receiveShadow = true;
  group.add(holder);

  // Lantern glass/paper
  const lanternGeom = new THREE.BoxGeometry(0.4, 0.6, 0.4);
  const lanternMat = new THREE.MeshStandardMaterial({ 
    color: 0xffaa00, 
    emissive: 0xff5500,
    emissiveIntensity: 0.05,
    transparent: true,
    opacity: 0.9
  });
  const lantern = new THREE.Mesh(lanternGeom, lanternMat);
  lantern.position.y = 2.5;
  lantern.castShadow = true;
  lantern.receiveShadow = true;
  group.add(lantern);

  // NOTE: Baked emissive lamp only (remove dynamic PointLight to reduce GPU cost)
  lamps.push({ light: null, mesh: lantern, group });

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
    pillar.castShadow = true;
    pillar.receiveShadow = true;
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
    orb.castShadow = true;
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

    // Check collision with height - can stand on top of buildings
    const collisionResult = checkCollision(this.position.x, this.position.z, playerRadius);
    let groundHeight = getTerrainHeight(this.position.x, this.position.z);
    
    if (collisionResult.collision) {
      // Player is inside a collision box horizontally
      const box = collisionResult.box;
      
      // If player is above the box, can stand on it
      if (this.position.y >= box.height - 1) {
        // Standing on top of the building/structure
        groundHeight = Math.max(groundHeight, box.height);
      }
      // If player is below or inside the box height, it's a wall - already handled by horizontal collision
    }
    
    // Ground check with terrain height or building top
    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
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
  
  // Calculate sun azimuth and polar angle so the sun will be overhead at noon.
  const sunAzimuth = ((timeValue - 6) / 24) * Math.PI * 2;

  // Map time to a polar angle theta: noon -> 0 (overhead), 6/18 -> PI/2 (horizon), midnight -> PI (underfoot)
  const xNorm = (timeValue - 12) / 12; // -1..+1 centered at noon
  const theta = (Math.PI / 2) * (1 - Math.cos(xNorm * Math.PI));

  const SUN_ORBIT_RADIUS = 2000; // distance from player for distant sun

  // Use `globalThis.player` to avoid TDZ errors if `updateSunPosition` is called before `player` is constructed
  const originPos = (globalThis && globalThis.player && globalThis.player.position) ? globalThis.player.position : null;
  const originX = originPos ? originPos.x : 0;
  const originZ = originPos ? originPos.z : 0;
  const originY = originPos ? originPos.y : 0;

  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const sunX = originX + SUN_ORBIT_RADIUS * sinTheta * Math.cos(sunAzimuth);
  const sunY = originY + SUN_ORBIT_RADIUS * cosTheta;
  const sunZ = originZ + SUN_ORBIT_RADIUS * sinTheta * Math.sin(sunAzimuth);

  sunLight.position.set(sunX, sunY, sunZ);
  // Position the moon opposite the sun in the sky
  if (moonLight) {
    try {
      const moonX = originX - SUN_ORBIT_RADIUS * sinTheta * Math.cos(sunAzimuth);
      const moonY = originY - SUN_ORBIT_RADIUS * cosTheta;
      const moonZ = originZ - SUN_ORBIT_RADIUS * sinTheta * Math.sin(sunAzimuth);
      moonLight.position.set(moonX, moonY, moonZ);
      if (moonMesh) moonMesh.position.set(moonX, moonY, moonZ);
    } catch (e) {}
  }
  // Point the sun toward the player or world center so lighting direction is correct
  try {
    // Use `globalThis.player` to avoid referencing module-scoped `player` before it's initialized
    const targetPos = (globalThis && globalThis.player && globalThis.player.position) ? globalThis.player.position : new THREE.Vector3(0, 0, 0);
    sunLight.target.position.copy(targetPos);
    sunLight.target.updateMatrixWorld();
    
    // Update moon light target as well
    if (moonLight && moonLight.target) {
      moonLight.target.position.copy(targetPos);
      moonLight.target.updateMatrixWorld();
    }
  } catch (e) { /* non-fatal */ }
  // Update visible sun/moon mesh positions
  try { if (sunMesh) sunMesh.position.copy(sunLight.position); } catch (e) {}
  try {
    if (sunMesh) sunMesh.position.copy(sunLight.position);
    if (sunSprite) { sunSprite.position.copy(sunLight.position); sunSprite.visible = !!sunLight.visible && !!sunMesh.visible; }
    if (sunHalo) { sunHalo.position.copy(sunLight.position); sunHalo.visible = !!sunLight.visible && !!sunMesh.visible; }
  } catch (e) {}
  try {
    if (moonMesh) moonMesh.position.copy(moonLight.position);
    if (moonSprite) { moonSprite.position.copy(moonLight.position); moonSprite.visible = !!moonLight.visible && !!moonMesh.visible; }
    if (moonHalo) { moonHalo.position.copy(moonLight.position); moonHalo.visible = !!moonLight.visible && !!moonMesh.visible; }
  } catch (e) {}
  
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
      // Midnight blues with moonlight
      scene.background = new THREE.Color(0x050520);
      scene.fog.color.setHex(0x050520);
      scene.fog.density = 0.0018;
      sunLight.intensity = 0;
      if (sunMesh) sunMesh.visible = false;
      sunLight.visible = false;
      // Stronger moon light for better night visibility
      moonLight.intensity = 1.8;
      moonLight.visible = true;
      if (moonMesh) moonMesh.visible = true;
      moonLight.color.setHex(0xaaddff);
      // Increase ambient/hemisphere to avoid overly dark shadows at night
      ambientLight.intensity = 0.9;
      hemiLight.intensity = 0.7;
      hemiLight.groundColor.setHex(0x111122);
      // Slight exposure boost at night for readability
      try { renderer.toneMappingExposure = 1.6; } catch (e) {}
      // Night fill ambient for softer overall illumination
      try { if (nightFillLight) { nightFillLight.intensity = 1.0; nightFillLight.visible = true; } } catch (e) {}
      // Turn on lamps (brighter, sparse)
      lamps.forEach(lamp => {
        if (lamp.light) lamp.light.intensity = 4.0;
        if (lamp.mesh && lamp.mesh.material) lamp.mesh.material.emissiveIntensity = 2.5;
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
      sunLight.intensity = 0.4 + (t * 1.1);
      sunLight.color.setHex(0xffaa66);
      if (sunMesh) sunMesh.visible = true;
      sunLight.visible = true;
      moonLight.intensity = 0.3 * (1 - t); // Fade out moon
      if (moonLight.intensity <= 0.001) { moonLight.visible = false; if (moonMesh) moonMesh.visible = false; }
      ambientLight.intensity = 0.3 + (t * 0.3);
      hemiLight.intensity = 0.3 + (t * 0.3);
      try { if (nightFillLight) { nightFillLight.intensity = 0; nightFillLight.visible = false; } } catch (e) {}
      hemiLight.groundColor.setHex(0x332211);
      // Gradually turn off lamps
      lamps.forEach(lamp => {
        if (lamp.light) lamp.light.intensity = 3.5 * (1 - t);
        if (lamp.mesh && lamp.mesh.material) lamp.mesh.material.emissiveIntensity = 0.2 + (1.8 * (1 - t));
      });
      break;
      
    case 'day':
        // Bright daylight (increased ambient/sun for clearer noon)
        scene.background = new THREE.Color(0x87CEEB);
        scene.fog.color.setHex(0x87CEEB);
        scene.fog.density = 0.0008;
        // Increase sun intensity for stronger directional light
        sunLight.intensity = 2.6;
        sunLight.color.setHex(0xfff5e6);
        if (sunMesh) sunMesh.visible = true;
        sunLight.visible = true;
        // Moon off during day
        moonLight.intensity = 0;
        moonLight.visible = false;
        if (moonMesh) moonMesh.visible = false;
        // Raise ambient and hemisphere to make scene brighter at noon
        ambientLight.intensity = 1.2; // brighter ambient overall
        hemiLight.intensity = 0.9;
        hemiLight.groundColor.setHex(0x3d5c3d);
        // Slightly boost renderer exposure for daytime clarity (subtle)
        try { renderer.toneMappingExposure = 1.2; } catch (e) {}
        // Turn off lamps (they remain baked emissive but dimmed)
        lamps.forEach(lamp => {
          if (lamp.light) lamp.light.intensity = 0;
          if (lamp.mesh && lamp.mesh.material) lamp.mesh.material.emissiveIntensity = 0.15;
        });
        try { if (nightFillLight) { nightFillLight.intensity = 0; nightFillLight.visible = false; } } catch (e) {}
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
      sunLight.intensity = 1.4 - (t * 0.6);
      sunLight.color.setHex(0xff8844);
      sunLight.visible = true;
      moonLight.intensity = 0.3 * t; // Fade in moon
      if (moonLight.intensity > 0.001) moonLight.visible = true;
      ambientLight.intensity = 0.4 - (t * 0.2);
      hemiLight.intensity = 0.5 - (t * 0.3);
      hemiLight.groundColor.setHex(0x332211);
      try { if (nightFillLight) { nightFillLight.intensity = 0; nightFillLight.visible = false; } } catch (e) {}
      // Gradually turn on lamps
      lamps.forEach(lamp => {
        if (lamp.light) lamp.light.intensity = 3.5 * t;
        if (lamp.mesh && lamp.mesh.material) lamp.mesh.material.emissiveIntensity = 0.2 + (1.8 * t);
      });
      break;
      
    case 'evening':
      // Early night
      scene.background = new THREE.Color(0x0a1020);
      scene.fog.color.setHex(0x0a1020);
      scene.fog.density = 0.0018;
      sunLight.intensity = 0;
      if (sunMesh) sunMesh.visible = false;
      sunLight.visible = false;
      // Brighter moon for early night
      moonLight.intensity = 0.75;
      moonLight.visible = true;
      if (moonMesh) moonMesh.visible = true;
      moonLight.color.setHex(0xaaddff);
      ambientLight.intensity = 0.45;
      hemiLight.intensity = 0.35;
      hemiLight.groundColor.setHex(0x111122);
      try { renderer.toneMappingExposure = 1.4; } catch (e) {}
      try { if (nightFillLight) { nightFillLight.intensity = 0.6; nightFillLight.visible = true; } } catch (e) {}
      // Lamps fully on and slightly brighter emissive
      lamps.forEach(lamp => {
        if (lamp.light) lamp.light.intensity = 4.0;
        if (lamp.mesh && lamp.mesh.material) lamp.mesh.material.emissiveIntensity = 2.5;
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
  
  // Debug: Count objects with shadow properties
  let castShadowCount = 0;
  let receiveShadowCount = 0;
  scene.traverse((obj) => {
    if (obj.isMesh) {
      if (obj.castShadow) castShadowCount++;
      if (obj.receiveShadow) receiveShadowCount++;
    }
  });
  console.log('[Shadow Debug] Objects casting shadows:', castShadowCount);
  console.log('[Shadow Debug] Objects receiving shadows:', receiveShadowCount);
  console.log('[Shadow Debug] Renderer shadowMap enabled:', renderer.shadowMap.enabled);
  console.log('[Shadow Debug] SunLight castShadow:', sunLight.castShadow);
  console.log('[Shadow Debug] SunLight intensity:', sunLight.intensity);
  
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
  
  // Save landmark key to determine map automatically
  localStorage.setItem('landmarkKey', landmark.key);
  
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
// Expose player on globalThis so other initialization code can safely read it
globalThis.player = player;
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
    
    // Optimize animations - only update visible objects
    const playerPos = player.position;
    const animationDistance = 100; // Only animate objects within 100 units

    // Update simple LOD registry for models
    updateModelLODs(playerPos);
    
    // Animate POI orbs (simple sine wave, very cheap)
    scene.traverse(obj => {
      if (obj.userData && obj.userData.isOrb) {
        const dx = playerPos.x - obj.position.x;
        const dz = playerPos.z - obj.position.z;
        const distSq = dx * dx + dz * dz; // Use squared distance to avoid sqrt
        
        if (distSq < animationDistance * animationDistance) {
          obj.position.y = 2.5 + Math.sin(clock.elapsedTime * 2) * 0.3;
        }
      }
      // Animate smoke from volcano (only if close)
      else if (obj.userData && obj.userData.isSmoke) {
        const dx = playerPos.x - obj.position.x;
        const dz = playerPos.z - obj.position.z;
        const distSq = dx * dx + dz * dz;
        
        if (distSq < animationDistance * animationDistance) {
          obj.position.y = obj.userData.baseY + Math.sin(clock.elapsedTime * 0.5 + obj.position.x) * 2;
          obj.material.opacity = 0.3 + Math.sin(clock.elapsedTime + obj.position.z) * 0.15;
        }
      }
      // Animate boats on lake (only if close)
      else if (obj.userData && obj.userData.isBoat) {
        const dx = playerPos.x - obj.position.x;
        const dz = playerPos.z - obj.position.z;
        const distSq = dx * dx + dz * dz;
        
        if (distSq < animationDistance * animationDistance) {
          const newAngle = obj.userData.angle + clock.elapsedTime * 0.02;
          obj.position.x = Math.cos(newAngle) * obj.userData.radius;
          obj.position.z = Math.sin(newAngle) * obj.userData.radius;
          obj.position.y = 0.3 + Math.sin(clock.elapsedTime * 2) * 0.1;
          obj.rotation.y = newAngle + Math.PI / 2;
        }
      }
    });
  }
  
  // Update dynamic shadow frusta if needed (keep focused on playable area)
  try {
    // If a player exists, center the sun shadow frustum around the player X/Z
    if (typeof player !== 'undefined' && player && player.position) {
      const radius = 350; // Increased from 180 for wider shadow coverage
      
      // Center shadow frustum on player position for better shadow quality
      const px = player.position.x;
      const pz = player.position.z;
      
      sunLight.shadow.camera.left = px - radius;
      sunLight.shadow.camera.right = px + radius;
      sunLight.shadow.camera.top = pz + radius;
      sunLight.shadow.camera.bottom = pz - radius;
      sunLight.shadow.camera.updateProjectionMatrix();

      moonLight.shadow.camera.left = px - radius;
      moonLight.shadow.camera.right = px + radius;
      moonLight.shadow.camera.top = pz + radius;
      moonLight.shadow.camera.bottom = pz - radius;
      moonLight.shadow.camera.updateProjectionMatrix();
      
      // Update shadow camera helper if exists (for debugging)
      if (globalThis.sunShadowHelper) {
        globalThis.sunShadowHelper.update();
      }
    }
  } catch (e) {
    // non-fatal
  }

  // Render with postprocessing (FXAA)
  if (typeof composer !== 'undefined') {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

// ===== WINDOW RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Keep composer in sync with renderer size and update FXAA resolution
  if (typeof composer !== 'undefined') {
    composer.setSize(window.innerWidth, window.innerHeight);
    const pr = Math.max(1, renderer.getPixelRatio());
    if (typeof fxaaPass !== 'undefined' && fxaaPass.material && fxaaPass.material.uniforms && fxaaPass.material.uniforms['resolution']) {
      fxaaPass.material.uniforms['resolution'].value.set(1 / (window.innerWidth * pr), 1 / (window.innerHeight * pr));
    }
  }
});

// Start animation
animate();