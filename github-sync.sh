#!/usr/bin/env bash
# QuantumRPG — GitHub Sync Script
# Monorepo'dan bağımsız public/src yapısına dönüştürür ve GitHub'a push eder.
# Kullanım: bash github-sync.sh
# GITHUB_PAT ortam değişkeni Replit Secrets üzerinden yüklenir.

set -euo pipefail

REPO_URL="https://TurkYoshi1905:${GITHUB_PAT}@github.com/TurkYoshi1905/quantumrpg.git"
BRANCH="main"
SOURCE_DIR="$(cd "$(dirname "$0")/artifacts/quantumrpg" && pwd)"
TMP_DIR="$(mktemp -d)"

echo "📁 Geçici dizin oluşturuldu: $TMP_DIR"

# ── 1. Kaynak dosyaları kopyala ────────────────────────────────────────────────
WORKSPACE_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📦 Oyun dosyaları kopyalanıyor..."
cp -r "$SOURCE_DIR/src"              "$TMP_DIR/src"
cp -r "$SOURCE_DIR/public"           "$TMP_DIR/public"
cp    "$SOURCE_DIR/index.html"       "$TMP_DIR/index.html"
cp    "$SOURCE_DIR/components.json"  "$TMP_DIR/components.json"
cp    "$SOURCE_DIR/vercel.json"      "$TMP_DIR/vercel.json"
cp    "$WORKSPACE_DIR/github-sync.sh" "$TMP_DIR/github-sync.sh"
cp    "$WORKSPACE_DIR/replit.md"      "$TMP_DIR/replit.md"

# ── 2. Standalone package.json ─────────────────────────────────────────────────
echo "📝 package.json yazılıyor..."
cat > "$TMP_DIR/package.json" << 'EOF'
{
  "name": "quantumrpg",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.545.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "wouter": "^3.3.5"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.14",
    "@tanstack/react-query": "^5.90.21",
    "@types/node": "^25.3.3",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "next-themes": "^0.4.6",
    "react-day-picker": "^9.11.1",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.14",
    "tw-animate-css": "^1.4.0",
    "typescript": "~5.9.3",
    "vaul": "^1.1.2",
    "vite": "^7.3.2",
    "zod": "^3.25.76"
  }
}
EOF

# ── 3. Standalone vite.config.ts (Replit eklentileri olmadan) ─────────────────
echo "⚙️  vite.config.ts yazılıyor..."
cat > "$TMP_DIR/vite.config.ts" << 'EOF'
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
EOF

# ── 4. Standalone tsconfig.json ────────────────────────────────────────────────
echo "📝 tsconfig.json yazılıyor..."
cat > "$TMP_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF

# ── 5. .gitignore ──────────────────────────────────────────────────────────────
cat > "$TMP_DIR/.gitignore" << 'EOF'
node_modules/
dist/
.env
.env.local
*.local
.DS_Store
EOF

# ── 6. README.md ───────────────────────────────────────────────────────────────
cat > "$TMP_DIR/README.md" << 'EOF'
# QuantumRPG 🎮

Karanlık bir kuantum evreninde geçen tek oyunculu, sıra tabanlı 2D web RPG oyunu.

## Özellikler

- 🗺️ **4 Bölge** — Kuantum Ormanı, Kristal Mağarası, Karanlık Kale, Void Uzayı
- 👾 **24 Düşman** — Her bölgede 5 normal + 1 boss
- ✨ **12 Büyü** — Seviye ve Quantum Coin sistemi
- ⚔️ **12 Ekipman** — 4 slot (silah, zırh, yüzük, kolye)
- 📈 **Seviye sistemi** — 1-20+ seviye, XP ve stat artışı
- 💰 **Ekonomi** — Quantum Coin ile dükkan sistemi
- 💾 **Kayıt** — localStorage ile otomatik kayıt

## Kurulum

```bash
npm install
npm run dev
```

## Teknoloji

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Wouter (routing)
EOF

# ── 7. Git repo başlat ve push et ─────────────────────────────────────────────
echo "🔧 Git repo başlatılıyor..."
cd "$TMP_DIR"
git init -b main
git config user.email "bot@quantumrpg.app"
git config user.name  "QuantumRPG Bot"

git add -A
COMMIT_MSG="chore: standalone build — src/public yapısı — $(date '+%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MSG"
echo "✅ Commit: $COMMIT_MSG"

echo "🚀 GitHub'a push ediliyor (force)..."
git push --force "$REPO_URL" HEAD:"$BRANCH"

# ── 8. Temizlik ────────────────────────────────────────────────────────────────
cd /
rm -rf "$TMP_DIR"
echo ""
echo "🎉 Başarıyla yayınlandı!"
echo "   👉 https://github.com/TurkYoshi1905/quantumrpg"
