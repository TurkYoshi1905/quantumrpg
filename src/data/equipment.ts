import { Equipment } from '../types/game';

export const equipment: Record<string, Equipment> = {
  // Silahlar
  'silah_demir': { id: 'silah_demir', name: 'Eski Yoldaş', description: 'Bin savaştan çıkmış, tutamağı bile yıpranmış. Ama hâlâ keser.', emoji: '🗡️', slot: 'silah', statBonus: { attack: 15 }, price: 100, requiredLevel: 1 },
  'silah_kuantum': { id: 'silah_kuantum', name: 'Titreyen Dil', description: 'Bıçak sürekli uğuldar — duyanlar diyor ki içinde bir şeyler fısıldar.', emoji: '⚡', slot: 'silah', statBonus: { attack: 30 }, price: 350, requiredLevel: 5 },
  'silah_void': { id: 'silah_void', name: "Gece'nin Nefesi", description: 'Çektiğinde çevreniz kararır. Bıraktığınızda soluk verir gibi ses çıkarır.', emoji: '🌌', slot: 'silah', statBonus: { attack: 50, speed: 10 }, price: 700, requiredLevel: 10 },
  'silah_ejder': { id: 'silah_ejder', name: 'Son Ejderha Dişi', description: "Büyük Yıkım'dan önce son ejderhanın ağzından koparılmış. Hâlâ sıcak.", emoji: '🐉', slot: 'silah', statBonus: { attack: 80 }, price: 1200, requiredLevel: 15 },

  // Zırhlar
  'zirh_deri': { id: 'zirh_deri', name: "Seyyahın Hırkası", description: 'Üzerinde sayısız yolun tozu var. Giyen biri her zaman bir yere gider.', emoji: '🦺', slot: 'zirh', statBonus: { defense: 10 }, price: 80, requiredLevel: 1 },
  'zirh_kristal': { id: 'zirh_kristal', name: 'Donmuş Cennet', description: "Mağara ejderinin nefesi bu kristalleri pişirdi. Soğuk ama kırılmaz.", emoji: '💎', slot: 'zirh', statBonus: { defense: 25 }, price: 300, requiredLevel: 5 },
  'zirh_gece': { id: 'zirh_gece', name: "Gece'nin Cildi", description: 'Karanlıkta giyen görünmez olmaz — ama düşman bir an duraksıyor.', emoji: '🧥', slot: 'zirh', statBonus: { defense: 40, maxHp: 20 }, price: 650, requiredLevel: 10 },
  'zirh_tanrisal': { id: 'zirh_tanrisal', name: 'Kıyamet Öncesi', description: "Tanrıların son gün için dövdüğü, hiç giyilmemiş bir zırh. Ta ki şimdi.", emoji: '🛡️', slot: 'zirh', statBonus: { defense: 70, maxHp: 50 }, price: 1100, requiredLevel: 15 },

  // Yüzükler
  'yuzuk_guc': { id: 'yuzuk_guc', name: "Demircinin Hatırası", description: 'Ustası onu yaptıktan sonra bir daha çekiç tutmadı. Sebebini kimse bilmez.', emoji: '💍', slot: 'yuzuk', statBonus: { attack: 10, defense: 5 }, price: 150, requiredLevel: 3 },
  'yuzuk_arcane': { id: 'yuzuk_arcane', name: 'Mavi Gözyaşı', description: "Bir büyücünün en son kristalinden yapılmış. Mana akar, ağlar gibi.", emoji: '🧿', slot: 'yuzuk', statBonus: { maxMana: 30 }, price: 250, requiredLevel: 6 },

  // Kolyeler
  'kolye_saglik': { id: 'kolye_saglik', name: "Annenin Emaneti", description: "Sıradan görünüyor ama takan biri hiçbir savaştan ölü çıkmadı.", emoji: '📿', slot: 'kolye', statBonus: { maxHp: 40 }, price: 200, requiredLevel: 3 },
  'kolye_quantum': { id: 'kolye_quantum', name: 'Paradoks Kalbi', description: "Hem var hem yok. Hem saldırır hem korur. Anlamaya çalışmayın.", emoji: '♾️', slot: 'kolye', statBonus: { attack: 20, defense: 20 }, price: 800, requiredLevel: 12 }
};
