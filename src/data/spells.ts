import { Spell } from '../types/game';

export const spells: Record<string, Spell> = {
  'atestop': { id: 'atestop', name: 'Ateş Topu', description: 'Düşmana kavurucu bir ateş topu fırlatır.', emoji: '🔥', element: 'ateş', damage: 35, manaCost: 15, effect: 'burn', effectChance: 0.2, unlockLevel: 1 },
  'buzmizrak': { id: 'buzmizrak', name: 'Buz Mızrağı', description: 'Keskin bir buz mızrağı ile düşmanı dondurabilir.', emoji: '🧊', element: 'buz', damage: 30, manaCost: 12, effect: 'freeze', effectChance: 0.25, unlockLevel: 2 },
  'simsekdarbesi': { id: 'simsekdarbesi', name: 'Şimşek Darbesi', description: 'Gökten düşen güçlü bir yıldırım.', emoji: '⚡', element: 'şimşek', damage: 40, manaCost: 18, effect: 'stun', effectChance: 0.15, unlockLevel: 3, shopPrice: 150 },
  'isikpatlama': { id: 'isikpatlama', name: 'Işık Patlaması', description: 'Karanlık varlıkları yok eden parlak bir ışık.', emoji: '✨', element: 'ışık', damage: 45, manaCost: 20, unlockLevel: 4, shopPrice: 200 },
  'sifaisini': { id: 'sifaisini', name: 'Şifa Işını', description: 'Yaraları iyileştiren kutsal enerji.', emoji: '💖', element: 'ışık', damage: 0, healAmount: 60, manaCost: 25, effect: 'heal', effectChance: 1, unlockLevel: 5, shopPrice: 400 },
  'voidcatlagi': { id: 'voidcatlagi', name: 'Void Çatlağı', description: 'Uzay-zamanı yırtarak gerçek hasar verir.', emoji: '🌌', element: 'void', damage: 60, manaCost: 30, unlockLevel: 5, shopPrice: 300 },
  'golgedalgasi': { id: 'golgedalgasi', name: 'Gölge Dalgası', description: 'Ağır, karanlık bir enerji dalgası.', emoji: '🌑', element: 'fiziksel', damage: 50, manaCost: 22, unlockLevel: 6, shopPrice: 350 },
  'kalkanbuyusu': { id: 'kalkanbuyusu', name: 'Kalkan Büyüsü', description: 'Bir sonraki saldırıyı tamamen emer.', emoji: '🛡️', element: 'fiziksel', damage: 0, manaCost: 20, effect: 'shield', effectChance: 1, unlockLevel: 7, shopPrice: 450 },
  'kuantumpatlama': { id: 'kuantumpatlama', name: 'Kuantum Patlama', description: 'Kararsız enerjilerin zincirleme patlaması.', emoji: '💥', element: 'void', damage: 80, manaCost: 40, effect: 'stun', effectChance: 0.3, unlockLevel: 8, shopPrice: 500 },
  'buzfirtinasi': { id: 'buzfirtinasi', name: 'Buz Fırtınası', description: 'Her şeyi donduran mutlak sıfır fırtınası.', emoji: '❄️', element: 'buz', damage: 70, manaCost: 35, effect: 'freeze', effectChance: 0.4, unlockLevel: 10, shopPrice: 600 },
  'cehennematesi': { id: 'cehennematesi', name: 'Cehennem Ateşi', description: 'Yok edilemez cehennem alevleri.', emoji: '🌋', element: 'ateş', damage: 90, manaCost: 45, effect: 'burn', effectChance: 0.35, unlockLevel: 12, shopPrice: 750 },
  'isikkilici': { id: 'isikkilici', name: 'Işık Kılıcı', description: 'Karanlığı yaratan mutlak ışık silahı.', emoji: '⚔️', element: 'ışık', damage: 100, manaCost: 50, unlockLevel: 14, shopPrice: 900 }
};
