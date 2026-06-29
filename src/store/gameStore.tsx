import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, Enemy, Spell, RegionId, EquipmentSlot, QuestProgress } from '../types/game';
import { INITIAL_STATE, makeFreshPlayer, makeFreshBattle, makeFreshQuestState, recalculateStats } from './constants';
import { equipment } from '../data/equipment';
import { spells } from '../data/spells';
import { potions } from '../data/potions';
import { QUEST_MAP, getDailyQuestIds, getWeeklyQuestIds, getDailyResetTimestamp, getWeeklyResetTimestamp } from '../data/questData';

const SAVE_KEY = 'quantumrpg_save';

type Action =
  | { type: 'START_GAME'; name: string }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'DELETE_SAVE' }
  | { type: 'ENTER_REGION'; regionId: RegionId }
  | { type: 'START_BATTLE'; enemy: Enemy }
  | { type: 'ATTACK_ENEMY'; damage: number; log: string }
  | { type: 'CAST_SPELL'; spell: Spell; damage: number; log: string; effectApplies: boolean; stunApplies: boolean }
  | { type: 'ENEMY_TURN'; damage: number; log: string }
  | { type: 'DEFEND'; log: string }
  | { type: 'FLEE'; success: boolean; log: string }
  | { type: 'APPLY_STATUS_EFFECTS'; enemyDamage: number; enemyLog: string; clearFreeze: boolean; clearStun: boolean }
  | { type: 'SKIP_ENEMY_TURN'; log: string }
  | { type: 'BATTLE_VICTORY'; xp: number; coins: number; log: string }
  | { type: 'BATTLE_DEFEAT'; log: string }
  | { type: 'END_BATTLE' }
  | { type: 'LEVEL_UP'; level: number }
  | { type: 'RESTORE_PLAYER' }
  | { type: 'BUY_SPELL'; spellId: string }
  | { type: 'BUY_EQUIPMENT'; equipmentId: string }
  | { type: 'BUY_POTION'; potionId: string }
  | { type: 'USE_POTION'; potionId: string }
  | { type: 'EQUIP_ITEM'; equipmentId: string }
  | { type: 'UNEQUIP_ITEM'; slot: EquipmentSlot }
  | { type: 'LEARN_FREE_SPELL'; spellId: string }
  | { type: 'REST_AT_INN' }
  | { type: 'CLAIM_QUEST_REWARD'; questId: string; questType: 'daily' | 'weekly' }
  | { type: 'RESET_QUESTS'; resetDaily: boolean; resetWeekly: boolean };

function deepClonePlayer(state: GameState): GameState['player'] {
  return {
    ...state.player,
    stats: { ...state.player.stats },
    baseStats: { ...state.player.baseStats },
    knownSpells: [...state.player.knownSpells],
    equippedItems: { ...state.player.equippedItems },
    inventory: [...state.player.inventory],
    potions: { ...state.player.potions },
    defeatedEnemies: { ...state.player.defeatedEnemies },
    unlockedRegions: [...state.player.unlockedRegions],
    strongestEnemy: state.player.strongestEnemy ? { ...state.player.strongestEnemy } : null,
  };
}

function deepCloneBattle(state: GameState): GameState['battle'] {
  return {
    ...state.battle,
    log: [...state.battle.log],
    enemy: state.battle.enemy
      ? { ...state.battle.enemy, stats: { ...state.battle.enemy.stats }, abilities: [...state.battle.enemy.abilities] }
      : null,
  };
}

function deepCloneQuestState(state: GameState): GameState['questState'] {
  return {
    ...state.questState,
    activeDailyIds: [...state.questState.activeDailyIds],
    activeWeeklyIds: [...state.questState.activeWeeklyIds],
    dailyProgress: state.questState.dailyProgress.map(p => ({ ...p })),
    weeklyProgress: state.questState.weeklyProgress.map(p => ({ ...p })),
  };
}

function updateQuestProgress(
  progressList: QuestProgress[],
  requirementType: 'kills' | 'escapes' | 'boss_kills',
  amount: number
): QuestProgress[] {
  return progressList.map(qp => {
    if (qp.claimed) return qp;
    const quest = QUEST_MAP[qp.questId];
    if (!quest || quest.requirement.type !== requirementType) return qp;
    const newProgress = Math.min(qp.progress + amount, quest.requirement.count);
    return { ...qp, progress: newProgress, completed: newProgress >= quest.requirement.count };
  });
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const player = makeFreshPlayer();
      player.name = action.name;
      return { ...INITIAL_STATE, started: true, player, battle: makeFreshBattle(), questState: makeFreshQuestState() };
    }

    case 'LOAD_GAME':
      return action.state;

    case 'DELETE_SAVE':
      return { started: false, player: makeFreshPlayer(), battle: makeFreshBattle(), currentRegion: null, questState: makeFreshQuestState() };

    case 'ENTER_REGION':
      return { ...state, currentRegion: action.regionId };

    case 'START_BATTLE': {
      const battle = makeFreshBattle();
      return {
        ...state,
        battle: {
          ...battle,
          active: true,
          enemy: action.enemy,
          playerHp: state.player.stats.hp,
          playerMana: state.player.stats.mana,
          enemyHp: action.enemy.stats.maxHp,
          phase: state.player.stats.speed >= action.enemy.stats.speed ? 'player_turn' : 'enemy_turn',
          log: [`${action.enemy.name} belirdi!`],
        },
      };
    }

    case 'ATTACK_ENEMY': {
      const battle = deepCloneBattle(state);
      const dmgMultiplier = state.battle.damageBoostTurns > 0 ? 1.5 : 1;
      const finalDmg = Math.floor(action.damage * dmgMultiplier);
      battle.enemyHp = Math.max(0, state.battle.enemyHp - finalDmg);
      battle.log.push(dmgMultiplier > 1 ? `${action.log} (Hasar İksiri: +%50 → ${finalDmg})` : action.log);
      if (state.battle.speedBoostTurns > 0) {
        battle.speedBoostTurns = state.battle.speedBoostTurns - 1;
        battle.phase = battle.enemyHp <= 0 ? 'victory' : 'player_turn';
        if (battle.speedBoostTurns > 0) battle.log.push(`⚡ Hız İksiri aktif — tekrar senin sıran! (${battle.speedBoostTurns} tur kaldı)`);
      } else {
        battle.phase = battle.enemyHp <= 0 ? 'victory' : 'enemy_turn';
      }
      return { ...state, battle };
    }

    case 'CAST_SPELL': {
      const battle = deepCloneBattle(state);
      battle.playerMana -= action.spell.manaCost;
      const dmgMultiplier = state.battle.damageBoostTurns > 0 ? 1.5 : 1;
      const finalDmg = Math.floor(action.damage * dmgMultiplier);
      battle.enemyHp = Math.max(0, state.battle.enemyHp - finalDmg);
      battle.log.push(dmgMultiplier > 1 ? `${action.log} (Hasar İksiri: +%50 → ${finalDmg} hasar)` : action.log);
      if (action.spell.healAmount && action.spell.healAmount > 0) {
        battle.playerHp = Math.min(state.player.stats.maxHp, state.battle.playerHp + (action.spell.healAmount || 0));
      }
      if (action.spell.effect === 'shield') {
        battle.playerShielded = true;
      }
      if (action.effectApplies) {
        if (action.spell.effect === 'burn') { battle.enemyBurning = true; battle.enemyBurnTurns = 2; }
        if (action.spell.effect === 'freeze') battle.enemyFrozen = true;
      }
      if (action.stunApplies) battle.enemyStunned = true;
      if (state.battle.speedBoostTurns > 0) {
        battle.speedBoostTurns = state.battle.speedBoostTurns - 1;
        battle.phase = battle.enemyHp <= 0 ? 'victory' : 'player_turn';
        if (battle.speedBoostTurns > 0) battle.log.push(`⚡ Hız İksiri aktif — tekrar senin sıran! (${battle.speedBoostTurns} tur kaldı)`);
      } else {
        battle.phase = battle.enemyHp <= 0 ? 'victory' : 'enemy_turn';
      }
      return { ...state, battle };
    }

    case 'DEFEND': {
      const battle = deepCloneBattle(state);
      battle.playerDefending = true;
      battle.log.push(action.log);
      battle.phase = 'enemy_turn';
      return { ...state, battle };
    }

    case 'SKIP_ENEMY_TURN': {
      const battle = deepCloneBattle(state);
      if (action.log) battle.log.push(action.log);
      if (battle.damageBoostTurns > 0) {
        battle.damageBoostTurns = battle.damageBoostTurns - 1;
        if (battle.damageBoostTurns === 0) battle.log.push('🔥 Hasar İksiri bitti.');
      }
      battle.turn += 1;
      battle.phase = 'player_turn';
      return { ...state, battle };
    }

    case 'FLEE': {
      const battle = deepCloneBattle(state);
      battle.log.push(action.log);
      if (action.success) {
        battle.active = false;
        battle.phase = 'defeat';
        const player = deepClonePlayer(state);
        player.stats.hp = battle.playerHp;
        player.stats.mana = battle.playerMana;
        player.totalEscapes = (player.totalEscapes || 0) + 1;
        const qs = deepCloneQuestState(state);
        qs.dailyProgress = updateQuestProgress(qs.dailyProgress, 'escapes', 1);
        qs.weeklyProgress = updateQuestProgress(qs.weeklyProgress, 'escapes', 1);
        return { ...state, battle, player, questState: qs };
      } else {
        battle.phase = 'enemy_turn';
      }
      return { ...state, battle };
    }

    case 'APPLY_STATUS_EFFECTS': {
      const battle = deepCloneBattle(state);
      if (action.enemyLog) battle.log.push(action.enemyLog);
      battle.enemyHp = Math.max(0, state.battle.enemyHp - action.enemyDamage);
      if (action.clearFreeze) battle.enemyFrozen = false;
      if (action.clearStun) battle.enemyStunned = false;
      if (battle.enemyBurning) {
        battle.enemyBurnTurns = battle.enemyBurnTurns - 1;
        if (battle.enemyBurnTurns <= 0) battle.enemyBurning = false;
      }
      return { ...state, battle };
    }

    case 'ENEMY_TURN': {
      const battle = deepCloneBattle(state);
      if (battle.damageBoostTurns > 0) {
        battle.damageBoostTurns = battle.damageBoostTurns - 1;
        if (battle.damageBoostTurns === 0) battle.log.push('🔥 Hasar İksiri bitti.');
      }
      let dmg = action.damage;
      if (state.battle.shieldPotionCharges > 0) {
        battle.shieldPotionCharges = state.battle.shieldPotionCharges - 1;
        battle.log.push(`🛡️ Kalkan İksiri saldırıyı engelledi! (${battle.shieldPotionCharges} şarj kaldı)`);
        dmg = 0;
      } else if (state.battle.playerShielded) {
        battle.playerShielded = false;
        battle.log.push('Kalkan saldırıyı tamamen engelledi!');
        dmg = 0;
      } else if (state.battle.playerDefending) {
        dmg = Math.max(1, Math.floor(dmg * 0.5));
        battle.playerDefending = false;
        battle.log.push(`${action.log} (Savunma ile %50 azaltıldı → ${dmg} hasar)`);
      } else {
        battle.log.push(action.log);
      }
      if (dmg > 0) {
        battle.playerHp = Math.max(0, state.battle.playerHp - dmg);
      }
      if (battle.playerHp <= 0) {
        battle.phase = 'defeat';
      } else {
        battle.turn += 1;
        battle.phase = 'player_turn';
      }
      return { ...state, battle };
    }

    case 'BATTLE_VICTORY': {
      const player = deepClonePlayer(state);
      const battle = deepCloneBattle(state);
      battle.phase = 'victory';
      battle.log.push(action.log);
      player.xp += action.xp;
      player.coins += action.coins;
      player.victories += 1;
      player.totalKills = (player.totalKills || 0) + 1;

      const enemy = state.battle.enemy;
      const enemyId = enemy?.id || '';
      if (enemyId) {
        player.defeatedEnemies[enemyId] = (player.defeatedEnemies[enemyId] || 0) + 1;
      }
      if (enemy && (!player.strongestEnemy || enemy.level > player.strongestEnemy.level)) {
        player.strongestEnemy = { name: enemy.name, emoji: enemy.emoji, level: enemy.level };
      }

      player.stats.hp = battle.playerHp;
      player.stats.mana = battle.playerMana;

      const isBoss = enemy?.isBoss === true;
      const qs = deepCloneQuestState(state);
      qs.dailyProgress = updateQuestProgress(qs.dailyProgress, 'kills', 1);
      qs.weeklyProgress = updateQuestProgress(qs.weeklyProgress, 'kills', 1);
      if (isBoss) {
        qs.dailyProgress = updateQuestProgress(qs.dailyProgress, 'boss_kills', 1);
        qs.weeklyProgress = updateQuestProgress(qs.weeklyProgress, 'boss_kills', 1);
      }

      while (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;
        player.level += 1;
        player.xpToNextLevel = player.level * 100 + (player.level - 1) * 50;
        player.baseStats = {
          ...player.baseStats,
          maxHp: player.baseStats.maxHp + 10,
          hp: player.baseStats.maxHp + 10,
          maxMana: player.baseStats.maxMana + 10,
          mana: player.baseStats.maxMana + 10,
          attack: player.baseStats.attack + 3,
          defense: player.baseStats.defense + 2,
        };
        player.stats = recalculateStats(player);
        if (player.level >= 5 && !player.unlockedRegions.includes('magara')) player.unlockedRegions.push('magara');
        if (player.level >= 10 && !player.unlockedRegions.includes('kale')) player.unlockedRegions.push('kale');
        if (player.level >= 15 && !player.unlockedRegions.includes('void')) player.unlockedRegions.push('void');
      }

      return { ...state, player, battle, questState: qs };
    }

    case 'BATTLE_DEFEAT': {
      const player = deepClonePlayer(state);
      const battle = deepCloneBattle(state);
      battle.phase = 'defeat';
      battle.log.push(action.log);
      player.deaths += 1;
      player.stats.hp = 1;
      battle.active = false;
      return { ...state, player, battle };
    }

    case 'END_BATTLE':
      return { ...state, battle: makeFreshBattle() };

    case 'RESTORE_PLAYER': {
      const player = deepClonePlayer(state);
      player.stats.hp = player.stats.maxHp;
      player.stats.mana = player.stats.maxMana;
      return { ...state, player };
    }

    case 'CLAIM_QUEST_REWARD': {
      const qs = deepCloneQuestState(state);
      const list = action.questType === 'daily' ? qs.dailyProgress : qs.weeklyProgress;
      const idx = list.findIndex(p => p.questId === action.questId);
      if (idx === -1 || !list[idx].completed || list[idx].claimed) return state;
      list[idx] = { ...list[idx], claimed: true };
      const quest = QUEST_MAP[action.questId];
      if (!quest) return state;
      const player = deepClonePlayer(state);
      player.xp += quest.reward.xp;
      player.coins += quest.reward.coins;
      while (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;
        player.level += 1;
        player.xpToNextLevel = player.level * 100 + (player.level - 1) * 50;
        player.baseStats = {
          ...player.baseStats,
          maxHp: player.baseStats.maxHp + 10,
          hp: player.baseStats.maxHp + 10,
          maxMana: player.baseStats.maxMana + 10,
          mana: player.baseStats.maxMana + 10,
          attack: player.baseStats.attack + 3,
          defense: player.baseStats.defense + 2,
        };
        player.stats = recalculateStats(player);
        if (player.level >= 5 && !player.unlockedRegions.includes('magara')) player.unlockedRegions.push('magara');
        if (player.level >= 10 && !player.unlockedRegions.includes('kale')) player.unlockedRegions.push('kale');
        if (player.level >= 15 && !player.unlockedRegions.includes('void')) player.unlockedRegions.push('void');
      }
      return { ...state, player, questState: qs };
    }

    case 'RESET_QUESTS': {
      const qs = deepCloneQuestState(state);
      if (action.resetDaily) {
        const ids = getDailyQuestIds();
        qs.activeDailyIds = ids;
        qs.dailyProgress = ids.map(id => ({ questId: id, progress: 0, completed: false, claimed: false }));
        qs.lastDailyReset = getDailyResetTimestamp();
      }
      if (action.resetWeekly) {
        const ids = getWeeklyQuestIds();
        qs.activeWeeklyIds = ids;
        qs.weeklyProgress = ids.map(id => ({ questId: id, progress: 0, completed: false, claimed: false }));
        qs.lastWeeklyReset = getWeeklyResetTimestamp();
      }
      return { ...state, questState: qs };
    }

    case 'BUY_SPELL': {
      const spell = spells[action.spellId];
      if (spell && spell.shopPrice && state.player.coins >= spell.shopPrice && state.player.level >= spell.unlockLevel && !state.player.knownSpells.includes(action.spellId)) {
        const player = deepClonePlayer(state);
        player.coins -= spell.shopPrice;
        player.knownSpells.push(action.spellId);
        return { ...state, player };
      }
      return state;
    }

    case 'BUY_EQUIPMENT': {
      const item = equipment[action.equipmentId];
      if (item && state.player.coins >= item.price && state.player.level >= item.requiredLevel && !state.player.inventory.includes(action.equipmentId)) {
        const player = deepClonePlayer(state);
        player.coins -= item.price;
        player.inventory.push(action.equipmentId);
        return { ...state, player };
      }
      return state;
    }

    case 'BUY_POTION': {
      const potion = potions[action.potionId];
      if (!potion || state.player.coins < potion.price) return state;
      const currentCount = state.player.potions[action.potionId] || 0;
      if (currentCount >= potion.maxStack) return state;
      const player = deepClonePlayer(state);
      player.coins -= potion.price;
      player.potions[action.potionId] = currentCount + 1;
      return { ...state, player };
    }

    case 'USE_POTION': {
      const potion = potions[action.potionId];
      if (!potion) return state;
      const currentCount = state.player.potions[action.potionId] || 0;
      if (currentCount <= 0) return state;
      const player = deepClonePlayer(state);
      const battle = deepCloneBattle(state);
      player.potions[action.potionId] = currentCount - 1;
      switch (potion.effect) {
        case 'heal_hp':
          battle.playerHp = Math.min(player.stats.maxHp, battle.playerHp + potion.value);
          battle.log.push(`${potion.emoji} ${potion.name} kullandın — ${potion.value} can geri kazandın!`);
          break;
        case 'heal_mana':
          battle.playerMana = Math.min(player.stats.maxMana, battle.playerMana + potion.value);
          battle.log.push(`${potion.emoji} ${potion.name} kullandın — ${potion.value} mana geri kazandın!`);
          break;
        case 'shield_charges':
          battle.shieldPotionCharges = (battle.shieldPotionCharges || 0) + potion.value;
          battle.log.push(`${potion.emoji} ${potion.name} kullandın — ${potion.value} saldırı engellenir!`);
          break;
        case 'speed_boost':
          battle.speedBoostTurns = (battle.speedBoostTurns || 0) + potion.value;
          battle.log.push(`${potion.emoji} ${potion.name} kullandın — ${potion.value} tur hız artışı!`);
          break;
        case 'damage_boost':
          battle.damageBoostTurns = (battle.damageBoostTurns || 0) + potion.value;
          battle.log.push(`${potion.emoji} ${potion.name} kullandın — ${potion.value} tur %50 fazla hasar!`);
          break;
      }
      return { ...state, player, battle };
    }

    case 'EQUIP_ITEM': {
      const equipItem = equipment[action.equipmentId];
      if (equipItem && state.player.inventory.includes(action.equipmentId)) {
        const player = deepClonePlayer(state);
        player.equippedItems[equipItem.slot] = action.equipmentId;
        player.stats = recalculateStats(player);
        return { ...state, player };
      }
      return state;
    }

    case 'UNEQUIP_ITEM': {
      const player = deepClonePlayer(state);
      delete player.equippedItems[action.slot];
      player.stats = recalculateStats(player);
      return { ...state, player };
    }

    case 'LEARN_FREE_SPELL': {
      if (!state.player.knownSpells.includes(action.spellId)) {
        const player = deepClonePlayer(state);
        player.knownSpells.push(action.spellId);
        return { ...state, player };
      }
      return state;
    }

    case 'REST_AT_INN': {
      if (state.player.coins < 10) return state;
      const player = deepClonePlayer(state);
      player.coins -= 10;
      player.stats.hp = player.stats.maxHp;
      player.stats.mana = player.stats.maxMana;
      return { ...state, player };
    }

    default:
      return state;
  }
}

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
}>({
  state: INITIAL_STATE,
  dispatch: () => undefined,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, (initial) => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'player' in parsed) {
          if (parsed.battle) {
            if (!Array.isArray(parsed.battle.log)) parsed.battle.log = [];
            if (parsed.battle.enemy && !Array.isArray(parsed.battle.enemy.abilities)) {
              parsed.battle.enemy.abilities = [];
            }
            parsed.battle.playerDefending = parsed.battle.playerDefending ?? false;
            parsed.battle.playerShielded = parsed.battle.playerShielded ?? false;
            parsed.battle.enemyFrozen = parsed.battle.enemyFrozen ?? false;
            parsed.battle.enemyBurning = parsed.battle.enemyBurning ?? false;
            parsed.battle.enemyStunned = parsed.battle.enemyStunned ?? false;
            parsed.battle.enemyBurnTurns = parsed.battle.enemyBurnTurns ?? 0;
            parsed.battle.shieldPotionCharges = parsed.battle.shieldPotionCharges ?? 0;
            parsed.battle.speedBoostTurns = parsed.battle.speedBoostTurns ?? 0;
            parsed.battle.damageBoostTurns = parsed.battle.damageBoostTurns ?? 0;
            parsed.battle.turn = parsed.battle.turn ?? 0;
            parsed.battle.playerHp = typeof parsed.battle.playerHp === 'number' ? parsed.battle.playerHp : 1;
            parsed.battle.playerMana = typeof parsed.battle.playerMana === 'number' ? parsed.battle.playerMana : 0;
            parsed.battle.enemyHp = typeof parsed.battle.enemyHp === 'number' ? parsed.battle.enemyHp : 0;
          }
          if (parsed.player) {
            parsed.player.potions = parsed.player.potions ?? {};
            if (!Array.isArray(parsed.player.knownSpells)) parsed.player.knownSpells = [];
            if (!Array.isArray(parsed.player.inventory)) parsed.player.inventory = [];
            if (!Array.isArray(parsed.player.unlockedRegions)) parsed.player.unlockedRegions = ['orman'];
            parsed.player.equippedItems = parsed.player.equippedItems ?? {};
            parsed.player.defeatedEnemies = parsed.player.defeatedEnemies ?? {};
            parsed.player.totalKills = parsed.player.totalKills ?? 0;
            parsed.player.totalEscapes = parsed.player.totalEscapes ?? 0;
            parsed.player.strongestEnemy = parsed.player.strongestEnemy ?? null;
          }
          if (!parsed.questState) {
            parsed.questState = makeFreshQuestState();
          } else {
            parsed.questState.activeDailyIds = parsed.questState.activeDailyIds ?? [];
            parsed.questState.activeWeeklyIds = parsed.questState.activeWeeklyIds ?? [];
            parsed.questState.dailyProgress = parsed.questState.dailyProgress ?? [];
            parsed.questState.weeklyProgress = parsed.questState.weeklyProgress ?? [];
            parsed.questState.lastDailyReset = parsed.questState.lastDailyReset ?? 0;
            parsed.questState.lastWeeklyReset = parsed.questState.lastWeeklyReset ?? 0;
          }
          return parsed as GameState;
        }
      }
    } catch {
      // ignore
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
