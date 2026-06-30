export type ChangelogCategory = 'yenilik' | 'geliştirme' | 'düzeltme' | 'teknik';

export interface ChangelogEntry {
  id: string;
  category: ChangelogCategory;
  title: string;
  description: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  summary: string;
  entries: ChangelogEntry[];
}

export const CATEGORY_META: Record<ChangelogCategory, { label: string; color: string; bg: string; border: string }> = {
  yenilik:    { label: 'Yeni Özellik', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  geliştirme: { label: 'Geliştirme',   color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30'    },
  düzeltme:   { label: 'Düzeltme',     color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30'   },
  teknik:     { label: 'Teknik',        color: 'text-slate-400',   bg: 'bg-slate-400/10',   border: 'border-slate-400/30'   },
};

export const changelog: ChangelogVersion[] = [
  // ── v0.0.4 ───────────────────────────────────────────────────────────────────
  {
    version: 'v0.0.4',
    date: '29 Haziran 2026',
    summary: 'Ünvan sistemi, büyü slot yükü, 10 yeni büyü, 15 yeni iksir, 40 yeni ekipman. En büyük içerik güncellemesi.',
    entries: [
      {
        id: 'v4e1',
        category: 'yenilik',
        title: 'Ünvan Sistemi — Her 10 Seviyede Yeni Unvan + Altın Ödülü',
        description: "11 kademeli ünvan sistemi eklendi: Gezgin (1-9), Acemi Savaşçı (10), Kaşif (20), Savaşçı (30), Şampiyon (40), Usta (50), Efsane (60), Titan (70), Yarı-Tanrı (80), Tanrı (90), Omega (100). Her milestone geçişinde otomatik altın ödülü: Sv.10'da 500, 20'de 1.000, 50'de 3.000, 100'de 20.000 altına kadar. Karakter sayfasında tüm tier ilerlemesi ve sonraki milestone bilgisi görüntülenir.",
      },
      {
        id: 'v4e2',
        category: 'yenilik',
        title: 'Büyü Slot Sistemi — Savaşta En Fazla 10 Büyü',
        description: 'Karakter sayfasına "Büyü Yükü" sekmesi eklendi. 10 numaralı slot sisteminde öğrenilen büyüler savaş yüküne atanabiliyor. Slot\'a tıkla → seç (altın çerçeve) → aşağıdan büyü ekle. İki dolu slota sırayla tıklayarak yer değiştirme yapılabiliyor. Her slot üzerindeki × butonu ile büyü çıkarılıyor. Savaşta artık sadece yüklenmiş büyüler gösterilmektedir; tüm öğrenilen büyüler değil.',
      },
      {
        id: 'v4e3',
        category: 'yenilik',
        title: '10 Yeni Büyü — Orta ve Yüksek Seviye',
        description: 'Gökyüzü Gürültüsü (şimşek, lv15), Void Yarığı (void, lv18), Buz Zinciri (buz/dondur %45, lv20), Güneş Patlaması (ışık 110 hasar, lv25), Arındırıcı Ateş (ateş/yanma %50, lv28), Karanlık Dalga (void/sersem, lv30), Büyük Şifa (150 can, lv35), Sonsuz Alev (ateş 120, lv35), Tanrısal Işık (ışık 140, lv40), Omega Darbesi (void 180, lv50). Toplam büyü sayısı 12 → 22\'ye yükseldi.',
      },
      {
        id: 'v4e4',
        category: 'yenilik',
        title: '10 Yeni İksir — Orta ve Nadir Tier',
        description: 'Can Şişesi (120 HP), Saf Mana İksiri (80 MP), Demir Kalkan (5 şarj), Titan Gücü (5 tur +%50 hasar), Şampiyon Hızı (5 tur çift hareket), Yaşam Özü (250 HP, nadir), Mana Kristali (200 MP, nadir), Efsane Kalkan (8 şarj, nadir), Tanrısal Darbe (8 tur +%50, nadir), Omega Hızı (8 tur çift, nadir). Toplam iksir sayısı 5 → 15\'e yükseldi.',
      },
      {
        id: 'v4e5',
        category: 'yenilik',
        title: '40 Yeni Ekipman — Her Slot için 10 Yeni Parça',
        description: 'Silah, Zırh, Yüzük, Kolye slotlarına her birine 10 yeni ekipman eklendi. Toplam ekipman sayısı 12 → 52\'ye yükseldi. Seviye 20\'den başlayıp 95\'e kadar uzanan yeni tier\'lar: Gece Bıçağı, Void Kılıcı, Yıldız Bıçağı, Alev Kılıcı, Fırtına Kılıcı, Kıyamet Bıçağı, Tanrısal Silah, Omega Kılıcı, Kaos Bıçağı, Evrenin Sonu (silah); benzer premium seriler diğer slotlar için de mevcut.',
      },
      {
        id: 'v4e6',
        category: 'geliştirme',
        title: 'Karakter Sayfası Yeniden Tasarımı',
        description: 'Karakter sayfası üç sekmeye bölündü: Büyü Yükü, Ekipman ve Envanter. Sol sütunda ünvan ilerleme şeridi, temel istatistikler ve savaş istatistikleri gösteriliyor. Ekipman sekmesine toplam bonus özeti eklendi. Envanter sekmesi artık her öğenin stat bonuslarını ve gerekli seviyeyi gösteriyor. "Kuşan / Çıkar" butonları her iki sekmede de mevcut.',
      },
      {
        id: 'v4e7',
        category: 'geliştirme',
        title: 'Market — Ekipman Slot Filtresi',
        description: 'Market\'in Ekipmanlar sekmesine slot filtresi eklendi: Tümü, Silah, Zırh, Yüzük, Kolye. Her kategori yanında mevcut ekipman sayısı gösterilmektedir. Artık 52 ekipman arasında kolayca arama yapılabilmektedir.',
      },
      {
        id: 'v4e8',
        category: 'teknik',
        title: 'Kayıt Geçişi — equippedSpells Alanı',
        description: 'v0.0.4 geçişinde eski kayıtlar için equippedSpells alanı otomatik olarak knownSpells\'ten ilk 10 büyü alınarak doldurulmaktadır. Yeni büyü öğrenildiğinde veya satın alındığında, 10 slot dolmamışsa otomatik olarak yükleniyor.',
      },
    ],
  },

  // ── v0.0.3 ───────────────────────────────────────────────────────────────────
  {
    version: 'v0.0.3',
    date: '29 Haziran 2026',
    summary: '10 yeni bölge, 60 yeni düşman, maksimum seviye 100 ve tüm düşman istatistikleri yeniden dengelendi.',
    entries: [
      {
        id: 'v3e1',
        category: 'yenilik',
        title: '10 Yeni Bölge — Seviye 50-100 Arası',
        description: 'Gölge Labirenti, Ebedi Tundra, Derin Uçurum, Yıldız Mezarlığı, Zihin Sarayı, Kaos Düzlemi, Kan Ormanı, Sonsuz Kristal, Tanrıların Tepesi ve Evrenin Sonu bölgeleri eklendi.',
      },
      {
        id: 'v3e2',
        category: 'yenilik',
        title: '60 Yeni Düşman',
        description: 'Her yeni bölgeye 5 normal + 1 boss olmak üzere toplamda 60 yeni düşman eklendi.',
      },
      {
        id: 'v3e3',
        category: 'yenilik',
        title: 'Maksimum Seviye 100',
        description: 'Oyunun maksimum seviyesi artık 100. Her seviye +10 HP/Mana, +3 ATK, +2 DEF kazandırır.',
      },
      {
        id: 'v3e4',
        category: 'geliştirme',
        title: 'Sıralı Bölge Açılış Sistemi',
        description: 'Bölgeler tamamen sıralı açılıyor: Orman→Bataklık(5)→Mağara(9)→...→Omega(95).',
      },
      {
        id: 'v3e5',
        category: 'geliştirme',
        title: 'Tüm Düşman İstatistikleri Yeniden Dengelendi',
        description: 'Boss\'lar yaklaşık 2× normal düşman HP\'ine sahip. Omega boss 20.000 HP ile oyunun son zorluğu.',
      },
    ],
  },

  // ── v0.0.2 ───────────────────────────────────────────────────────────────────
  {
    version: 'v0.0.2',
    date: '29 Haziran 2026',
    summary: 'Görev sistemi, savaş istatistikleri ve ana menü iyileştirmeleri.',
    entries: [
      {
        id: 'v2e1',
        category: 'yenilik',
        title: 'Görev Sistemi — Günlük & Haftalık',
        description: 'Her gün 3 günlük, her hafta 3 haftalık görev otomatik seçilir. Görevler tamamlandığında XP ve Altın ödülü kazanılır.',
      },
      {
        id: 'v2e2',
        category: 'yenilik',
        title: 'Savaş İstatistikleri',
        description: 'Karakter sayfasına toplam öldürme, kaçış, benzersiz düşman ve en güçlü düşman bilgisi eklendi.',
      },
      {
        id: 'v2e3',
        category: 'yenilik',
        title: 'Ana Menüde Hızlı Eylem Çubuğu',
        description: 'Kayıtlı oyun varken hızlı Dinlen, Market, Karakter, Görevler ve Ayarlar butonları görünür.',
      },
      {
        id: 'v2e6',
        category: 'düzeltme',
        title: 'Kaçış Sonrası Can/Mana Senkron Sorunu',
        description: 'Kaçış başarılı olduğunda savaş içi HP/Mana değerleri artık player state\'e senkronize ediliyor.',
      },
    ],
  },

  // ── v0.0.1 ───────────────────────────────────────────────────────────────────
  {
    version: 'v0.0.1',
    date: '29 Haziran 2026',
    summary: 'İlk resmi geliştirme sürümü. Arayüz kalitesi ve temel sistem altyapıları.',
    entries: [
      {
        id: 'e1',
        category: 'yenilik',
        title: 'Elementer Tür Göstergesi',
        description: 'Market ve savaş büyü panelinde her büyüye elementer tür badge\'i eklendi.',
      },
      {
        id: 'e5',
        category: 'yenilik',
        title: 'Güncelleme Notları Sistemi',
        description: 'Tüm sürümler, kategorilere ayrılmış girişlerle kronolojik olarak listelenmektedir.',
      },
      {
        id: 'e6',
        category: 'yenilik',
        title: 'Ayarlar Paneli',
        description: 'Üst bar\'a Ayarlar butonu ve modal eklendi.',
      },
    ],
  },
];
