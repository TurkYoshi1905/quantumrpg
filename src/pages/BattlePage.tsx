import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { spells } from '../data/spells';
import { potions } from '../data/potions';
import { Heart, Zap, Shield, Sword, RefreshCcw, FlaskConical } from 'lucide-react';
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
        dispatch({ type: 'ENEMY_TURN', damage: finalDmg, log: `${emoji} ${enemy.name} ${attackName} kullandı — ${finalDmg} hasar!` });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [battle.phase, battle.active, enemy, battle.enemyHp, battle.enemyBurning, battle.enemyFrozen, battle.enemyStunned, player.stats.defense, dispatch]);

  useEffect(() => { if (battle.phase !== 'player_turn') setPanel('main'); }, [battle.phase]);

  // Zafer anında altını bir kez hesapla — ekranda gerçek miktar gösterilsin
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
    if (battle.phase !== 'player_turn') return;
    const variance = 0.75 + Math.random() * 0.5;
    const baseAtk = Math.floor(player.stats.attack * variance);
    const defReduction = Math.floor(enemy.stats.defense * 0.4);
    const finalDmg = Math.max(1, baseAtk - defReduction);
    const isCrit = variance > 1.15;
    dispatch({ type: 'ATTACK_ENEMY', damage: finalDmg, log: isCrit ? `⚔️ KRİTİK! Güçlü vurdun — ${finalDmg} hasar!` : `Kılıcınla saldırdın — ${finalDmg} hasar!` });
  };

  const handleSpell = (spellId: string) => {
    if (battle.phase !== 'player_turn') return;
    const spell = spells[spellId];
    if (!spell || battle.playerMana < spell.manaCost) return;
    let finalDmg = spell.damage;
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
    dispatch({ type: 'CAST_SPELL', spell, damage: finalDmg, log, effectApplies, stunApplies });
    setPanel('main');
  };

  const handleUsePotion = (potionId: string) => {
    if (battle.phase !== 'player_turn') return;
    if ((player.potions[potionId] || 0) <= 0) return;
    dispatch({ type: 'USE_POTION', potionId });
  };

  const handleDefend = () => {
    if (battle.phase !== 'player_turn') return;
    dispatch({ type: 'DEFEND', log: 'Savunma pozisyonu aldın.' });
  };

  const handleFlee = () => {
    if (battle.phase !== 'player_turn') return;
    const success = Math.random() > 0.6;
    dispatch({ type: 'FLEE', success, log: success ? 'Başarıyla kaçtın!' : 'Kaçmayı başaramadın!' });
    if (success) setTimeout(() => setLocation('/harita'), 1500);
  };

  const handlePostBattle = () => {
    if (battle.phase === 'victory') {
      const xp = enemy.xpReward;
      // earnedCoins zaten zafer anında hesaplandı; fallback olarak tekrar hesapla
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
  const getEnemyHpColor = () => enemyHpPercent > 50 ? 'bg-green-500' : enemyHpPercent > 20 ? 'bg-yellow-500' : 'bg-destructive';

  const isPlayerTurn  = battle.phase === 'player_turn';
  const hasPotions    = Object.keys(player.potions).some(k => (player.potions[k] || 0) > 0);
  const potionCount   = Object.values(player.potions).reduce((a, b) => a + b, 0);

  const regionGradient =
    state.currentRegion === 'orman'  ? 'from-green-950/50'  :
    state.currentRegion === 'magara' ? 'from-blue-950/50'   :
    state.currentRegion === 'kale'   ? 'from-red-950/50'    :
                                       'from-purple-950/50';

  // ── Shared: Victory / Defeat overlay ────────────────────────────────────────
  const endOverlay = (
    <AnimatePresence>
      {(battle.phase === 'victory' || battle.phase === 'defeat') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border p-6 rounded-2xl text-center max-w-sm w-full mx-4"
          >
            <h2 className={`text-3xl font-serif font-bold mb-4 ${battle.phase === 'victory' ? 'text-yellow-400' : 'text-destructive'}`}>
              {battle.phase === 'victory' ? 'ZAFER! 🏆' : 'YENİLGİ! 💀'}
            </h2>
            {battle.phase === 'victory' && (
              <div className="space-y-2 mb-6 text-left">
                <div className="bg-white/5 p-3 rounded flex justify-between">
                  <span>XP:</span><span className="text-blue-400 font-bold">+{enemy.xpReward}</span>
                </div>
                <div className="bg-white/5 p-3 rounded flex justify-between">
                  <span>Altın:</span><span className="text-yellow-400 font-bold">+{earnedCoins ?? '...'} 🪙</span>
                </div>
              </div>
            )}
            <button onClick={handlePostBattle}
              disabled={battle.phase === 'victory' && earnedCoins === null}
              className="w-full py-3 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white rounded-xl font-bold transition-all disabled:opacity-50">
              Devam Et
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Shared: Action panels (spells / items) ───────────────────────────────────
  const renderActionPanel = (compact = false) => (
    <AnimatePresence mode="wait">
      {panel === 'main' && (
        <motion.div key="main" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className={`grid grid-cols-2 gap-2 h-full`}>
          <button onClick={handleAttack} disabled={!isPlayerTurn}
            className={`bg-card border border-border hover:border-orange-400/50 hover:bg-orange-400/10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${compact ? 'py-2' : 'py-3'}`}>
            <Sword size={compact ? 18 : 22} className="text-orange-400" />
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>Saldır</span>
          </button>
          <button onClick={() => setPanel('spells')} disabled={!isPlayerTurn || player.knownSpells.length === 0}
            className={`bg-card border border-border hover:border-purple-400/50 hover:bg-purple-400/10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${compact ? 'py-2' : 'py-3'}`}>
            <Zap size={compact ? 18 : 22} className="text-purple-400" />
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>Büyüler</span>
          </button>
          <button onClick={handleDefend} disabled={!isPlayerTurn}
            className={`bg-card border border-border hover:border-blue-400/50 hover:bg-blue-400/10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${compact ? 'py-2' : 'py-3'}`}>
            <Shield size={compact ? 18 : 22} className="text-blue-400" />
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>Savun</span>
          </button>
          <button onClick={() => setPanel('items')} disabled={!isPlayerTurn || !hasPotions}
            className={`relative bg-card border border-border hover:border-green-400/50 hover:bg-green-400/10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${compact ? 'py-2' : 'py-3'}`}>
            <FlaskConical size={compact ? 18 : 22} className="text-green-400" />
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>Eşyalar</span>
            {hasPotions && <span className="absolute top-1.5 right-1.5 text-[9px] bg-green-500/20 border border-green-500/30 text-green-400 rounded-full px-1 font-mono">{potionCount}</span>}
          </button>
          <button onClick={handleFlee} disabled={!isPlayerTurn}
            className={`col-span-2 bg-card border border-border hover:border-destructive/50 hover:bg-destructive/10 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${compact ? 'py-1.5' : 'py-2.5'}`}>
            <RefreshCcw size={compact ? 14 : 16} className="text-muted-foreground" />
            <span className={`font-bold text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>Kaç</span>
          </button>
        </motion.div>
      )}

      {panel === 'spells' && (
        <motion.div key="spells" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-border/50 shrink-0">
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>✨ Büyüler</span>
            <button onClick={() => setPanel('main')} className="text-xs text-muted-foreground hover:text-white px-2 py-0.5 rounded bg-white/5">← Geri</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {player.knownSpells.map(spellId => {
              const spell = spells[spellId];
              if (!spell) return null;
              const canCast = battle.playerMana >= spell.manaCost;
              const es = getElementStyle(spell.element);
              return (
                <button key={spell.id} onClick={() => handleSpell(spell.id)} disabled={!canCast}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${canCast ? 'border-primary/30 bg-primary/5 hover:bg-primary/20 active:bg-primary/30' : 'border-border/30 bg-black/20 opacity-40 cursor-not-allowed'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={compact ? 'text-lg shrink-0' : 'text-xl shrink-0'}>{spell.emoji}</span>
                    <div className="min-w-0">
                      <div className={`flex items-center gap-1.5 flex-wrap ${compact ? 'text-[11px]' : 'text-sm'}`}>
                        <span className="font-bold">{spell.name}</span>
                        <span className={`inline-flex items-center text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-full border ${es.text} ${es.bg} ${es.border} ${es.glow}`}>
                          {es.label}
                        </span>
                      </div>
                      <div className="text-[9px] text-muted-foreground line-clamp-2 break-words">{spell.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 shrink-0">{spell.manaCost}MP</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {panel === 'items' && (
        <motion.div key="items" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-border/50 shrink-0">
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>🎒 Eşyalar</span>
            <button onClick={() => setPanel('main')} className="text-xs text-muted-foreground hover:text-white px-2 py-0.5 rounded bg-white/5">← Geri</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {Object.entries(player.potions).filter(([, c]) => (c || 0) > 0).map(([potionId, count]) => {
              const potion = potions[potionId];
              if (!potion) return null;
              return (
                <button key={potionId} onClick={() => handleUsePotion(potionId)}
                  className="w-full flex items-center justify-between p-2 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/20 active:bg-green-500/30 text-left transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={compact ? 'text-lg shrink-0' : 'text-xl shrink-0'}>{potion.emoji}</span>
                    <div className="min-w-0">
                      <div className={`font-bold ${compact ? 'text-[11px]' : 'text-sm'}`}>{potion.name}</div>
                      <div className="text-[9px] text-muted-foreground line-clamp-2 break-words">{potion.description}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-green-400 shrink-0">×{count}</span>
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
      <div className={`h-[100dvh] bg-black flex flex-col overflow-hidden relative`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-black z-0`} />
        {endOverlay}

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-3 h-9 border-b border-white/10 bg-black/40 shrink-0 text-xs font-mono">
          <span className="text-muted-foreground">Tur: {battle.turn}</span>
          <div className="flex gap-1.5">
            {battle.shieldPotionCharges > 0 && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">🛡️×{battle.shieldPotionCharges}</span>}
            {battle.speedBoostTurns    > 0 && <span className="px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">⚡{battle.speedBoostTurns}t</span>}
            {battle.damageBoostTurns   > 0 && <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">🔥{battle.damageBoostTurns}t</span>}
          </div>
          <span className={`px-2 py-0.5 rounded border ${isPlayerTurn ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
            {battle.phase === 'player_turn' ? 'Senin Sıran' : battle.phase === 'enemy_turn' ? 'Düşman...' : 'Bitti'}
          </span>
        </div>

        {/* Main content: 2 columns */}
        <div className="relative z-10 flex flex-1 overflow-hidden">
          {/* Left: Enemy */}
          <div className="w-[40%] flex flex-col items-center justify-center px-2 border-r border-white/10">
            <motion.div
              animate={{ y: battle.phase === 'enemy_turn' ? [0, -10, 0] : [0, -4, 0] }}
              transition={{ duration: battle.phase === 'enemy_turn' ? 0.3 : 2.5, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
              className="text-6xl mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              {enemy.emoji}
            </motion.div>
            <h3 className={`font-serif font-bold text-center text-sm mb-1 ${enemy.isBoss ? 'text-destructive' : 'text-white'}`}>{enemy.name}</h3>
            <div className="flex gap-1 mb-2 flex-wrap justify-center">
              {battle.enemyBurning  && <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">🔥 Yanıyor</span>}
              {battle.enemyFrozen  && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/10   border border-cyan-400/20   text-cyan-400">❄️ Donmuş</span>}
              {battle.enemyStunned && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">💫 Sersem</span>}
            </div>
            <div className="w-full px-4">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-1">
                <motion.div className={`h-full ${getEnemyHpColor()}`} animate={{ width: `${enemyHpPercent}%` }} transition={{ duration: 0.3 }} />
              </div>
              <div className="text-[9px] font-mono text-center text-muted-foreground">{battle.enemyHp}/{enemy.stats.maxHp} HP</div>
            </div>
          </div>

          {/* Right: Player + Log + Actions */}
          <div className="flex-1 flex flex-col px-2 py-1.5 gap-1.5 overflow-hidden">
            {/* Player stats */}
            <div className="space-y-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <Heart size={10} className="text-destructive shrink-0" />
                <div className="flex-1 h-2 bg-destructive/20 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-destructive" animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.3 }} />
                </div>
                <span className="text-[9px] font-mono text-destructive w-14 text-right">{battle.playerHp}/{player.stats.maxHp}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-blue-400 shrink-0" />
                <div className="flex-1 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-500" animate={{ width: `${playerManaPercent}%` }} transition={{ duration: 0.3 }} />
                </div>
                <span className="text-[9px] font-mono text-blue-400 w-14 text-right">{battle.playerMana}/{player.stats.maxMana}</span>
              </div>
            </div>

            {/* Battle log — compact, 2 lines */}
            <div className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 shrink-0 overflow-hidden" style={{ maxHeight: '44px' }}>
              {battle.log.slice(-2).map((line, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate leading-tight">{line}</p>
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
      <div className="h-[100dvh] bg-black flex flex-col overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-black z-0`} />
        {endOverlay}

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-3 h-10 border-b border-white/10 bg-black/40 shrink-0 text-xs font-mono">
          <span className="text-muted-foreground">Tur: {battle.turn}</span>
          <div className="flex gap-1">
            {battle.shieldPotionCharges > 0 && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px]">🛡️×{battle.shieldPotionCharges}</span>}
            {battle.speedBoostTurns    > 0 && <span className="px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px]">⚡{battle.speedBoostTurns}t</span>}
            {battle.damageBoostTurns   > 0 && <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px]">🔥{battle.damageBoostTurns}t</span>}
          </div>
          <span className={`px-2 py-0.5 rounded border text-[10px] ${isPlayerTurn ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
            {battle.phase === 'player_turn' ? 'Senin Sıran' : battle.phase === 'enemy_turn' ? 'Düşman...' : 'Bitti'}
          </span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden px-3 py-2 gap-2">
          {/* Enemy section */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              animate={{ y: battle.phase === 'enemy_turn' ? [0, -8, 0] : [0, -3, 0] }}
              transition={{ duration: battle.phase === 'enemy_turn' ? 0.3 : 2.5, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
              className="text-5xl shrink-0"
            >
              {enemy.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-serif font-bold text-sm mb-1 ${enemy.isBoss ? 'text-destructive' : 'text-white'}`}>{enemy.name}</h3>
              <div className="flex gap-1 mb-1 flex-wrap">
                {battle.enemyBurning  && <span className="text-[8px] px-1 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">🔥</span>}
                {battle.enemyFrozen  && <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-400/10   border border-cyan-400/20   text-cyan-400">❄️</span>}
                {battle.enemyStunned && <span className="text-[8px] px-1 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">💫</span>}
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div className={`h-full ${getEnemyHpColor()}`} animate={{ width: `${enemyHpPercent}%` }} transition={{ duration: 0.3 }} />
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-0.5">{battle.enemyHp}/{enemy.stats.maxHp} HP</div>
            </div>
          </div>

          {/* Player HP / MP */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-2 space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Heart size={11} className="text-destructive shrink-0" />
              <div className="flex-1 h-2 bg-destructive/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-destructive" animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.3 }} />
              </div>
              <span className="text-[10px] font-mono text-destructive w-16 text-right">{battle.playerHp}/{player.stats.maxHp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={11} className="text-blue-400 shrink-0" />
              <div className="flex-1 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-500" animate={{ width: `${playerManaPercent}%` }} transition={{ duration: 0.3 }} />
              </div>
              <span className="text-[10px] font-mono text-blue-400 w-16 text-right">{battle.playerMana}/{player.stats.maxMana}</span>
            </div>
          </div>

          {/* Battle log — 1-2 lines */}
          <div className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 shrink-0">
            {battle.log.slice(-2).map((line, i) => (
              <p key={i} className="text-[10px] text-muted-foreground leading-snug">{line}</p>
            ))}
            {battle.log.length === 0 && <p className="text-[10px] text-muted-foreground/50">Savaş başlıyor...</p>}
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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden font-sans">
      <div className={`absolute inset-0 bg-gradient-to-b ${regionGradient} to-black z-0`} />
      {endOverlay}

      <div className="relative z-10 flex-1 flex flex-col p-4 max-w-3xl w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center py-4 border-b border-white/10 mb-8">
          <div className="text-sm font-mono text-muted-foreground">Tur: {battle.turn}</div>
          <div className="flex gap-2">
            {battle.shieldPotionCharges > 0 && <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">🛡️ ×{battle.shieldPotionCharges}</span>}
            {battle.speedBoostTurns    > 0 && <span className="text-xs px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">⚡ {battle.speedBoostTurns}t</span>}
            {battle.damageBoostTurns   > 0 && <span className="text-xs px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">🔥 {battle.damageBoostTurns}t</span>}
          </div>
          <div className="text-sm font-mono px-3 py-1 rounded bg-white/5 border border-white/10">
            {battle.phase === 'player_turn'  ? <span className="text-green-400">Senin Sıran</span> :
             battle.phase === 'enemy_turn'   ? <span className="text-destructive">Düşman Saldırıyor...</span> :
             'Savaş Bitti'}
          </div>
        </div>

        {/* Enemy */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <motion.div
            animate={{ y: battle.phase === 'enemy_turn' ? [0, -20, 0] : [0, -5, 0], x: battle.phase === 'enemy_turn' ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: battle.phase === 'enemy_turn' ? 0.3 : 3, repeat: battle.phase === 'enemy_turn' ? 0 : Infinity, repeatType: 'reverse' }}
            className="text-8xl md:text-[120px] mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {enemy.emoji}
          </motion.div>
          <div className="w-full max-w-xs text-center space-y-2">
            <h3 className={`font-serif font-bold text-xl ${enemy.isBoss ? 'text-destructive' : 'text-white'}`}>{enemy.name}</h3>
            <div className="flex justify-center gap-2 h-6">
              {battle.enemyBurning  && <span className="text-orange-500 text-sm bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">🔥 Yanıyor</span>}
              {battle.enemyFrozen  && <span className="text-cyan-400   text-sm bg-cyan-400/10   px-2 py-0.5 rounded border border-cyan-400/20">❄️ Donmuş</span>}
              {battle.enemyStunned && <span className="text-yellow-400 text-sm bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">💫 Sersem</span>}
            </div>
            <div className="bg-black/50 border border-white/20 p-1 rounded-full w-full">
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div className={`h-full ${getEnemyHpColor()}`} initial={{ width: '100%' }} animate={{ width: `${enemyHpPercent}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">{battle.enemyHp} / {enemy.stats.maxHp} HP</div>
          </div>
        </div>

        <BattleLog logs={battle.log} />

        {/* Player stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 border border-destructive/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1 text-destructive font-bold text-sm"><Heart size={14}/> HP</div>
              <div className="text-xs font-mono">{battle.playerHp}/{player.stats.maxHp}</div>
            </div>
            <div className="h-2 w-full bg-destructive/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-destructive" animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
          <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1 text-blue-500 font-bold text-sm"><Zap size={14}/> MP</div>
              <div className="text-xs font-mono">{battle.playerMana}/{player.stats.maxMana}</div>
            </div>
            <div className="h-2 w-full bg-blue-500/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500" animate={{ width: `${playerManaPercent}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        </div>

        {/* Actions desktop */}
        <div className="relative h-52">
          {renderActionPanel(false)}
        </div>
      </div>
    </div>
  );
}
