import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { HUD } from '../components/HUD';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, CalendarDays, Zap, Coins, ChevronRight, Trophy } from 'lucide-react';
import { QUEST_MAP, getDailyResetTimestamp, getWeeklyResetTimestamp } from '../data/questData';
import { QuestProgress } from '../types/game';
import { useMobileDevice } from '../hooks/use-mobile';

function msToCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useCountdown(targetTimestamp: number) {
  const [remaining, setRemaining] = React.useState(0);
  useEffect(() => {
    const calc = () => setRemaining(Math.max(0, targetTimestamp - Date.now()));
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetTimestamp]);
  return remaining;
}

interface QuestCardProps {
  qp: QuestProgress;
  onClaim: () => void;
  type: 'daily' | 'weekly';
  index: number;
}

function QuestCard({ qp, onClaim, type, index }: QuestCardProps) {
  const quest = QUEST_MAP[qp.questId];
  if (!quest) return null;

  const pct = Math.min(100, (qp.progress / quest.requirement.count) * 100);
  const canClaim = qp.completed && !qp.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`relative overflow-hidden rounded-2xl border transition-all ${
        qp.claimed
          ? 'border-green-500/20 bg-green-500/5'
          : canClaim
          ? 'border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
          : 'border-border bg-card hover:border-border/80'
      }`}
    >
      {canClaim && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      )}
      {qp.claimed && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className={`text-2xl shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
            qp.claimed ? 'bg-green-500/10 border-green-500/20' : 'bg-black/40 border-white/10'
          }`}>
            {quest.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-sm ${qp.claimed ? 'text-green-400' : 'text-white'}`}>
                {quest.title}
              </span>
              {qp.claimed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={9} /> Tamamlandı
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{quest.description}</p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-[10px] font-mono text-yellow-400">
              <Zap size={9} /> +{quest.reward.xp} XP
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-yellow-500">
              <Coins size={9} /> +{quest.reward.coins}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>{qp.progress} / {quest.requirement.count}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 bg-black/40 border border-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                qp.claimed ? 'bg-green-500' : qp.completed ? 'bg-yellow-500' : type === 'weekly' ? 'bg-purple-500' : 'bg-primary'
              }`}
              style={{ width: `${pct}%`, transition: 'width 0.5s ease-out' }}
            />
          </div>
        </div>

        {canClaim && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClaim}
            className="w-full py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/35 border border-yellow-500/40 text-yellow-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Trophy size={14} />
            Ödülü Al — +{quest.reward.xp} XP, +{quest.reward.coins} Altın
            <ChevronRight size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function QuestsPage() {
  const { state, dispatch } = useGameState();
  const { isMobile } = useMobileDevice();
  const { questState } = state;

  const todayMidnight = getDailyResetTimestamp();
  const weekMonday = getWeeklyResetTimestamp();
  const nextDayMs = todayMidnight + 86400000;
  const nextWeekMs = weekMonday + 7 * 86400000;
  const dailyCountdown = useCountdown(nextDayMs);
  const weeklyCountdown = useCountdown(nextWeekMs);

  useEffect(() => {
    const needDailyReset = questState.lastDailyReset < getDailyResetTimestamp();
    const needWeeklyReset = questState.lastWeeklyReset < getWeeklyResetTimestamp();
    if (needDailyReset || needWeeklyReset) {
      dispatch({ type: 'RESET_QUESTS', resetDaily: needDailyReset, resetWeekly: needWeeklyReset });
    }
  }, [questState.lastDailyReset, questState.lastWeeklyReset, dispatch]);

  const completedDaily = questState.dailyProgress.filter(p => p.claimed).length;
  const completedWeekly = questState.weeklyProgress.filter(p => p.claimed).length;

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-8 px-3 md:px-8">
      <HUD />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h1 className={`font-serif font-black ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Görevler</h1>
              <p className="text-muted-foreground text-sm">Görevleri tamamla, XP ve Quantum Coin kazan!</p>
            </div>
          </div>
        </motion.div>

        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>

          {/* ── Daily ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <CalendarDays size={13} className="text-primary" />
                </div>
                <div>
                  <div className="font-bold text-base">Günlük Görevler</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{completedDaily}/{questState.dailyProgress.length} tamamlandı</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5">
                <Clock size={11} className="text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{msToCountdown(dailyCountdown)}</span>
              </div>
            </div>

            <div className="h-1 bg-black/30 border border-white/5 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${questState.dailyProgress.length > 0 ? (completedDaily / questState.dailyProgress.length) * 100 : 0}%`, transition: 'width 0.5s ease-out' }}
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {questState.activeDailyIds.map((id, i) => {
                  const qp = questState.dailyProgress.find(p => p.questId === id) ?? { questId: id, progress: 0, completed: false, claimed: false };
                  return (
                    <QuestCard
                      key={id}
                      qp={qp}
                      type="daily"
                      index={i}
                      onClaim={() => dispatch({ type: 'CLAIM_QUEST_REWARD', questId: id, questType: 'daily' })}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* ── Weekly ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                  <CalendarDays size={13} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-base">Haftalık Görevler</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{completedWeekly}/{questState.weeklyProgress.length} tamamlandı</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5">
                <Clock size={11} className="text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{msToCountdown(weeklyCountdown)}</span>
              </div>
            </div>

            <div className="h-1 bg-black/30 border border-white/5 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${questState.weeklyProgress.length > 0 ? (completedWeekly / questState.weeklyProgress.length) * 100 : 0}%`, transition: 'width 0.5s ease-out' }}
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {questState.activeWeeklyIds.map((id, i) => {
                  const qp = questState.weeklyProgress.find(p => p.questId === id) ?? { questId: id, progress: 0, completed: false, claimed: false };
                  return (
                    <QuestCard
                      key={id}
                      qp={qp}
                      type="weekly"
                      index={i}
                      onClaim={() => dispatch({ type: 'CLAIM_QUEST_REWARD', questId: id, questType: 'weekly' })}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        </div>

        <div className="mt-8 p-4 bg-black/20 border border-white/5 rounded-2xl text-center">
          <p className="text-xs text-muted-foreground/60 font-mono">
            Günlük görevler her gece <span className="text-white/40">00:00</span>'da · Haftalık görevler her <span className="text-white/40">Pazartesi</span> sıfırlanır
          </p>
        </div>
      </div>
    </div>
  );
}
