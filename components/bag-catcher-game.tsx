"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  House, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Star, 
  BookOpen, 
  Trophy, 
  Swords, 
  User, 
  Users 
} from 'lucide-react';
import './bag-catcher-game.css';

// ========================================================
// 1. DATA & ITEM CATALOG
// ========================================================
export interface GameItemDef {
  id: string;
  name: string;
  emoji?: string;
  image?: string;
  category: 'siaga' | 'hazard' | 'non_siaga';
  points: number;
  reason: string;
  tip: string;
}

export const GAME_ITEMS_CATALOG: GameItemDef[] = [
  // --- Benda Siaga Bencana (BENAR - Dari Aset Gambar Unggahan) ---
  {
    id: 'air_minum',
    name: 'Air Minum',
    image: '/Air Minum.png',
    category: 'siaga',
    points: 15,
    reason: 'Kebutuhan paling vital untuk mencegah dehidrasi saat evakuasi darurat.',
    tip: 'Siapkan botol air bersih minimal 1-2 liter per orang.'
  },
  {
    id: 'baterai_cadangan',
    name: 'Baterai Cadangan',
    image: '/Baterai Cadangan.png',
    category: 'siaga',
    points: 15,
    reason: 'Daya cadangan untuk peralatan penting seperti senter dan radio.',
    tip: 'Simpan baterai dalam wadah kering dan tersegel.'
  },
  {
    id: 'biskuit',
    name: 'Biskuit',
    image: '/Biskuit.png',
    category: 'siaga',
    points: 15,
    reason: 'Asupan kalori dan energi darurat yang praktis tanpa perlu dimasak.',
    tip: 'Biskuit padat kalori tahan berbulan-bulan di dalam tas.'
  },
  {
    id: 'dokumen_penting',
    name: 'Dokumen Penting',
    image: '/Dokumen Penting.png',
    category: 'siaga',
    points: 25,
    reason: 'Berkas identitas keluarga (KK, akta, ijazah) dalam plastik kedap air.',
    tip: 'Lindungi berkas penting dari basah dan debu reruntuhan.'
  },
  {
    id: 'hand_sanitizer',
    name: 'Hand Sanitizer',
    image: '/Hand Sanitizer.png',
    category: 'siaga',
    points: 10,
    reason: 'Menjaga kebersihan tangan dari kuman saat pasokan air bersih terbatas.',
    tip: 'Gunakan cairan pembersih tangan beralkohol minimal 60%.'
  },
  {
    id: 'jas_hujan',
    name: 'Jas Hujan',
    image: '/Jas Hujan.png',
    category: 'siaga',
    points: 15,
    reason: 'Melindungi tubuh dari hujan dan terpaan angin di tempat pengungsian.',
    tip: 'Jas hujan ponco yang ringan dan mudah dilipat.'
  },
  {
    id: 'korek_api',
    name: 'Korek Api',
    image: '/Korek Api.png',
    category: 'siaga',
    points: 15,
    reason: 'Menyalakan api darurat untuk kebutuhan penerangan dan penghangat.',
    tip: 'Simpan korek api dalam kantong plastik klip anti-air.'
  },
  {
    id: 'kotak_p3k',
    name: 'Kotak P3K',
    image: '/Kotak P3K.png',
    category: 'siaga',
    points: 20,
    reason: 'Sangat krusial untuk pertolongan pertama pada luka dan cedera fisik.',
    tip: 'Isi perban steril, plester, cairan antiseptik, dan gunting kecil.'
  },
  {
    id: 'makanan_kaleng',
    name: 'Makanan Kaleng',
    image: '/Makanan Kaleng.png',
    category: 'siaga',
    points: 15,
    reason: 'Makanan siap santap tahan lama untuk bertahan hidup 72 jam pertama.',
    tip: 'Pilih kemasan kaleng yang memiliki pembuka tarik praktis.'
  },
  {
    id: 'masker_medis',
    name: 'Masker Medis',
    image: '/Masker Medis.png',
    category: 'siaga',
    points: 10,
    reason: 'Menyaring debu runtuhan bangunan dan partikel asap berbahaya.',
    tip: 'Pakai masker saat evakuasi agar tidak terkena infeksi pernapasan.'
  },
  {
    id: 'obat_pribadi',
    name: 'Obat Pribadi',
    image: '/Obat Pribadi.png',
    category: 'siaga',
    points: 20,
    reason: 'Obat rutin untuk anggota keluarga yang memiliki riwayat sakit tertentu.',
    tip: 'Sertakan catatan resep dan dosis pemakaian dari dokter.'
  },
  {
    id: 'pakaian_ganti',
    name: 'Pakaian Ganti',
    image: '/Pakaian Ganti.png',
    category: 'siaga',
    points: 15,
    reason: 'Pakaian ganti bersih dan hangat untuk beberapa hari di pengungsian.',
    tip: 'Bungkus pakaian dalam kantong plastik kedap air.'
  },
  {
    id: 'peluit_darurat',
    name: 'Peluit Darurat',
    image: '/Peluit Darurat.png',
    category: 'siaga',
    points: 20,
    reason: 'Alat efektif memanggil regu penyelamat SAR tanpa membuang tenaga.',
    tip: 'Tiup 3 kali berturut-turut sebagai kode internasional SOS.'
  },
  {
    id: 'pisau_lipat',
    name: 'Pisau Lipat',
    image: '/Pisau Lipat.png',
    category: 'siaga',
    points: 15,
    reason: 'Peralatan serbaguna untuk memotong tali, membuka kemasan, atau perbaikan darurat.',
    tip: 'Gunakan pisau lipat saku multifungsi dengan sistem pengunci aman.'
  },
  {
    id: 'powerbank',
    name: 'Powerbank',
    image: '/Powerbank.png',
    category: 'siaga',
    points: 15,
    reason: 'Menjaga baterai ponsel tetap terisi agar dapat menghubungi keluarga.',
    tip: 'Pastikan baterai selalu terisi penuh saat disimpan di tas.'
  },
  {
    id: 'radio',
    name: 'Radio Darurat',
    image: '/Radio.png',
    category: 'siaga',
    points: 20,
    reason: 'Memantau informasi resmi BMKG dan instruksi evakuasi darurat.',
    tip: 'Gunakan radio baterai atau putar tangan (hand-crank).'
  },
  {
    id: 'sikat_gigi',
    name: 'Sikat Gigi',
    image: '/SIkat Gigi.png',
    category: 'siaga',
    points: 10,
    reason: 'Menjaga sanitasi dan kebersihan mulut selama di pengungsian.',
    tip: 'Perlengkapan sanitasi dasar untuk mencegah infeksi.'
  },
  {
    id: 'sabun_mandi',
    name: 'Sabun Mandi',
    image: '/Sabun Mandi.png',
    category: 'siaga',
    points: 10,
    reason: 'Menjaga kebersihan tubuh dan mencegah penyakit kulit di posko bencana.',
    tip: 'Simpan sabun dalam kotak plastik tertutup rapat.'
  },
  {
    id: 'senter_led',
    name: 'Senter LED',
    image: '/Senter LED.png',
    category: 'siaga',
    points: 15,
    reason: 'Penerangan vital saat pemadaman listrik pasca gempa bumi.',
    tip: 'Senter LED hemat daya dengan jangkauan sinar yang terang.'
  },
  {
    id: 'uang_tunai',
    name: 'Uang Tunai',
    image: '/Uang Tunai.png',
    category: 'siaga',
    points: 20,
    reason: 'Alat transaksi darurat ketika mesin ATM dan listrik padam.',
    tip: 'Siapkan pecahan uang kertas kecil secukupnya.'
  },

  // --- Benda Bahaya Reruntuhan / Benda Tajam & Berat (KURANGI NYAWA) ---
  {
    id: 'botol_kaca',
    name: 'Botol Kaca',
    image: '/Botol Kaca.png',
    category: 'hazard',
    points: -1, // Kurangi 1 Heart!
    reason: 'BAHAYA! Botol kaca mudah pecah menjadi pecahan tajam yang melukai dan merusak tas!',
    tip: 'Gunakan botol berbahan plastik tebal tahan benturan atau aluminium.'
  },
  {
    id: 'setrika',
    name: 'Setrika',
    image: '/Setrika.png',
    category: 'hazard',
    points: -1, // Kurangi 1 Heart!
    reason: 'BAHAYA! Setrika besi sangat berat, merusak jahitan tas dan tidak ada listrik saat darurat!',
    tip: 'Tinggalkan perabot logam berat non-darurat saat evakuasi.'
  },

  // --- Benda Bukan Siaga / Pengecoh (KURANGI POIN) ---
  {
    id: 'bantal',
    name: 'Bantal',
    image: '/Bantal.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Bantal tidur terlalu memakan tempat dan bukan kebutuhan pokok evakuasi.',
    tip: 'Gunakan ruang tas untuk kebutuhan esensial bertahan hidup.'
  },
  {
    id: 'blender',
    name: 'Blender',
    image: '/Blender.png',
    category: 'non_siaga',
    points: -15,
    reason: 'SALAH! Blender peralatan dapur yang berat dan membutuhkan daya listrik tinggi.',
    tip: 'Alat elektronik rumah tangga tidak dibutuhkan saat evakuasi darurat.'
  },
  {
    id: 'bola',
    name: 'Bola',
    image: '/Bola.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Bola olahraga bukan kebutuhan utama dalam situasi darurat bencana.',
    tip: 'Prioritaskan barang penyelamatan diri dan medis.'
  },
  {
    id: 'boneka',
    name: 'Boneka',
    image: '/Boneka.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Boneka mainan berukuran besar menyita ruang simpan tas siaga.',
    tip: 'Prioritaskan ruang tas untuk makanan, air, dan obat-obatan.'
  },
  {
    id: 'bulu_mata',
    name: 'Bulu Mata',
    image: '/Bulu Mata.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Kosmetik kecantikan tidak berguna saat proses penyelamatan diri.',
    tip: 'Fokus pada keselamatan jiwa saat bencana terjadi.'
  },
  {
    id: 'gaun_pesta',
    name: 'Gaun Pesta',
    image: '/Gaun Pesta.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Gaun pesta tidak praktis dan menyulitkan pergerakan cepat saat evakuasi.',
    tip: 'Siapkan pakaian hangat yang fleksibel, nyaman, dan kuat.'
  },
  {
    id: 'joystik',
    name: 'Joystick Game',
    image: '/Joystik.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Kontroler mainan game bukan perlengkapan keselamatan bencana.',
    tip: 'Tinggalkan perangkat konsol game di rumah.'
  },
  {
    id: 'kamera',
    name: 'Kamera',
    image: '/kamera.png',
    category: 'non_siaga',
    points: -15,
    reason: 'SALAH! Kamera berat, riskan rusak terbentur, dan bukan prioritas evakuasi.',
    tip: 'Bawa barang yang benar-benar esensial untuk keselamatan diri.'
  },
  {
    id: 'laptop',
    name: 'Laptop',
    image: '/Laptop.png',
    category: 'non_siaga',
    points: -15,
    reason: 'SALAH! Laptop berat dan rentan rusak terkena air atau reruntuhan.',
    tip: 'Cadangkan data dan dokumen penting ke cloud penyimpanan awan.'
  },
  {
    id: 'lemper',
    name: 'Lemper Basah',
    image: '/Lemper.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Kue basah seperti lemper cepat basi berjamur dalam 1-2 hari.',
    tip: 'Siapkan biskuit padat kalori atau makanan kaleng tahan lama.'
  },
  {
    id: 'makeup',
    name: 'Peralatan Makeup',
    image: '/Makeup.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Alat rias kosmetik tidak berfungsi untuk pertolongan pertama darurat.',
    tip: 'Ganti dengan sabun mandi, pasta gigi, atau hand sanitizer.'
  },
  {
    id: 'novel',
    name: 'Buku Novel',
    image: '/Novel.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Buku bacaan tebal menambah beban tas tanpa fungsi penyelamatan.',
    tip: 'Hemat kapasitas tas untuk persediaan air dan logistik darurat.'
  },
  {
    id: 'parfum',
    name: 'Parfum Kaca',
    image: '/Parfum.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Botol parfum kaca mudah pecah dan cairannya mudah terbakar.',
    tip: 'Hindari membawa botol wewangian beralkohol yang rawan menyulut api.'
  },
  {
    id: 'pengering_rambut',
    name: 'Pengering Rambut',
    image: '/Pengering Rambut.png',
    category: 'non_siaga',
    points: -15,
    reason: 'SALAH! Hair dryer butuh daya listrik besar yang padam saat bencana.',
    tip: 'Tinggalkan peralatan salon elektronik berdaya tinggi.'
  },
  {
    id: 'rubik',
    name: 'Kubus Rubik',
    image: '/Rubik.png',
    category: 'non_siaga',
    points: -10,
    reason: 'SALAH! Mainan kubus rubik bukan perlengkapan darurat bencana.',
    tip: 'Utamakan perlengkapan survival seperti senter dan peluit.'
  },
  {
    id: 'sepatu_heels',
    name: 'Sepatu Heels',
    image: '/Sepatu Heels.png',
    category: 'non_siaga',
    points: -15,
    reason: 'SALAH! Sepatu hak tinggi sangat berbahaya untuk berlari saat gempa.',
    tip: 'Gunakan sepatu kets bertelapak tebal untuk melindungi kaki dari pecahan kaca.'
  }
];

// Active falling item instance
interface ActiveFallingItem {
  uid: number;
  item: GameItemDef;
  x: number; // in percent: 8 to 92
  y: number; // in percent: -10 to 110
  speed: number; // percent per second
}

// Floating feedback message
interface FloatingFeedback {
  uid: number;
  text: string;
  x: number;
  y: number;
  type: 'positive' | 'hazard' | 'penalty';
  player?: 'p1' | 'p2';
}

// ========================================================
// 2. WEB AUDIO SYNTHESIZER
// ========================================================
class SoundFX {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCatch() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.0, now + 0.08); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playPenalty() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.18);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playHazard() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playVictory() {
    if (this.muted) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }
}

const sfx = new SoundFX();

// ========================================================
// 3. MAIN COMPONENT
// ========================================================
export default function BagCatcherGame() {
  const [stage, setStage] = useState<'start' | 'playing' | 'gameover'>('start');
  const [gameMode, setGameMode] = useState<'solo' | 'pvp'>('solo');
  const [playerName, setPlayerName] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [nameError, setNameError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Pemain 1 Stats (Tas Biru Cyan)
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(1);
  const [bagX, setBagX] = useState(50); // percentage 8 to 92
  const [bagSquish, setBagSquish] = useState(false);
  const bagSquishRef = useRef(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const isBagOpenRef = useRef(false);
  const [collectedCounts, setCollectedCounts] = useState<Record<string, number>>({});

  // Pemain 2 Stats (Tas Kuning/Emas Amber - Khusus PvP)
  const [score2, setScore2] = useState(0);
  const [lives2, setLives2] = useState(3);
  const [combo2, setCombo2] = useState(1);
  const [bagX2, setBagX2] = useState(50);
  const [bagSquish2, setBagSquish2] = useState(false);
  const bagSquish2Ref = useRef(false);
  const [isBagOpen2, setIsBagOpen2] = useState(false);
  const isBagOpen2Ref = useRef(false);
  const [collectedCounts2, setCollectedCounts2] = useState<Record<string, number>>({});

  // Hasil PvP
  const [winner, setWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);
  const [winReason, setWinReason] = useState<'score' | 'knockout' | null>(null);

  const [isDangerShake, setIsDangerShake] = useState(false);
  const [isDangerShake2, setIsDangerShake2] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Preload bag and items images
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const imagesToPreload = [
        '/bg main.png',
        '/tas buka.png',
        '/tas tutup.png',
        // 20 Benda Siaga
        '/Air Minum.png',
        '/Baterai Cadangan.png',
        '/Biskuit.png',
        '/Dokumen Penting.png',
        '/Hand Sanitizer.png',
        '/Jas Hujan.png',
        '/Korek Api.png',
        '/Kotak P3K.png',
        '/Makanan Kaleng.png',
        '/Masker Medis.png',
        '/Obat Pribadi.png',
        '/Pakaian Ganti.png',
        '/Peluit Darurat.png',
        '/Pisau Lipat.png',
        '/Powerbank.png',
        '/Radio.png',
        '/SIkat Gigi.png',
        '/Sabun Mandi.png',
        '/Senter LED.png',
        '/Uang Tunai.png',
        // 18 Benda Pengecoh & Bahaya
        '/Bantal.png',
        '/Blender.png',
        '/Bola.png',
        '/Boneka.png',
        '/Botol Kaca.png',
        '/Bulu Mata.png',
        '/Gaun Pesta.png',
        '/Joystik.png',
        '/kamera.png',
        '/Laptop.png',
        '/Lemper.png',
        '/Makeup.png',
        '/Novel.png',
        '/Parfum.png',
        '/Pengering Rambut.png',
        '/Rubik.png',
        '/Sepatu Heels.png',
        '/Setrika.png'
      ];
      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, []);

  // Active items and feedbacks in canvas
  const [fallingItems, setFallingItems] = useState<ActiveFallingItem[]>([]);
  const [fallingItems2, setFallingItems2] = useState<ActiveFallingItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [feedbacks2, setFeedbacks2] = useState<FloatingFeedback[]>([]);

  // Input states
  const keysRef = useRef<{
    p1Left: boolean;
    p1Right: boolean;
    p2Left: boolean;
    p2Right: boolean;
  }>({
    p1Left: false,
    p1Right: false,
    p2Left: false,
    p2Right: false
  });

  const [isP1LeftActive, setIsP1LeftActive] = useState(false);
  const [isP1RightActive, setIsP1RightActive] = useState(false);
  const [isP2LeftActive, setIsP2LeftActive] = useState(false);
  const [isP2RightActive, setIsP2RightActive] = useState(false);

  // Refs for animation loop
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const itemCounterRef = useRef<number>(0);
  const playfieldRef = useRef<HTMLDivElement>(null);
  const playfieldRef2 = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isDraggingRef2 = useRef<boolean>(false);
  const p1PlayfieldPointerIdRef = useRef<number | null>(null);
  const p2PlayfieldPointerIdRef = useRef<number | null>(null);
  const p1LeftPointerIdRef = useRef<number | null>(null);
  const p1RightPointerIdRef = useRef<number | null>(null);
  const p2LeftPointerIdRef = useRef<number | null>(null);
  const p2RightPointerIdRef = useRef<number | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const pvpTrack1Ref = useRef<HTMLDivElement>(null);
  const pvpTrack2Ref = useRef<HTMLDivElement>(null);
  const isDraggingTrackRef = useRef<boolean>(false);
  const isDraggingPvpTrack1Ref = useRef<boolean>(false);
  const isDraggingPvpTrack2Ref = useRef<boolean>(false);
  const p1TrackPointerIdRef = useRef<number | null>(null);
  const p2TrackPointerIdRef = useRef<number | null>(null);

  // State mirror refs for requestAnimationFrame
  const gameModeRef = useRef<'solo' | 'pvp'>('solo');
  const playerNameRef = useRef('');
  const player2NameRef = useRef('');

  const bagXRef = useRef(50);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(1);
  const collectedCountsRef = useRef<Record<string, number>>({});

  const bagX2Ref = useRef(50);
  const score2Ref = useRef(0);
  const lives2Ref = useRef(3);
  const combo2Ref = useRef(1);
  const collectedCounts2Ref = useRef<Record<string, number>>({});

  const stageRef = useRef(stage);
  const isPausedRef = useRef(isPaused);
  const fallingItemsRef = useRef<ActiveFallingItem[]>([]);
  const fallingItems2Ref = useRef<ActiveFallingItem[]>([]);

  // Keep refs synced
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);
  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);
  useEffect(() => {
    player2NameRef.current = player2Name;
  }, [player2Name]);

  // Load saved high score and names
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('geo_student_name');
      if (savedName) setPlayerName(savedName);
      const savedP2 = localStorage.getItem('geo_pvp_p2');
      if (savedP2) setPlayer2Name(savedP2);
      const savedHigh = localStorage.getItem('geo_game_highscore');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10) || 0);
    } catch {}
  }, []);

  // Sync mute state
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.muted = next;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const mode = gameModeRef.current;

      // P1 Keyboard Controls: A and D (always) or Arrow keys in Solo
      if (e.key === 'a' || e.key === 'A') {
        keysRef.current.p1Left = true;
        setIsP1LeftActive(true);
        const nextX = Math.max(9, bagXRef.current - 7.5);
        bagXRef.current = nextX;
        setBagX(nextX);
      } else if (e.key === 'd' || e.key === 'D') {
        keysRef.current.p1Right = true;
        setIsP1RightActive(true);
        const nextX = Math.min(91, bagXRef.current + 7.5);
        bagXRef.current = nextX;
        setBagX(nextX);
      }

      if (mode === 'solo') {
        if (e.key === 'ArrowLeft') {
          keysRef.current.p1Left = true;
          setIsP1LeftActive(true);
          const nextX = Math.max(9, bagXRef.current - 7.5);
          bagXRef.current = nextX;
          setBagX(nextX);
        } else if (e.key === 'ArrowRight') {
          keysRef.current.p1Right = true;
          setIsP1RightActive(true);
          const nextX = Math.min(91, bagXRef.current + 7.5);
          bagXRef.current = nextX;
          setBagX(nextX);
        }
      } else {
        // PvP Mode: P2 Keyboard Controls (ArrowLeft & ArrowRight)
        if (e.key === 'ArrowLeft') {
          keysRef.current.p2Left = true;
          setIsP2LeftActive(true);
          const nextX = Math.max(9, bagX2Ref.current - 7.5);
          bagX2Ref.current = nextX;
          setBagX2(nextX);
        } else if (e.key === 'ArrowRight') {
          keysRef.current.p2Right = true;
          setIsP2RightActive(true);
          const nextX = Math.min(91, bagX2Ref.current + 7.5);
          bagX2Ref.current = nextX;
          setBagX2(nextX);
        }
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (stageRef.current === 'playing') {
          setIsPaused(prev => !prev);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mode = gameModeRef.current;

      if (e.key === 'a' || e.key === 'A') {
        keysRef.current.p1Left = false;
        setIsP1LeftActive(false);
      } else if (e.key === 'd' || e.key === 'D') {
        keysRef.current.p1Right = false;
        setIsP1RightActive(false);
      }

      if (mode === 'solo') {
        if (e.key === 'ArrowLeft') {
          keysRef.current.p1Left = false;
          setIsP1LeftActive(false);
        } else if (e.key === 'ArrowRight') {
          keysRef.current.p1Right = false;
          setIsP1RightActive(false);
        }
      } else {
        if (e.key === 'ArrowLeft') {
          keysRef.current.p2Left = false;
          setIsP2LeftActive(false);
        } else if (e.key === 'ArrowRight') {
          keysRef.current.p2Right = false;
          setIsP2RightActive(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (stage !== 'playing' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver('time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isPaused]);

  // Trigger Game Over
  const triggerGameOver = useCallback((reason: 'time' | 'death' | 'knockout', koWinner?: 'p1' | 'p2') => {
    setStage('gameover');
    stageRef.current = 'gameover';
    keysRef.current = { p1Left: false, p1Right: false, p2Left: false, p2Right: false };
    setIsP1LeftActive(false);
    setIsP1RightActive(false);
    setIsP2LeftActive(false);
    setIsP2RightActive(false);
    isDraggingRef.current = false;
    isDraggingRef2.current = false;
    isDraggingTrackRef.current = false;
    isDraggingPvpTrack1Ref.current = false;
    isDraggingPvpTrack2Ref.current = false;
    p1LeftPointerIdRef.current = null;
    p1RightPointerIdRef.current = null;
    p2LeftPointerIdRef.current = null;
    p2RightPointerIdRef.current = null;
    p1PlayfieldPointerIdRef.current = null;
    p2PlayfieldPointerIdRef.current = null;
    p1TrackPointerIdRef.current = null;
    p2TrackPointerIdRef.current = null;

    if (gameModeRef.current === 'solo') {
      if (reason === 'time') {
        sfx.playVictory();
      } else {
        sfx.playHazard();
      }

      // Save high score
      const finalScore = scoreRef.current;
      try {
        const currentHigh = parseInt(localStorage.getItem('geo_game_highscore') || '0', 10);
        if (finalScore > currentHigh) {
          localStorage.setItem('geo_game_highscore', finalScore.toString());
          setHighScore(finalScore);
        }
      } catch {}
    } else {
      // PvP 1 vs 1 Mode Game Over
      sfx.playVictory();
      if (reason === 'knockout') {
        setWinner(koWinner || 'p1');
        setWinReason('knockout');
      } else {
        const s1 = scoreRef.current;
        const s2 = score2Ref.current;
        setWinReason('score');
        if (s1 > s2) {
          setWinner('p1');
        } else if (s2 > s1) {
          setWinner('p2');
        } else {
          setWinner('draw');
        }
      }
    }
  }, []);

  // Spawn a random item
  const spawnItem = (currentSecRemaining: number) => {
    itemCounterRef.current += 1;
    const uid = itemCounterRef.current;

    // Determine category based on probability
    const rand = Math.random();
    let selectedItem: GameItemDef;

    if (rand < 0.65) {
      // 65% chance: Benda Siaga Bencana (Benar)
      const siagaItems = GAME_ITEMS_CATALOG.filter(i => i.category === 'siaga');
      selectedItem = siagaItems[Math.floor(Math.random() * siagaItems.length)];
    } else if (rand < 0.80) {
      // 15% chance: Hazard / Benda Berbahaya (Botol Kaca, Setrika)
      const hazardItems = GAME_ITEMS_CATALOG.filter(i => i.category === 'hazard');
      selectedItem = hazardItems[Math.floor(Math.random() * hazardItems.length)];
    } else {
      // 20% chance: Benda Pengecoh Non-Siaga (Bantal, Blender, Lemper, dll)
      const nonSiagaItems = GAME_ITEMS_CATALOG.filter(i => i.category === 'non_siaga');
      selectedItem = nonSiagaItems[Math.floor(Math.random() * nonSiagaItems.length)];
    }

    // Speed increases as time decreases (60s -> 0s)
    const baseSpeed = 26; // percent per second
    const speedBoost = ((60 - currentSecRemaining) / 60) * 14; // up to +14%
    const randomVar = (Math.random() - 0.5) * 6;
    const speed = baseSpeed + speedBoost + randomVar;

    const x = Math.floor(Math.random() * 80) + 10; // 10% to 90%

    return {
      uid,
      item: selectedItem,
      x,
      y: -10,
      speed
    };
  };

  // Add floating feedback popup
  const addFeedback = (text: string, x: number, y: number, type: 'positive' | 'hazard' | 'penalty', player: 'p1' | 'p2' = 'p1') => {
    const uid = Date.now() + Math.random();
    if (player === 'p1') {
      setFeedbacks(prev => [...prev.slice(-8), { uid, text, x, y, type, player }]);
      setTimeout(() => {
        setFeedbacks(prev => prev.filter(f => f.uid !== uid));
      }, 850);
    } else {
      setFeedbacks2(prev => [...prev.slice(-8), { uid, text, x, y, type, player }]);
      setTimeout(() => {
        setFeedbacks2(prev => prev.filter(f => f.uid !== uid));
      }, 850);
    }
  };

  // Start game session
  const handleStartGame = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean1 = playerName.trim();
    if (!clean1) {
      setNameError(gameMode === 'solo' 
        ? 'Silakan ketikkan namamu terlebih dahulu untuk memulai!' 
        : 'Silakan ketikkan nama Pemain 1 terlebih dahulu!');
      return;
    }
    if (gameMode === 'pvp') {
      const clean2 = player2Name.trim();
      if (!clean2) {
        setNameError('Silakan ketikkan nama Pemain 2 terlebih dahulu!');
        return;
      }
      try {
        localStorage.setItem('geo_student_name', clean1);
        localStorage.setItem('geo_pvp_p2', clean2);
      } catch {}
    } else {
      try {
        localStorage.setItem('geo_student_name', clean1);
      } catch {}
    }
    setNameError('');

    gameModeRef.current = gameMode;
    playerNameRef.current = clean1;
    player2NameRef.current = player2Name.trim() || 'Pemain 2';

    // Reset P1
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setCombo(1);
    comboRef.current = 1;
    const initX1 = 50;
    setBagX(initX1);
    bagXRef.current = initX1;
    setBagSquish(false);
    bagSquishRef.current = false;
    setIsBagOpen(false);
    isBagOpenRef.current = false;
    setCollectedCounts({});
    collectedCountsRef.current = {};

    // Reset P2 (PvP)
    setScore2(0);
    score2Ref.current = 0;
    setLives2(3);
    lives2Ref.current = 3;
    setCombo2(1);
    combo2Ref.current = 1;
    const initX2 = 50;
    setBagX2(initX2);
    bagX2Ref.current = initX2;
    setBagSquish2(false);
    bagSquish2Ref.current = false;
    setIsBagOpen2(false);
    isBagOpen2Ref.current = false;
    setCollectedCounts2({});
    collectedCounts2Ref.current = {};

    // Reset Result
    setWinner(null);
    setWinReason(null);

    // Common
    setTimeLeft(60);
    setFallingItems([]);
    fallingItemsRef.current = [];
    setFallingItems2([]);
    fallingItems2Ref.current = [];
    setFeedbacks([]);
    setFeedbacks2([]);
    setIsPaused(false);
    isPausedRef.current = false;
    setIsDangerShake(false);
    setIsDangerShake2(false);

    keysRef.current = { p1Left: false, p1Right: false, p2Left: false, p2Right: false };
    setIsP1LeftActive(false);
    setIsP1RightActive(false);
    setIsP2LeftActive(false);
    setIsP2RightActive(false);

    setStage('playing');
    stageRef.current = 'playing';
    lastTimeRef.current = performance.now();
    spawnTimerRef.current = 0;
  };

  // Main Game Animation Loop
  useEffect(() => {
    if (stage !== 'playing') return;

    let frame = 0;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isPausedRef.current && stageRef.current === 'playing') {
        const moveSpeed = 120; // percent per second (responsif dan lincah untuk layar sentuh)
        const isPvP = gameModeRef.current === 'pvp';

        // 1. Move Player 1 Bag
        let currentX1 = bagXRef.current;
        let movedP1 = false;
        if (keysRef.current.p1Left) {
          currentX1 = Math.max(9, currentX1 - moveSpeed * dt);
          movedP1 = true;
        }
        if (keysRef.current.p1Right) {
          currentX1 = Math.min(91, currentX1 + moveSpeed * dt);
          movedP1 = true;
        }
        if (movedP1) {
          bagXRef.current = currentX1;
          setBagX(currentX1);
        }

        // 2. Move Player 2 Bag (if PvP)
        let currentX2 = bagX2Ref.current;
        let movedP2 = false;
        if (isPvP) {
          if (keysRef.current.p2Left) {
            currentX2 = Math.max(9, currentX2 - moveSpeed * dt);
            movedP2 = true;
          }
          if (keysRef.current.p2Right) {
            currentX2 = Math.min(91, currentX2 + moveSpeed * dt);
            movedP2 = true;
          }
          if (movedP2) {
            bagX2Ref.current = currentX2;
            setBagX2(currentX2);
          }
        }

        // 3. Spawn Items
        spawnTimerRef.current += dt;
        const baseInterval = isPvP ? 1.05 : 1.25;
        const minInterval = isPvP ? 0.65 : 0.72;
        const spawnInterval = Math.max(minInterval, baseInterval - ((60 - timeLeft) / 60) * 0.45);
        if (spawnTimerRef.current >= spawnInterval) {
          spawnTimerRef.current = 0;
          const newItem = spawnItem(timeLeft);
          fallingItemsRef.current.push(newItem);
          if (isPvP) {
            // Identical clone for Player 2
            fallingItems2Ref.current.push({ ...newItem, uid: newItem.uid + 100000 });
          }
        }

        const bagHitYMin = 72;
        const bagHitYMax = 86;
        const bagRadius = isPvP ? 12 : 9.5;

        // 4A. Update & Check Collisions for P1
        const nextItems1: ActiveFallingItem[] = [];
        for (const it of fallingItemsRef.current) {
          it.y += it.speed * dt;

          if (it.y >= bagHitYMin && it.y <= bagHitYMax) {
            const distX1 = Math.abs(it.x - currentX1);
            if (livesRef.current > 0 && distX1 <= bagRadius) {
              bagSquishRef.current = true;
              setBagSquish(true);
              setTimeout(() => {
                bagSquishRef.current = false;
                setBagSquish(false);
              }, 180);

              if (it.item.category === 'siaga') {
                sfx.playCatch();
                const pointsEarned = Math.round(it.item.points * (1 + (comboRef.current - 1) * 0.2));
                scoreRef.current += pointsEarned;
                setScore(scoreRef.current);
                comboRef.current = Math.min(comboRef.current + 1, 5);
                setCombo(comboRef.current);

                const newCounts = { ...collectedCountsRef.current };
                newCounts[it.item.id] = (newCounts[it.item.id] || 0) + 1;
                collectedCountsRef.current = newCounts;
                setCollectedCounts(newCounts);

                addFeedback(`+${pointsEarned} ${it.item.name}!`, it.x, it.y, 'positive', 'p1');
              } else if (it.item.category === 'hazard') {
                sfx.playHazard();
                setIsDangerShake(true);
                setTimeout(() => setIsDangerShake(false), 360);

                livesRef.current = Math.max(0, livesRef.current - 1);
                setLives(livesRef.current);
                comboRef.current = 1;
                setCombo(1);
                addFeedback(`💥 -1 ❤️ Kena Benda Bahaya!`, it.x, it.y, 'hazard', 'p1');

                if (isPvP && livesRef.current <= 0) {
                  triggerGameOver('knockout', 'p2');
                  return;
                } else if (!isPvP && livesRef.current <= 0) {
                  triggerGameOver('death');
                  return;
                }
              } else {
                sfx.playPenalty();
                scoreRef.current = Math.max(0, scoreRef.current + it.item.points);
                setScore(scoreRef.current);
                comboRef.current = 1;
                setCombo(1);
                addFeedback(`${it.item.points} ${it.item.name}!`, it.x, it.y, 'penalty', 'p1');
              }

              continue;
            }
          }

          if (it.y > 105) {
            if (it.item.category === 'siaga' && !isPvP) {
              comboRef.current = 1;
              setCombo(1);
            }
            continue;
          }

          nextItems1.push(it);
        }
        fallingItemsRef.current = nextItems1;
        setFallingItems([...nextItems1]);

        // 4B. Update & Check Collisions for P2 (PvP Mode)
        if (isPvP) {
          const nextItems2: ActiveFallingItem[] = [];
          for (const it of fallingItems2Ref.current) {
            it.y += it.speed * dt;

            if (it.y >= bagHitYMin && it.y <= bagHitYMax) {
              const distX2 = Math.abs(it.x - currentX2);
              if (lives2Ref.current > 0 && distX2 <= bagRadius) {
                bagSquish2Ref.current = true;
                setBagSquish2(true);
                setTimeout(() => {
                  bagSquish2Ref.current = false;
                  setBagSquish2(false);
                }, 180);

                if (it.item.category === 'siaga') {
                  sfx.playCatch();
                  const pointsEarned = Math.round(it.item.points * (1 + (combo2Ref.current - 1) * 0.2));
                  score2Ref.current += pointsEarned;
                  setScore2(score2Ref.current);
                  combo2Ref.current = Math.min(combo2Ref.current + 1, 5);
                  setCombo2(combo2Ref.current);

                  const newCounts = { ...collectedCounts2Ref.current };
                  newCounts[it.item.id] = (newCounts[it.item.id] || 0) + 1;
                  collectedCounts2Ref.current = newCounts;
                  setCollectedCounts2(newCounts);

                  addFeedback(`+${pointsEarned} ${it.item.name}!`, it.x, it.y, 'positive', 'p2');
                } else if (it.item.category === 'hazard') {
                  sfx.playHazard();
                  setIsDangerShake2(true);
                  setTimeout(() => setIsDangerShake2(false), 360);

                  lives2Ref.current = Math.max(0, lives2Ref.current - 1);
                  setLives2(lives2Ref.current);
                  combo2Ref.current = 1;
                  setCombo2(1);
                  addFeedback(`💥 -1 ❤️ Kena Benda Bahaya!`, it.x, it.y, 'hazard', 'p2');

                  if (lives2Ref.current <= 0) {
                    triggerGameOver('knockout', 'p1');
                    return;
                  }
                } else {
                  sfx.playPenalty();
                  score2Ref.current = Math.max(0, score2Ref.current + it.item.points);
                  setScore2(score2Ref.current);
                  combo2Ref.current = 1;
                  setCombo2(1);
                  addFeedback(`${it.item.points} ${it.item.name}!`, it.x, it.y, 'penalty', 'p2');
                }

                continue;
              }
            }

            if (it.y > 105) {
              continue;
            }

            nextItems2.push(it);
          }
          fallingItems2Ref.current = nextItems2;
          setFallingItems2([...nextItems2]);
        }

        // 5. Update Bag Open / Closed State:
        const isApproaching1 = nextItems1.some(it => it.y >= 58 && it.y <= 88 && Math.abs(it.x - currentX1) <= 15);
        const shouldOpen1 = isApproaching1 || bagSquishRef.current;
        if (shouldOpen1 !== isBagOpenRef.current) {
          isBagOpenRef.current = shouldOpen1;
          setIsBagOpen(shouldOpen1);
        }

        if (isPvP) {
          const isApproaching2 = fallingItems2Ref.current.some(it => it.y >= 58 && it.y <= 88 && Math.abs(it.x - currentX2) <= 15);
          const shouldOpen2 = isApproaching2 || bagSquish2Ref.current;
          if (shouldOpen2 !== isBagOpen2Ref.current) {
            isBagOpen2Ref.current = shouldOpen2;
            setIsBagOpen2(shouldOpen2);
          }
        }
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [stage, timeLeft, triggerGameOver]);

  // 1. Position calculation helpers
  const updateP1BagPositionFromPointer = useCallback((clientX: number) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, percentX));
    bagXRef.current = clamped;
    setBagX(clamped);
  }, []);

  const updateP2BagPositionFromPointer = useCallback((clientX: number) => {
    if (!playfieldRef2.current) return;
    const rect = playfieldRef2.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, percentX));
    bagX2Ref.current = clamped;
    setBagX2(clamped);
  }, []);

  const updateP1BagPositionFromTrack = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, percentX));
    bagXRef.current = clamped;
    setBagX(clamped);
  }, []);

  const updateP1BagPositionFromPvpTrack = useCallback((clientX: number) => {
    if (!pvpTrack1Ref.current) return;
    const rect = pvpTrack1Ref.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, percentX));
    bagXRef.current = clamped;
    setBagX(clamped);
  }, []);

  const updateP2BagPositionFromPvpTrack = useCallback((clientX: number) => {
    if (!pvpTrack2Ref.current) return;
    const rect = pvpTrack2Ref.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = (relativeX / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, percentX));
    bagX2Ref.current = clamped;
    setBagX2(clamped);
  }, []);

  // 2. Window-level pointer tracking (rock-solid for touch / interactive screens)
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current && p1PlayfieldPointerIdRef.current === e.pointerId) {
        updateP1BagPositionFromPointer(e.clientX);
      }
      if (isDraggingRef2.current && p2PlayfieldPointerIdRef.current === e.pointerId) {
        updateP2BagPositionFromPointer(e.clientX);
      }
      if (isDraggingTrackRef.current && p1TrackPointerIdRef.current === e.pointerId) {
        updateP1BagPositionFromTrack(e.clientX);
      }
      if (isDraggingPvpTrack1Ref.current && p1TrackPointerIdRef.current === e.pointerId) {
        updateP1BagPositionFromPvpTrack(e.clientX);
      }
      if (isDraggingPvpTrack2Ref.current && p2TrackPointerIdRef.current === e.pointerId) {
        updateP2BagPositionFromPvpTrack(e.clientX);
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (p1PlayfieldPointerIdRef.current === e.pointerId) {
        isDraggingRef.current = false;
        p1PlayfieldPointerIdRef.current = null;
      }
      if (p2PlayfieldPointerIdRef.current === e.pointerId) {
        isDraggingRef2.current = false;
        p2PlayfieldPointerIdRef.current = null;
      }
      if (p1TrackPointerIdRef.current === e.pointerId) {
        isDraggingTrackRef.current = false;
        isDraggingPvpTrack1Ref.current = false;
        p1TrackPointerIdRef.current = null;
      }
      if (p2TrackPointerIdRef.current === e.pointerId) {
        isDraggingPvpTrack2Ref.current = false;
        p2TrackPointerIdRef.current = null;
      }
      if (p1LeftPointerIdRef.current === e.pointerId) {
        keysRef.current.p1Left = false;
        setIsP1LeftActive(false);
        p1LeftPointerIdRef.current = null;
      }
      if (p1RightPointerIdRef.current === e.pointerId) {
        keysRef.current.p1Right = false;
        setIsP1RightActive(false);
        p1RightPointerIdRef.current = null;
      }
      if (p2LeftPointerIdRef.current === e.pointerId) {
        keysRef.current.p2Left = false;
        setIsP2LeftActive(false);
        p2LeftPointerIdRef.current = null;
      }
      if (p2RightPointerIdRef.current === e.pointerId) {
        keysRef.current.p2Right = false;
        setIsP2RightActive(false);
        p2RightPointerIdRef.current = null;
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [
    updateP1BagPositionFromPointer,
    updateP2BagPositionFromPointer,
    updateP1BagPositionFromTrack,
    updateP1BagPositionFromPvpTrack,
    updateP2BagPositionFromPvpTrack
  ]);

  // 3. Pointer drag handlers on Playfield
  const handlePointerDownPlayfield = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    p1PlayfieldPointerIdRef.current = e.pointerId;
    isDraggingRef.current = true;
    updateP1BagPositionFromPointer(e.clientX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMovePlayfield = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    if (p1PlayfieldPointerIdRef.current !== null && p1PlayfieldPointerIdRef.current !== e.pointerId) return;
    updateP1BagPositionFromPointer(e.clientX);
  };

  const handlePointerUpPlayfield = (e: React.PointerEvent<HTMLDivElement>) => {
    if (p1PlayfieldPointerIdRef.current === null || p1PlayfieldPointerIdRef.current === e.pointerId) {
      isDraggingRef.current = false;
      p1PlayfieldPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const handlePointerDownPlayfield2 = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    p2PlayfieldPointerIdRef.current = e.pointerId;
    isDraggingRef2.current = true;
    updateP2BagPositionFromPointer(e.clientX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMovePlayfield2 = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef2.current) return;
    if (p2PlayfieldPointerIdRef.current !== null && p2PlayfieldPointerIdRef.current !== e.pointerId) return;
    updateP2BagPositionFromPointer(e.clientX);
  };

  const handlePointerUpPlayfield2 = (e: React.PointerEvent<HTMLDivElement>) => {
    if (p2PlayfieldPointerIdRef.current === null || p2PlayfieldPointerIdRef.current === e.pointerId) {
      isDraggingRef2.current = false;
      p2PlayfieldPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // 4. Pointer drag start handlers on Slider Tracks
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    p1TrackPointerIdRef.current = e.pointerId;
    isDraggingTrackRef.current = true;
    updateP1BagPositionFromTrack(e.clientX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  const handleP1TrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    p1TrackPointerIdRef.current = e.pointerId;
    isDraggingPvpTrack1Ref.current = true;
    updateP1BagPositionFromPvpTrack(e.clientX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  const handleP2TrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    p2TrackPointerIdRef.current = e.pointerId;
    isDraggingPvpTrack2Ref.current = true;
    updateP2BagPositionFromPvpTrack(e.clientX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  // 5. On-screen Button handlers with Instant Tap Hop
  const handleP1LeftDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    p1LeftPointerIdRef.current = e.pointerId;
    keysRef.current.p1Left = true;
    setIsP1LeftActive(true);
    // Instant tap-step for ultra-responsive feel
    const nextX = Math.max(9, bagXRef.current - 7.5);
    bagXRef.current = nextX;
    setBagX(nextX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
  };
  const handleP1LeftUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (p1LeftPointerIdRef.current === null || p1LeftPointerIdRef.current === e.pointerId) {
      keysRef.current.p1Left = false;
      setIsP1LeftActive(false);
      p1LeftPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const handleP1RightDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    p1RightPointerIdRef.current = e.pointerId;
    keysRef.current.p1Right = true;
    setIsP1RightActive(true);
    // Instant tap-step for ultra-responsive feel
    const nextX = Math.min(91, bagXRef.current + 7.5);
    bagXRef.current = nextX;
    setBagX(nextX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
  };
  const handleP1RightUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (p1RightPointerIdRef.current === null || p1RightPointerIdRef.current === e.pointerId) {
      keysRef.current.p1Right = false;
      setIsP1RightActive(false);
      p1RightPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const handleP2LeftDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    p2LeftPointerIdRef.current = e.pointerId;
    keysRef.current.p2Left = true;
    setIsP2LeftActive(true);
    // Instant tap-step for PvP P2
    const nextX = Math.max(9, bagX2Ref.current - 7.5);
    bagX2Ref.current = nextX;
    setBagX2(nextX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
  };
  const handleP2LeftUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (p2LeftPointerIdRef.current === null || p2LeftPointerIdRef.current === e.pointerId) {
      keysRef.current.p2Left = false;
      setIsP2LeftActive(false);
      p2LeftPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const handleP2RightDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    p2RightPointerIdRef.current = e.pointerId;
    keysRef.current.p2Right = true;
    setIsP2RightActive(true);
    // Instant tap-step for PvP P2
    const nextX = Math.min(91, bagX2Ref.current + 7.5);
    bagX2Ref.current = nextX;
    setBagX2(nextX);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
  };
  const handleP2RightUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (p2RightPointerIdRef.current === null || p2RightPointerIdRef.current === e.pointerId) {
      keysRef.current.p2Right = false;
      setIsP2RightActive(false);
      p2RightPointerIdRef.current = null;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // Star Rating calculation (Solo)
  const getStars = () => {
    if (score >= 260) return 3;
    if (score >= 140) return 2;
    return 1;
  };

  const totalSiagaCaught = Object.values(collectedCounts).reduce((a, b) => a + b, 0);
  const totalSiagaCaught2 = Object.values(collectedCounts2).reduce((a, b) => a + b, 0);

  return (
    <section className={`learning-deck game-deck ${stage === 'start' ? 'is-start-screen' : stage === 'gameover' ? 'is-result-screen' : 'is-gameplay-screen'}`} aria-label="Permainan Tangkap Benda Tas Siaga Bencana">
      {/* 1. HEADER TOP BAR */}
      <div className="slide-top">
        <Link href="/" aria-label="Kembali ke Beranda" title="Kembali ke Beranda" className="pixar-home-btn">
          <House className="w-5 h-5" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* SCREEN 1: START / LOBBY                                      */}
      {/* ============================================================ */}
      {stage === 'start' && (
        <div key="start" className="game-deck-body game-stage-centered section-fade-in start-menu-stage">
          {/* Main 3D Game Control Panel */}
          <article className="game-start-card game-start-pixar-panel" aria-label="Mulai Permainan">
            {/* 3D Decorative Corner Rivets */}
            <span className="board-rivet rivet-tl" aria-hidden="true" />
            <span className="board-rivet rivet-tr" aria-hidden="true" />
            <span className="board-rivet rivet-bl" aria-hidden="true" />
            <span className="board-rivet rivet-br" aria-hidden="true" />

            {/* Decorative Compass on top right of wooden frame */}
            <div className="board-decor-compass" aria-hidden="true" title="Kompas Petualang">
              <svg viewBox="0 0 48 48" className="compass-svg">
                <defs>
                  <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe57f" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="21" fill="url(#brassGrad)" stroke="#fef08a" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="16" fill="#082038" stroke="#92400e" strokeWidth="1.5" />
                <line x1="24" y1="9" x2="24" y2="13" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="35" x2="24" y2="39" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="24" x2="13" y2="24" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="35" y1="24" x2="39" y2="24" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <polygon points="24,11 27,24 24,22 21,24" fill="#ef4444" />
                <polygon points="24,37 27,24 24,26 21,24" fill="#60a5fa" />
                <circle cx="24" cy="24" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              </svg>
            </div>

            {/* Decorative Leaves Sprouting at Bottom Corners */}
            <div className="board-decor-leaf leaf-left" aria-hidden="true">
              <svg viewBox="0 0 60 40" className="leaf-svg">
                <path d="M 0 35 C 10 15 35 10 45 25 C 25 35 15 35 0 35 Z" fill="#4ade80" />
                <path d="M 12 38 C 22 20 48 18 58 32 C 38 42 25 40 12 38 Z" fill="#22c55e" />
                <path d="M 2 34 C 18 26 32 24 44 26" stroke="#15803d" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="board-decor-leaf leaf-right" aria-hidden="true">
              <svg viewBox="0 0 60 40" className="leaf-svg">
                <path d="M 0 35 C 10 15 35 10 45 25 C 25 35 15 35 0 35 Z" fill="#4ade80" />
                <path d="M 12 38 C 22 20 48 18 58 32 C 38 42 25 40 12 38 Z" fill="#22c55e" />
                <path d="M 2 34 C 18 26 32 24 44 26" stroke="#15803d" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            {/* Mode Switcher Tabs (3D Capsule Buttons) */}
            <div className="game-mode-tabs" role="tablist" aria-label="Pilih Mode Permainan">
              <button
                type="button"
                role="tab"
                aria-selected={gameMode === 'solo'}
                className={`mode-tab-btn ${gameMode === 'solo' ? 'is-active' : ''}`}
                onClick={() => {
                  setGameMode('solo');
                  setNameError('');
                }}
              >
                <span className="tab-icon-wrap"><User className="w-5 h-5" /></span>
                <span>1 Pemain (Solo)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={gameMode === 'pvp'}
                className={`mode-tab-btn ${gameMode === 'pvp' ? 'is-active' : ''}`}
                onClick={() => {
                  setGameMode('pvp');
                  setNameError('');
                }}
              >
                <span className="tab-icon-wrap"><Swords className="w-5 h-5" /></span>
                <span>1 vs 1 (Duel)</span>
              </button>
            </div>

            {/* Name Form */}
            <form onSubmit={handleStartGame} className="game-name-form">
              {gameMode === 'solo' ? (
                <div className="pvp-input-col p1" style={{ width: '100%', maxWidth: '100%' }}>
                  {/* Subtle Mountain Landscape in Background */}
                  <div className="hud-landscape-bg" aria-hidden="true">
                    <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="hud-mountain-svg">
                      <ellipse cx="490" cy="30" rx="35" ry="16" fill="#38bdf8" opacity="0.18" />
                      <ellipse cx="520" cy="26" rx="25" ry="12" fill="#38bdf8" opacity="0.18" />
                      <ellipse cx="465" cy="32" rx="20" ry="10" fill="#38bdf8" opacity="0.18" />
                      <path d="M 425 120 L 485 36 L 545 120 Z" fill="#38bdf8" opacity="0.22" />
                      <path d="M 470 120 L 515 56 L 560 120 Z" fill="#38bdf8" opacity="0.18" />
                      <line x1="485" y1="36" x2="485" y2="20" stroke="#38bdf8" strokeWidth="2" opacity="0.4" />
                      <polygon points="485,20 500,25 485,30" fill="#38bdf8" opacity="0.4" />
                    </svg>
                  </div>

                  <label htmlFor="player-name-input" className="game-name-label pvp-label-p1">
                    <User className="w-5 h-5 text-sky-300" />
                    <span>Ketik namamu</span>
                  </label>
                  <input
                    id="player-name-input"
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Ketik namamu di sini..."
                    maxLength={35}
                    className="game-name-input pvp-input"
                    autoFocus
                  />
                  <span className="pvp-control-hint p1">
                    <span className="hint-icon" aria-hidden="true">🎮</span>
                    <span>Kendali: Tombol A & D / Tombol Panah / Sentuh & Geser Layar</span>
                  </span>
                </div>
              ) : (
                <div className="pvp-input-grid">
                  {/* Pemain 1 Input */}
                  <div className="pvp-input-col p1">
                    <div className="hud-landscape-bg" aria-hidden="true">
                      <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="hud-mountain-svg">
                        <ellipse cx="240" cy="28" rx="25" ry="12" fill="#38bdf8" opacity="0.18" />
                        <path d="M 190 120 L 235 42 L 280 120 Z" fill="#38bdf8" opacity="0.2" />
                      </svg>
                    </div>
                    <label htmlFor="pvp-p1-input" className="game-name-label pvp-label-p1">
                      <span className="pvp-badge-tag p1">P1</span>
                      <span>Pemain 1</span>
                    </label>
                    <input
                      id="pvp-p1-input"
                      type="text"
                      value={playerName}
                      onChange={(e) => {
                        setPlayerName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="Nama P1 (Contoh: Budi)"
                      maxLength={25}
                      className="game-name-input pvp-input"
                      autoFocus
                    />
                    <span className="pvp-control-hint p1">
                      <span className="hint-icon" aria-hidden="true">⌨️</span>
                      <span>Kendali: Tombol A & D / Layar Kiri</span>
                    </span>
                  </div>

                  {/* Pemain 2 Input */}
                  <div className="pvp-input-col p2">
                    <div className="hud-landscape-bg" aria-hidden="true">
                      <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="hud-mountain-svg">
                        <ellipse cx="240" cy="28" rx="25" ry="12" fill="#fbbf24" opacity="0.18" />
                        <path d="M 190 120 L 235 42 L 280 120 Z" fill="#fbbf24" opacity="0.2" />
                      </svg>
                    </div>
                    <label htmlFor="pvp-p2-input" className="game-name-label pvp-label-p2">
                      <span className="pvp-badge-tag p2">P2</span>
                      <span>Pemain 2</span>
                    </label>
                    <input
                      id="pvp-p2-input"
                      type="text"
                      value={player2Name}
                      onChange={(e) => {
                        setPlayer2Name(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="Nama P2 (Contoh: Siti)"
                      maxLength={25}
                      className="game-name-input pvp-input"
                    />
                    <span className="pvp-control-hint p2">
                      <span className="hint-icon" aria-hidden="true">⌨️</span>
                      <span>Kendali: Tombol Panah ← & → / Layar Kanan</span>
                    </span>
                  </div>
                </div>
              )}

              {/* 3D Big Juicy Orange-Yellow PLAY Button */}
              <button type="submit" className="game-start-btn pvp-start-btn pixar-play-btn" aria-label="Mulai Bermain!">
                <div className="btn-play-icon-glow" aria-hidden="true">
                  <Play className="w-8 h-8 fill-white text-white drop-shadow" />
                </div>
                <span className="btn-play-text">Mulai Bermain!</span>
              </button>

              {nameError && (
                <p className="quiz-error-msg" role="alert">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {nameError}
                </p>
              )}
            </form>
          </article>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 2: ACTIVE PLAYING ARENA                               */}
      {/* ============================================================ */}
      {stage === 'playing' && (
        gameMode === 'solo' ? (
          <div key="playing-solo" className="game-deck-body solo-arena-layout section-fade-in">
            {/* Top Shared Match Bar */}
            <div className="pvp-top-header">
              <div className="pvp-header-side p1">
                <span className="pvp-badge-tag p1">P1</span>
                <strong className="pvp-header-player-name">{playerName || 'Pemain Tunggal'}</strong>
              </div>

              <div className="pvp-header-center">
                <div className="hud-pill hud-pill-timer">
                  <span className="hud-pill-val" style={{ color: timeLeft <= 10 ? '#ef4444' : '#ffd166' }}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="game-top-btn"
                  style={{ width: '38px', height: '38px', minHeight: '38px' }}
                  title={isPaused ? "Lanjutkan" : "Jeda"}
                  aria-label={isPaused ? "Lanjutkan" : "Jeda"}
                >
                  {isPaused ? <Play className="w-4 h-4 text-white drop-shadow" /> : <Pause className="w-4 h-4 text-white drop-shadow" />}
                </button>
              </div>

              <div className="solo-side-record">
                <div className="solo-record-pill" title="Rekor Tertinggi">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Rekor: {Math.max(highScore, score)}</span>
                </div>
                <span className="pvp-badge-tag solo-badge">SOLO</span>
              </div>
            </div>

            {/* Solo Arena Grid */}
            <div className="solo-arena-grid">
              <article className={`pvp-split-pane p1 solo-pane ${isDangerShake ? 'is-danger-shake' : ''}`} aria-label="Arena Pemain Tunggal">
                {/* HUD P1 */}
                <div className="pvp-split-hud p1">
                  <div className="pvp-hud-name-group">
                    <span className="pvp-badge-tag p1">P1</span>
                    <span className="pvp-hud-player-title">{playerName || 'Pemain Tunggal'}</span>
                  </div>
                  <div className="hud-lives" aria-label={`Ketahanan Tas: ${lives}`}>
                    {[1, 2, 3].map((heartIndex) => (
                      <Heart
                        key={heartIndex}
                        className={`w-5 h-5 hud-heart ${heartIndex <= lives ? 'fill-rose-500' : 'empty'}`}
                      />
                    ))}
                  </div>
                  <div className="pvp-hud-score-group">
                    <span className="pvp-score-num p1">{score}</span>
                    {combo > 1 && <span className="hud-combo-badge p1">x{combo}</span>}
                  </div>
                </div>

                {/* Playfield */}
                <div
                  ref={playfieldRef}
                  className="game-playfield pvp-playfield"
                  onPointerDown={handlePointerDownPlayfield}
                  onPointerMove={handlePointerMovePlayfield}
                  onPointerUp={handlePointerUpPlayfield}
                  onPointerCancel={handlePointerUpPlayfield}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="playfield-grid-bg" />
                  <div className="catch-zone-line" />

                  {/* Falling Items */}
                  {fallingItems.map((item) => (
                    <div
                      key={item.uid}
                      className={`falling-item cat-${item.item.category}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`
                      }}
                    >
                      <div className="item-avatar">
                        {item.item.image ? (
                          <img
                            src={item.item.image}
                            alt={item.item.name}
                            className="item-avatar-img"
                            draggable={false}
                          />
                        ) : (
                          <span>{item.item.emoji}</span>
                        )}
                      </div>
                      <span className="item-name-tag">{item.item.name}</span>
                    </div>
                  ))}

                  {/* Feedbacks */}
                  {feedbacks.map((fb) => (
                    <div
                      key={fb.uid}
                      className={`floating-feedback ${fb.type} player-p1`}
                      style={{
                        left: `${fb.x}%`,
                        top: `${fb.y}%`
                      }}
                    >
                      {fb.text}
                    </div>
                  ))}

                  {/* Emergency Bag */}
                  <div
                    className={`player-bag bag-p1 ${bagSquish ? 'is-catching' : ''} ${isBagOpen ? 'is-open' : 'is-closed'}`}
                    style={{
                      left: `${bagX}%`
                    }}
                  >
                    <div className="bag-basket-aura aura-p1" />
                    <img
                      src={isBagOpen ? "/tas buka.png" : "/tas tutup.png"}
                      alt={isBagOpen ? "Tas Siaga Terbuka" : "Tas Siaga Tertutup"}
                      className="bag-sprite-img"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* ON-SCREEN CONTROLS (SOLO) */}
                <div className="pvp-split-controls p1 solo-controls">
                  <button
                    type="button"
                    className={`control-btn pvp-btn p1 ${isP1LeftActive ? 'is-active' : ''}`}
                    onPointerDown={handleP1LeftDown}
                    onPointerUp={handleP1LeftUp}
                    onPointerCancel={handleP1LeftUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Gerakkan Tas ke Kiri"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>

                  <div
                    ref={trackRef}
                    className={`pvp-track-container p1 solo-track ${isDraggingTrackRef.current ? 'is-dragging' : ''}`}
                    onPointerDown={handleTrackPointerDown}
                    onContextMenu={(e) => e.preventDefault()}
                    title="Geser atau sentuh track untuk kontrol instan"
                  >
                    <div className="pvp-track-bar">
                      <div
                        className="pvp-track-thumb p1"
                        style={{ left: `${bagX}%` }}
                      />
                    </div>
                    <span className="pvp-track-label">Geser atau sentuh track untuk kontrol instan</span>
                  </div>

                  <button
                    type="button"
                    className={`control-btn pvp-btn p1 ${isP1RightActive ? 'is-active' : ''}`}
                    onPointerDown={handleP1RightDown}
                    onPointerUp={handleP1RightUp}
                    onPointerCancel={handleP1RightUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Gerakkan Tas ke Kanan"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </article>
            </div>

            {/* Pause Overlay */}
            {isPaused && (
              <div className="pvp-pause-overlay">
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffd166', marginBottom: '10px' }}>
                  Permainan Dijeda (PAUSE)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="game-start-btn"
                >
                  <Play className="w-5 h-5" />
                  <span>Lanjutkan Permainan</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* PVP SPLITSCREEN LAYOUT (DUEL BERDAMPINGAN KIRI-KANAN) */
          <div key="playing-pvp" className="game-deck-body pvp-splitscreen-layout section-fade-in">
            {/* Top Shared Match Bar */}
            <div className="pvp-top-header">
              <div className="pvp-header-side p1">
                <span className="pvp-badge-tag p1">P1</span>
                <strong className="pvp-header-player-name">{playerName || 'Pemain 1'}</strong>
              </div>

              <div className="pvp-header-center">
                <div className="hud-pill hud-pill-timer">
                  <span className="hud-pill-val" style={{ color: timeLeft <= 10 ? '#ef4444' : '#ffd166' }}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="game-top-btn"
                  style={{ width: '38px', height: '38px', minHeight: '38px' }}
                  title={isPaused ? "Lanjutkan" : "Jeda"}
                  aria-label={isPaused ? "Lanjutkan" : "Jeda"}
                >
                  {isPaused ? <Play className="w-4 h-4 text-white drop-shadow" /> : <Pause className="w-4 h-4 text-white drop-shadow" />}
                </button>
              </div>

              <div className="pvp-header-side p2">
                <strong className="pvp-header-player-name">{player2Name || 'Pemain 2'}</strong>
                <span className="pvp-badge-tag p2">P2</span>
              </div>
            </div>

            {/* 2-Column Splitscreen Grid */}
            <div className="pvp-splitscreen-grid">
              {/* SISI KIRI: PEMAIN 1 */}
              <article className={`pvp-split-pane p1 ${isDangerShake ? 'is-danger-shake' : ''}`} aria-label="Arena Pemain 1">
                {/* HUD P1 */}
                <div className="pvp-split-hud p1">
                  <div className="pvp-hud-name-group">
                    <span className="pvp-badge-tag p1">P1</span>
                    <span className="pvp-hud-player-title">{playerName || 'Pemain 1'}</span>
                  </div>
                  <div className="hud-lives" aria-label={`Nyawa P1: ${lives}`}>
                    {[1, 2, 3].map((heartIndex) => (
                      <Heart
                        key={heartIndex}
                        className={`w-5 h-5 hud-heart ${heartIndex <= lives ? 'fill-rose-500' : 'empty'}`}
                      />
                    ))}
                  </div>
                  <div className="pvp-hud-score-group">
                    <span className="pvp-score-num p1">{score}</span>
                    {combo > 1 && <span className="hud-combo-badge p1">x{combo}</span>}
                  </div>
                </div>

                {/* Playfield P1 */}
                <div
                  ref={playfieldRef}
                  className="game-playfield pvp-playfield"
                  onPointerDown={handlePointerDownPlayfield}
                  onPointerMove={handlePointerMovePlayfield}
                  onPointerUp={handlePointerUpPlayfield}
                  onPointerCancel={handlePointerUpPlayfield}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="playfield-grid-bg" />
                  <div className="catch-zone-line" />

                  {/* Falling Items P1 */}
                  {fallingItems.map((item) => (
                    <div
                      key={item.uid}
                      className={`falling-item cat-${item.item.category}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`
                      }}
                    >
                      <div className="item-avatar">
                        {item.item.image ? (
                          <img
                            src={item.item.image}
                            alt={item.item.name}
                            className="item-avatar-img"
                            draggable={false}
                          />
                        ) : (
                          <span>{item.item.emoji}</span>
                        )}
                      </div>
                      <span className="item-name-tag">{item.item.name}</span>
                    </div>
                  ))}

                  {/* Feedbacks P1 */}
                  {feedbacks.map((fb) => (
                    <div
                      key={fb.uid}
                      className={`floating-feedback ${fb.type} player-p1`}
                      style={{
                        left: `${fb.x}%`,
                        top: `${fb.y}%`
                      }}
                    >
                      {fb.text}
                    </div>
                  ))}

                  {/* Bag P1 */}
                  <div
                    className={`player-bag bag-p1 ${bagSquish ? 'is-catching' : ''} ${isBagOpen ? 'is-open' : 'is-closed'}`}
                    style={{
                      left: `${bagX}%`
                    }}
                  >
                    <div className="bag-basket-aura aura-p1" />
                    <img
                      src={isBagOpen ? "/tas buka.png" : "/tas tutup.png"}
                      alt="Tas Siaga P1"
                      className="bag-sprite-img"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Controls P1 */}
                <div className="pvp-split-controls p1">
                  <button
                    type="button"
                    className={`control-btn pvp-btn p1 ${isP1LeftActive ? 'is-active' : ''}`}
                    onPointerDown={handleP1LeftDown}
                    onPointerUp={handleP1LeftUp}
                    onPointerCancel={handleP1LeftUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="P1 Kiri (A)"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>

                  <div
                    ref={pvpTrack1Ref}
                    className={`pvp-track-container p1 ${isDraggingPvpTrack1Ref.current ? 'is-dragging' : ''}`}
                    onPointerDown={handleP1TrackDown}
                    onContextMenu={(e) => e.preventDefault()}
                    title="Geser tas P1"
                  >
                    <div className="pvp-track-bar">
                      <div className="pvp-track-thumb p1" style={{ left: `${bagX}%` }} />
                    </div>
                    <span className="pvp-track-label">Geser Tas P1</span>
                  </div>

                  <button
                    type="button"
                    className={`control-btn pvp-btn p1 ${isP1RightActive ? 'is-active' : ''}`}
                    onPointerDown={handleP1RightDown}
                    onPointerUp={handleP1RightUp}
                    onPointerCancel={handleP1RightUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="P1 Kanan (D)"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </article>

              {/* SISI KANAN: PEMAIN 2 */}
              <article className={`pvp-split-pane p2 ${isDangerShake2 ? 'is-danger-shake' : ''}`} aria-label="Arena Pemain 2">
                {/* HUD P2 */}
                <div className="pvp-split-hud p2">
                  <div className="pvp-hud-name-group">
                    <span className="pvp-badge-tag p2">P2</span>
                    <span className="pvp-hud-player-title">{player2Name || 'Pemain 2'}</span>
                  </div>
                  <div className="hud-lives" aria-label={`Nyawa P2: ${lives2}`}>
                    {[1, 2, 3].map((heartIndex) => (
                      <Heart
                        key={heartIndex}
                        className={`w-5 h-5 hud-heart ${heartIndex <= lives2 ? 'fill-rose-500' : 'empty'}`}
                      />
                    ))}
                  </div>
                  <div className="pvp-hud-score-group">
                    <span className="pvp-score-num p2">{score2}</span>
                    {combo2 > 1 && <span className="hud-combo-badge p2">x{combo2}</span>}
                  </div>
                </div>

                {/* Playfield P2 */}
                <div
                  ref={playfieldRef2}
                  className="game-playfield pvp-playfield"
                  onPointerDown={handlePointerDownPlayfield2}
                  onPointerMove={handlePointerMovePlayfield2}
                  onPointerUp={handlePointerUpPlayfield2}
                  onPointerCancel={handlePointerUpPlayfield2}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="playfield-grid-bg" />
                  <div className="catch-zone-line" />

                  {/* Falling Items P2 */}
                  {fallingItems2.map((item) => (
                    <div
                      key={item.uid}
                      className={`falling-item cat-${item.item.category}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`
                      }}
                    >
                      <div className="item-avatar">
                        {item.item.image ? (
                          <img
                            src={item.item.image}
                            alt={item.item.name}
                            className="item-avatar-img"
                            draggable={false}
                          />
                        ) : (
                          <span>{item.item.emoji}</span>
                        )}
                      </div>
                      <span className="item-name-tag">{item.item.name}</span>
                    </div>
                  ))}

                  {/* Feedbacks P2 */}
                  {feedbacks2.map((fb) => (
                    <div
                      key={fb.uid}
                      className={`floating-feedback ${fb.type} player-p2`}
                      style={{
                        left: `${fb.x}%`,
                        top: `${fb.y}%`
                      }}
                    >
                      {fb.text}
                    </div>
                  ))}

                  {/* Bag P2 */}
                  <div
                    className={`player-bag bag-p2 ${bagSquish2 ? 'is-catching' : ''} ${isBagOpen2 ? 'is-open' : 'is-closed'}`}
                    style={{
                      left: `${bagX2}%`
                    }}
                  >
                    <div className="bag-basket-aura aura-p2" />
                    <img
                      src={isBagOpen2 ? "/tas buka.png" : "/tas tutup.png"}
                      alt="Tas Siaga P2"
                      className="bag-sprite-img"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Controls P2 */}
                <div className="pvp-split-controls p2">
                  <button
                    type="button"
                    className={`control-btn pvp-btn p2 ${isP2LeftActive ? 'is-active' : ''}`}
                    onPointerDown={handleP2LeftDown}
                    onPointerUp={handleP2LeftUp}
                    onPointerCancel={handleP2LeftUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="P2 Kiri"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>

                  <div
                    ref={pvpTrack2Ref}
                    className={`pvp-track-container p2 ${isDraggingPvpTrack2Ref.current ? 'is-dragging' : ''}`}
                    onPointerDown={handleP2TrackDown}
                    onContextMenu={(e) => e.preventDefault()}
                    title="Geser tas P2"
                  >
                    <div className="pvp-track-bar">
                      <div className="pvp-track-thumb p2" style={{ left: `${bagX2}%` }} />
                    </div>
                    <span className="pvp-track-label">Geser Tas P2</span>
                  </div>

                  <button
                    type="button"
                    className={`control-btn pvp-btn p2 ${isP2RightActive ? 'is-active' : ''}`}
                    onPointerDown={handleP2RightDown}
                    onPointerUp={handleP2RightUp}
                    onPointerCancel={handleP2RightUp}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="P2 Kanan"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </article>
            </div>

            {/* Pause Overlay */}
            {isPaused && (
              <div className="pvp-pause-overlay">
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffd166', marginBottom: '10px' }}>
                  Permainan Dijeda (PAUSE)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="game-start-btn"
                >
                  <Play className="w-5 h-5" />
                  <span>Lanjutkan Permainan</span>
                </button>
              </div>
            )}
          </div>
        )
      )}

      {/* ============================================================ */}
      {/* SCREEN 3: GAMEOVER & EVALUATION RESULT                       */}
      {/* ============================================================ */}
      {stage === 'gameover' && (
        <div key="gameover" className="game-deck-body game-stage-centered section-fade-in result-menu-stage">
          <article className="game-result-card game-result-pixar-panel" aria-label="Hasil Permainan">
            {/* 3D Decorative Corner Rivets */}
            <span className="board-rivet rivet-tl" aria-hidden="true" />
            <span className="board-rivet rivet-tr" aria-hidden="true" />
            <span className="board-rivet rivet-bl" aria-hidden="true" />
            <span className="board-rivet rivet-br" aria-hidden="true" />

            {/* Decorative Compass on top right of wooden frame */}
            <div className="board-decor-compass" aria-hidden="true" title="Kompas Petualang">
              <svg viewBox="0 0 48 48" className="compass-svg">
                <circle cx="24" cy="24" r="21" fill="url(#brassGrad)" stroke="#fef08a" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="16" fill="#082038" stroke="#92400e" strokeWidth="1.5" />
                <line x1="24" y1="9" x2="24" y2="13" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="35" x2="24" y2="39" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="24" x2="13" y2="24" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="35" y1="24" x2="39" y2="24" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                <polygon points="24,11 27,24 24,22 21,24" fill="#ef4444" />
                <polygon points="24,37 27,24 24,26 21,24" fill="#60a5fa" />
                <circle cx="24" cy="24" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              </svg>
            </div>

            {/* Decorative Leaves Sprouting at Bottom Corners */}
            <div className="board-decor-leaf leaf-left" aria-hidden="true">
              <svg viewBox="0 0 60 40" className="leaf-svg">
                <path d="M 0 35 C 10 15 35 10 45 25 C 25 35 15 35 0 35 Z" fill="#4ade80" />
                <path d="M 12 38 C 22 20 48 18 58 32 C 38 42 25 40 12 38 Z" fill="#22c55e" />
                <path d="M 2 34 C 18 26 32 24 44 26" stroke="#15803d" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="board-decor-leaf leaf-right" aria-hidden="true">
              <svg viewBox="0 0 60 40" className="leaf-svg">
                <path d="M 0 35 C 10 15 35 10 45 25 C 25 35 15 35 0 35 Z" fill="#4ade80" />
                <path d="M 12 38 C 22 20 48 18 58 32 C 38 42 25 40 12 38 Z" fill="#22c55e" />
                <path d="M 2 34 C 18 26 32 24 44 26" stroke="#15803d" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            {gameMode === 'solo' ? (
              // SOLO RESULT
              <>
                {/* Stars Pop */}
                <div className="result-stars-row">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`result-star-icon ${starIdx <= getStars() ? 'fill-amber-400' : 'empty'}`}
                    />
                  ))}
                </div>

                {/* Headline */}
                <div className="result-headline">
                  <h2>
                    {lives > 0 ? 'Misi Siaga Berhasil! 🎉' : 'Ketahanan Tas Habis! ⚠️'}
                  </h2>
                  <p>
                    {lives > 0
                      ? `Luar biasa, ${playerName || 'Pejuang Siaga'}! Kamu berhasil mengumpulkan logistik penting sebelum waktu habis.`
                      : `Tetap semangat, ${playerName || 'Pejuang Siaga'}! Selalu waspadai benda berbahaya dan barang pengecoh saat mengemas tas siaga.`}
                  </p>
                </div>

                {/* Unified Player Card for Solo */}
                <div className="solo-result-card-container">
                  <div className="pvp-player-card p1 is-winner">
                    <div className="pvp-card-header">
                      <span className="pvp-badge-tag p1">SOLO</span>
                      <strong>{playerName || 'Pemain'}</strong>
                      <span className="pvp-win-tag">{lives > 0 ? 'BERHASIL' : 'SELESAI'}</span>
                    </div>
                    <div className="pvp-card-score">{score} Poin</div>
                    <div className="pvp-card-detail">
                      <span>Benda Siaga: <strong>{totalSiagaCaught}</strong></span>
                      <span className="pvp-detail-dot">•</span>
                      <span>Sisa Ketahanan: <strong style={{ color: lives > 0 ? '#34d399' : '#f87171' }}>{lives} / 3 ❤️</strong></span>
                      <span className="pvp-detail-dot">•</span>
                      <span>Rekor: <strong style={{ color: '#ffd166' }}>{Math.max(highScore, score)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="result-stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Skor Akhir</span>
                    <span className="stat-val">{score}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Benda Siaga Terkumpul</span>
                    <span className="stat-val">{totalSiagaCaught}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Sisa Ketahanan</span>
                    <span className="stat-val" style={{ color: lives > 0 ? '#34d399' : '#f87171' }}>
                      {lives} / 3 ❤️
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Rekor Tertinggi</span>
                    <span className="stat-val" style={{ color: '#ffd166' }}>
                      {Math.max(highScore, score)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // PVP DUEL RESULT
              <>
                {/* Winner Trophy Icon */}
                <div className="pvp-winner-icon-row">
                  {winner === 'draw' ? (
                    <div className="pvp-draw-badge">🤝</div>
                  ) : (
                    <div className="pvp-trophy-badge">
                      <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Winner Headline */}
                <div className="result-headline pvp-headline">
                  <h2>
                    {winner === 'p1' && `🏆 ${playerName || 'Pemain 1'} Menang Duel!`}
                    {winner === 'p2' && `🏆 ${player2Name || 'Pemain 2'} Menang Duel!`}
                    {winner === 'draw' && `🤝 Hasil Seri / Seimbang!`}
                  </h2>
                  <p>
                    {winReason === 'knockout'
                      ? winner === 'p1'
                        ? `Tas ${player2Name || 'Pemain 2'} kehabisan ketahanan akibat menangkap benda bahaya!`
                        : `Tas ${playerName || 'Pemain 1'} kehabisan ketahanan akibat menangkap benda bahaya!`
                      : winner === 'draw'
                      ? `Kedua pemain memperoleh skor imbang yang sama!`
                      : `Pemenang berhasil mengumpulkan skor logistik siaga bencana tertinggi!`}
                  </p>
                </div>

                {/* Duel Comparison Cards */}
                <div className="pvp-comparison-grid">
                  {/* P1 Col */}
                  <div className={`pvp-player-card p1 ${winner === 'p1' ? 'is-winner' : ''}`}>
                    <div className="pvp-card-header">
                      <span className="pvp-badge-tag p1">P1</span>
                      <strong>{playerName || 'Pemain 1'}</strong>
                      {winner === 'p1' && <span className="pvp-win-tag">PEMENANG</span>}
                    </div>
                    <div className="pvp-card-score">{score} Poin</div>
                    <div className="pvp-card-detail">
                      <span>Benda Siaga: <strong>{totalSiagaCaught}</strong></span>
                      <span className="pvp-detail-dot">•</span>
                      <span>Sisa Nyawa: <strong>{lives} / 3 ❤️</strong></span>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="pvp-vs-divider">
                    <Swords className="w-5 h-5 text-amber-400" />
                    <span>VS</span>
                  </div>

                  {/* P2 Col */}
                  <div className={`pvp-player-card p2 ${winner === 'p2' ? 'is-winner' : ''}`}>
                    <div className="pvp-card-header">
                      <span className="pvp-badge-tag p2">P2</span>
                      <strong>{player2Name || 'Pemain 2'}</strong>
                      {winner === 'p2' && <span className="pvp-win-tag">PEMENANG</span>}
                    </div>
                    <div className="pvp-card-score">{score2} Poin</div>
                    <div className="pvp-card-detail">
                      <span>Benda Siaga: <strong>{totalSiagaCaught2}</strong></span>
                      <span className="pvp-detail-dot">•</span>
                      <span>Sisa Nyawa: <strong>{lives2} / 3 ❤️</strong></span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Educational Recap Section */}
            <div className="result-edu-section">
              <h3>
                <span className="edu-title-badge">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span>Pentingnya Isi Tas Siaga Bencana</span>
              </h3>
              <div className="edu-items-list">
                {GAME_ITEMS_CATALOG.filter(i => i.category === 'siaga').slice(0, 6).map((item) => (
                  <div key={item.id} className="edu-item-row">
                    <span className="edu-icon">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="edu-item-img" draggable={false} />
                      ) : (
                        item.emoji
                      )}
                    </span>
                    <div className="edu-item-text">
                      <strong>{item.name}</strong>
                      <p>{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="result-actions-row">
              <button
                type="button"
                onClick={handleStartGame}
                className="btn-result-action primary pixar-btn-replay"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{gameMode === 'pvp' ? 'Tanding Ulang (Duel)' : 'Main Lagi'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStage('start')}
                className="btn-result-action mode-switch-btn pixar-btn-mode"
              >
                <Users className="w-5 h-5" />
                <span>Ganti Mode</span>
              </button>

              <Link href="/" className="btn-result-action secondary pixar-btn-home">
                <House className="w-5 h-5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
