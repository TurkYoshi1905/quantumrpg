# QuantumRPG

Karanlık bir kuantum evreninde geçen tek oyunculu, sıra tabanlı 2D web RPG oyunu. Oyuncu bölge bölge ilerleyerek çeşitli yaratıklarla savaşır, XP kazanır, seviye atlar, büyü öğrenir ve Quantum Coin ile dükkândan ekipman satın alır.

---

## Run & Operate

- `pnpm --filter @workspace/quantumrpg run dev` — oyun frontend'ini çalıştır (PORT env gerekli)
- `pnpm --filter @workspace/api-server run dev` — API sunucusunu çalıştır (PORT env gerekli)
- `pnpm run typecheck` — tüm paketlerde TypeScript kontrolü
- `pnpm run build` — typecheck + tüm paketleri derle
- `pnpm --filter @workspace/api-spec run codegen` — OpenAPI'den hook ve Zod şemaları üret
- `pnpm --filter @workspace/db run push` — DB şema değişikliklerini uygula (sadece dev)

Oyun verisi **localStorage**'da tutulur (`quantumrpg_save` key). Backend gerekmez.

---

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- Routing: Wouter
- Animasyonlar: Framer Motion
- İkonlar: Lucide React
- Persistence: localStorage (backend yok, oyun verisi client-side)
- API: Express 5 (mevcut — oyun için kullanılmıyor)
- DB: PostgreSQL + Drizzle ORM (mevcut — oyun için kullanılmıyor)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

---

## Oyun Özellikleri

| Özellik | Detay |
|---------|-------|
| **Bölgeler** | 10 bölge (Kuantum Ormanı → Zamanın Kırığı) |
| **Düşmanlar** | 60+ düşman — 5 normal + 1 boss/bölge |
| **Büyüler** | 12 büyü — seviye atlandıkça açılır veya dükkândan satın alınır |
| **Ekipman** | 12 ekipman — 4 slot (silah, zırh, yüzük, kolye) |
| **İksirler** | 5 iksir türü — savaş içi kullanılabilir (can, mana, kalkan, hız, hasar) |
| **Seviye** | 1-30+ seviye, XP sistemi, seviyeye göre stat artışı |
| **Ekonomi** | Quantum Coin — düşmanlardan düşer, dükkânda harcanır |
| **Elementer** | Ateş, Buz, Şimşek, Void, Işık, Fiziksel |
| **Savaş** | Sıra tabanlı: Saldır / Büyü / Savun / Eşya / Kaç |
| **Görevler** | 3 günlük + 3 haftalık görev — XP & Coin ödülü, otomatik sıfırlama |
| **İstatistikler** | Toplam öldürme, kaçış, en güçlü düşman — Karakter sayfasında |

---

## Where Things Live

```
artifacts/quantumrpg/src/
├── App.tsx                    # Router + global GameProvider
├── index.css                  # Karanlık RPG teması (CSS değişkenleri)
├── types/game.ts              # Tüm TypeScript tipleri
├── utils/
│   └── elementStyles.ts       # Elementer renk/glow/badge yardımcı modülü
├── data/
│   ├── enemies.ts             # 60+ düşman tanımı
│   ├── spells.ts              # 12 büyü tanımı (element alanı dahil)
│   ├── equipment.ts           # 12 ekipman tanımı
│   ├── regions.ts             # 10 bölge tanımı
│   ├── potions.ts             # 5 iksir tanımı
│   └── changelogData.ts       # Güncelleme notları veri yapısı (kategorize, tip güvenli)
├── store/gameStore.tsx        # Context API + useReducer + localStorage
├── hooks/useGameState.ts      # Context hook
├── pages/
│   ├── MainMenu.tsx           # Ana menü (Yeni Oyun / Devam / Kayıt Sil)
│   ├── WorldMap.tsx           # Bölge haritası
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

Shared packages: `lib/api-spec/`, `lib/api-client-react/`, `lib/db/`

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
- Çift seviyeler (2, 4, 6, 8...) → ücretsiz yeni büyü açılabilir
- Belirli seviyelerde bölge kilidi açılır (requiredLevel her bölgede tanımlı)

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

## Gotchas

- `PORT` ve `BASE_PATH` env değişkenleri workflow tarafından sağlanır; elle çalıştırmaya çalışma.
- Wouter `base` prop'u `import.meta.env.BASE_URL.replace(/\/$/, '')` olmalı.
- localStorage key: `quantumrpg_save` — save silmek için bu key'i temizle.
- Yeni düşman/büyü/ekipman eklerken `types/game.ts` tiplerini güncelle.
- TypeScript strict: tüm alanlar zorunlu tanımlanmış olmalı.
- `pnpm dev` komutunu workspace root'ta çalıştırma — artifacts workflow üzerinden çalışır.
- Yeni büyü eklenirse `elementStyles.ts`'deki `GameElement` tipini de güncelle.
- Changelog'a yeni sürüm eklenirse `changelogData.ts` dosyasına üste yeni `ChangelogVersion` objesi ekle.

---

## Pointers

- Oyun verileri: `artifacts/quantumrpg/src/data/` klasöründe
- Global state: `artifacts/quantumrpg/src/store/gameStore.tsx`
- Tip tanımları: `artifacts/quantumrpg/src/types/game.ts`
- Elementer stiller: `artifacts/quantumrpg/src/utils/elementStyles.ts`
- Changelog verisi: `artifacts/quantumrpg/src/data/changelogData.ts`
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
