export type RegionId = 'orman' | 'bataklk' | 'magara' | 'liman' | 'kale' | 'col' | 'void' | 'firtina' | 'atesgolu' | 'zaman'
  | 'golge' | 'tundra' | 'derin' | 'uzay' | 'zihin' | 'kaos' | 'kan' | 'sonsuz' | 'tanri' | 'omega';
export type EnemyId = string;
export type SpellId = string;
export type EquipmentSlot = 'silah' | 'zirh' | 'yuzuk' | 'kolye';
export type ItemType = 'spell' | 'equipment' | 'potion';
export type PotionEffect = 'heal_hp' | 'heal_mana' | 'shield_charges' | 'speed_boost' | 'damage_boost';
export type BattlePhase = 'idle' | 'player_turn' | 'enemy_turn' | 'victory' | 'defeat' | 'animating';
export type QuestRequirementType = 'kills' | 'escapes' | 'boss_kills';

export interface PlayerTitle {
  title: string;
  emoji: string;
  color: string;
  glowColor: string;
  minLevel: number;
  maxLevel: number;
  milestoneCoins: number;
}

export const PLAYER_TITLES: PlayerTitle[] = [
  { title: 'Gezgin',        emoji: '🚶',  color: 'text-slate-400',   glowColor: 'shadow-slate-400/20',   minLevel: 1,   maxLevel: 9,   milestoneCoins: 0     },
  { title: 'Acemi Savaşçı', emoji: '⚔️',  color: 'text-green-400',   glowColor: 'shadow-green-400/30',   minLevel: 10,  maxLevel: 19,  milestoneCoins: 500   },
  { title: 'Kaşif',         emoji: '🗡️',  color: 'text-teal-400',    glowColor: 'shadow-teal-400/30',    minLevel: 20,  maxLevel: 29,  milestoneCoins: 1000  },
  { title: 'Savaşçı',       emoji: '🛡️',  color: 'text-blue-400',    glowColor: 'shadow-blue-400/30',    minLevel: 30,  maxLevel: 39,  milestoneCoins: 1500  },
  { title: 'Şampiyon',      emoji: '🏹',  color: 'text-orange-400',  glowColor: 'shadow-orange-400/30',  minLevel: 40,  maxLevel: 49,  milestoneCoins: 2000  },
  { title: 'Usta',          emoji: '🔮',  color: 'text-indigo-400',  glowColor: 'shadow-indigo-400/30',  minLevel: 50,  maxLevel: 59,  milestoneCoins: 3000  },
  { title: 'Efsane',        emoji: '🌟',  color: 'text-yellow-400',  glowColor: 'shadow-yellow-400/30',  minLevel: 60,  maxLevel: 69,  milestoneCoins: 4000  },
  { title: 'Titan',         emoji: '⚡',  color: 'text-cyan-300',    glowColor: 'shadow-cyan-300/30',    minLevel: 70,  maxLevel: 79,  milestoneCoins: 5000  },
  { title: 'Yarı-Tanrı',    emoji: '🌌',  color: 'text-purple-400',  glowColor: 'shadow-purple-400/30',  minLevel: 80,  maxLevel: 89,  milestoneCoins: 7500  },
  { title: 'Tanrı',         emoji: '💫',  color: 'text-amber-300',   glowColor: 'shadow-amber-300/30',   minLevel: 90,  maxLevel: 99,  milestoneCoins: 10000 },
  { title: 'Omega',         emoji: '💥',  color: 'text-violet-300',  glowColor: 'shadow-violet-300/40',  minLevel: 100, maxLevel: 100, milestoneCoins: 20000 },
];

export function getPlayerTitle(level: number): PlayerTitle {
  for (let i = PLAYER_TITLES.length - 1; i >= 0; i--) {
    if (level >= PLAYER_TITLES[i].minLevel) return PLAYER_TITLES[i];
  }
  return PLAYER_TITLES[0];
}

export interface Stats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Enemy {
  id: EnemyId;
  name: string;
  description: string;
  emoji: string;
  regionId: RegionId;
  level: number;
  stats: Stats;
  xpReward: number;
  coinReward: { min: number; max: number };
  abilities: string[];
  weakness?: string;
  isBoss?: boolean;
}

export interface Spell {
  id: SpellId;
  name: string;
  description: string;
  emoji: string;
  element: 'ateş' | 'buz' | 'şimşek' | 'void' | 'ışık' | 'fiziksel';
  damage: number;
  manaCost: number;
  healAmount?: number;
  effect?: 'burn' | 'freeze' | 'stun' | 'heal' | 'shield';
  effectChance?: number;
  unlockLevel: number;
  shopPrice?: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  emoji: string;
  slot: EquipmentSlot;
  statBonus: Partial<Stats>;
  price: number;
  requiredLevel: number;
}

export interface Region {
  id: RegionId;
  name: string;
  description: string;
  emoji: string;
  requiredLevel: number;
  background: string;
  enemies: EnemyId[];
  bossId?: EnemyId;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  emoji: string;
  requirement: { type: QuestRequirementType; count: number };
  reward: { xp: number; coins: number };
}

export interface QuestProgress {
  questId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface QuestState {
  activeDailyIds: string[];
  activeWeeklyIds: string[];
  dailyProgress: QuestProgress[];
  weeklyProgress: QuestProgress[];
  lastDailyReset: number;
  lastWeeklyReset: number;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: Stats;
  baseStats: Stats;
  coins: number;
  knownSpells: SpellId[];
  equippedSpells: SpellId[];   // max 10, shown in battle
  equippedItems: Partial<Record<EquipmentSlot, string>>;
  inventory: string[];
  potions: Record<string, number>;
  defeatedEnemies: Record<EnemyId, number>;
  unlockedRegions: RegionId[];
  victories: number;
  deaths: number;
  totalKills: number;
  totalEscapes: number;
  strongestEnemy: { name: string; emoji: string; level: number } | null;
}

export interface BattleState {
  active: boolean;
  enemy: Enemy | null;
  playerHp: number;
  playerMana: number;
  enemyHp: number;
  phase: BattlePhase;
  log: string[];
  turn: number;
  playerShielded: boolean;
  playerDefending: boolean;
  enemyBurning: boolean;
  enemyBurnTurns: number;
  enemyFrozen: boolean;
  enemyStunned: boolean;
  shieldPotionCharges: number;
  speedBoostTurns: number;
  damageBoostTurns: number;
}

export interface GameState {
  started: boolean;
  player: PlayerState;
  battle: BattleState;
  currentRegion: RegionId | null;
  questState: QuestState;
}
