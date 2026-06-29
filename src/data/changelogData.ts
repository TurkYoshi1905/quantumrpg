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
