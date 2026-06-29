import React, { useState } from 'react';
import { HUD } from '../components/HUD';
import { changelog, CATEGORY_META, ChangelogCategory } from '../data/changelogData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, Sparkles, Wrench, Bug, Cpu, ChevronDown, ChevronUp, Calendar, Hash } from 'lucide-react';
import { useLocation } from 'wouter';

const CATEGORY_ICON: Record<ChangelogCategory, React.ReactNode> = {
  yenilik:    <Sparkles size={11} />,
  geliştirme: <Wrench   size={11} />,
  düzeltme:   <Bug      size={11} />,
  teknik:     <Cpu      size={11} />,
};

export default function ChangelogPage() {
  const [, setLocation] = useLocation();
  const [expandedVersion, setExpandedVersion] = useState<string | null>(changelog[0]?.version ?? null);
  const [activeFilter, setActiveFilter] = useState<ChangelogCategory | 'all'>('all');

  const categories: Array<{ key: ChangelogCategory | 'all'; label: string }> = [
    { key: 'all',        label: 'Tümü'         },
    { key: 'yenilik',    label: 'Yeni Özellik' },
    { key: 'geliştirme', label: 'Geliştirme'   },
    { key: 'düzeltme',   label: 'Düzeltme'     },
    { key: 'teknik',     label: 'Teknik'        },
  ];

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-20 pb-12 px-3 md:px-6">
      <HUD />

      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <button
            onClick={() => setLocation('/harita')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Haritaya Dön
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Tag size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white mb-1">Güncelleme Notları</h1>
              <p className="text-muted-foreground text-sm">QuantumRPG'ye yapılan tüm değişiklikler, düzeltmeler ve yeni özellikler.</p>
            </div>
          </div>
        </div>

        {/* ── Category filter ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => {
            const meta = cat.key !== 'all' ? CATEGORY_META[cat.key] : null;
            const isActive = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? meta
                      ? `${meta.color} ${meta.bg} ${meta.border}`
                      : 'text-white bg-white/10 border-white/20'
                    : 'text-muted-foreground bg-transparent border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.key !== 'all' && CATEGORY_ICON[cat.key as ChangelogCategory]}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60 pointer-events-none" />

          <div className="space-y-6">
            {changelog.map((ver, vIdx) => {
              const isExpanded = expandedVersion === ver.version;
              const filteredEntries = activeFilter === 'all'
                ? ver.entries
                : ver.entries.filter(e => e.category === activeFilter);

              if (filteredEntries.length === 0 && activeFilter !== 'all') return null;

              return (
                <motion.div
                  key={ver.version}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: vIdx * 0.08 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-3 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    vIdx === 0
                      ? 'bg-primary border-primary shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                      : 'bg-card border-border'
                  }`}>
                    <Hash size={14} className={vIdx === 0 ? 'text-white' : 'text-muted-foreground'} />
                  </div>

                  {/* Version card */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Card header — clickable */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      onClick={() => setExpandedVersion(isExpanded ? null : ver.version)}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className={`font-mono font-black text-xl ${vIdx === 0 ? 'text-primary' : 'text-white'}`}>
                            {ver.version}
                          </span>
                          {vIdx === 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/20 text-primary border border-primary/30">
                              Son Sürüm
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar size={11} />
                          <span>{ver.date}</span>
                          <span className="text-white/20">·</span>
                          <span>{ver.entries.length} değişiklik</span>
                        </div>
                        {!isExpanded && (
                          <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">{ver.summary}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-muted-foreground mt-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expanded body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-border/50 pt-4">
                            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{ver.summary}</p>

                            <div className="space-y-3">
                              {filteredEntries.map((entry, eIdx) => {
                                const meta = CATEGORY_META[entry.category];
                                return (
                                  <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: eIdx * 0.04 }}
                                    className="flex gap-3 p-3.5 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors"
                                  >
                                    <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border mt-0.5 ${meta.bg} ${meta.border}`}>
                                      <span className={meta.color}>{CATEGORY_ICON[entry.category]}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-sm text-white">{entry.title}</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${meta.color} ${meta.bg} ${meta.border}`}>
                                          {meta.label}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{entry.description}</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground/40 font-mono">
          QuantumRPG · Tüm hakları saklıdır
        </div>
      </div>
    </div>
  );
}
