import { Region } from '../types/game';

export const regions: Record<string, Region> = {
  // ── 1 ── Kuantum Ormanı ── req 1, boss lv 5 ─────────────────────────────────
  'orman': {
    id: 'orman',
    name: 'Kuantum Ormanı',
    description: 'Neon yeşil yapraklar arasında tehlikelerin gezindiği başlangıç bölgesi.',
    emoji: '🌲',
    requiredLevel: 1,
    background: 'bg-gradient-to-b from-green-950 to-green-900 border-green-500/30',
    enemies: ['orman_bocek', 'orman_tilki', 'orman_kok', 'orman_kurt', 'orman_yarasa'],
    bossId: 'boss_orman',
  },
  // ── 2 ── Kükürtlü Bataklık ── req 5, boss lv 9 ──────────────────────────────
  'bataklk': {
    id: 'bataklk',
    name: 'Kükürtlü Bataklık',
    description: 'Asit buharlarının yükseldiği, adım atmak bile tehlikeli olan zehirli bataklık.',
    emoji: '🐊',
    requiredLevel: 5,
    background: 'bg-gradient-to-b from-lime-950 to-yellow-950 border-lime-500/30',
    enemies: ['bataklk_suluk', 'bataklk_kaplumbaga', 'bataklk_timsah', 'bataklk_canta', 'bataklk_ilan'],
    bossId: 'boss_bataklk',
  },
  // ── 3 ── Kristal Mağarası ── req 9, boss lv 14 ──────────────────────────────
  'magara': {
    id: 'magara',
    name: 'Kristal Mağarası',
    description: 'Sonsuz karanlığı aydınlatan devasa mavi kristallerle dolu soğuk mağaralar.',
    emoji: '🧊',
    requiredLevel: 9,
    background: 'bg-gradient-to-b from-blue-950 to-cyan-950 border-cyan-500/30',
    enemies: ['magara_golem', 'magara_yarasa', 'magara_ejder', 'magara_rune', 'magara_ruh'],
    bossId: 'boss_magara',
  },
  // ── 4 ── Pas Limanı ── req 14, boss lv 19 ───────────────────────────────────
  'liman': {
    id: 'liman',
    name: 'Pas Limanı',
    description: 'Yüzyıl önce terk edilmiş çürük iskele ve batan gemilerin arasında tehlike bekliyor.',
    emoji: '⚓',
    requiredLevel: 14,
    background: 'bg-gradient-to-b from-slate-950 to-zinc-900 border-slate-500/30',
    enemies: ['liman_hortum', 'liman_kopek', 'liman_iskelet', 'liman_ahtapot', 'liman_kaplan'],
    bossId: 'boss_liman',
  },
  // ── 5 ── Karanlık Kale ── req 19, boss lv 24 ────────────────────────────────
  'kale': {
    id: 'kale',
    name: 'Karanlık Kale',
    description: 'Uzun zaman önce terk edilmiş, şimdi karanlık varlıkların mesken tuttuğu kızıl kale.',
    emoji: '🏰',
    requiredLevel: 19,
    background: 'bg-gradient-to-b from-red-950 to-purple-950 border-red-500/30',
    enemies: ['kale_sovalye', 'kale_cin', 'kale_vampir', 'kale_buyucu', 'kale_avci'],
    bossId: 'boss_kale',
  },
  // ── 6 ── Kızıl Çöl ── req 24, boss lv 29 ───────────────────────────────────
  'col': {
    id: 'col',
    name: 'Kızıl Çöl',
    description: 'Güneş taşı eritir, kumlar kaynar. Burada ölüm sıcaklıktan önce gelir.',
    emoji: '🏜️',
    requiredLevel: 24,
    background: 'bg-gradient-to-b from-orange-950 to-red-900 border-orange-500/30',
    enemies: ['col_akrep', 'col_yilan', 'col_deve', 'col_eleman', 'col_cin'],
    bossId: 'boss_col',
  },
  // ── 7 ── Void Uzayı ── req 29, boss lv 34 ───────────────────────────────────
  'void': {
    id: 'void',
    name: 'Void Uzayı',
    description: 'Gerçekliğin parçalandığı, sadece en güçlülerin hayatta kalabileceği derin uzay boşluğu.',
    emoji: '🌌',
    requiredLevel: 29,
    background: 'bg-gradient-to-b from-purple-950 to-black border-purple-500/30',
    enemies: ['void_ajan', 'void_hayalet', 'void_canavar', 'void_bocek', 'void_ruh'],
    bossId: 'boss_void',
  },
  // ── 8 ── Gümüş Fırtınası ── req 34, boss lv 39 ──────────────────────────────
  'firtina': {
    id: 'firtina',
    name: 'Gümüş Fırtınası',
    description: 'Bulutların üstünde, şimşeklerin arasında süzülen gök adaları ve fırtına varlıkları.',
    emoji: '⛈️',
    requiredLevel: 34,
    background: 'bg-gradient-to-b from-sky-950 to-indigo-950 border-sky-400/30',
    enemies: ['firtina_kartal', 'firtina_bulut', 'firtina_yarasa', 'firtina_devasa', 'firtina_cin'],
    bossId: 'boss_firtina',
  },
  // ── 9 ── Ateş Gölü ── req 39, boss lv 44 ────────────────────────────────────
  'atesgolu': {
    id: 'atesgolu',
    name: 'Ateş Gölü',
    description: 'Erimiş kayaların üzerinde yüzen lavların ortasında, tanrıların bile korktukları yer.',
    emoji: '🌋',
    requiredLevel: 39,
    background: 'bg-gradient-to-b from-red-950 to-orange-950 border-red-400/30',
    enemies: ['ates_bocek', 'ates_golem', 'ates_ejder', 'ates_bekci', 'ates_firtina'],
    bossId: 'boss_atesgolu',
  },
  // ── 10 ── Zamanın Kırığı ── req 44, boss lv 50 ──────────────────────────────
  'zaman': {
    id: 'zaman',
    name: 'Zamanın Kırığı',
    description: 'Geçmiş, şimdi ve gelecek iç içe geçmiş. Kim olduğunu unutmadan çıkabilirsen şanslısın.',
    emoji: '⌛',
    requiredLevel: 44,
    background: 'bg-gradient-to-b from-violet-950 to-fuchsia-950 border-violet-400/30',
    enemies: ['zaman_golge', 'zaman_robot', 'zaman_hirsiz', 'zaman_paradoks', 'zaman_yanki'],
    bossId: 'boss_zaman',
  },
  // ── 11 ── Gölge Labirenti ── req 50, boss lv 55 ─────────────────────────────
  'golge': {
    id: 'golge',
    name: 'Gölge Labirenti',
    description: 'İçinden çıkılmaz karanlık koridorlar — her köşede bambaşka bir kabus seni bekliyor.',
    emoji: '🌑',
    requiredLevel: 50,
    background: 'bg-gradient-to-b from-neutral-950 to-slate-950 border-neutral-500/30',
    enemies: ['golge_yansima', 'golge_avci', 'golge_canavar', 'golge_duvar', 'golge_efendi'],
    bossId: 'boss_golge',
  },
  // ── 12 ── Ebedi Tundra ── req 55, boss lv 60 ────────────────────────────────
  'tundra': {
    id: 'tundra',
    name: 'Ebedi Tundra',
    description: 'Güneşin hiç doğmadığı donmuş bir düzlük — burada her nefes kristale dönüşür.',
    emoji: '🏔️',
    requiredLevel: 55,
    background: 'bg-gradient-to-b from-cyan-950 to-blue-950 border-cyan-300/30',
    enemies: ['tundra_ayisi', 'tundra_kurt', 'tundra_firtina', 'tundra_golem', 'tundra_ejder'],
    bossId: 'boss_tundra',
  },
  // ── 13 ── Derin Uçurum ── req 60, boss lv 65 ────────────────────────────────
  'derin': {
    id: 'derin',
    name: 'Derin Uçurum',
    description: 'Işığın ulaşamadığı sonsuz derinliklerde, bilinmeyenin gözleri seni izliyor.',
    emoji: '🌊',
    requiredLevel: 60,
    background: 'bg-gradient-to-b from-blue-950 to-indigo-950 border-blue-400/30',
    enemies: ['derin_balik', 'derin_balina', 'derin_ejder', 'derin_medusa', 'derin_levyatan'],
    bossId: 'boss_derin',
  },
  // ── 14 ── Yıldız Mezarlığı ── req 65, boss lv 70 ────────────────────────────
  'uzay': {
    id: 'uzay',
    name: 'Yıldız Mezarlığı',
    description: 'Milyarlarca yıl önce sönen yıldızların kalıntıları arasında gezinen ölümsüz varlıklar.',
    emoji: '☄️',
    requiredLevel: 65,
    background: 'bg-gradient-to-b from-indigo-950 to-violet-950 border-indigo-300/30',
    enemies: ['uzay_meteor', 'uzay_kara', 'uzay_gezegen', 'uzay_yildiz', 'uzay_korsani'],
    bossId: 'boss_uzay',
  },
  // ── 15 ── Zihin Sarayı ── req 70, boss lv 75 ────────────────────────────────
  'zihin': {
    id: 'zihin',
    name: 'Zihin Sarayı',
    description: 'Gerçek mi hayal mi? Korkuların somutlaştığı, aklın sınırını zorlayan boyut.',
    emoji: '🧠',
    requiredLevel: 70,
    background: 'bg-gradient-to-b from-fuchsia-950 to-pink-950 border-fuchsia-400/30',
    enemies: ['zihin_korku', 'zihin_hayal', 'zihin_enigma', 'zihin_ani', 'zihin_efendi'],
    bossId: 'boss_zihin',
  },
  // ── 16 ── Kaos Düzlemi ── req 75, boss lv 80 ────────────────────────────────
  'kaos': {
    id: 'kaos',
    name: 'Kaos Düzlemi',
    description: 'Fizik yasalarının çöktüğü, her şeyin olası ya da imkânsız olduğu entropi alanı.',
    emoji: '♾️',
    requiredLevel: 75,
    background: 'bg-gradient-to-b from-rose-950 to-orange-950 border-rose-400/30',
    enemies: ['kaos_parcasi', 'kaos_savasci', 'kaos_canavar', 'kaos_tanri', 'kaos_efendi'],
    bossId: 'boss_kaos',
  },
  // ── 17 ── Kan Ormanı ── req 80, boss lv 85 ──────────────────────────────────
  'kan': {
    id: 'kan',
    name: 'Kan Ormanı',
    description: 'Ağaçların damarında kan akar, zemin her adımda kırmızı — bu ormandan sağ dönen olmaz.',
    emoji: '🩸',
    requiredLevel: 80,
    background: 'bg-gradient-to-b from-red-950 to-rose-950 border-red-300/30',
    enemies: ['kan_vampir', 'kan_kurt', 'kan_agac', 'kan_avcisi', 'kan_ejder'],
    bossId: 'boss_kan',
  },
  // ── 18 ── Sonsuz Kristal ── req 85, boss lv 90 ──────────────────────────────
  'sonsuz': {
    id: 'sonsuz',
    name: 'Sonsuz Kristal',
    description: 'Evrenin özünden damıtılmış saf enerji kristalleri — dokunan her şeyi değiştirir.',
    emoji: '💎',
    requiredLevel: 85,
    background: 'bg-gradient-to-b from-teal-950 to-cyan-950 border-teal-300/30',
    enemies: ['sonsuz_golem', 'sonsuz_ejder', 'sonsuz_koruyucu', 'sonsuz_yok', 'sonsuz_tac'],
    bossId: 'boss_sonsuz',
  },
  // ── 19 ── Tanrıların Tepesi ── req 90, boss lv 95 ───────────────────────────
  'tanri': {
    id: 'tanri',
    name: 'Tanrıların Tepesi',
    description: 'Mortallerin adım atmasının yasak olduğu zirve — burada tanrıların kalıntıları savaşır.',
    emoji: '⚡',
    requiredLevel: 90,
    background: 'bg-gradient-to-b from-amber-950 to-yellow-950 border-amber-300/30',
    enemies: ['tanri_savasci', 'tanri_cin', 'tanri_kartal', 'tanri_koruyucu', 'tanri_kral'],
    bossId: 'boss_tanri',
  },
  // ── 20 ── Evrenin Sonu ── req 95, boss lv 100 ───────────────────────────────
  'omega': {
    id: 'omega',
    name: 'Evrenin Sonu',
    description: 'Varoluşun son noktası. Buraya ulaşan, her şeyin neden var olduğunu anlar — ya da yok olur.',
    emoji: '🌌',
    requiredLevel: 95,
    background: 'bg-gradient-to-b from-black to-violet-950 border-violet-200/20',
    enemies: ['omega_varlik', 'omega_yaratan', 'omega_yok', 'omega_sifir', 'omega_son'],
    bossId: 'boss_omega',
  },
};
