# QuantumRPG

Karanlık bir kuantum evreninde geçen tek oyunculu, sıra tabanlı 2D web RPG oyunu. Oyuncu bölge bölge ilerleyerek çeşitli yaratıklarla savaşır, XP kazanır, seviye atlar, büyü öğrenir ve Quantum Coin ile dükkândan ekipman satın alır.

---

## Run & Operate

- `pnpm --filter @workspace/quantumrpg run dev` — oyun frontend'ini çalıştır (port 25468)
- `pnpm run typecheck` — tüm paketlerde TypeScript kontrolü
- `pnpm run build` — typecheck + build
- `bash .migration-backup/github-sync.sh` — GitHub'a push et (GITHUB_PAT secret gerekli)

Oyun verisi **localStorage**'da tutulur (`quantumrpg_save` key). Backend gerekmez.

---

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS v4
- Routing: Wouter (base path desteği ile)
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
| **Büyü Gücü** | Her seviyede +2, ekipmanla yükseltilebilir; büyü hasarını ölçekler |
| **Ünvan Sistemi** | Her 10 seviyede yeni ünvan + altın milestone ödülü (500→20.000) |
| **Ekipman** | 58 ekipman — 4 slot (silah, zırh, yüzük, kolye); büyücü odaklı setler dahil |
| **İksirler** | 15 iksir türü — temel / orta / nadir tier; savaş içi kullanılabilir |
| **Seviye** | 1-100 seviye, XP sistemi, seviyeye göre stat artışı |
| **Ekonomi** | Quantum Coin — düşmanlardan düşer, dükkânda harcanır |
| **Elementer** | Ateş, Buz, Şimşek, Void, Işık, Fiziksel |
| **Savaş** | Sıra tabanlı: Saldır / Büyü / Savun / Eşya / Kaç — spam/çift tıklama kilidi |
| **Seviye Atlama Modalı** | Kazanılan tüm statlar gösterilir — mobil dikey/yatay uyumlu |
| **Görevler** | 3 günlük + 3 haftalık görev — XP & Coin ödülü, otomatik sıfırlama |
| **İstatistikler** | Toplam öldürme, kaçış, en güçlü düşman — Karakter sayfasında |

---

## Where Things Live

```
artifacts/quantumrpg/src/
├── App.tsx                    # Router + global GameProvider
├── index.css                  # Karanlık RPG teması (CSS değişkenleri)
├── types/game.ts              # Tüm TypeScript tipleri (20 RegionId dahil)
├── utils/
│   └── elementStyles.ts       # Elementer renk/glow/badge yardımcı modülü
├── data/
│   ├── enemies.ts             # 120 düşman (20 bölge × 6)
│   ├── spells.ts              # 22 büyü tanımı
│   ├── equipment.ts           # 58 ekipman tanımı
│   ├── regions.ts             # 20 bölge tanımı (sıralı açılış, lv1-lv95)
│   ├── potions.ts             # 15 iksir tanımı
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
│   ├── QuestsPage.tsx         # Günlük & haftalık görevler
│   └── ChangelogPage.tsx      # Güncelleme notları sayfası (premium UI)
└── components/
    ├── HUD.tsx                # Üst bilgi çubuğu + Ayarlar modal'ı
    ├── BattleLog.tsx          # Savaş olayları log kutusu
    ├── LevelUpModal.tsx       # Seviye atlama modal'ı (mobil landscape uyumlu)
    └── SpellUnlockModal.tsx   # Yeni büyü açılma modal'ı
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
- Seviye atlarken: +10 HP/Mana, +3 ATK, +2 DEF, +2 Büyü Gücü
- Maksimum seviye: **100** (fazla XP sıfırlanır)
- Çift seviyeler (2, 4, 6, 8...) → ücretsiz yeni büyü açılabilir

**Savaş:**
- Oyuncu hızlıysa (speed > düşman speed) ilk hamle oyuncuda
- Elementer zayıflık → %50 ekstra hasar
- Durum efektleri: Yanma (3 hasar/tur × 2 tur), Donma (1 tur atla), Sersem (%50 hasar azalır)
- Kaçma şansı: %40
- Yenilgide HP = 1 (ölüm sayacı +1, kayıp yok)

---

## Architecture Decisions

- **Backend yok**: Oyun tamamen client-side, localStorage tek veri deposu. Sıfır gecikme, çevrimdışı çalışır.
- **Context API + useReducer**: Büyük global state için Redux yerine hafif Context; oyun için yeterli ölçek.
- **Wouter**: React Router yerine daha hafif Wouter tercih edildi; base path desteği var.
- **Framer Motion**: Savaş animasyonları, level up efekti, sayfa geçişleri için.
- **Merkezi element stilleri**: `elementStyles.ts` badge tutarlılığını garantiler; market ve savaş arayüzü aynı kaynaktan beslenir.
- **Tek artifact (quantumrpg)**: Oyun saf frontend; `api-server` artifact mevcut ancak oyun tarafından kullanılmıyor.

---

## User Preferences

- Oyun dili: **Türkçe**
- Tek oyunculu mod
- Premium, kaliteli görünüm — el yapımı hissettiren UI/UX
- Tüm butonlar işlevsel
- Temiz, modüler, TypeScript strict uyumlu kod

---

## Gotchas

- Wouter `base` prop'u `import.meta.env.BASE_URL.replace(/\/$/, '')` olmalı.
- localStorage key: `quantumrpg_save` — kayıt silmek için bu key'i temizle.
- Yeni düşman/büyü/ekipman eklerken `types/game.ts` tiplerini güncelle.
- Yeni büyü eklenirse `elementStyles.ts`'deki `GameElement` tipini de güncelle.
- Changelog'a yeni sürüm eklenince `changelogData.ts` dosyasına üste yeni `ChangelogVersion` objesi ekle.
- `pnpm run dev` workspace kökünde çalışmaz — workflow üzerinden başlat.

---

## Pointers

- Oyun verileri: `artifacts/quantumrpg/src/data/`
- Global state: `artifacts/quantumrpg/src/store/gameStore.tsx`
- Tip tanımları: `artifacts/quantumrpg/src/types/game.ts`
- Elementer stiller: `artifacts/quantumrpg/src/utils/elementStyles.ts`
- Changelog verisi: `artifacts/quantumrpg/src/data/changelogData.ts`
- GitHub sync scripti: `.migration-backup/github-sync.sh` (GITHUB_PAT secret gerekli)
