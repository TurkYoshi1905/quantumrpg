import { Quest } from '../types/game';

export const DAILY_QUEST_POOL: Quest[] = [
  { id: 'd1', title: '5 Düşman Yen', description: 'Herhangi bir bölgede 5 düşmanı yen.', type: 'daily', emoji: '⚔️', requirement: { type: 'kills', count: 5 }, reward: { xp: 60, coins: 20 } },
  { id: 'd2', title: 'Kaçak', description: 'Bir savaştan kaçmayı başar.', type: 'daily', emoji: '💨', requirement: { type: 'escapes', count: 1 }, reward: { xp: 30, coins: 10 } },
  { id: 'd3', title: '10 Düşman Yen', description: '10 düşmanı başarıyla yen.', type: 'daily', emoji: '🗡️', requirement: { type: 'kills', count: 10 }, reward: { xp: 120, coins: 40 } },
  { id: 'd4', title: 'İki Kez Kaç', description: 'İki farklı savaştan kaçmayı başar.', type: 'daily', emoji: '🌀', requirement: { type: 'escapes', count: 2 }, reward: { xp: 50, coins: 20 } },
  { id: 'd5', title: 'Boss Avcısı', description: 'Bir bölgenin boss\'unu yen.', type: 'daily', emoji: '💀', requirement: { type: 'boss_kills', count: 1 }, reward: { xp: 200, coins: 70 } },
  { id: 'd6', title: 'Savaşçı Ruhu', description: 'Herhangi 3 düşmanı yen.', type: 'daily', emoji: '🔥', requirement: { type: 'kills', count: 3 }, reward: { xp: 40, coins: 15 } },
];

export const WEEKLY_QUEST_POOL: Quest[] = [
  { id: 'w1', title: 'Düşman Avcısı', description: 'Bu hafta 30 düşmanı yen.', type: 'weekly', emoji: '🗡️', requirement: { type: 'kills', count: 30 }, reward: { xp: 500, coins: 150 } },
  { id: 'w2', title: 'Kaçak Usta', description: 'Bu hafta 5 kez kaçmayı başar.', type: 'weekly', emoji: '💨', requirement: { type: 'escapes', count: 5 }, reward: { xp: 200, coins: 80 } },
  { id: 'w3', title: 'Boss Katili', description: 'Bu hafta 3 boss öldür.', type: 'weekly', emoji: '👑', requirement: { type: 'boss_kills', count: 3 }, reward: { xp: 800, coins: 250 } },
  { id: 'w4', title: 'Savaş Makinesi', description: 'Bu hafta 20 düşmanı yen.', type: 'weekly', emoji: '⚔️', requirement: { type: 'kills', count: 20 }, reward: { xp: 350, coins: 100 } },
  { id: 'w5', title: 'Ölümden Dönen', description: 'Bu hafta 3 kez kaçmayı başar.', type: 'weekly', emoji: '🌀', requirement: { type: 'escapes', count: 3 }, reward: { xp: 300, coins: 90 } },
];

export const QUEST_MAP: Record<string, Quest> = {};
[...DAILY_QUEST_POOL, ...WEEKLY_QUEST_POOL].forEach(q => { QUEST_MAP[q.id] = q; });

function lcg(seed: number): number {
  return ((seed * 1664525 + 1013904223) & 0x7fffffff);
}

function seededPick<T>(pool: T[], count: number, seed: number): T[] {
  const result: T[] = [];
  const indices = pool.map((_, i) => i);
  let s = Math.abs(seed);
  while (result.length < Math.min(count, pool.length)) {
    s = lcg(s);
    const pick = s % indices.length;
    result.push(pool[indices[pick]]);
    indices.splice(pick, 1);
  }
  return result;
}

export function getDailyQuestIds(): string[] {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return seededPick(DAILY_QUEST_POOL, 3, seed).map(q => q.id);
}

export function getWeeklyQuestIds(): string[] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const seed = now.getFullYear() * 100 + weekNum;
  return seededPick(WEEKLY_QUEST_POOL, 3, seed).map(q => q.id);
}

export function getDailyResetTimestamp(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function getWeeklyResetTimestamp(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}
