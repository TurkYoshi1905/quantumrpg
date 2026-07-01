import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { spells } from '../data/spells';
import { equipment } from '../data/equipment';
import { potionList } from '../data/potions';
import { HUD } from '../components/HUD';
import { getElementStyle } from '../utils/elementStyles';
import {
  Shield, Sword, Heart, Zap, Coins, FlaskConical,
  Gem, Link2, LayoutGrid, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'potions' | 'spells' | 'equipment';
type SlotFilter = 'all' | 'silah' | 'zirh' | 'yuzuk' | 'kolye';

const SLOT_LABELS: Record<SlotFilter, string> = {
  all: 'Tümü',
  silah: 'Silah',
  zirh: 'Zırh',
  yuzuk: 'Yüzük',
  kolye: 'Kolye',
};

const SLOT_ICON: Record<SlotFilter, React.ReactNode> = {
  all: <LayoutGrid size={12} />,
  silah: <Sword size={12} />,
  zirh: <Shield size={12} />,
  yuzuk: <Gem size={12} />,
  kolye: <Link2 size={12} />,
};

export default function ShopPage() {
  const { state, dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState<Tab>('potions');
  const [slotFilter, setSlotFilter] = useState<SlotFilter>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyPotion = (potionId: string) => {
    dispatch({ type: 'BUY_POTION', potionId });
    showToast('İksir satın alındı!');
  };

  const handleBuySpell = (spellId: string, price: number, unlockLevel: number) => {
    if (state.player.coins >= price && state.player.level >= unlockLevel) {
      dispatch({ type: 'BUY_SPELL', spellId });
      showToast('Büyü satın alındı!');
    }
  };

  const handleBuyEquip = (equipId: string) => {
    dispatch({ type: 'BUY_EQUIPMENT', equipmentId: equipId });
    showToast('Ekipman satın alındı!');
  };

  const shopSpells = Object.values(spells).filter(s => s.shopPrice);
  const allEquips = Object.values(equipment);
  const filteredEquips = slotFilter === 'all'
    ? allEquips
    : allEquips.filter(e => e.slot === slotFilter);

  // Reset slot filter when leaving equipment tab
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'equipment') setSlotFilter('all');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'potions', label: 'İksirler', icon: <FlaskConical size={13}/> },
    { key: 'spells', label: 'Büyüler', icon: <Zap size={13}/> },
    { key: 'equipment', label: 'Ekipmanlar', icon: <Sword size={13}/> },
  ];

  const slotFilters: SlotFilter[] = ['all', 'silah', 'zirh', 'yuzuk', 'kolye'];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <HUD />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary/20 border border-primary/50 text-white px-6 py-2 rounded-2xl font-bold shadow-lg text-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable body — starts after HUD */}
      <div className="flex-1 overflow-y-auto pt-12 md:pt-16">
        <div className="max-w-5xl mx-auto px-3 md:px-4 pt-2 pb-8">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                🏪 Quantum Marketi
              </h1>
              <p className="text-xs text-muted-foreground">İksir, büyü ve ekipman al. Hazine senin!</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-3 py-1.5 ml-auto">
              <Coins size={14} className="text-yellow-400" />
              <span className="font-bold font-mono text-yellow-400 text-sm">{state.player.coins} Altın</span>
            </div>
          </div>

          {/* Main tabs */}
          <div className="flex gap-1 mb-3 bg-black/30 p-1 rounded-xl border border-border w-fit">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary/20 text-white border border-primary/30'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Equipment slot filter — only visible in equipment tab */}
          <AnimatePresence>
            {activeTab === 'equipment' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {slotFilters.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSlotFilter(slot)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        slotFilter === slot
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-black/20 border-white/10 text-muted-foreground hover:text-white hover:border-white/20'
                      }`}
                    >
                      {SLOT_ICON[slot]}
                      {SLOT_LABELS[slot]}
                      {slot !== 'all' && (
                        <span className="ml-0.5 text-[10px] opacity-60">
                          ({allEquips.filter(e => e.slot === slot).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* POTIONS TAB */}
          {activeTab === 'potions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {potionList.map(potion => {
                const owned = (state.player.potions ?? {})[potion.id] || 0;
                const canAfford = state.player.coins >= potion.price;
                const atMax = owned >= potion.maxStack;

                return (
                  <div key={potion.id} className="bg-card border border-border rounded-xl p-4 flex flex-col relative overflow-hidden hover:border-green-500/30 transition-all">
                    <div className="absolute top-0 right-0 bg-black/40 border-b border-l border-white/10 px-2 py-0.5 text-[9px] font-mono rounded-bl-lg text-muted-foreground">
                      Maks {potion.maxStack}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl bg-black/40 w-12 h-12 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                        {potion.emoji}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm leading-tight">{potion.name}</h3>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          Envanter: <span className="text-green-400 font-bold">{owned}/{potion.maxStack}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground flex-1 mb-3 leading-relaxed">{potion.description}</p>

                    {atMax ? (
                      <button disabled className="w-full py-2 bg-white/5 border border-white/10 text-muted-foreground rounded-lg font-bold text-xs cursor-not-allowed">
                        Dolu (Max {potion.maxStack})
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyPotion(potion.id)}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 text-white'
                            : 'bg-black/40 border border-border text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <Coins size={13} className={canAfford ? 'text-yellow-400' : 'text-muted-foreground'} />
                        {potion.price} Altın
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SPELLS TAB */}
          {activeTab === 'spells' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shopSpells.map(spell => {
                const hasSpell = state.player.knownSpells.includes(spell.id);
                const canAfford = state.player.coins >= (spell.shopPrice || 0);
                const levelReqMet = state.player.level >= spell.unlockLevel;
                const canBuy = canAfford && levelReqMet;

                return (
                  <div key={spell.id} className="bg-card border border-border rounded-xl p-4 flex flex-col relative overflow-hidden hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 bg-black/40 border-b border-l border-white/10 px-2 py-0.5 text-[9px] font-mono rounded-bl-lg text-muted-foreground">
                      Sv.{spell.unlockLevel}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl bg-black/40 w-12 h-12 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                        {spell.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="font-bold text-sm leading-tight">{spell.name}</h3>
                          {(() => {
                            const es = getElementStyle(spell.element);
                            return (
                              <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${es.text} ${es.bg} ${es.border} ${es.glow}`}>
                                {es.label}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono mt-0.5">
                          {spell.damage > 0 && <span className="text-orange-400 flex items-center gap-0.5"><Sword size={10}/>{spell.damage}</span>}
                          {spell.healAmount && <span className="text-green-400 flex items-center gap-0.5"><Heart size={10}/>{spell.healAmount}</span>}
                          <span className="text-blue-400 flex items-center gap-0.5"><Zap size={10}/>{spell.manaCost}MP</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex-1 mb-3 leading-relaxed">{spell.description}</p>
                    {hasSpell ? (
                      <button disabled className="w-full py-2 bg-white/5 border border-white/10 text-muted-foreground rounded-lg font-bold text-xs cursor-not-allowed">
                        ✓ Öğrenildi
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuySpell(spell.id, spell.shopPrice!, spell.unlockLevel)}
                        disabled={!canBuy}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          canBuy
                            ? 'bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white'
                            : 'bg-black/40 border border-border text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {!levelReqMet ? `Seviye ${spell.unlockLevel} Gerekli` : (
                          <><Coins size={13} className={canAfford ? 'text-yellow-400' : 'text-muted-foreground'} />{spell.shopPrice} Altın</>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* EQUIPMENT TAB */}
          {activeTab === 'equipment' && (
            <>
              {filteredEquips.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">🪣</div>
                  <p className="text-sm">Bu kategoride ekipman yok.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredEquips.map(equip => {
                    const hasEquip = state.player.inventory.includes(equip.id);
                    const canAfford = state.player.coins >= equip.price;
                    const levelReqMet = state.player.level >= equip.requiredLevel;

                    const slotDisplayName: Record<string, string> = {
                      silah: 'Silah', zirh: 'Zırh', yuzuk: 'Yüzük', kolye: 'Kolye'
                    };
                    const slotIcon: Record<string, React.ReactNode> = {
                      silah: <Sword size={10}/>,
                      zirh: <Shield size={10}/>,
                      yuzuk: <Gem size={10}/>,
                      kolye: <Link2 size={10}/>,
                    };

                    return (
                      <div key={equip.id} className="bg-card border border-border rounded-xl p-4 flex flex-col relative overflow-hidden hover:border-primary/30 transition-all">
                        <div className="absolute top-0 right-0 bg-black/40 border-b border-l border-white/10 px-2 py-0.5 text-[9px] font-mono rounded-bl-lg text-muted-foreground">
                          Sv.{equip.requiredLevel}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-3xl bg-black/40 w-12 h-12 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                            {equip.emoji}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm leading-tight">{equip.name}</h3>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                              {slotIcon[equip.slot]}
                              <span>{slotDisplayName[equip.slot] ?? equip.slot}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{equip.description}</p>
                        <div className="bg-black/30 rounded-lg px-3 py-2 border border-white/5 mb-3 flex-1 grid grid-cols-2 gap-1 text-[10px]">
                          {equip.statBonus.attack && <div className="flex items-center gap-1 text-orange-400"><Sword size={10}/> +{equip.statBonus.attack} ATK</div>}
                          {equip.statBonus.defense && <div className="flex items-center gap-1 text-blue-400"><Shield size={10}/> +{equip.statBonus.defense} DEF</div>}
                          {equip.statBonus.maxHp && <div className="flex items-center gap-1 text-green-400"><Heart size={10}/> +{equip.statBonus.maxHp} HP</div>}
                          {equip.statBonus.maxMana && <div className="flex items-center gap-1 text-purple-400"><Zap size={10}/> +{equip.statBonus.maxMana} MP</div>}
                          {equip.statBonus.speed && <div className="flex items-center gap-1 text-yellow-400"><Zap size={10}/> +{equip.statBonus.speed} SPD</div>}
                          {equip.statBonus.spellPower && <div className="flex items-center gap-1 text-violet-400"><Sparkles size={10}/> +{equip.statBonus.spellPower} BG</div>}
                        </div>
                        {hasEquip ? (
                          <button disabled className="w-full py-2 bg-white/5 border border-white/10 text-muted-foreground rounded-lg font-bold text-xs cursor-not-allowed">
                            ✓ Satın Alındı
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyEquip(equip.id)}
                            disabled={!canAfford || !levelReqMet}
                            className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                              canAfford && levelReqMet
                                ? 'bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white'
                                : 'bg-black/40 border border-border text-muted-foreground cursor-not-allowed'
                            }`}
                          >
                            {!levelReqMet ? `Seviye ${equip.requiredLevel} Gerekli` : (
                              <><Coins size={13} className={canAfford ? 'text-yellow-400' : 'text-muted-foreground'} />{equip.price} Altın</>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
