import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { regions } from '../data/regions';
import { enemies } from '../data/enemies';
import { Link, useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { HUD } from '../components/HUD';
import { ArrowLeft, Shield, Sword, Heart, Droplet, Coins, Star } from 'lucide-react';

export default function RegionPage() {
  const { regionId } = useParams();
  const { state, dispatch } = useGameState();
  const [, setLocation] = useLocation();

  const region = regions[regionId || ''];

  if (!region) {
    return <div className="text-white mt-20 text-center">Bölge bulunamadı.</div>;
  }

  if (!state.player.unlockedRegions.includes(region.id)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-serif font-bold mb-2">Bölge Kilitli</h2>
        <p className="text-muted-foreground mb-8">Seviye {region.requiredLevel} olmalısın.</p>
        <Link href="/harita" className="px-6 py-2 bg-primary/20 hover:bg-primary/40 text-white rounded-lg transition-colors border border-primary/50">
          Haritaya Dön
        </Link>
      </div>
    );
  }

  const handleStartBattle = (enemyId: string) => {
    const enemy = enemies[enemyId];
    if (enemy) {
      dispatch({ type: 'ENTER_REGION', regionId: region.id });
      dispatch({ type: 'START_BATTLE', enemy });
      setLocation(`/savas/${enemy.id}`);
    }
  };

  const getElementColor = (element?: string) => {
    switch(element) {
      case 'ateş': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'buz': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'şimşek': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'ışık': return 'text-yellow-200 border-yellow-200/30 bg-yellow-200/10';
      case 'void': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
      default: return 'text-muted-foreground border-border bg-card';
    }
  };

  const allEnemies = [...region.enemies, region.bossId].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-8 px-3 md:px-8">
      <HUD />
      
      <div className="max-w-6xl mx-auto">
        <Link href="/harita" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Haritaya Dön
        </Link>

        <div className={`rounded-2xl p-8 mb-12 relative overflow-hidden border border-border`}>
          <div className={`absolute inset-0 ${region.background} opacity-30`} />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="text-7xl bg-black/40 p-4 rounded-2xl border border-white/10">
              {region.emoji}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">{region.name}</h1>
              <p className="text-lg text-muted-foreground">{region.description}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold mb-6">Düşmanlar</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEnemies.map((enemyId, index) => {
            const enemy = enemies[enemyId];
            if (!enemy) return null;
            
            const isBoss = enemy.isBoss;
            const defeatedCount = state.player.defeatedEnemies[enemy.id] || 0;
            const levelWarning = state.player.level < enemy.level - 2;
            
            return (
              <motion.div
                key={enemy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-xl p-5 border flex flex-col ${isBoss ? 'border-destructive/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-border'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{enemy.emoji}</span>
                    <div>
                      <h3 className={`font-bold ${isBoss ? 'text-destructive font-serif text-lg' : ''}`}>{enemy.name}</h3>
                      <div className="text-xs text-muted-foreground flex gap-2">
                        <span>Lvl {enemy.level}</span>
                        {defeatedCount > 0 && <span>• 💀 {defeatedCount}</span>}
                      </div>
                    </div>
                  </div>
                  {isBoss && <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-bold rounded-md border border-destructive/30">BOSS</span>}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{enemy.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1"><Heart size={14} className="text-destructive" /> {enemy.stats.maxHp} HP</div>
                  <div className="flex items-center gap-1"><Sword size={14} className="text-orange-400" /> {enemy.stats.attack} ATK</div>
                  <div className="flex items-center gap-1"><Shield size={14} className="text-blue-400" /> {enemy.stats.defense} DEF</div>
                  {enemy.weakness && (
                    <div className="flex items-center gap-1">
                      <Droplet size={14} className="text-purple-400" /> Zayıf:&nbsp;
                      <span className={`px-1.5 rounded text-[10px] uppercase tracking-wider ${getElementColor(enemy.weakness)}`}>
                        {enemy.weakness}
                      </span>
                    </div>
                  )}
                </div>

                {/* XP & Coin reward preview */}
                <div className="flex items-center gap-4 mb-3 px-1 py-2 rounded-lg bg-black/20 border border-white/5 text-xs">
                  <span className="flex items-center gap-1.5 text-yellow-300 font-mono font-bold">
                    <Star size={11} className="text-yellow-400 shrink-0" />
                    {enemy.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-500 font-mono font-bold">
                    <Coins size={11} className="text-yellow-500 shrink-0" />
                    {enemy.coinReward.min}–{enemy.coinReward.max} Altın
                  </span>
                </div>

                {levelWarning && (
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded mb-4 text-center border border-destructive/20">
                    Seviyen bu düşman için çok düşük!
                  </div>
                )}

                <button 
                  onClick={() => handleStartBattle(enemy.id)}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isBoss 
                      ? 'bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground border border-destructive/50' 
                      : 'bg-primary/20 hover:bg-primary/40 text-primary-foreground border border-primary/50'
                  }`}
                >
                  SAVAŞ!
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
