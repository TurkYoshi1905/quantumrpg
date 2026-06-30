# QuantumRPG

Karanlık bir kuantum evreninde geçen tek oyunculu, sıra tabanlı 2D web RPG oyunu. Oyuncu bölge bölge ilerleyerek çeşitli yaratıklarla savaşır, XP kazanır, seviye atlar, büyü öğrenir ve Quantum Coin ile dükkândan ekipman satın alır.

---

## Run & Operate

- `npm run dev` — oyun frontend'ini çalıştır (port 5000)
- `npm run build` — TypeScript kontrolü + Vite build
- `npm run preview` — build çıktısını önizle
- `bash github-sync.sh` — GitHub'a push et (GITHUB_PAT secret gerekli)

Oyun verisi **localStorage**'da tutulur (`quantumrpg_save` key). Backend gerekmez.

---

## Stack

- Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS v4
- Routing: Wouter
- Animasyonlar: Framer Motion
- İkonlar: Lucide React
- Persistence: localStorage (backend yok, oyun verisi client-side)
- Build: Vite (ESM)

---

## Oyun Özellikleri

| Özellik | Detay |
|---------|-------|
| **Bölgeler** | 20 bölge (Kuantum Ormanı lv1 → Evrenin Sonu lv100) |
| **Düşmanlar** | 120 düşman — 5 normal + 1 boss/bölge |
| **Büyüler** | 22 büyü — seviye atlandıkça açılır veya dükkândan satın alınır |
| **Büyü Yükü** | Savaşta maks 10 slot; karakter sayfasından ekle/çıkar/sıra değiştir |
| **Ünvan Sistemi** | Her 10 seviyede yeni ünvan + altın milestone ödülü (500→20.000) |
| **Ekipman** | 52 ekipman — 4 slot (silah, zırh, yüzük, kolye) |
| **İksirler** | 15 iksir türü — temel / orta / nadir tier; savaş içi kullanılabilir |
| **Seviye** | 1-100 seviye, XP sistemi, seviyeye göre stat artışı |
| **Ekonomi** | Quantum Coin — düşmanlardan düşer, dükkânda harcanır |
| **Elementer** | Ateş, Buz, Şimşek, Void, Işık, Fiziksel |
| **Savaş** | Sıra tabanlı: Saldır / Büyü / Savun / Eşya / Kaç |
| **Görevler** | 3 günlük + 3 haftalık görev — XP & Coin ödülü, otomatik sıfırlama |
| **İstatistikler** | Toplam öldürme, kaçış, en güçlü düşman — Karakter sayfasında |

---

## Where Things Live

```
src/
├── App.tsx                    # Router + global GameProvider
├── index.css                  # Karanlık RPG teması (CSS değişkenleri)
├── types/game.ts              # Tüm TypeScript tipleri (20 RegionId dahil)
├── utils/
│   └── elementStyles.ts       # Elementer renk/glow/badge yardımcı modülü
├── data/
│   ├── enemies.ts             # 120 düşman (20 bölge × 6)
│   ├── spells.ts              # 12 büyü tanımı (element alanı dahil)
│   ├── equipment.ts           # 12 ekipman tanımı
│   ├── regions.ts             # 20 bölge tanımı (sıralı açılış, lv1-lv95)
│   ├── potions.ts             # 5 iksir tanımı
│   └── changelogData.ts       # Güncelleme notları veri yapısı (kategorize, tip güvenli)
├── store/gameStore.tsx        # Context API + useReducer + localStorage (max lv100)
├── hooks/useGameState.ts      # Context hook
├── pages/
│   ├── MainMenu.tsx           # Ana menü (Yeni Oyun / Devam / Kayıt Sil)
│   ├── WorldMap.tsx           # Bölge haritası (level kıyaslamalı kilit)
│   ├── RegionPage.tsx         # Bölge düşman listesi
│   ├── BattlePage.tsx         # Savaş ekranı (elementer badge dahil)
│   ├── ShopPage.tsx           # Dükkan (büyü + ekipman + elementer badge)
│   ├── CharacterPage.tsx      # Karakter + envanter
│   └── ChangelogPage.tsx      # Güncelleme notları sayfası (premium UI)
└── components/
    ├── HUD.tsx                # Üst bilgi çubuğu + Ayarlar modal'ı + Changelog navigasyonu
    ├── BattleLog.tsx          # Savaş olayları log kutusu
    ├── LevelUpModal.tsx       # Seviye atlama modal'ı (mobil landscape uyumlu)
    └── SpellUnlockModal.tsx   # Yeni büyü açılma modal'ı (mobil landscape uyumlu)
```

---

## Routing

| Route | Sayfa |
|-------|-------|
| `/` | Ana Menü |
| `/harita` | Dünya Haritası |
| `/bolge/:regionId` | Bölge Düşman Listesi |
| `/savas/:enemyId` | Savaş Ekranı |
| `/dukkan` | Dükkan |
| `/karakter` | Karakter Sayfası |
| `/gorevler` | Günlük & Haftalık Görevler |
| `/degisiklikler` | Güncelleme Notları (Changelog) |

---

## Oyun Mekanik Detayları

**XP & Seviye:**
- `xpToNextLevel = level * 100 + (level - 1) * 50`
- Seviye atlarken: +10 HP/Mana, +3 ATK, +2 DEF
- Maksimum seviye: **100** (fazla XP sıfırlanır, xpToNextLevel = 0)
- Çift seviyeler (2, 4, 6, 8...) → ücretsiz yeni büyü açılabilir
- Bölge kilitleri `player.level >= region.requiredLevel` ile kontrol edilir — sıralı açılış
- Sıralı açılış zinciri: Orman(1)→Bataklık(5)→Mağara(9)→Liman(14)→Kale(19)→Çöl(24)→Void(29)→Fırtına(34)→Ateş(39)→Zaman(44)→Gölge(50)→Tundra(55)→Uçurum(60)→Yıldız(65)→Zihin(70)→Kaos(75)→Kan(80)→Kristal(85)→Tanrılar(90)→Omega(95)

**Savaş:**
- Oyuncu hızlıysa (speed > düşman speed) ilk hamle oyuncuda
- Elementer zayıflık → %50 ekstra hasar
- Durum efektleri: Yanma (3 hasar/tur × 2 tur), Donma (1 tur atla), Sersem (%50 hasar azalır)
- İksir efektleri: Kalkan şarjı, Hız (ekstra hamle), Hasar arttırıcı
- Kaçma şansı: %40
- Yenilgide HP = 1 (ölüm sayacı +1, kayıp yok)

**Dükkan:**
- Büyüler: Seviye kısıtı + Quantum Coin fiyatı + elementer tür badge'i
- Ekipman: Seviye kısıtı + Quantum Coin fiyatı
- İksirler: Anlık satın al, maksimum stok sınırı var

---

## Yeni Sistem: Elementer Badge (v0.0.1)

`src/utils/elementStyles.ts` modülü tüm elementer renk/glow tanımlarını merkezi olarak yönetir.

| Element | Renk | Kullanım |
|---------|------|---------|
| Ateş | orange-400 | Ateş topu, Cehennem Ateşi |
| Buz | cyan-400 | Buz Mızrağı, Buz Fırtınası |
| Şimşek | yellow-400 | Şimşek Darbesi |
| Işık | amber-200 | Işık Patlaması, Şifa Işını, Işık Kılıcı |
| Void | purple-400 | Void Çatlağı, Kuantum Patlama |
| Fiziksel | slate-400 | Gölge Dalgası, Kalkan Büyüsü |

Badge'ler hem market hem savaş büyü panelinde `getElementStyle(element)` ile tutarlı biçimde uygulanır.

---

## Yeni Sistem: Ayarlar Paneli (v0.0.1)

HUD'daki ⚙️ butonu bir modal açar. Modal içerisinde:
- **Güncelleme Notları** → `/degisiklikler` sayfasına navigasyon
- **Hızlı Navigasyon** → Harita, Dükkan, Karakter
- **Kaydı Sil** (tehlikeli alan, confirm gerektirir)

---

## Yeni Sistem: Changelog (v0.0.1)

`src/data/changelogData.ts`: Tip güvenli, kategorize günlük değişiklik veri yapısı.
- Kategoriler: `yenilik | geliştirme | düzeltme | teknik`
- `src/pages/ChangelogPage.tsx`: Timeline tabanlı, accordion-collapsible premium arayüz
- Rota: `/degisiklikler`

---

## Architecture Decisions

- **Backend yok**: Oyun tamamen client-side, localStorage tek veri deposu. Böylece sıfır gecikme, çevrimdışı çalışır.
- **Context API + useReducer**: Büyük global state için Redux yerine hafif Context kullanıldı; oyun için yeterli ölçek.
- **Wouter**: React Router yerine daha hafif Wouter tercih edildi (zaten kurulu, base path desteği var).
- **Framer Motion**: Savaş animasyonları, level up efekti, sayfa geçişleri için kullanıldı.
- **Merkezi element stilleri**: `elementStyles.ts` utility modülü badge tutarlılığını garantiler; market ve savaş arayüzü aynı kaynaktan beslenir.
- **Tek artifact**: Oyun saf frontend; API Server artifact mevcut ancak oyun tarafından kullanılmıyor.

---

## User Preferences

- Oyun dili: **Türkçe**
- Tek oyunculu mod
- Premium, kaliteli görünüm — yapay zeka üretimi gibi görünmeyen, el yapımı UI/UX
- Tüm butonlar işlevsel
- Bölge bölge ilerleme
- Yaratık çeşitliliği önemli
- Seviye atlayınca yeni büyü açılabilsin
- Quantum Coin ekonomisi ile dükkan sistemi
- Temiz, modüler, TypeScript strict uyumlu kod

---

## Boss Denge (Balance)

Her bölgenin boss'u, o bölgedeki en yüksek HP'li normal düşmanın yaklaşık **2×** HP'ine sahiptir — savaş biraz daha uzun sürsün diye. Attack/defense/XP/coin da orantılı şekilde artırılmıştır.

| Boss | HP | XP | Coin |
|------|----|----|------|
| Orman Dehası (lv5) | 260 | 400 | 95–175 |
| Bataklık Anası (lv9) | 500 | 660 | 145–265 |
| Kristal Ejder Ana (lv14) | 800 | 990 | 210–385 |
| Batık Kaptan (lv19) | 1.100 | 1.320 | 280–505 |
| Karanlık Kral (lv24) | 1.400 | 1.650 | 345–620 |
| Çöl Firavunu (lv29) | 1.700 | 1.980 | 410–740 |
| Büyük Yokluk (lv34) | 2.000 | 2.310 | 475–860 |
| Gök Lordu (lv39) | 2.300 | 2.640 | 545–985 |
| Gölün Tanrısı (lv44) | 2.600 | 2.975 | 610–1.105 |
| Kronos'un Kırığı (lv50) | 2.900 | 3.370 | 690–1.245 |
| Labirent Mimarı (lv55) | 3.200 | 3.700 | 755–1.370 |
| Ebedi Kış Lordu (lv60) | 3.500 | 4.030 | 820–1.490 |
| Uçurumun Tanrısı (lv65) | 3.800 | 4.360 | 885–1.610 |
| Galaksi İmparatoru (lv70) | 4.100 | 4.690 | 950–1.730 |
| Kolektif Bilinçdışı (lv75) | 4.400 | 5.020 | 1.020–1.860 |
| İblis Kaos (lv80) | 4.700 | 5.350 | 1.085–1.990 |
| Kan Tanrısı (lv85) | 5.000 | 5.680 | 1.150–2.115 |
| Sonsuz Kristal Tanrısı (lv90) | 5.300 | 6.010 | 1.215–2.240 |
| Unutulan Tanrı (lv95) | 5.600 | 6.340 | 1.285–2.370 |
| **Omega — Evrenin Çöküşü (lv100)** | **20.000** | **10.000** | **2.500–5.000** |

> Omega boss 20.000 HP ile multiplayer için tasarlanmıştır (4-5 oyuncu); şu an single-player.

---

## Gotchas

- Vite port **5000** olmalı, `server.allowedHosts: true` ile — webview proxy için zorunlu.
- Wouter `base` prop'u `import.meta.env.BASE_URL.replace(/\/$/, '')` olmalı.
- localStorage key: `quantumrpg_save` — save silmek için bu key'i temizle.
- Yeni düşman/büyü/ekipman eklerken `types/game.ts` tiplerini güncelle.
- TypeScript strict: tüm alanlar zorunlu tanımlanmış olmalı.
- Yeni büyü eklenirse `elementStyles.ts`'deki `GameElement` tipini de güncelle.
- Changelog'a yeni sürüm eklenirse `changelogData.ts` dosyasına üste yeni `ChangelogVersion` objesi ekle.

---

## Pointers

- Oyun verileri: `src/data/` klasöründe
- Global state: `src/store/gameStore.tsx`
- Tip tanımları: `src/types/game.ts`
- Elementer stiller: `src/utils/elementStyles.ts`
- Changelog verisi: `src/data/changelogData.ts`
