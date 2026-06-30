import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { equipment } from '../data/equipment';
import { spells } from '../data/spells';
import { HUD } from '../components/HUD';
import { Shield, Sword, Heart, Zap, Award, Skull, Trophy, Target, Wind, Star, Plus, X } from 'lucide-react';
import { EquipmentSlot, getPlayerTitle, PLAYER_TITLES } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

type CharTab = 'spells' | 'equipment' | 'inventory';

export default function CharacterPage() {
  const { state, dispatch } = useGameState();
  const { player } = state;
  const [activeTab, setActiveTab] = useState<CharTab>('spells');
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);

  const titleInfo = getPlayerTitle(player.level);
  const xpPercent = player.xpToNextLevel > 0 ? (player.xp / player.xpToNextLevel) * 100 : 100;
  const totalDefeated = Object.values(player.defeatedEnemies).reduce((a, b) => a + b, 0);

  const equippedSpells = player.equippedSpells ?? [];
  const unequippedKnown = player.knownSpells.filter(id => !equippedSpells.includes(id));

  // Next title tier info
  const currentTierIdx = PLAYER_TITLES.findIndex(t => t.minLevel === titleInfo.minLevel);
  const nextTier = currentTierIdx < PLAYER_TITLES.length - 1 ? PLAYER_TITLES[currentTierIdx + 1] : null;

  // ── Spell slot handlers ────────────────────────────────────────────
  const handleEquippedSlotClick = (index: number) => {
    if (equippedSpells[index] === undefined) {
      // Empty slot — always select it so next pool-spell click fills here (push to end)
      setSelectedSlotIdx(index);
      return;
    }
    if (selectedSlotIdx === index) {
      setSelectedSlotIdx(null); // deselect
    } else if (selectedSlotIdx !== null && selectedSlotIdx < equippedSpells.length) {
      dispatch({ type: 'SWAP_EQUIPPED_SPELLS', indexA: selectedSlotIdx, indexB: index });
      setSelectedSlotIdx(null);
    } else {
      setSelectedSlotIdx(index); // select
    }
  };

  const handleUnequipSlot = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    dispatch({ type: 'UNEQUIP_SPELL_AT', index });
    setSelectedSlotIdx(null);
  };

  const handlePoolSpellClick = (spellId: string) => {
    if (selectedSlotIdx !== null) {
      dispatch({ type: 'EQUIP_SPELL_AT', spellId, index: selectedSlotIdx });
      setSelectedSlotIdx(null);
    } else {
      dispatch({ type: 'EQUIP_SPELL', spellId });
    }
  };

  // ── Equipment handlers ─────────────────────────────────────────────
  const handleEquip = (equipId: string) => dispatch({ type: 'EQUIP_ITEM', equipmentId: equipId });
  const handleUnequip = (slot: EquipmentSlot) => dispatch({ type: 'UNEQUIP_ITEM', slot });

  const slots: { id: EquipmentSlot; label: string; emoji: string }[] = [
    { id: 'silah', label: 'Silah', emoji: '⚔️' },
    { id: 'zirh',  label: 'Zırh',  emoji: '🛡️' },
    { id: 'yuzuk', label: 'Yüzük', emoji: '💍' },
    { id: 'kolye', label: 'Kolye', emoji: '📿' },
  ];

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-8 px-3 md:px-6">
      <HUD />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN ──────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">

          {/* Profile Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Title banner */}
            <div className={`relative px-6 pt-6 pb-4 bg-gradient-to-br from-white/5 to-transparent`}>
              <div className="flex flex-col items-center text-center">
                <div className="text-6xl mb-3 drop-shadow-lg">{titleInfo.emoji}</div>
                <h2 className="text-2xl font-serif font-bold mb-0.5">{player.name}</h2>
                <div className={`text-base font-bold ${titleInfo.color} mb-1`}>
                  {titleInfo.title}
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-4">
                  Seviye {player.level}
                  {player.level < 100 && ` · ${player.xpToNextLevel - player.xp} XP kaldı`}
                  {player.level >= 100 && ' · Maksimum Seviye'}
                </div>

                {/* XP Bar */}
                {player.level < 100 && (
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                      <span>XP</span>
                      <span>{player.xp} / {player.xpToNextLevel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title Tier Progression */}
            <div className="px-4 pb-5 pt-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-3">Ünvan İlerlemesi</div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PLAYER_TITLES.map((tier, idx) => {
                  const isCurrentTier = tier.minLevel === titleInfo.minLevel;
                  const isPast = tier.minLevel < titleInfo.minLevel;
                  return (
                    <div
                      key={tier.title}
                      className={`flex flex-col items-center gap-1 shrink-0 px-2 py-1.5 rounded-lg border transition-all ${
                        isCurrentTier
                          ? 'bg-white/10 border-white/30 shadow-lg'
                          : isPast
                          ? 'bg-white/5 border-white/10 opacity-60'
                          : 'bg-black/30 border-white/5 opacity-40'
                      }`}
                      title={`${tier.title} (Sv.${tier.minLevel}${tier.maxLevel < 100 ? '–' + tier.maxLevel : '+'})`}
                    >
                      <span className={`text-lg ${isCurrentTier ? '' : 'grayscale'}`}>{tier.emoji}</span>
                      <span className={`text-[8px] font-bold ${isCurrentTier ? tier.color : 'text-muted-foreground'} whitespace-nowrap`}>
                        {tier.minLevel}
                      </span>
                    </div>
                  );
                })}
              </div>
              {nextTier && (
                <div className="mt-3 flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-lg grayscale">{nextTier.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-muted-foreground truncate">{nextTier.title}</div>
                    <div className="text-[10px] text-muted-foreground/60">Seviye {nextTier.minLevel}</div>
                  </div>
                  {nextTier.milestoneCoins > 0 && (
                    <div className="text-[10px] font-mono text-yellow-400 font-bold shrink-0">+{nextTier.milestoneCoins} 🪙</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2">
              <Award size={16} className="text-primary" /> Temel İstatistikler
            </h3>
            <div className="space-y-3">
              <StatRow icon={<Heart size={14} className="text-green-500" />} label="Sağlık" value={player.stats.maxHp} base={player.baseStats.maxHp} />
              <StatRow icon={<Zap size={14} className="text-purple-500" />} label="Mana" value={player.stats.maxMana} base={player.baseStats.maxMana} />
              <div className="border-t border-border/50 my-1" />
              <StatRow icon={<Sword size={14} className="text-orange-500" />} label="Saldırı" value={player.stats.attack} base={player.baseStats.attack} />
              <StatRow icon={<Shield size={14} className="text-blue-500" />} label="Savunma" value={player.stats.defense} base={player.baseStats.defense} />
              <StatRow icon={<Zap size={14} className="text-yellow-500" />} label="Hız" value={player.stats.speed} base={player.baseStats.speed} />
            </div>
          </div>

          {/* Battle Stats */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2">
              <Target size={16} className="text-orange-400" /> Savaş İstatistikleri
            </h3>
            <div className="space-y-2.5">
              <BattleStat icon={<Trophy size={13} className="text-yellow-400" />}  label="Zafer"          value={player.victories}                       color="text-yellow-400" />
              <BattleStat icon={<Skull size={13} className="text-destructive" />}   label="Ölüm"          value={player.deaths}                          color="text-destructive" />
              <BattleStat icon={<Sword size={13} className="text-red-400" />}       label="Toplam Öldürme" value={player.totalKills ?? 0}                 color="text-red-400" />
              <BattleStat icon={<Wind size={13} className="text-cyan-400" />}       label="Başarılı Kaçış" value={player.totalEscapes ?? 0}               color="text-cyan-400" />
              <BattleStat icon={<Target size={13} className="text-purple-400" />}   label="Benzersiz Düşman" value={Object.keys(player.defeatedEnemies).length} color="text-purple-400" />
              <BattleStat icon={<Trophy size={13} className="text-orange-400" />}   label="Toplam Galip"  value={totalDefeated}                          color="text-orange-400" />
            </div>
            {player.strongestEnemy && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-2">En Güçlü Düşman</div>
                <div className="flex items-center gap-3 bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-2xl">{player.strongestEnemy.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{player.strongestEnemy.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Star size={9} className="text-yellow-400" /> Seviye {player.strongestEnemy.level}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <div className="lg:col-span-8">

          {/* Tab Bar */}
          <div className="flex gap-1 mb-5 bg-black/30 p-1 rounded-xl border border-border w-fit">
            {([['spells', '✨', 'Büyü Yükü'], ['equipment', '⚔️', 'Ekipman'], ['inventory', '🎒', 'Envanter']] as const).map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  activeTab === key
                    ? 'bg-primary/20 text-white border border-primary/30'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* ── BÜYÜ YÜKÜ TAB ────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'spells' && (
              <motion.div key="spells" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Instructions */}
                <div className="mb-4 flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
                  <div className="text-blue-400 mt-0.5 shrink-0">ℹ️</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-white">Savaşta en fazla 10 büyü slotu</span> kullanabilirsin.
                    Bir slota tıkla → seç (altın çerçeve). Ardından aşağıdan büyü seç → o slota ekle.
                    İki doldurulan slota tıklayarak sıraları değiştirebilirsin. &nbsp;
                    <span className="text-destructive">✕</span> ile slotu boşalt.
                  </div>
                </div>

                {/* 10 Spell Slots */}
                <h3 className="font-serif font-bold text-base mb-3 flex items-center gap-2">
                  ⚔️ Savaş Yükü
                  <span className="text-xs font-mono text-muted-foreground font-normal">({equippedSpells.length}/10)</span>
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const spellId = equippedSpells[idx];
                    const spell = spellId ? spells[spellId] : null;
                    const isSelected = selectedSlotIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleEquippedSlotClick(idx)}
                        className={`relative aspect-square rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-1 p-2 text-center select-none ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                            : spell
                            ? 'border-primary/40 bg-primary/5 hover:border-primary/70 hover:bg-primary/10'
                            : 'border-dashed border-white/15 bg-black/20 hover:border-white/30'
                        }`}
                      >
                        {/* Slot number */}
                        <div className={`absolute top-1 left-2 text-[9px] font-mono ${isSelected ? 'text-yellow-400' : 'text-muted-foreground/50'}`}>{idx + 1}</div>

                        {spell ? (
                          <>
                            <button
                              onClick={(e) => handleUnequipSlot(e, idx)}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive/20 hover:bg-destructive/60 border border-destructive/40 flex items-center justify-center transition-all"
                              title="Çıkar"
                            >
                              <X size={8} className="text-destructive" />
                            </button>
                            <div className="text-2xl">{spell.emoji}</div>
                            <div className="text-[9px] font-bold leading-tight truncate w-full text-center px-1">{spell.name}</div>
                            <div className="text-[8px] font-mono text-blue-400">{spell.manaCost}MP</div>
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="text-white/20" />
                            <div className="text-[8px] text-muted-foreground/40">Boş</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Known spell pool */}
                <h3 className="font-serif font-bold text-base mb-3 flex items-center gap-2">
                  📚 Öğrenilen Büyüler
                  <span className="text-xs font-mono text-muted-foreground font-normal">({unequippedKnown.length} eklenebilir)</span>
                </h3>
                {unequippedKnown.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground/50 text-sm">
                    {player.knownSpells.length === 0
                      ? 'Henüz büyü öğrenmedin. Marketten büyü satın al!'
                      : 'Tüm büyüler yüklendi! ✓'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {unequippedKnown.map(spellId => {
                      const spell = spells[spellId];
                      if (!spell) return null;
                      const canAdd = equippedSpells.length < 10;
                      return (
                        <button
                          key={spellId}
                          onClick={() => handlePoolSpellClick(spellId)}
                          disabled={!canAdd && selectedSlotIdx === null}
                          className={`bg-card border rounded-xl p-3 flex items-center gap-3 text-left transition-all ${
                            selectedSlotIdx !== null
                              ? 'border-yellow-400/40 hover:border-yellow-400 hover:bg-yellow-400/5 cursor-pointer'
                              : canAdd
                              ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                              : 'border-border/30 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-2xl shrink-0">{spell.emoji}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs leading-tight truncate">{spell.name}</div>
                            <div className="text-[9px] font-mono text-blue-400 mt-0.5">{spell.manaCost} MP</div>
                          </div>
                          <Plus size={13} className="text-primary/60 shrink-0 ml-auto" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── EKİPMAN TAB ──────────────────────────────────── */}
            {activeTab === 'equipment' && (
              <motion.div key="equipment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3 className="font-serif font-bold text-base mb-4">Kuşanılan Ekipman</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {slots.map(slot => {
                    const equippedId = player.equippedItems[slot.id];
                    const item = equippedId ? equipment[equippedId] : null;
                    return (
                      <div key={slot.id} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center relative group min-h-[130px]">
                        <div className="text-[9px] text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-1">
                          <span>{slot.emoji}</span> {slot.label}
                        </div>
                        {item ? (
                          <>
                            <div className="text-4xl mb-2">{item.emoji}</div>
                            <div className="font-bold text-xs leading-tight">{item.name}</div>
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <button
                                onClick={() => handleUnequip(slot.id)}
                                className="px-3 py-2 bg-destructive/20 text-destructive border border-destructive/50 rounded-lg text-xs font-bold hover:bg-destructive/40 transition-colors"
                              >
                                Çıkar
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center opacity-25">
                            <div className="w-10 h-10 border-2 border-dashed border-white/20 rounded-full mb-2" />
                            <span className="text-xs">Boş</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Stat bonuses summary */}
                {Object.keys(player.equippedItems).length > 0 && (
                  <div className="mb-6 bg-black/20 border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-3">Ekipman Bonusları</div>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      {(() => {
                        const bonuses: Record<string, number> = {};
                        Object.values(player.equippedItems).forEach(id => {
                          if (!id || !equipment[id]) return;
                          const b = equipment[id].statBonus;
                          if (b.attack) bonuses['ATK'] = (bonuses['ATK'] || 0) + b.attack;
                          if (b.defense) bonuses['DEF'] = (bonuses['DEF'] || 0) + b.defense;
                          if (b.maxHp) bonuses['HP'] = (bonuses['HP'] || 0) + b.maxHp;
                          if (b.maxMana) bonuses['MP'] = (bonuses['MP'] || 0) + b.maxMana;
                          if (b.speed) bonuses['SPD'] = (bonuses['SPD'] || 0) + b.speed;
                        });
                        return Object.entries(bonuses).map(([k, v]) => (
                          <span key={k} className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400">+{v} {k}</span>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ENVANTER TAB ─────────────────────────────────── */}
            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3 className="font-serif font-bold text-base mb-4">Envanter</h3>
                {player.inventory.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground/50">
                    <div className="text-4xl mb-3">🎒</div>
                    <p>Envanterin boş. Marketten ekipman satın al.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {player.inventory.map(itemId => {
                      const item = equipment[itemId];
                      if (!item) return null;
                      const isEquipped = Object.values(player.equippedItems).includes(itemId);
                      const slotName: Record<string, string> = { silah: 'Silah', zirh: 'Zırh', yuzuk: 'Yüzük', kolye: 'Kolye' };
                      return (
                        <div key={item.id} className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${isEquipped ? 'border-primary/40' : 'border-border'}`}>
                          <div className={`text-3xl w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 ${isEquipped ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-white/10'}`}>
                            {item.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm leading-tight">{item.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {slotName[item.slot]} · Sv.{item.requiredLevel}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {Object.entries(item.statBonus).map(([k, v]) => (
                                <span key={k} className="text-[9px] px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 font-mono">+{v} {k.replace('max', '').toUpperCase()}</span>
                              ))}
                            </div>
                          </div>
                          {isEquipped ? (
                            <button
                              onClick={() => handleUnequip(item.slot as EquipmentSlot)}
                              className="shrink-0 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/30 border border-destructive/30 text-destructive rounded-lg text-xs font-bold transition-colors"
                            >
                              Çıkar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquip(item.id)}
                              disabled={player.level < item.requiredLevel}
                              className="shrink-0 px-3 py-1.5 bg-primary/15 hover:bg-primary/30 border border-primary/30 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Kuşan
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────
function BattleStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
      <div className="flex items-center gap-2">
        <div className="bg-white/5 p-1 rounded">{icon}</div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`font-mono font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}

function StatRow({ icon, label, value, base }: { icon: React.ReactNode; label: string; value: number; base: number }) {
  const bonus = value - base;
  return (
    <div className="flex justify-between items-center py-1.5">
      <div className="flex items-center gap-2.5">
        <div className="bg-white/5 p-1 rounded">{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono">
        <span className="font-bold text-sm">{value}</span>
        {bonus > 0 && <span className="text-green-400 text-[10px]">(+{bonus})</span>}
      </div>
    </div>
  );
}
