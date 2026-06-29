import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spell } from '../types/game';
import { useMobileDevice } from '../hooks/use-mobile';
import { getElementStyle } from '../utils/elementStyles';

interface Props {
  spell: Spell | null;
  onClose: () => void;
}

export function SpellUnlockModal({ spell, onClose }: Props) {
  const { isMobile, isLandscape } = useMobileDevice();
  if (!spell) return null;

  const compact = isMobile && isLandscape;
  const elemStyle = getElementStyle(spell.element);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3"
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className={`bg-card border border-primary/50 rounded-3xl w-full relative overflow-hidden ${
            compact ? 'max-w-xl flex flex-row' : 'max-w-sm flex flex-col'
          }`}
          style={{ maxHeight: '88dvh' }}
        >
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none z-0" />

          {/* ── Landscape: two columns ── */}
          {compact ? (
            <>
              {/* Left: icon */}
              <div className="relative z-10 flex flex-col items-center justify-center px-6 py-4 border-r border-white/10 shrink-0 w-[38%]">
                <div className="text-4xl mb-2">📖</div>
                <h2 className="text-lg font-serif font-black text-white text-center leading-tight">
                  Yeni Büyü<br />Açıldı!
                </h2>
                <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${elemStyle.text} ${elemStyle.bg} ${elemStyle.border} ${elemStyle.glow}`}>
                  {elemStyle.label}
                </div>
              </div>

              {/* Right: spell detail */}
              <div className="relative z-10 flex flex-col justify-center px-5 py-4 flex-1 overflow-y-auto">
                <div className={`border rounded-xl p-3 flex items-center gap-3 mb-4 ${elemStyle.bg} ${elemStyle.border}`}>
                  <div className="text-4xl bg-black/50 w-14 h-14 flex justify-center items-center rounded-xl border border-primary/20 shrink-0">
                    {spell.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{spell.name}</h4>
                    <div className="text-xs font-mono text-blue-400 mb-1">{spell.manaCost} Mana</div>
                    <p className="text-xs text-muted-foreground leading-snug">{spell.description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white rounded-xl font-bold text-sm tracking-wide transition-all"
                >
                  Öğren
                </button>
              </div>
            </>
          ) : (
            /* ── Portrait: stacked ── */
            <div className="relative z-10 flex flex-col text-center p-6 overflow-y-auto" style={{ maxHeight: '85dvh' }}>
              <div className="text-5xl mb-3">📖</div>
              <h2 className="text-2xl font-serif font-black text-white mb-5">
                Yeni Büyü Açıldı!
              </h2>

              <div className={`my-2 border rounded-xl p-4 flex flex-col items-center gap-3 ${elemStyle.bg} ${elemStyle.border}`}>
                <div className={`text-5xl bg-black/50 w-20 h-20 flex justify-center items-center rounded-2xl border border-primary/20 ${elemStyle.glow}`}>
                  {spell.emoji}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h4 className="font-bold text-xl text-white">{spell.name}</h4>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${elemStyle.text} ${elemStyle.bg} ${elemStyle.border}`}>
                      {elemStyle.label}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-blue-400 mb-2">{spell.manaCost} Mana</div>
                  <p className="text-sm text-muted-foreground">{spell.description}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-5 w-full py-3 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white rounded-xl font-bold tracking-wide transition-all"
              >
                Öğren
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
