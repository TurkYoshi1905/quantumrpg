export interface Potion {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  maxStack: number; // max kaç tane taşınabilir
  effect: 'heal_hp' | 'heal_mana' | 'shield_charges' | 'speed_boost' | 'damage_boost';
  value: number; // heal miktarı veya şarj sayısı veya tur sayısı
}

export const potions: Record<string, Potion> = {
  can_iksiri: {
    id: 'can_iksiri',
    name: 'Can İksiri',
    description: '50 can puanı geri kazanırsın. Savaşın ortasında bile kullanılabilir.',
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
    description: 'Bir sonraki 3 saldırıya karşı tam koruma sağlar. Hasar almadan savuşturursun.',
    emoji: '🛡️',
    price: 80,
    maxStack: 3,
    effect: 'shield_charges',
    value: 3,
  },
  hiz_iksiri: {
    id: 'hiz_iksiri',
    name: 'Hız İksiri',
    description: '3 tur boyunca iki kez hareket edersin — her turda hem saldırır hem de bir aksiyon alırsın.',
    emoji: '⚡',
    price: 90,
    maxStack: 3,
    effect: 'speed_boost',
    value: 3,
  },
  hasar_iksiri: {
    id: 'hasar_iksiri',
    name: 'Hasar Arttırıcı İksir',
    description: '3 tur boyunca tüm saldırı ve büyü hasarın %50 artar.',
    emoji: '🔥',
    price: 75,
    maxStack: 3,
    effect: 'damage_boost',
    value: 3,
  },
};

export const potionList = Object.values(potions);
