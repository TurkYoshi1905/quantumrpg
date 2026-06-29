import React, { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { spells } from '../data/spells';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileDevice } from '../hooks/use-mobile';
import { SpellUnlockModal } from './SpellUnlockModal';

export function LevelUpModal() {
  const { state, dispatch } = useGameState();
  const { player } = state;
  const { isMobile, isLandscape } = useMobileDevice();
  const [prevLevel, setPrevLevel] = useState(player.level);
  const [show, setShow] = useState(false);
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [unlockedSpell, setUnlockedSpell] = useState<any>(null);

  useEffect(() => {
    if (player.level > prevLevel && prevLevel > 0) {
      setShow(true);
      setPrevLevel(player.level);
      const availableFreeSpells = Object.values(spells).filter(
        s => s.unlockLevel <= player.level && s.shopPrice === undefined && !player.knownSpells.includes(s.id)
      );
      setUnlockedSpell(availableFreeSpells.length > 0 ? availableFreeSpells[0] : null);
    }
  }, [player.level, prevLevel, player.knownSpells]);

  const handleClose = () => {
    setShow(false);
    if (unlockedSpell) setShowSpellModal(true);
  };

  const handleSpellLearn = () => {
    if (unlockedSpell) dispatch({ type: 'LEARN_FREE_SPELL', spellId: unlockedSpell.id });
    setShowSpellModal(false);
    setUnlockedSpell(null);
  };

  const compact = isMobile && isLandscape;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className={`bg-card border border-primary rounded-3xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] ${
                compact ? 'max-w-2xl flex flex-row gap-0' : 'max-w-md flex flex-col'
              }`}
              style={{ maxHeight: '90dvh' }}
            >
              {/* Ambient glow */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/25 to-transparent pointer-events-none z-0" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 blur-[40px] rounded-full pointer-events-none z-0"
              />

              {/* ── Landscape: two-column layout ── */}
              {compact ? (
                <>
                  {/* Left column: icon + title */}
                  <div className="relative z-10 flex flex-col items-center justify-center px-6 py-4 border-r border-white/10 shrink-0 w-[40%]">
                    <div className="text-5xl mb-2">⭐</div>
                    <h2 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-center leading-tight">
                      SEVİYE<br />ATLADIN!
                    </h2>
                    <p className="text-base font-mono text-white mt-1">Seviye {player.level}</p>
                  </div>

                  {/* Right column: stats + button */}
                  <div className="relative z-10 flex flex-col justify-center px-5 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-white/10">
                      <StatRow label="Maks HP"  value="+10" color="text-green-400" />
                      <StatRow label="Maks Mana" value="+10" color="text-blue-400" />
                      <StatRow label="Saldırı"  value="+3"  color="text-orange-400" />
                      <StatRow label="Savunma"  value="+2"  color="text-cyan-400" />
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm tracking-wide hover:bg-primary/90 transition-colors shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                    >
                      Devam Et
                    </button>
                  </div>
                </>
              ) : (
                /* ── Portrait: original stacked layout ── */
                <div className="relative z-10 flex flex-col text-center p-6 overflow-y-auto" style={{ maxHeight: '85dvh' }}>
                  <div className="text-6xl mb-3">⭐</div>
                  <h2 className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-1">
                    SEVİYE ATLADIN!
                  </h2>
                  <p className="text-xl font-mono text-white mb-6">Seviye {player.level}</p>

                  <div className="space-y-3 mb-6 text-left bg-black/40 p-4 rounded-xl border border-white/10">
                    <StatRow label="Maks HP"   value="+10" color="text-green-400" />
                    <StatRow label="Maks Mana" value="+10" color="text-blue-400" />
                    <StatRow label="Saldırı"   value="+3"  color="text-orange-400" />
                    <StatRow label="Savunma"   value="+2"  color="text-cyan-400" />
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg tracking-wide hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  >
                    Devam Et
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSpellModal && unlockedSpell && (
        <SpellUnlockModal spell={unlockedSpell} onClose={handleSpellLearn} />
      )}
    </>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={`${color} font-bold text-sm`}>{value}</span>
    </div>
  );
}
