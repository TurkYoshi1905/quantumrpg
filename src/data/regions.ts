import { Region } from '../types/game';

export const regions: Record<string, Region> = {
  'orman': {
    id: 'orman',
    name: 'Kuantum Ormanı',
    description: 'Neon yeşil yapraklar arasında tehlikelerin gezindiği başlangıç bölgesi.',
    emoji: '🌲',
    requiredLevel: 1,
    background: 'bg-gradient-to-b from-green-950 to-green-900 border-green-500/30',
    enemies: ['orman_bocek', 'orman_tilki', 'orman_kok', 'orman_kurt', 'orman_yarasa'],
    bossId: 'boss_orman'
  },
  'bataklk': {
    id: 'bataklk',
    name: 'Kükürtlü Bataklık',
    description: 'Asit buharlarının yükseldiği, adım atmak bile tehlikeli olan zehirli bataklık.',
    emoji: '🐊',
    requiredLevel: 5,
    background: 'bg-gradient-to-b from-lime-950 to-yellow-950 border-lime-500/30',
    enemies: ['bataklk_suluk', 'bataklk_kaplumbaga', 'bataklk_timsah', 'bataklk_canta', 'bataklk_ilan'],
    bossId: 'boss_bataklk'
  },
  'magara': {
    id: 'magara',
    name: 'Kristal Mağarası',
    description: 'Sonsuz karanlığı aydınlatan devasa mavi kristallerle dolu soğuk mağaralar.',
    emoji: '🧊',
    requiredLevel: 7,
    background: 'bg-gradient-to-b from-blue-950 to-cyan-950 border-cyan-500/30',
    enemies: ['magara_golem', 'magara_yarasa', 'magara_ejder', 'magara_rune', 'magara_ruh'],
    bossId: 'boss_magara'
  },
  'liman': {
    id: 'liman', 
    name: 'Pas Limanı',
    description: 'Yüzyıl önce terk edilmiş çürük iskele ve batan gemilerin arasında tehlike bekliyor.',
    emoji: '⚓',
    requiredLevel: 11,
    background: 'bg-gradient-to-b from-slate-950 to-zinc-900 border-slate-500/30',
    enemies: ['liman_hortum', 'liman_kopek', 'liman_iskelet', 'liman_ahtapot', 'liman_kaplan'],
    bossId: 'boss_liman'
  },
  'kale': {
    id: 'kale',
    name: 'Karanlık Kale',
    description: 'Uzun zaman önce terk edilmiş, şimdi karanlık varlıkların mesken tuttuğu kızıl kale.',
    emoji: '🏰',
    requiredLevel: 13,
    background: 'bg-gradient-to-b from-red-950 to-purple-950 border-red-500/30',
    enemies: ['kale_sovalye', 'kale_cin', 'kale_vampir', 'kale_buyucu', 'kale_avci'],
    bossId: 'boss_kale'
  },
  'col': {
    id: 'col',
    name: 'Kızıl Çöl',
    description: 'Güneş taşı eritir, kumlar kaynar. Burada ölüm sıcaklıktan önce gelir.',
    emoji: '🏜️',
    requiredLevel: 16,
    background: 'bg-gradient-to-b from-orange-950 to-red-900 border-orange-500/30',
    enemies: ['col_akrep', 'col_yilan', 'col_deve', 'col_eleman', 'col_cin'],
    bossId: 'boss_col'
  },
  'void': {
    id: 'void',
    name: 'Void Uzayı',
    description: 'Gerçekliğin parçalandığı, sadece en güçlülerin hayatta kalabileceği derin uzay boşluğu.',
    emoji: '🌌',
    requiredLevel: 18,
    background: 'bg-gradient-to-b from-purple-950 to-black border-purple-500/30',
    enemies: ['void_ajan', 'void_hayalet', 'void_canavar', 'void_bocek', 'void_ruh'],
    bossId: 'boss_void'
  },
  'firtina': {
    id: 'firtina',
    name: 'Gümüş Fırtınası',
    description: 'Bulutların üstünde, şimşeklerin arasında süzülen gök adaları ve fırtına varlıkları.',
    emoji: '⛈️',
    requiredLevel: 20,
    background: 'bg-gradient-to-b from-sky-950 to-indigo-950 border-sky-400/30',
    enemies: ['firtina_kartal', 'firtina_bulut', 'firtina_yarasa', 'firtina_devasa', 'firtina_cin'],
    bossId: 'boss_firtina'
  },
  'atesgolu': {
    id: 'atesgolu',
    name: 'Ateş Gölü',
    description: 'Erimiş kayaların üzerinde yüzen lavların ortasında, tanrıların bile korktukları yer.',
    emoji: '🌋',
    requiredLevel: 23,
    background: 'bg-gradient-to-b from-red-950 to-orange-950 border-red-400/30',
    enemies: ['ates_bocek', 'ates_golem', 'ates_ejder', 'ates_bekci', 'ates_firtina'],
    bossId: 'boss_atesgolu'
  },
  'zaman': {
    id: 'zaman',
    name: "Zamanın Kırığı",
    description: "Geçmiş, şimdi ve gelecek iç içe geçmiş. Kim olduğunu unutmadan çıkabilirsen şanslısın.",
    emoji: '⌛',
    requiredLevel: 27,
    background: 'bg-gradient-to-b from-violet-950 to-fuchsia-950 border-violet-400/30',
    enemies: ['zaman_golge', 'zaman_robot', 'zaman_hirsiz', 'zaman_paradoks', 'zaman_yanki'],
    bossId: 'boss_zaman'
  },
};
