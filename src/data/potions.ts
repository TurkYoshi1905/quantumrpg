export interface Potion {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  maxStack: number;
  effect: 'heal_hp' | 'heal_mana' | 'shield_charges' | 'speed_boost' | 'damage_boost';
  value: number;
}

export const potions: Record<string, Potion> = {
  // ── Temel İksirler ────────────────────────────────────────────────────────────
  can_iksiri: {
    id: 'can_iksiri',
    name: 'Can İksiri',
    description: '50 can puanı geri kazanırsın.',
    emoji: '🧪',
    price: 40,
    maxStack: 5,
    effect: 'heal_hp',
    value: 50,
  },
  mana_iksiri: {
    id: 'mana_iksiri',
    name: 'Mana İksiri',
    description: '40 mana puanı geri kazanırsın. Büyüler için yakıt.',
    emoji: '💙',
    price: 35,
    maxStack: 5,
    effect: 'heal_mana',
    value: 40,
  },
  kalkan_iksiri: {
    id: 'kalkan_iksiri',
    name: 'Kalkan İksiri',
    description: 'Bir sonraki 3 saldırıya karşı tam koruma sağlar.',
    emoji: '🛡️',
    price: 80,
    maxStack: 3,
    effect: 'shield_charges',
    value: 3,
  },
  hiz_iksiri: {
    id: 'hiz_iksiri',
    name: 'Hız İksiri',
    description: '3 tur boyunca iki kez hareket edersin.',
    emoji: '⚡',
    price: 90,
    maxStack: 3,
    effect: 'speed_boost',
    value: 3,
  },
  hasar_iksiri: {
    id: 'hasar_iksiri',
    name: 'Hasar Arttırıcı İksir',
    description: '3 tur boyunca tüm hasar %50 artar.',
    emoji: '🔥',
    price: 75,
    maxStack: 3,
    effect: 'damage_boost',
    value: 3,
  },

  // ── Orta İksirler ─────────────────────────────────────────────────────────────
  iri_can_iksiri: {
    id: 'iri_can_iksiri',
    name: 'Can Şişesi',
    description: '120 can puanı geri kazanırsın — büyük yaraları bile kapatır.',
    emoji: '🫙',
    price: 90,
    maxStack: 5,
    effect: 'heal_hp',
    value: 120,
  },
  saf_mana_iksiri: {
    id: 'saf_mana_iksiri',
    name: 'Saf Mana İksiri',
    description: '80 mana puanı geri kazanırsın — arındırılmış büyü enerjisi.',
    emoji: '💎',
    price: 80,
    maxStack: 5,
    effect: 'heal_mana',
    value: 80,
  },
  demir_kalkan: {
    id: 'demir_kalkan',
    name: 'Demir Kalkan',
    description: '5 saldırıyı tamamen engeller — demir gibi sert.',
    emoji: '⚙️',
    price: 150,
    maxStack: 3,
    effect: 'shield_charges',
    value: 5,
  },
  titan_gucu: {
    id: 'titan_gucu',
    name: 'Titan Gücü',
    description: '5 tur boyunca tüm hasarın %50 artar — titan gibi vururusun.',
    emoji: '⚒️',
    price: 140,
    maxStack: 3,
    effect: 'damage_boost',
    value: 5,
  },
  sampiyon_hizi: {
    id: 'sampiyon_hizi',
    name: 'Şampiyon Hızı',
    description: '5 tur boyunca iki kez hareket edersin — şampiyon gibi koşarsın.',
    emoji: '💨',
    price: 160,
    maxStack: 3,
    effect: 'speed_boost',
    value: 5,
  },

  // ── Nadir İksirler ────────────────────────────────────────────────────────────
  yasam_ozu: {
    id: 'yasam_ozu',
    name: 'Yaşam Özü',
    description: '250 can puanı geri kazanırsın — bir hayat kurtarır.',
    emoji: '🌹',
    price: 250,
    maxStack: 3,
    effect: 'heal_hp',
    value: 250,
  },
  mana_kristali: {
    id: 'mana_kristali',
    name: 'Mana Kristali',
    description: '200 mana puanı geri kazanırsın — derin bir sihir rezervi.',
    emoji: '🔮',
    price: 200,
    maxStack: 3,
    effect: 'heal_mana',
    value: 200,
  },
  efsane_kalkani: {
    id: 'efsane_kalkani',
    name: 'Efsane Kalkan',
    description: '8 saldırıyı tamamen engeller — efsanevi koruma.',
    emoji: '🏛️',
    price: 350,
    maxStack: 2,
    effect: 'shield_charges',
    value: 8,
  },
  tanrisal_darbe: {
    id: 'tanrisal_darbe',
    name: 'Tanrısal Darbe',
    description: '8 tur boyunca tüm hasarın %50 artar — tanrısal yıkım.',
    emoji: '🌪️',
    price: 400,
    maxStack: 2,
    effect: 'damage_boost',
    value: 8,
  },
  omega_hizi: {
    id: 'omega_hizi',
    name: 'Omega Hızı',
    description: '8 tur boyunca iki kez hareket edersin — ışık hızında.',
    emoji: '🌀',
    price: 380,
    maxStack: 2,
    effect: 'speed_boost',
    value: 8,
  },
};

export const potionList = Object.values(potions);
