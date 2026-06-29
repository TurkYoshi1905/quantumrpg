import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { equipment } from '../data/equipment';
import { spells } from '../data/spells';
import { HUD } from '../components/HUD';
import { Shield, Sword, Heart, Zap, Award, Skull, Trophy, Target, Wind, Star } from 'lucide-react';
import { EquipmentSlot } from '../types/game';
import { motion } from 'framer-motion';

export default function CharacterPage() {
  const { state, dispatch } = useGameState();
  const { player } = state;

  const handleEquip = (equipId: string) => {
    dispatch({ type: 'EQUIP_ITEM', equipmentId: equipId });
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    dispatch({ type: 'UNEQUIP_ITEM', slot });
  };

  const xpPercent = (player.xp / player.xpToNextLevel) * 100;
  
  const slots: { id: EquipmentSlot; label: string }[] = [
    { id: 'silah', label: 'Silah' },
    { id: 'zirh', label: 'Zırh' },
    { id: 'yuzuk', label: 'Yüzük' },
    { id: 'kolye', label: 'Kolye' }
  ];

  const totalDefeated = Object.values(player.defeatedEnemies).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-8 px-3 md:px-8">
      <HUD />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/20 to-transparent" />
            <div className="text-7xl mb-4 relative z-10">🧑‍🚀</div>
            <h2 className="text-3xl font-serif font-bold mb-1 relative z-10">{player.name}</h2>
            <div className="text-primary font-mono mb-6 relative z-10">Seviye {player.level} Gezgin</div>
            
            <div className="text-left relative z-10">
              <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
                <span>XP</span>
                <span>{player.xp} / {player.xpToNextLevel}</span>
              </div>
              <div className="h-2 w-full bg-black/50 border border-white/10 rounded-full overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                  <Trophy size={20} className="text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold">{player.victories}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Zafer</div>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                  <Skull size={20} className="text-destructive mb-2" />
                  <div className="text-2xl font-bold">{player.deaths}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Ölüm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Savaş İstatistikleri */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-serif font-bold text-lg mb-5 flex items-center gap-2">
              <Target size={18} className="text-orange-400" /> Savaş İstatistikleri
            </h3>
            <div className="space-y-3">
              <BattleStat
                icon={<Sword size={15} className="text-red-400" />}
                label="Toplam Öldürme"
                value={player.totalKills ?? 0}
                color="text-red-400"
              />
              <BattleStat
                icon={<Wind size={15} className="text-cyan-400" />}
                label="Başarılı Kaçış"
                value={player.totalEscapes ?? 0}
                color="text-cyan-400"
              />
              <BattleStat
                icon={<Skull size={15} className="text-purple-400" />}
                label="Benzersiz Düşman"
                value={Object.keys(player.defeatedEnemies).length}
                color="text-purple-400"
              />
              <BattleStat
                icon={<Trophy size={15} className="text-yellow-400" />}
                label="Toplam Galip"
                value={totalDefeated}
                color="text-yellow-400"
              />

              {player.strongestEnemy && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60 mb-2">
                    En Güçlü Düşman
                  </div>
                  <div className="flex items-center gap-3 bg-black/30 border border-white/5 rounded-xl p-3">
                    <span className="text-2xl">{player.strongestEnemy.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-white">{player.strongestEnemy.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <Star size={9} className="text-yellow-400" />
                        Seviye {player.strongestEnemy.level}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
              <Award size={20} className="text-primary" /> İstatistikler
            </h3>
            <div className="space-y-4">
              <StatRow icon={<Heart size={16} className="text-green-500" />} label="Sağlık" value={player.stats.maxHp} base={player.baseStats.maxHp} />
              <StatRow icon={<Zap size={16} className="text-purple-500" />} label="Mana" value={player.stats.maxMana} base={player.baseStats.maxMana} />
              <div className="my-4 border-t border-border" />
              <StatRow icon={<Sword size={16} className="text-orange-500" />} label="Saldırı" value={player.stats.attack} base={player.baseStats.attack} />
              <StatRow icon={<Shield size={16} className="text-blue-500" />} label="Savunma" value={player.stats.defense} base={player.baseStats.defense} />
              <StatRow icon={<Zap size={16} className="text-yellow-500" />} label="Hız" value={player.stats.speed} base={player.baseStats.speed} />
            </div>
          </div>
        </div>

        {/* Center/Right Column: Equipment & Inventory */}
        <div className="lg:col-span-8 space-y-8">
          
          <div>
            <h3 className="font-serif font-bold text-2xl mb-4">Mevcut Ekipman</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {slots.map(slot => {
                const equippedId = player.equippedItems[slot.id];
                const item = equippedId ? equipment[equippedId] : null;
                
                return (
                  <div key={slot.id} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center relative group min-h-[140px]">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest w-full border-b border-border/50 pb-2">{slot.label}</div>
                    
                    {item ? (
                      <>
                        <div className="text-4xl mb-2">{item.emoji}</div>
                        <div className="font-bold text-sm leading-tight">{item.name}</div>
                        
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl p-4">
                          <button 
                            onClick={() => handleUnequip(slot.id)}
                            className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive/50 rounded-lg text-sm font-bold hover:bg-destructive/40 transition-colors"
                          >
                            Çıkar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <div className="w-12 h-12 border-2 border-dashed border-white/20 rounded-full mb-2" />
                        <span className="text-xs">Boş</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-2xl mb-4">Envanter</h3>
            <div className="bg-card border border-border rounded-2xl p-6 min-h-[200px]">
              {player.inventory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-12">
                  <div className="text-4xl mb-2">🎒</div>
                  <p>Envanterin boş. Dükkandan eşya satın al.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {player.inventory.map(itemId => {
                    const item = equipment[itemId];
                    if (!item) return null;
                    const isEquipped = Object.values(player.equippedItems).includes(itemId);
                    if (isEquipped) return null;
                    
                    return (
                      <div key={item.id} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="text-3xl bg-black/50 w-12 h-12 rounded-lg flex items-center justify-center border border-white/10">
                          {item.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm leading-tight">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground mb-2">Seviye {item.requiredLevel} • {item.slot}</div>
                          <button 
                            onClick={() => handleEquip(item.id)}
                            className="w-full py-1.5 bg-primary/20 hover:bg-primary/40 text-primary-foreground border border-primary/30 rounded text-xs font-bold transition-colors"
                          >
                            Kuşan
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-2xl mb-4">Öğrenilen Büyüler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {player.knownSpells.map(spellId => {
                const spell = spells[spellId];
                if (!spell) return null;
                return (
                  <div key={spell.id} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{spell.emoji}</div>
                    <div className="font-bold text-sm leading-tight mb-1">{spell.name}</div>
                    <div className="text-xs text-blue-400 font-mono">{spell.manaCost} MP</div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function BattleStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="bg-white/5 p-1.5 rounded">{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`font-mono font-bold text-base ${color}`}>{value}</span>
    </div>
  );
}

function StatRow({ icon, label, value, base }: { icon: React.ReactNode, label: string, value: number, base: number }) {
  const bonus = value - base;
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-3">
        <div className="bg-white/5 p-1.5 rounded text-white">{icon}</div>
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 font-mono">
        <span className="text-white font-bold">{value}</span>
        {bonus > 0 && <span className="text-green-400 text-xs">(+{bonus})</span>}
      </div>
    </div>
  )
}
