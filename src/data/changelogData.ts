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
  {
    version: 'v0.0.3',
    date: '29 Haziran 2026',
    summary: '10 yeni bölge, 60 yeni düşman, maksimum seviye 100 ve tüm düşman istatistikleri yeniden dengelendi.',
    entries: [
      {
        id: 'v3e1',
        category: 'yenilik',
        title: '10 Yeni Bölge — Seviye 50-100 Arası',
        description: 'Gölge Labirenti, Ebedi Tundra, Derin Uçurum, Yıldız Mezarlığı, Zihin Sarayı, Kaos Düzlemi, Kan Ormanı, Sonsuz Kristal, Tanrıların Tepesi ve Evrenin Sonu bölgeleri eklendi. Her bölgenin kendine özgü teması, renk paleti ve lore\'u var.',
      },
      {
        id: 'v3e2',
        category: 'yenilik',
        title: '60 Yeni Düşman — Yaratıcı İsimler & Element Zayıflıkları',
        description: 'Her yeni bölgeye 5 normal + 1 boss olmak üzere toplamda 60 yeni düşman eklendi. Karanlık Yansıma, Labirent Mimarı, Ebedi Kış Lordu, Uçurumun Tanrısı, Galaksi İmparatoru, Kolektif Bilinçdışı, İblis Kaos, Kan Tanrısı, Sonsuz Kristal Tanrısı, Unutulan Tanrı ve Omega – Evrenin Çöküşü bu bölgelerin patronlarıdır.',
      },
      {
        id: 'v3e3',
        category: 'yenilik',
        title: 'Maksimum Seviye 100',
        description: 'Oyunun maksimum seviyesi artık 100. Seviye 100\'e ulaşıldığında XP sıfırlanır ve "Maksimum Seviye" göstergesi aktif olur. Her seviye +10 HP/Mana, +3 ATK, +2 DEF kazandırır; seviye 100\'de oyuncu son derece güçlü olur.',
      },
      {
        id: 'v3e4',
        category: 'geliştirme',
        title: 'Sıralı Bölge Açılış Sistemi — Paralel Yollar Kaldırıldı',
        description: 'Bölgeler artık tamamen sıralı açılıyor. Her bölgenin kilidi bir önceki bölgenin boss seviyesine göre belirleniyor: Orman→Bataklık(5)→Mağara(9)→Liman(14)→Kale(19)→Çöl(24)→Void(29)→Fırtına(34)→Ateş Gölü(39)→Zaman(44)→Gölge(50)→Tundra(55)→Uçurum(60)→Yıldız(65)→Zihin(70)→Kaos(75)→Kan(80)→Kristal(85)→Tanrılar(90)→Omega(95).',
      },
      {
        id: 'v3e5',
        category: 'geliştirme',
        title: 'Tüm Düşman İstatistikleri Yeniden Dengelendi',
        description: 'Mevcut 10 bölgedeki tüm düşmanların HP, ATK, DEF ve SPD değerleri seviye 1-50 arası tutarlı bir formüle göre yeniden hesaplandı. Yeni 10 bölgedeki düşmanlar seviye 51-100 aralığını kapsayacak şekilde ölçeklendirildi. Boss\'lar yaklaşık 3.5-4x normal düşman HP\'ine sahip.',
      },
      {
        id: 'v3e6',
        category: 'teknik',
        title: 'RegionId Tipi Genişletildi',
        description: 'TypeScript\'teki RegionId tipi 10 yeni bölge ID\'siyle güncellendi: golge, tundra, derin, uzay, zihin, kaos, kan, sonsuz, tanri, omega. Tüm tip kontrollerinden geçti.',
      },
    ],
  },
  {
    version: 'v0.0.2',
    date: '29 Haziran 2026',
    summary: 'Görev sistemi, savaş istatistikleri ve ana menü iyileştirmeleri. Oyun deneyimi bir sonraki seviyeye taşındı.',
    entries: [
      {
        id: 'v2e1',
        category: 'yenilik',
        title: 'Görev Sistemi — Günlük & Haftalık',
        description: 'Oyuna günlük ve haftalık görev sistemi eklendi. Her gün 3 günlük, her hafta 3 haftalık görev otomatik olarak seçilir. Görevler tamamlandığında XP ve Quantum Coin ödülü kazanılır. Tamamlanan görevlerin yanında yeşil tik ve "Tamamlandı" etiketi görünür. Görevler her gün gece 00:00\'da, haftalık görevler her Pazartesi sıfırlanır.',
      },
      {
        id: 'v2e2',
        category: 'yenilik',
        title: 'Savaş İstatistikleri — Karakter Sayfası',
        description: 'Karakter sayfasına "Savaş İstatistikleri" bölümü eklendi. Toplam öldürme sayısı, başarılı kaçış sayısı, benzersiz düşman sayısı, toplam galip sayısı ve en güçlü düşman bilgisi görüntülenmektedir.',
      },
      {
        id: 'v2e3',
        category: 'yenilik',
        title: 'Ana Menüde Hızlı Eylem Çubuğu',
        description: 'Kayıtlı oyun varken ana menüde oyuncu bilgi kartı ve beş hızlı eylem butonu görünür: Dinlen (10 Altın), Market, Karakter, Görevler ve Ayarlar. Oyuncu can/mana barları ve altın miktarı da ana menüde görüntülenir.',
      },
      {
        id: 'v2e4',
        category: 'yenilik',
        title: 'Dünya Haritasında Ana Menüye Dönüş',
        description: 'Dünya Haritası sayfasına "Ana Menü" geri dönüş butonu eklendi. Buton sağ üst köşede, başlığın yanında konumlanmaktadır.',
      },
      {
        id: 'v2e5',
        category: 'geliştirme',
        title: 'HUD Navigasyonuna Görevler Butonu',
        description: 'Üst bilgi çubuğuna 🎯 Görevler navigasyon butonu eklendi. Ayarlar modalına da Görevler hızlı erişim bağlantısı eklendi.',
      },
      {
        id: 'v2e6',
        category: 'düzeltme',
        title: 'Kaçış Sonrası Can/Mana Barı Donma Sorunu',
        description: 'Savaş sırasında hasar alındıktan sonra kaçılınca can ve mana barlarının doğru değeri yansıtmaması sorunu giderildi. Kaçış başarılı olduğunda artık savaş içi HP/Mana değerleri kalıcı player state\'e senkronize ediliyor.',
      },
      {
        id: 'v2e7',
        category: 'düzeltme',
        title: 'Sekme Değişiminde Can/Mana Animasyonunun Yeniden Oynanması',
        description: 'Farklı sayfalara geçildiğinde can ve mana barlarının sıfırdan dolduğu görüntülenen animasyon hatası giderildi. Barlar artık yalnızca değer değişiminde animasyon gösteriyor.',
      },
      {
        id: 'v2e8',
        category: 'geliştirme',
        title: 'HUD\'da Can/Mana Sayılarının Büyütülmesi',
        description: 'Masaüstü görünümünde can ve mana değerleri (ör: 148/120) daha büyük ve okunaklı hale getirildi. Bar kalınlığı, font boyutu ve alan genişliği artırıldı.',
      },
    ],
  },
  {
    version: 'v0.0.1',
    date: '29 Haziran 2026',
    summary: 'İlk resmi geliştirme sürümü. Arayüz kalitesi, mobil uyumluluk ve yeni sistem altyapıları bu sürümde teslim edilmiştir.',
    entries: [
      {
        id: 'e1',
        category: 'yenilik',
        title: 'Elementer Tür Göstergesi — Market',
        description: 'Quantum Marketi\'nde Büyüler sekmesinde listelenen her büyünün adının yanına elementer türü badge\'i eklendi. Her element (Ateş, Buz, Şimşek, Işık, Void, Fiziksel) kendi rengiyle ve hafif bir parlama (glow) efektiyle görüntülenmektedir.',
      },
      {
        id: 'e2',
        category: 'yenilik',
        title: 'Elementer Tür Göstergesi — Savaş Büyü Paneli',
        description: 'Savaş ekranındaki büyü seçim panelinde her büyünün adının sağında, markettekiyle tutarlı elementer tür badge\'i gösterilmektedir.',
      },
      {
        id: 'e3',
        category: 'düzeltme',
        title: 'Mobil Yatay Ekran — Level Up Modal Taşma Sorunu',
        description: 'Mobil cihazlarda yatay (landscape) modda seviye atlama panelinin dikey eksende taşması sorunu giderildi.',
      },
      {
        id: 'e4',
        category: 'düzeltme',
        title: 'Mobil Yatay Ekran — Yeni Büyü Modal Taşma Sorunu',
        description: 'Yeni büyü öğrenme ekranının mobil yatay modda ekrana sığmaması sorunu çözüldü.',
      },
      {
        id: 'e5',
        category: 'yenilik',
        title: 'Güncelleme Notları (Changelog) Sistemi',
        description: 'Oyuna yeni bir Güncelleme Notları sayfası eklendi. Tüm sürümler, kategorilere ayrılmış girişlerle kronolojik olarak listelenmektedir.',
      },
      {
        id: 'e6',
        category: 'yenilik',
        title: 'Ayarlar Paneli ve Navigasyon Entegrasyonu',
        description: 'Üst bar\'a Ayarlar butonu eklendi. Açılan modal üzerinden oyun ayarlarına ve Güncelleme Notları sayfasına erişim sağlanmaktadır.',
      },
      {
        id: 'e7',
        category: 'teknik',
        title: 'Elementer Stil Yardımcı Modülü (elementStyles.ts)',
        description: 'Tüm elementer renk, kenarlık, parlama ve etiket tanımlamaları merkezi bir yardımcı modülde toplandı.',
      },
      {
        id: 'e8',
        category: 'teknik',
        title: 'Changelog Veri Altyapısı (changelogData.ts)',
        description: 'Güncelleme notları için tip güvenli, kategorize edilmiş veri yapısı oluşturuldu.',
      },
    ],
  },
];
