import { PlayerState, GameState, Stats, QuestState } from '../types/game';
import { equipment } from '../data/equipment';
import { getDailyQuestIds, getWeeklyQuestIds, getDailyResetTimestamp, getWeeklyResetTimestamp } from '../data/questData';

export function makeFreshQuestState(): QuestState {
  const dailyIds = getDailyQuestIds();
  const weeklyIds = getWeeklyQuestIds();
  return {
    activeDailyIds: dailyIds,
    activeWeeklyIds: weeklyIds,
    dailyProgress: dailyIds.map(id => ({ questId: id, progress: 0, completed: false, claimed: false })),
    weeklyProgress: weeklyIds.map(id => ({ questId: id, progress: 0, completed: false, claimed: false })),
    lastDailyReset: getDailyResetTimestamp(),
    lastWeeklyReset: getWeeklyResetTimestamp(),
  };
}

export const MILESTONE_COINS: Record<number, number> = {
  10: 500, 20: 1000, 30: 1500, 40: 2000, 50: 3000,
  60: 4000, 70: 5000, 80: 7500, 90: 10000, 100: 20000,
};

export const INITIAL_PLAYER: PlayerState = {
  name: 'Gezgin',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    hp: 100, maxHp: 100,
    mana: 60, maxMana: 60,
    attack: 15, defense: 8, speed: 10, spellPower: 10
  },
  baseStats: {
    hp: 100, maxHp: 100,
    mana: 60, maxMana: 60,
    attack: 15, defense: 8, speed: 10, spellPower: 10
  },
  coins: 50,
  knownSpells: ['atestop'],
  equippedSpells: ['atestop'],
  equippedItems: {},
  inventory: [],
  potions: {},
  defeatedEnemies: {},
  unlockedRegions: ['orman'],
  victories: 0,
  deaths: 0,
  totalKills: 0,
  totalEscapes: 0,
  strongestEnemy: null,
};

export function makeFreshPlayer(): PlayerState {
  return {
    name: 'Gezgin',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    stats: { hp: 100, maxHp: 100, mana: 60, maxMana: 60, attack: 15, defense: 8, speed: 10, spellPower: 10 },
    baseStats: { hp: 100, maxHp: 100, mana: 60, maxMana: 60, attack: 15, defense: 8, speed: 10, spellPower: 10 },
    coins: 50,
    knownSpells: ['atestop'],
    equippedSpells: ['atestop'],
    equippedItems: {},
    inventory: [],
    potions: {},
    defeatedEnemies: {},
    unlockedRegions: ['orman'],
    victories: 0,
    deaths: 0,
    totalKills: 0,
    totalEscapes: 0,
    strongestEnemy: null,
  };
}

export function makeFreshBattle() {
  return {
    active: false,
    enemy: null,
    playerHp: 100,
    playerMana: 60,
    enemyHp: 0,
    phase: 'idle' as const,
    log: [],
    turn: 1,
    playerShielded: false,
    playerDefending: false,
    enemyBurning: false,
    enemyBurnTurns: 0,
    enemyFrozen: false,
    enemyStunned: false,
    shieldPotionCharges: 0,
    speedBoostTurns: 0,
    speedBoostExtraUsed: false,
    damageBoostTurns: 0,
  };
}

export const INITIAL_STATE: GameState = {
  started: false,
  player: makeFreshPlayer(),
  battle: makeFreshBattle(),
  currentRegion: null,
  questState: makeFreshQuestState(),
};

export function recalculateStats(player: PlayerState): Stats {
  const stats = { ...player.baseStats };
  Object.values(player.equippedItems).forEach(itemId => {
    if (itemId && equipment[itemId]) {
      const bonus = equipment[itemId].statBonus;
      if (bonus.maxHp) stats.maxHp += bonus.maxHp;
      if (bonus.maxMana) stats.maxMana += bonus.maxMana;
      if (bonus.attack) stats.attack += bonus.attack;
      if (bonus.defense) stats.defense += bonus.defense;
      if (bonus.speed) stats.speed += bonus.speed;
      if (bonus.spellPower) stats.spellPower = (stats.spellPower ?? 10) + bonus.spellPower;
    }
  });
  if (stats.hp > stats.maxHp) stats.hp = stats.maxHp;
  if (stats.mana > stats.maxMana) stats.mana = stats.maxMana;
  return stats;
}
