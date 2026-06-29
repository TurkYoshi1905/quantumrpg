import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Coins, ShoppingCart, User, Settings, Target, LogOut, X } from 'lucide-react';

export default function MainMenu() {
  const { state, dispatch } = useGameState();
  const [, setLocation] = useLocation();
  const [showNewGame, setShowNewGame] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [restToast, setRestToast] = useState<'ok' | 'broke' | 'full' | null>(null);

  const { player } = state;
  const hasSave = player.level > 1 || player.xp > 0 || player.coins !== 50;

  const handleNewGame = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('playerName') as HTMLInputElement;
    const name = nameInput.value.trim();
    if (!name) return;
    dispatch({ type: 'START_GAME', name });
    setLocation('/harita');
  };

  const handleContinue = () => setLocation('/harita');

  const handleDeleteSave = () => {
    if (confirm('Tüm ilerlemeniz silinecek. Emin misiniz?')) {
      dispatch({ type: 'DELETE_SAVE' });
      setShowSettings(false);
    }
  };

  const isFullHp = player.stats.hp >= player.stats.maxHp;
  const isFullMana = player.stats.mana >= player.stats.maxMana;
  const alreadyFull = isFullHp && isFullMana;
  const canAffordRest = player.coins >= 10;

  const handleRest = () => {
    if (alreadyFull) { flash('full'); return; }
    if (!canAffordRest) { flash('broke'); return; }
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {restToast && (
          <motion.div
            key="rest-toast"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] border px-4 py-2 rounded-2xl font-bold text-xs shadow-lg whitespace-nowrap ${toastConfig[restToast].cls}`}
          >
            {toastConfig[restToast].text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 text-center w-full max-w-md px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
            QUANTUM
          </h1>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-widest mb-12" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
            RPG
          </h2>
        </motion.div>

        {!showNewGame ? (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {hasSave && (
              <button
                onClick={handleContinue}
                className="w-full py-4 px-6 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              >
                OYUNA DEVAM ET
              </button>
            )}
            <button
              onClick={() => setShowNewGame(true)}
              className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold tracking-wide transition-all"
            >
              YENİ OYUN
            </button>
            {hasSave && (
              <button
                onClick={handleDeleteSave}
                className="w-full py-3 px-6 mt-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl text-sm transition-colors"
              >
                KAYDI SİL
              </button>
            )}

            {/* Quick action bar — only when there's a save */}
            {hasSave && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-2 pt-4 border-t border-white/10"
              >
                {/* Player bar */}
                <div className="flex items-center gap-3 mb-4 bg-black/30 border border-white/10 rounded-2xl px-4 py-3">
                  <span className="text-2xl shrink-0">🧑‍🚀</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{player.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Seviye {player.level}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Heart size={9} className="text-destructive shrink-0" />
                      <div className="w-20 h-1.5 bg-destructive/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-destructive rounded-full transition-all"
                          style={{ width: `${Math.min(100, (player.stats.hp / player.stats.maxHp) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-destructive font-mono w-12 text-right">{player.stats.hp}/{player.stats.maxHp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={9} className="text-blue-500 shrink-0" />
                      <div className="w-20 h-1.5 bg-blue-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (player.stats.mana / player.stats.maxMana) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-blue-400 font-mono w-12 text-right">{player.stats.mana}/{player.stats.maxMana}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/30 px-2 py-1 shrink-0">
                    <Coins size={11} />
                    <span className="font-mono font-bold text-xs">{player.coins}</span>
                  </div>
                </div>

                {/* Quick nav buttons */}
                <div className="grid grid-cols-5 gap-2">
                  <QuickBtn
                    icon="💤"
                    label="Dinlen"
                    onClick={handleRest}
                    disabled={alreadyFull || !canAffordRest}
                    hint={alreadyFull ? 'Tam can' : !canAffordRest ? 'Yetersiz' : '10 Altın'}
                  />
                  <QuickBtn
                    icon={<ShoppingCart size={18} />}
                    label="Market"
                    onClick={() => setLocation('/dukkan')}
                  />
                  <QuickBtn
                    icon={<User size={18} />}
                    label="Karakter"
                    onClick={() => setLocation('/karakter')}
                  />
                  <QuickBtn
                    icon={<Target size={18} />}
                    label="Görevler"
                    onClick={() => setLocation('/gorevler')}
                  />
                  <QuickBtn
                    icon={<Settings size={18} />}
                    label="Ayarlar"
                    onClick={() => setShowSettings(true)}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleNewGame}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-left mb-2">
              <label className="text-sm text-muted-foreground mb-1 block">Karakter Adı</label>
              <input
                name="playerName"
                type="text"
                defaultValue=""
                className="w-full bg-black/50 border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Örn: Gezgin"
                autoFocus
                maxLength={20}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 px-6 bg-primary/30 hover:bg-primary/50 border border-primary/50 text-white rounded-xl font-bold tracking-wide transition-all"
            >
              MACERAYA BAŞLA
            </button>
            <button
              type="button"
              onClick={() => setShowNewGame(false)}
              className="w-full py-3 px-6 text-muted-foreground hover:text-white transition-colors"
            >
              Geri Dön
            </button>
          </motion.form>
        )}

        <div className="absolute bottom-8 left-0 right-0 text-center text-muted-foreground/50 text-xs font-mono">
          Singleplayer · Türkçe · v0.0.2
        </div>
      </div>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.18 }}
              className="bg-card border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Settings size={15} className="text-primary" />
                  <span className="font-serif font-bold text-base">Ayarlar</span>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => { setShowSettings(false); setLocation('/degisiklikler'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <span className="text-lg">📋</span>
                  <div>
                    <div className="font-semibold text-sm text-white">Güncelleme Notları</div>
                    <div className="text-xs text-muted-foreground">v0.0.2 — Görev sistemi ve istatistikler</div>
                  </div>
                </button>
                {hasSave && (
                  <button
                    onClick={handleDeleteSave}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all text-left"
                  >
                    <LogOut size={14} className="text-destructive" />
                    <div>
                      <div className="font-medium text-sm text-destructive">Kaydı Sil</div>
                      <div className="text-xs text-muted-foreground">Tüm ilerleme kalıcı olarak silinir</div>
                    </div>
                  </button>
                )}
              </div>
              <div className="px-5 py-3 border-t border-border text-center">
                <span className="text-[10px] text-muted-foreground/40 font-mono">QuantumRPG · v0.0.2</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickBtn({
  icon,
  label,
  onClick,
  disabled = false,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
        disabled
          ? 'border-white/5 bg-black/20 opacity-40 cursor-not-allowed'
          : 'border-white/10 bg-black/20 hover:bg-white/10 hover:border-white/20 active:scale-95'
      }`}
    >
      <span className={`${typeof icon === 'string' ? 'text-xl' : 'text-muted-foreground'}`}>{icon}</span>
      <span className="text-[9px] text-muted-foreground font-medium">{label}</span>
    </button>
  );
}
