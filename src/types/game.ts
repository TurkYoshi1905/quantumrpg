export type RegionId = 'orman' | 'bataklk' | 'magara' | 'liman' | 'kale' | 'col' | 'void' | 'firtina' | 'atesgolu' | 'zaman'
  | 'golge' | 'tundra' | 'derin' | 'uzay' | 'zihin' | 'kaos' | 'kan' | 'sonsuz' | 'tanri' | 'omega';
export type EnemyId = string;
export type SpellId = string;
export type EquipmentSlot = 'silah' | 'zirh' | 'yuzuk' | 'kolye';
export type ItemType = 'spell' | 'equipment' | 'potion';
export type PotionEffect = 'heal_hp' | 'heal_mana' | 'shield_charges' | 'speed_boost' | 'damage_boost';
export type BattlePhase = 'idle' | 'player_turn' | 'enemy_turn' | 'victory' | 'defeat' | 'animating';
export type QuestRequirementType = 'kills' | 'escapes' | 'boss_kills';

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
