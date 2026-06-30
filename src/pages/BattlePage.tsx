import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { spells } from '../data/spells';
import { potions } from '../data/potions';
import { Heart, Zap, Shield, Sword, RefreshCcw, FlaskConical, ChevronLeft } from 'lucide-react';
import { Spell } from '../types/game';
import { BattleLog } from '../components/BattleLog';
import { useMobileDevice } from '../hooks/use-mobile';
import { getElementStyle } from '../utils/elementStyles';

type ActionPanel = 'main' | 'spells' | 'items';

export default function BattlePage() {
  const { enemyId } = useParams();
  const { state, dispatch } = useGameState();
  const [, setLocation] = useLocation();
  const { battle, player } = state;
  const enemy = battle.enemy;
  const { isMobile, isLandscape } = useMobileDevice();

  const [panel, setPanel] = useState<ActionPanel>('main');
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const [hitFlash, setHitFlash] = useState<'enemy' | 'player' | null>(null);

  const isActing = useRef(false);
  const prevPhaseRef = useRef(battle.phase);

  useEffect(() => {
    if (!battle.active || !enemy || enemy.id !== enemyId) {
      setLocation('/harita');
    }
  }, [battle.active, enemy, enemyId, setLocation]);

  useEffect(() => {
    if (battle.phase !== 'enemy_turn' || !battle.active) return;
    const timer = setTimeout(() => {
      let statusDmg = 0;
      let statusLog = '';
      if (battle.enemyBurning) { statusDmg += 3; statusLog += `${enemy?.name} yanıyor ve 3 hasar aldı! `; }

      if (battle.enemyFrozen) {
        statusLog += `${enemy?.name} donmuş durumda, saldıramıyor!`;
        dispatch({ type: 'APPLY_STATUS_EFFECTS', enemyDamage: statusDmg, enemyLog: statusLog.trim(), clearFreeze: true, clearStun: false });
        if (battle.enemyHp - statusDmg > 0) dispatch({ type: 'SKIP_ENEMY_TURN', log: '' });
        return;
      }
      if (battle.enemyStunned) {
        statusLog += `${enemy?.name} sersemliyor, saldıramıyor!`;
        dispatch({ type: 'APPLY_STATUS_EFFECTS', enemyDamage: statusDmg, enemyLog: statusLog.trim(), clearFreeze: false, clearStun: true });
        if (battle.enemyHp - statusDmg > 0) dispatch({ type: 'SKIP_ENEMY_TURN', log: '' });
        return;
      }
      if (statusDmg > 0) {
        dispatch({ type: 'APPLY_STATUS_EFFECTS', enemyDamage: statusDmg, enemyLog: statusLog.trim(), clearFreeze: false, clearStun: false });
        if (battle.enemyHp - statusDmg <= 0) return;
      }
      if (enemy) {
        const isAbility = Math.random() > 0.6 && enemy.abilities.length > 0;
        const attackName = isAbility ? enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)] : 'Saldırı';
        const damageMultiplier = isAbility ? 1.4 : 1;
        const enemyVariance = 0.75 + Math.random() * 0.5;
        const rawDmg = Math.floor(enemy.stats.attack * damageMultiplier * enemyVariance);
        const defenseReduction = Math.floor(player.stats.defense * 0.4);
        const finalDmg = Math.max(1, rawDmg - defenseReduction);
        const emoji = isAbility ? '💥' : '⚔️';
        setHitFlash('player');
        setTimeout(() => setHitFlash(null), 400);
        dispatch({ type: 'ENEMY_TURN', damage: finalDmg, log: `${emoji} ${enemy.name} ${attackName} kullandı — ${finalDmg} hasar!` });
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [battle.phase, battle.active, enemy, battle.enemyHp, battle.enemyBurning, battle.enemyFrozen, battle.enemyStunned, player.stats.defense, dispatch]);

  useEffect(() => {
    if (battle.phase === 'player_turn') {
      isActing.current = false;
    } else {
      setPanel('main');
    }
    prevPhaseRef.current = battle.phase;
  }, [battle.phase]);

  useEffect(() => {
    if (battle.phase === 'victory' && earnedCoins === null && enemy) {
      const coins = Math.floor(Math.random() * (enemy.coinReward.max - enemy.coinReward.min + 1)) + enemy.coinReward.min;
      setEarnedCoins(coins);
    }
    if (battle.phase !== 'victory' && battle.phase !== 'defeat') {
      setEarnedCoins(null);
    }
  }, [battle.phase, enemy, earnedCoins]);

  if (!battle.active || !enemy) return null;

  const handleAttack = () => {
    if (battle.phase !== 'player_turn' || isActing.current) return;
    isActing.current = true;
    const variance = 0.75 + Math.random() * 0.5;
    const baseAtk = Math.floor(player.stats.attack * variance);
    const defReduction = Math.floor(enemy.stats.defense * 0.4);
    const finalDmg = Math.max(1, baseAtk - defReduction);
    const isCrit = variance > 1.15;
    setHitFlash('enemy');
    setTimeout(() => setHitFlash(null), 400);
    dispatch({ type: 'ATTACK_ENEMY', damage: finalDmg, log: isCrit ? `⚔️ KRİTİK! Güçlü vurdun — ${finalDmg} hasar!` : `Kılıcınla saldırdın — ${finalDmg} hasar!` });
  };

  const handleSpell = (spellId: string) => {
    if (battle.phase !== 'player_turn' || isActing.current) return;
    const spell = spells[spellId];
    if (!spell || battle.playerMana < spell.manaCost) return;
    const spPower = player.stats.spellPower ?? 10;
    let finalDmg = spell.damage + Math.floor(spPower * 0.5);
    let log = `${spell.name} büyüsünü kullandın! `;
    let effectApplies = false;
    let stunApplies = false;
    if (spell.damage > 0) {
      const spellVariance = 0.8 + Math.random() * 0.4;
      finalDmg = Math.floor(finalDmg * spellVariance);
      if (spell.element === enemy.weakness) { finalDmg = Math.floor(finalDmg * 1.5); log += '🎯 Zayıflık! '; }
      const defReduction = Math.floor(enemy.stats.defense * 0.25);
      finalDmg = Math.max(1, finalDmg - defReduction);
      log += `${finalDmg} hasar verdin.`;
      if (spell.effectChance && Math.random() < spell.effectChance) {
        if (spell.effect === 'burn') { effectApplies = true; log += ' Düşman yanıyor!'; }
        else if (spell.effect === 'freeze') { effectApplies = true; log += ' Düşman dondu!'; }
        else if (spell.effect === 'stun') { stunApplies = true; log += ' Düşman sersemliyor!'; }
      }
    } else if (spell.effect === 'heal') { log += `Kendini ${spell.healAmount} can iyileştirdin.`; }
    else if (spell.effect === 'shield') { log += `Kendini kalkanla korudun!`; }
    if (spell.damage > 0) { setHitFlash('enemy'); setTimeout(() => setHitFlash(null), 400); }
    isActing.current = true;
    dispatch({ type: 'CAST_SPELL', spell, damage: finalDmg, log, effectApplies, stunApplies });
    setPanel('main');
  };

  const handleUsePotion = (potionId: string) => {
    if (battle.phase !== 'player_turn' || isActing.current) return;
    if ((player.potions[potionId] || 0) <= 0) return;
    isActing.current = true;
    dispatch({ type: 'USE_POTION', potionId });
    setPanel('main');
  };

  const handleDefend = () => {
    if (battle.phase !== 'player_turn' || isActing.current) return;
    isActing.current = true;
    dispatch({ type: 'DEFEND', log: 'Savunma pozisyonu aldın.' });
  };

  const handleFlee = () => {
    if (battle.phase !== 'player_turn' || isActing.current) return;
    isActing.current = true;
    const success = Math.random() > 0.6;
    dispatch({ type: 'FLEE', success, log: success ? 'Başarıyla kaçtın!' : 'Kaçmayı başaramadın!' });
    if (success) setTimeout(() => setLocation('/harita'), 1500);
  };

  const handlePostBattle = () => {
    if (battle.phase === 'victory') {
      const xp = enemy.xpReward;
      const coins = earnedCoins ?? (Math.floor(Math.random() * (enemy.coinReward.max - enemy.coinReward.min + 1)) + enemy.coinReward.min);
      dispatch({ type: 'BATTLE_VICTORY', xp, coins, log: `Kazandın! ${xp} XP ve ${coins} Altın elde ettin.` });
      dispatch({ type: 'END_BATTLE' });
      setLocation('/harita');
    } else if (battle.phase === 'defeat') {
      dispatch({ type: 'BATTLE_DEFEAT', log: 'Yenildin...' });
      dispatch({ type: 'END_BATTLE' });
      setLocation('/harita');
    }
  };

  const enemyHpPercent   = (battle.enemyHp   / enemy.stats.maxHp)    * 100;
  const playerHpPercent  = (battle.playerHp   / player.stats.maxHp)   * 100;
  const playerManaPercent = (battle.playerMana / player.stats.maxMana) * 100;

  const enemyHpBarColor =
    enemyHpPercent > 60 ? 'from-emerald-500 to-green-400' :
    enemyHpPercent > 25 ? 'from-yellow-500 to-amber-400' :
    'from-red-600 to-rose-500';

  const isPlayerTurn  = battle.phase === 'player_turn';
  const hasPotions    = Object.keys(player.potions).some(k => (player.potions[k] || 0) > 0);
  const potionCount   = Object.values(player.potions).reduce((a, b) => a + b, 0);

  const regionGradient =
    state.currentRegion === 'orman'  ? 'from-green-950/60 via-black'  :
    state.currentRegion === 'magara' ? 'from-blue-950/60 via-black'   :
    state.currentRegion === 'kale'   ? 'from-red-950/60 via-black'    :
                                       'from-purple-950/60 via-black';

  // ── Victory / Defeat overlay ─────────────────────────────────────────────────
  const endOverlay = (
    <AnimatePresence>
      {(battle.phase === 'victory' || battle.phase === 'defeat') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`relative overflow-hidden bg-[#0e0e1a] border rounded-2xl text-center max-w-sm w-full mx-4 p-7 shadow-2xl
              ${battle.phase === 'victory' ? 'border-yellow-500/30' : 'border-red-600/30'}`}
          >
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-b ${battle.phase === 'victory' ? 'from-yellow-400' : 'from-red-600'} to-transparent pointer-events-none`} />
            <div className="text-5xl mb-3">{battle.phase === 'victory' ? '🏆' : '💀'}</div>
            <h2 className={`text-2xl font-extrabold mb-5 tracking-tight ${battle.phase === 'victory' ? 'text-yellow-400' : 'text-red-400'}`}>
              {battle.phase === 'victory' ? 'ZAFER!' : 'YENİLGİ!'}
            </h2>
            {battle.phase === 'victory' && (
              <div className="space-y-2 mb-6 text-left">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <span className="text-sm text-muted-foreground">Deneyim</span>
                  <span className="text-blue-400 font-bold">+{enemy.xpReward} XP</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <span className="text-sm text-muted-foreground">Altın</span>
                  <span className="text-yellow-400 font-bold">+{earnedCoins ?? '...'} 🪙</span>
                </div>
              </div>
            )}
            <button
              onClick={handlePostBattle}
              disabled={battle.phase === 'victory' && earnedCoins === null}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border
                ${battle.phase === 'victory'
                  ? 'bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/40 text-yellow-300'
                  : 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-300'}`}
            >
              Devam Et →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Active buff badges ────────────────────────────────────────────────────────
  const BuffBadges = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center gap-1 ${compact ? '' : 'gap-1.5'}`}>
      <AnimatePresence>
        {battle.shieldPotionCharges > 0 && (
          <motion.span
            key="shield"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className={`inline-flex items-center gap-1 font-bold rounded-full border
              bg-blue-500/15 border-blue-500/40 text-blue-300
              shadow-[0_0_8px_rgba(59,130,246,0.4)]
              ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
          >
            🛡️ ×{battle.shieldPotionCharges}
          </motion.span>
        )}
        {battle.speedBoostTurns > 0 && (
          <motion.span
            key="speed"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className={`inline-flex items-center gap-1 font-bold rounded-full border
              bg-yellow-400/15 border-yellow-400/40 text-yellow-300
              shadow-[0_0_8px_rgba(250,204,21,0.4)]
              ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
          >
            ⚡ {battle.speedBoostTurns}t
          </motion.span>
        )}
        {battle.damageBoostTurns > 0 && (
          <motion.span
            key="damage"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className={`inline-flex items-center gap-1 font-bold rounded-full border
              bg-orange-500/15 border-orange-500/40 text-orange-300
              shadow-[0_0_8px_rgba(249,115,22,0.4)]
              ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
          >
            🔥 {battle.damageBoostTurns}t
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Turn indicator ────────────────────────────────────────────────────────────
  const TurnIndicator = ({ compact = false }: { compact?: boolean }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={battle.phase}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center gap-1.5 font-bold rounded-full border
          ${compact ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'}
          ${isPlayerTurn
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
            : battle.phase === 'enemy_turn'
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
            : 'bg-white/5 border-white/10 text-muted-foreground'}`}
      >
        <span className={isPlayerTurn ? 'animate-pulse' : ''}>
          {isPlayerTurn ? '⚔️' : battle.phase === 'enemy_turn' ? '👾' : '—'}
        </span>
        {battle.phase === 'player_turn' ? 'Senin Sıran' :
         battle.phase === 'enemy_turn'  ? 'Düşman...'  : 'Bitti'}
      </motion.div>
    </AnimatePresence>
  );

  // ── Enemy status badges ───────────────────────────────────────────────────────
  const EnemyStatusBadges = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex gap-1 flex-wrap justify-center">
      {battle.enemyBurning  && <span className={`font-semibold rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 ${compact ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}>🔥 Yanıyor</span>}
      {battle.enemyFrozen   && <span className={`font-semibold rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 ${compact ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}>❄️ Donmuş</span>}
      {battle.enemyStunned  && <span className={`font-semibold rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 ${compact ? 'text-[9px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}>💫 Sersem</span>}
    </div>
  );

  // ── HP bar ───────────────────────────────────────────────────────────────────
  const HpBar = ({ pct, colorClass }: { pct: number; colorClass: string }) => (
    <div className="h-full w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
        style={{ width: `${Math.max(0, pct)}%`, transition: 'width 0.35s ease-out' }}
      />
    </div>
  );

  // ── Action panel ─────────────────────────────────────────────────────────────
  const renderActionPanel = (compact = false) => (
    <AnimatePresence mode="wait">
      {panel === 'main' && (
        <motion.div key="main" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="grid grid-cols-2 gap-2 h-full">

          <ActionBtn
            onClick={handleAttack} disabled={!isPlayerTurn} compact={compact}
            icon={<Sword size={compact ? 16 : 20} />}
            label="Saldır"
            color="orange"
          />
          <ActionBtn
            onClick={() => setPanel('spells')} disabled={!isPlayerTurn || (player.equippedSpells?.length ?? 0) === 0} compact={compact}
            icon={<Zap size={compact ? 16 : 20} />}
            label="Büyüler"
            color="purple"
          />
          <ActionBtn
            onClick={handleDefend} disabled={!isPlayerTurn} compact={compact}
            icon={<Shield size={compact ? 16 : 20} />}
            label="Savun"
            color="blue"
          />
          <ActionBtn
            onClick={() => setPanel('items')} disabled={!isPlayerTurn || !hasPotions} compact={compact}
            icon={<FlaskConical size={compact ? 16 : 20} />}
            label="Eşyalar"
            color="green"
            badge={hasPotions ? `×${potionCount}` : undefined}
          />

          <button
            onClick={handleFlee} disabled={!isPlayerTurn}
            className={`col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3
              hover:bg-white/8 hover:border-white/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed
              ${compact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'} text-muted-foreground font-semibold`}
          >
            <RefreshCcw size={compact ? 12 : 14} />
            Kaç
          </button>
        </motion.div>
      )}

      {panel === 'spells' && (
        <motion.div key="spells" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="flex flex-col h-full bg-[#0d0d1e]/80 border border-purple-500/20 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-purple-500/20 shrink-0 bg-purple-500/5">
            <span className={`font-bold text-purple-300 ${compact ? 'text-xs' : 'text-sm'}`}>✨ Büyüler</span>
            <button onClick={() => setPanel('main')} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronLeft size={12} /> Geri
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {(player.equippedSpells ?? []).map(spellId => {
              const spell = spells[spellId];
              if (!spell) return null;
              const canCast = battle.playerMana >= spell.manaCost;
              const es = getElementStyle(spell.element);
              return (
                <button key={spell.id} onClick={() => handleSpell(spell.id)} disabled={!canCast}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all active:scale-[0.98]
                    ${canCast
                      ? 'border-purple-500/25 bg-purple-500/8 hover:bg-purple-500/18 hover:border-purple-400/40'
                      : 'border-white/5 bg-black/20 opacity-35 cursor-not-allowed'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={compact ? 'text-lg shrink-0' : 'text-xl shrink-0'}>{spell.emoji}</span>
                    <div className="min-w-0">
                      <div className={`flex items-center gap-1.5 flex-wrap ${compact ? 'text-[11px]' : 'text-sm'}`}>
                        <span className="font-semibold">{spell.name}</span>
                        <span className={`inline-flex items-center text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${es.text} ${es.bg} ${es.border}`}>
                          {es.label}
                        </span>
                      </div>
                      <div className="text-[9px] text-muted-foreground line-clamp-1">{spell.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 shrink-0 ml-2">{spell.manaCost}MP</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {panel === 'items' && (
        <motion.div key="items" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="flex flex-col h-full bg-[#0d1a10]/80 border border-green-500/20 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-green-500/20 shrink-0 bg-green-500/5">
            <span className={`font-bold text-green-300 ${compact ? 'text-xs' : 'text-sm'}`}>🎒 Eşyalar</span>
            <button onClick={() => setPanel('main')} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronLeft size={12} /> Geri
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {Object.entries(player.potions).filter(([, c]) => (c || 0) > 0).map(([potionId, count]) => {
              const potion = potions[potionId];
              if (!potion) return null;
              return (
                <button key={potionId} onClick={() => handleUsePotion(potionId)}
                  className="w-full flex items-center justify-between p-2 rounded-lg border border-green-500/25 bg-green-500/8
                    hover:bg-green-500/18 hover:border-green-400/40 text-left transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={compact ? 'text-lg shrink-0' : 'text-xl shrink-0'}>{potion.emoji}</span>
                    <div className="min-w-0">
                      <div className={`font-semibold ${compact ? 'text-[11px]' : 'text-sm'}`}>{potion.name}</div>
                      <div className="text-[9px] text-muted-foreground line-clamp-1">{potion.description}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400 shrink-0 ml-2">×{count}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── MOBILE LANDSCAPE ──────────────────────────────────────────────────────────
  if (isMobile && isLandscape) {
    return (
      <div className="h-[100dvh] bg-[#06060f] flex flex-col overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-[#06060f] z-0`} />
        {endOverlay}

        {/* Top info bar */}
        <div className="relative z-10 flex items-center justify-between px-3 h-9 border-b border-white/8 bg-black/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-white/40">TUR</span>
            <span className="text-white font-bold">{battle.turn}</span>
          </div>
          <BuffBadges compact />
          <TurnIndicator compact />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 overflow-hidden">
          {/* Left: Enemy */}
          <div className="w-[38%] flex flex-col items-center justify-center px-2 border-r border-white/8">
            <motion.div
              animate={{
                y: battle.phase === 'enemy_turn' ? [0, -12, 0] : [0, -4, 0],
                filter: hitFlash === 'enemy' ? ['brightness(1)', 'brightness(3)', 'brightness(1)'] : 'brightness(1)',
              }}
              transition={{ duration: battle.phase === 'enemy_turn' ? 0.25 : 2.5, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
              className={`text-5xl mb-1 drop-shadow-[0_0_24px_rgba(255,255,255,0.2)] ${enemy.isBoss ? 'drop-shadow-[0_0_24px_rgba(239,68,68,0.4)]' : ''}`}
            >
              {enemy.emoji}
            </motion.div>
            <h3 className={`font-bold text-center text-xs mb-1 ${enemy.isBoss ? 'text-red-400' : 'text-white'}`}>{enemy.name}</h3>
            <EnemyStatusBadges compact />
            <div className="w-full px-3 mt-1.5">
              <div className="h-2 rounded-full overflow-hidden bg-white/8 shadow-inner">
                <HpBar pct={enemyHpPercent} colorClass={enemyHpBarColor} />
              </div>
              <div className="text-[9px] font-mono text-center text-muted-foreground mt-0.5">{battle.enemyHp}/{enemy.stats.maxHp}</div>
            </div>
          </div>

          {/* Right: Player + Log + Actions */}
          <div className="flex-1 flex flex-col px-2 py-1.5 gap-1.5 overflow-hidden">
            {/* Player stats */}
            <div className="space-y-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <Heart size={9} className="text-rose-400 shrink-0" />
                <div className={`flex-1 h-2 rounded-full overflow-hidden bg-rose-900/40 ${hitFlash === 'player' ? 'ring-1 ring-rose-400' : ''}`}>
                  <HpBar pct={playerHpPercent} colorClass="from-rose-600 to-red-500" />
                </div>
                <span className="text-[9px] font-mono text-rose-400 w-14 text-right">{battle.playerHp}/{player.stats.maxHp}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={9} className="text-blue-400 shrink-0" />
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-blue-900/40">
                  <HpBar pct={playerManaPercent} colorClass="from-blue-600 to-blue-400" />
                </div>
                <span className="text-[9px] font-mono text-blue-400 w-14 text-right">{battle.playerMana}/{player.stats.maxMana}</span>
              </div>
            </div>

            {/* Battle log */}
            <div className="bg-black/30 border border-white/8 rounded-lg px-2 py-1 shrink-0 overflow-hidden" style={{ maxHeight: '38px' }}>
              {battle.log.slice(-2).map((line, i) => (
                <p key={i} className="text-[9px] text-muted-foreground truncate leading-tight">{line}</p>
              ))}
            </div>

            {/* Action panel */}
            <div className="flex-1 min-h-0">
              {renderActionPanel(true)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILE PORTRAIT ───────────────────────────────────────────────────────────
  if (isMobile && !isLandscape) {
    return (
      <div className="h-[100dvh] bg-[#06060f] flex flex-col overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-[#06060f] z-0`} />
        {endOverlay}

        {/* Top info bar */}
        <div className="relative z-10 flex items-center justify-between px-3 h-11 border-b border-white/8 bg-black/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground min-w-[40px]">
            <span className="text-white/40">TUR</span>
            <span className="text-white font-bold">{battle.turn}</span>
          </div>
          <BuffBadges compact />
          <TurnIndicator compact />
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden px-3 py-2 gap-2">
          {/* Enemy section */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              animate={{
                y: battle.phase === 'enemy_turn' ? [0, -10, 0] : [0, -3, 0],
                filter: hitFlash === 'enemy' ? ['brightness(1)', 'brightness(3)', 'brightness(1)'] : 'brightness(1)',
              }}
              transition={{ duration: battle.phase === 'enemy_turn' ? 0.25 : 2.5, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
              className={`text-5xl shrink-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] ${enemy.isBoss ? 'drop-shadow-[0_0_20px_rgba(239,68,68,0.35)]' : ''}`}
            >
              {enemy.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm mb-1 ${enemy.isBoss ? 'text-red-400' : 'text-white'}`}>{enemy.name}</h3>
              <EnemyStatusBadges compact />
              <div className="h-2.5 w-full rounded-full overflow-hidden bg-white/8 mt-1.5 shadow-inner">
                <HpBar pct={enemyHpPercent} colorClass={enemyHpBarColor} />
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-0.5">{battle.enemyHp}/{enemy.stats.maxHp} HP</div>
            </div>
          </div>

          {/* Player stats */}
          <div className={`border rounded-xl p-2.5 space-y-1.5 shrink-0 transition-all
            ${hitFlash === 'player' ? 'bg-rose-900/20 border-rose-500/40' : 'bg-black/30 border-white/8'}`}>
            <div className="flex items-center gap-2">
              <Heart size={11} className="text-rose-400 shrink-0" />
              <div className="flex-1 h-2 bg-rose-900/40 rounded-full overflow-hidden">
                <HpBar pct={playerHpPercent} colorClass="from-rose-600 to-red-500" />
              </div>
              <span className="text-[10px] font-mono text-rose-400 w-16 text-right">{battle.playerHp}/{player.stats.maxHp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={11} className="text-blue-400 shrink-0" />
              <div className="flex-1 h-2 bg-blue-900/40 rounded-full overflow-hidden">
                <HpBar pct={playerManaPercent} colorClass="from-blue-600 to-blue-400" />
              </div>
              <span className="text-[10px] font-mono text-blue-400 w-16 text-right">{battle.playerMana}/{player.stats.maxMana}</span>
            </div>
          </div>

          {/* Battle log */}
          <div className="bg-black/30 border border-white/8 rounded-lg px-2.5 py-1.5 shrink-0">
            {battle.log.slice(-2).map((line, i) => (
              <p key={i} className="text-[10px] text-muted-foreground leading-snug">{line}</p>
            ))}
            {battle.log.length === 0 && <p className="text-[10px] text-muted-foreground/40">Savaş başlıyor...</p>}
          </div>

          {/* Action panel */}
          <div className="flex-1 min-h-0">
            {renderActionPanel(true)}
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col relative overflow-hidden font-sans">
      <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-[#06060f] z-0`} />
      {endOverlay}

      <div className="relative z-10 flex-1 flex flex-col p-4 max-w-3xl w-full mx-auto">

        {/* Info bar */}
        <div className="flex justify-between items-center py-3.5 border-b border-white/8 mb-8">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-white/30 text-xs uppercase tracking-widest">Tur</span>
            <span className="text-white font-bold text-base">{battle.turn}</span>
          </div>
          <BuffBadges />
          <TurnIndicator />
        </div>

        {/* Enemy */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <motion.div
            animate={{
              y: battle.phase === 'enemy_turn' ? [0, -22, 0] : [0, -6, 0],
              x: battle.phase === 'enemy_turn' ? [0, 12, -12, 0] : 0,
              filter: hitFlash === 'enemy' ? ['brightness(1)', 'brightness(4)', 'brightness(1)'] : 'brightness(1)',
            }}
            transition={{ duration: battle.phase === 'enemy_turn' ? 0.28 : 3, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
            className={`text-[120px] mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.18)] select-none
              ${enemy.isBoss ? 'drop-shadow-[0_0_40px_rgba(239,68,68,0.5)]' : ''}`}
          >
            {enemy.emoji}
          </motion.div>

          <div className="w-full max-w-xs text-center space-y-3">
            <h3 className={`font-extrabold text-2xl tracking-tight ${enemy.isBoss ? 'text-red-400' : 'text-white'}`}>{enemy.name}</h3>
            <EnemyStatusBadges />
            <div className="bg-black/50 rounded-2xl p-1 border border-white/8">
              <div className="h-3 w-full rounded-xl overflow-hidden bg-white/8">
                <HpBar pct={enemyHpPercent} colorClass={enemyHpBarColor} />
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">{battle.enemyHp} / {enemy.stats.maxHp} HP</div>
          </div>
        </div>

        <BattleLog logs={battle.log} />

        {/* Player stats */}
        <div className={`grid grid-cols-2 gap-4 mb-5 mt-5`}>
          <div className={`border rounded-2xl p-4 transition-all duration-200
            ${hitFlash === 'player' ? 'bg-rose-900/25 border-rose-500/50 shadow-[0_0_18px_rgba(244,63,94,0.25)]' : 'bg-black/40 border-rose-900/30'}`}>
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-sm"><Heart size={14}/> HP</div>
              <div className="text-xs font-mono text-muted-foreground">{battle.playerHp}/{player.stats.maxHp}</div>
            </div>
            <div className="h-2.5 w-full rounded-full overflow-hidden bg-rose-900/40">
              <HpBar pct={playerHpPercent} colorClass="from-rose-600 to-red-500" />
            </div>
          </div>
          <div className="bg-black/40 border border-blue-900/30 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-sm"><Zap size={14}/> MP</div>
              <div className="text-xs font-mono text-muted-foreground">{battle.playerMana}/{player.stats.maxMana}</div>
            </div>
            <div className="h-2.5 w-full rounded-full overflow-hidden bg-blue-900/40">
              <HpBar pct={playerManaPercent} colorClass="from-blue-600 to-blue-400" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative h-52">
          {renderActionPanel(false)}
        </div>
      </div>
    </div>
  );
}

// ── Action Button component ─────────────────────────────────────────────────
type BtnColor = 'orange' | 'purple' | 'blue' | 'green';
const colorMap: Record<BtnColor, { border: string; hover: string; icon: string; glow: string }> = {
  orange: { border: 'border-orange-500/20', hover: 'hover:border-orange-400/50 hover:bg-orange-400/10 hover:shadow-[0_0_12px_rgba(251,146,60,0.2)]', icon: 'text-orange-400', glow: 'shadow-[0_0_8px_rgba(251,146,60,0.15)]' },
  purple: { border: 'border-purple-500/20', hover: 'hover:border-purple-400/50 hover:bg-purple-400/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]', icon: 'text-purple-400', glow: 'shadow-[0_0_8px_rgba(168,85,247,0.15)]' },
  blue:   { border: 'border-blue-500/20',   hover: 'hover:border-blue-400/50   hover:bg-blue-400/10   hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]',   icon: 'text-blue-400',   glow: 'shadow-[0_0_8px_rgba(59,130,246,0.15)]' },
  green:  { border: 'border-green-500/20',  hover: 'hover:border-green-400/50  hover:bg-green-400/10  hover:shadow-[0_0_12px_rgba(74,222,128,0.2)]',  icon: 'text-green-400',  glow: 'shadow-[0_0_8px_rgba(74,222,128,0.15)]' },
};

function ActionBtn({ onClick, disabled, compact, icon, label, color, badge }: {
  onClick: () => void; disabled: boolean; compact: boolean;
  icon: React.ReactNode; label: string; color: BtnColor; badge?: string;
}) {
  const c = colorMap[color];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative bg-[#0e0e1a]/80 border ${c.border} ${c.hover} rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-95
        ${compact ? 'py-2' : 'py-3'}`}
    >
      <span className={`${c.icon}`}>{icon}</span>
      <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} text-white`}>{label}</span>
      {badge && (
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold ${c.icon} bg-white/8 border ${c.border} rounded-full px-1.5 py-0.5 font-mono`}>
          {badge}
        </span>
      )}
    </button>
  );
}
