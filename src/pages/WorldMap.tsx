import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { regions } from '../data/regions';
import { enemies } from '../data/enemies';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { HUD } from '../components/HUD';
import { Home } from 'lucide-react';

export default function WorldMap() {
  const { state } = useGameState();
  const [, setLocation] = useLocation();

  const isUnlocked = (requiredLevel: number) => state.player.level >= requiredLevel;

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-8 px-3 md:px-8">
      <HUD />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Kuantum Evreni</h1>
            <p className="text-muted-foreground text-sm mt-1">Keşfedilecek bölgeleri seçin.</p>
          </div>
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-muted-foreground hover:text-white transition-all text-sm font-medium shrink-0"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Ana Menü</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {Object.values(regions).map((region, index) => {
            const unlocked = isUnlocked(region.requiredLevel);
            const defeatedCount = region.enemies.reduce((acc, enemyId) => acc + (state.player.defeatedEnemies[enemyId] || 0), 0);
            const bossDefeated = state.player.defeatedEnemies[region.bossId || ''] > 0;
            const boss = region.bossId ? enemies[region.bossId] : null;

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {unlocked ? (
                  <Link href={`/bolge/${region.id}`}>
                    <div className={`relative overflow-hidden rounded-2xl border ${unlocked ? 'border-primary/30 hover:border-primary/70 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]' : 'border-border/50 opacity-50 cursor-not-allowed'} transition-all group h-full cursor-pointer`}>
                      <div className={`absolute inset-0 ${region.background} opacity-20 group-hover:opacity-40 transition-opacity`} />
                      
                      <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-4xl bg-black/40 w-16 h-16 flex items-center justify-center rounded-xl border border-white/10">
                            {region.emoji}
                          </div>
                          {bossDefeated && (
                            <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs border border-yellow-500/30 flex items-center gap-1">
                              <span>👑</span> Temizlendi
                            </div>
                          )}
                        </div>
                        
                        <h2 className="text-2xl font-serif font-bold mb-2">{region.name}</h2>
                        <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{region.description}</p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-muted-foreground">
                            <span className="text-white font-medium">{defeatedCount}</span> yaratık yenildi
                          </div>
                          {boss && (
                            <div className={`flex items-center gap-1 ${bossDefeated ? 'text-green-400' : 'text-destructive/70'}`}>
                              <span>🔥</span> {boss.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-border/50 opacity-60 bg-card h-full p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-4xl mb-4 grayscale opacity-50">🔒</div>
                    <h2 className="text-xl font-serif font-bold mb-2 text-muted-foreground">{region.name}</h2>
                    <p className="text-sm text-muted-foreground/70 mb-4">Bu bölgeye girmek için Seviye {region.requiredLevel} olmalısın.</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
