import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { PRESTIGE_BONUS_PER } from '../store/constants';
import { Sword, Shield, Heart, Zap, Sparkles, Trophy, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function PrestigeModal({ onClose }: Props) {
  const { state, dispatch } = useGameState();
  const { player } = state;
  const currentCount = player.prestigeCount || 0;
  const pb = player.prestigeBonus;
  const nextBonus = {
    attack:     (pb?.attack     || 0) + PRESTIGE_BONUS_PER.attack,
    defense:    (pb?.defense    || 0) + PRESTIGE_BONUS_PER.defense,
    maxHp:      (pb?.maxHp      || 0) + PRESTIGE_BONUS_PER.maxHp,
    maxMana:    (pb?.maxMana    || 0) + PRESTIGE_BONUS_PER.maxMana,
    spellPower: (pb?.spellPower || 0) + PRESTIGE_BONUS_PER.spellPower,
  };

  const handleConfirm = () => {
    dispatch({ type: 'PRESTIGE' });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, y: 28, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: 16, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onClick={e => e.stopPropagation()}
          className="relative bg-[#0d0d1e] border border-violet-500/30 rounded-2xl max-w-md w-full shadow-2xl shadow-violet-900/40 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/8 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8 flex items-start justify-between">
            <div>
              <div className="text-4xl mb-2">⭐</div>
              <h2 className="text-xl font-extrabold text-violet-300 tracking-tight">Prestij Sistemi</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prestij #{currentCount + 1} — Seviye 100 ile hak kazandın!
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* What you GAIN */}
            <div className="bg-violet-500/8 border border-violet-500/25 rounded-xl p-4">
              <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Trophy size={12} /> Kalıcı Prestij Bonusu (Birikim)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <BonusRow icon={<Sword size={13} className="text-orange-400" />} label="Saldırı"    cur={pb?.attack || 0}     gain={PRESTIGE_BONUS_PER.attack}     next={nextBonus.attack}     color="text-orange-400" />
                <BonusRow icon={<Shield size={13} className="text-blue-400" />}  label="Savunma"   cur={pb?.defense || 0}    gain={PRESTIGE_BONUS_PER.defense}    next={nextBonus.defense}    color="text-blue-400" />
                <BonusRow icon={<Heart size={13} className="text-green-400" />}  label="Sağlık"    cur={pb?.maxHp || 0}      gain={PRESTIGE_BONUS_PER.maxHp}      next={nextBonus.maxHp}      color="text-green-400" />
                <BonusRow icon={<Zap size={13} className="text-purple-400" />}   label="Mana"      cur={pb?.maxMana || 0}    gain={PRESTIGE_BONUS_PER.maxMana}    next={nextBonus.maxMana}    color="text-purple-400" />
                <BonusRow icon={<Sparkles size={13} className="text-violet-400" />} label="Büyü Gücü" cur={pb?.spellPower || 0} gain={PRESTIGE_BONUS_PER.spellPower} next={nextBonus.spellPower} color="text-violet-400" />
              </div>
            </div>

            {/* What you KEEP */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">✅ Korunanlar</div>
              <div className="grid grid-cols-2 gap-1.5 text-sm">
                {['💰 Altın (Coinler)', '⚔️ Ekipmanlar', '✨ Büyüler', '🧪 İksirler', '📿 Kuşanılan Eşyalar', '🏆 Savaş İstatistikleri'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-green-300/80">{item}</div>
                ))}
              </div>
            </div>

            {/* What you LOSE */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">🔄 Sıfırlananlar</div>
              <div className="grid grid-cols-2 gap-1.5">
                {['📈 Seviye (→ 1)', '⭐ XP', '🗺️ Bölge Açılışları', '💪 Temel İstatistikler'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-red-300/80">{item}</div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2">Prestij bonusu stat hesaplamasına her zaman eklenir.</p>
            </div>

            {currentCount > 0 && (
              <div className="text-center text-xs text-muted-foreground/60 font-mono">
                Mevcut Prestij: <span className="text-violet-400 font-bold">{currentCount}×</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white font-bold text-sm transition-all"
            >
              Vazgeç
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl border border-violet-500/50 bg-violet-500/15 hover:bg-violet-500/30 text-violet-200 font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            >
              ⭐ Prestij Yap #{currentCount + 1}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BonusRow({ icon, label, cur, gain, next, color }: {
  icon: React.ReactNode; label: string; cur: number; gain: number; next: number; color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon} {label}
      </div>
      <div className="flex items-center gap-1 text-xs font-mono">
        {cur > 0 && <span className={`${color} opacity-60`}>{cur}</span>}
        {cur > 0 && <span className="text-white/30">→</span>}
        <span className={`${color} font-bold`}>+{next}</span>
        <span className="text-emerald-400 text-[10px]">(+{gain})</span>
      </div>
    </div>
  );
}
