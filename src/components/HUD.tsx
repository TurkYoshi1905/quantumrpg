import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Coins, Settings, X, Tag, LogOut, Map, ShoppingCart, User, Target } from 'lucide-react';
import { useMobileDevice } from '../hooks/use-mobile';

export function HUD() {
  const { state, dispatch } = useGameState();
  const { player, battle } = state;
  const [location, setLocation] = useLocation();
  const { isMobile } = useMobileDevice();
  const [restToast, setRestToast] = useState<'ok' | 'broke' | 'full' | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isFullHp    = player.stats.hp   >= player.stats.maxHp;
  const isFullMana  = player.stats.mana >= player.stats.maxMana;
  const alreadyFull = isFullHp && isFullMana;
  const canAfford   = player.coins >= 10;
  const inBattle    = battle.active;
  const hasSave     = player.level > 1 || player.xp > 0 || player.coins !== 50;
  const restDisabled = inBattle || alreadyFull || !canAfford || !hasSave;

  const handleRest = () => {
    if (inBattle)    { flash('full'); return; }
    if (alreadyFull) { flash('full'); return; }
    if (!canAfford)  { flash('broke'); return; }
    dispatch({ type: 'REST_AT_INN' });
    flash('ok');
  };

  const flash = (kind: 'ok' | 'broke' | 'full') => {
    setRestToast(kind);
    setTimeout(() => setRestToast(null), 2500);
  };

  const toastConfig = {
    ok:    { text: '🛌 Dinlendin! Can ve mana yenilendi.', cls: 'bg-green-500/20 border-green-500/40 text-green-300' },
    broke: { text: '💸 Yeterli altın yok (10 Altın gerekli)', cls: 'bg-red-500/20 border-red-500/40 text-red-300' },
    full:  { text: '✨ Zaten tam candasın!', cls: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
  };

  const restLabel = inBattle ? 'Savaşta dinlenemezsin' : alreadyFull ? 'Zaten tam can & mana' : !canAfford ? 'Yeterli altın yok' : 'Dinlen (10 Altın)';

  const navIconCls = (path: string) =>
    `p-1.5 rounded-full transition-colors relative group ${location === path ? 'bg-white/10' : 'hover:bg-white/5'}`;

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {restToast && (
          <motion.div
            key="rest-toast"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-[60] border px-4 py-1.5 rounded-2xl font-bold text-xs shadow-lg whitespace-nowrap ${toastConfig[restToast].cls}`}
          >
            {toastConfig[restToast].text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD bar ── */}
      <div className={`fixed top-0 left-0 right-0 bg-background/85 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-3 lg:px-8 ${isMobile ? 'h-12' : 'h-16'}`}>

        {/* ── Left: Avatar + Name + Bars ── */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`shrink-0 ${isMobile ? 'text-xl' : 'text-2xl'}`} role="img" aria-label="avatar">🧑‍🚀</span>
            <div className="min-w-0">
              <div className={`font-sans font-bold text-foreground truncate ${isMobile ? 'text-sm' : ''}`}>{player.name}</div>
              <div className={`text-muted-foreground font-mono leading-none ${isMobile ? 'text-[9px]' : 'text-xs'}`}>Seviye {player.level}</div>
            </div>
          </div>

          <div className={`flex flex-col gap-1 ml-1.5 ${isMobile ? '' : 'hidden md:flex'}`}>
            <div className={`flex items-center gap-1 ${isMobile ? 'w-32' : 'w-44 gap-1.5'}`}>
              <Heart size={isMobile ? 10 : 12} className="text-destructive shrink-0" />
              <div className={`flex-1 bg-destructive/20 rounded-full overflow-hidden ${isMobile ? 'h-1.5' : 'h-2'}`}>
                <div className="h-full bg-destructive rounded-full"
                  style={{ width: `${Math.min(100, player.stats.maxHp > 0 ? (player.stats.hp / player.stats.maxHp) * 100 : 0)}%`, transition: 'width 0.3s ease-out' }} />
              </div>
              <span className={`text-destructive text-right font-mono shrink-0 ${isMobile ? 'text-[10px] w-12' : 'text-xs w-14'}`}>
                {player.stats.hp}/{player.stats.maxHp}
              </span>
            </div>
            <div className={`flex items-center gap-1 ${isMobile ? 'w-32' : 'w-44 gap-1.5'}`}>
              <Zap size={isMobile ? 10 : 12} className="text-blue-500 shrink-0" />
              <div className={`flex-1 bg-blue-500/20 rounded-full overflow-hidden ${isMobile ? 'h-1.5' : 'h-2'}`}>
                <div className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, player.stats.maxMana > 0 ? (player.stats.mana / player.stats.maxMana) * 100 : 0)}%`, transition: 'width 0.3s ease-out' }} />
              </div>
              <span className={`text-blue-500 text-right font-mono shrink-0 ${isMobile ? 'text-[10px] w-12' : 'text-xs w-14'}`}>
                {player.stats.mana}/{player.stats.maxMana}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Coins + Rest + Nav + Settings ── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Coin display */}
          <div className={`flex items-center gap-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/30 ${isMobile ? 'px-2 py-1 mr-1' : 'px-3 py-1.5 mr-2'}`}>
            <Coins size={isMobile ? 12 : 15} />
            <span className={`font-mono font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>{player.coins}</span>
          </div>

          {/* 💤 Rest button */}
          {hasSave && (
            <button
              onClick={handleRest}
              className={`relative rounded-full transition-all group ${isMobile ? 'p-1.5' : 'p-2'} ${
                restDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-green-500/15 hover:ring-1 hover:ring-green-500/40'
              }`}
              aria-label="Dinlen"
            >
              {!restDisabled && (
                <span className="absolute inset-0 rounded-full bg-green-500/10 animate-ping opacity-60 pointer-events-none" />
              )}
              <span className={`relative z-10 ${isMobile ? 'text-base' : 'text-xl'}`} role="img" aria-label="rest">💤</span>
              {!isMobile && (
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150
                  bg-black/90 border border-white/10 text-white text-xs rounded-xl px-3 py-2
                  whitespace-nowrap shadow-xl flex flex-col items-center gap-1">
                  <span className="font-bold">{restLabel}</span>
                  {!restDisabled && (
                    <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span className="text-red-400 flex items-center gap-0.5"><Heart size={9}/>{player.stats.hp}/{player.stats.maxHp}</span>
                      <span className="text-blue-400 flex items-center gap-0.5"><Zap size={9}/>{player.stats.mana}/{player.stats.maxMana}</span>
                    </span>
                  )}
                </span>
              )}
            </button>
          )}

          {/* Nav icons */}
          <Link href="/dukkan" className={navIconCls('/dukkan')}>
            <span className={`${isMobile ? 'text-base' : 'text-xl'}`} role="img" aria-label="shop">🛒</span>
            {!isMobile && <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dükkan</span>}
          </Link>
          <Link href="/karakter" className={navIconCls('/karakter')}>
            <span className={`${isMobile ? 'text-base' : 'text-xl'}`} role="img" aria-label="character">🎒</span>
            {!isMobile && <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Karakter</span>}
          </Link>
          <Link href="/harita" className={navIconCls('/harita')}>
            <span className={`${isMobile ? 'text-base' : 'text-xl'}`} role="img" aria-label="map">🗺️</span>
            {!isMobile && <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Harita</span>}
          </Link>
          <Link href="/gorevler" className={navIconCls('/gorevler')}>
            <span className={`${isMobile ? 'text-base' : 'text-xl'}`} role="img" aria-label="quests">🎯</span>
            {!isMobile && <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Görevler</span>}
          </Link>

          {/* ⚙️ Settings button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className={`relative rounded-full transition-all group hover:bg-white/10 ${isMobile ? 'p-1.5' : 'p-2'}`}
            aria-label="Ayarlar"
          >
            <Settings size={isMobile ? 14 : 18} className="text-muted-foreground group-hover:text-white transition-colors" />
            {!isMobile && <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ayarlar</span>}
          </button>
        </div>
      </div>

      {/* ── Settings Modal ── */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm ${isMobile ? '' : 'flex items-center justify-center p-4'}`}
            onClick={() => !isMobile && setSettingsOpen(false)}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.92, y: 20 }}
              animate={isMobile ? { y: 0 } : { scale: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.92, y: 20 }}
              transition={{ duration: 0.22 }}
              className={`bg-card shadow-2xl overflow-y-auto ${isMobile ? 'w-full h-full border-0 rounded-none' : 'border border-border rounded-2xl w-full max-w-sm max-h-[90vh]'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Settings size={15} className="text-primary" />
                  </div>
                  <span className="font-serif font-bold text-base">Ayarlar</span>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">

                {/* Changelog link */}
                <button
                  onClick={() => { setSettingsOpen(false); setLocation('/degisiklikler'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Tag size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-white">Güncelleme Notları</div>
                    <div className="text-xs text-muted-foreground">Son sürüm değişiklikleri ve yenilikler</div>
                  </div>
                  <div className="text-xs font-mono text-primary/60 shrink-0">v0.0.6</div>
                </button>

                {/* Separator */}
                <div className="pt-1 pb-0.5">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50 px-1">Navigasyon</div>
                </div>

                {/* Quick nav links */}
                {[
                  { href: '/harita',    icon: <Map size={14}/>,          label: 'Dünya Haritası',  sub: 'Bölgelere göz at'        },
                  { href: '/dukkan',    icon: <ShoppingCart size={14}/>, label: 'Quantum Marketi', sub: 'İksir, büyü, ekipman'    },
                  { href: '/karakter',  icon: <User size={14}/>,         label: 'Karakter',        sub: 'İstatistikler ve envanter'},
                  { href: '/gorevler',  icon: <Target size={14}/>,       label: 'Görevler',        sub: 'Günlük ve haftalık görevler'},
                ].map(item => (
                  <button
                    key={item.href}
                    onClick={() => { setSettingsOpen(false); setLocation(item.href); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-muted-foreground">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.sub}</div>
                    </div>
                  </button>
                ))}

                {/* Delete save */}
                {hasSave && (
                  <>
                    <div className="pt-1 pb-0.5">
                      <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50 px-1">Tehlikeli Alan</div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Tüm ilerlemeniz silinecek. Emin misiniz?')) {
                          dispatch({ type: 'DELETE_SAVE' });
                          setSettingsOpen(false);
                          setLocation('/');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                        <LogOut size={14} className="text-destructive" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-destructive">Kaydı Sil</div>
                        <div className="text-xs text-muted-foreground">Tüm ilerleme kalıcı olarak silinir</div>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border text-center">
                <span className="text-[10px] text-muted-foreground/40 font-mono">QuantumRPG · v0.0.6</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
