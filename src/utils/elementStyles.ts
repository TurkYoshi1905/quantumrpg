export type GameElement = 'ateş' | 'buz' | 'şimşek' | 'ışık' | 'void' | 'fiziksel';

interface ElementStyle {
  text: string;
  border: string;
  bg: string;
  glow: string;
  label: string;
}

export const ELEMENT_STYLES: Record<GameElement, ElementStyle> = {
  'ateş':     { text: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10', glow: 'shadow-[0_0_8px_rgba(251,146,60,0.55)]',   label: 'Ateş'     },
  'buz':      { text: 'text-cyan-400',   border: 'border-cyan-400/50',   bg: 'bg-cyan-400/10',   glow: 'shadow-[0_0_8px_rgba(34,211,238,0.55)]',    label: 'Buz'      },
  'şimşek':   { text: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', glow: 'shadow-[0_0_8px_rgba(250,204,21,0.55)]',    label: 'Şimşek'   },
  'ışık':     { text: 'text-amber-200',  border: 'border-amber-200/50',  bg: 'bg-amber-200/10',  glow: 'shadow-[0_0_8px_rgba(253,230,138,0.55)]',   label: 'Işık'     },
  'void':     { text: 'text-purple-400', border: 'border-purple-400/50', bg: 'bg-purple-400/10', glow: 'shadow-[0_0_8px_rgba(192,132,252,0.55)]',   label: 'Void'     },
  'fiziksel': { text: 'text-slate-400',  border: 'border-slate-400/40',  bg: 'bg-slate-400/10',  glow: 'shadow-[0_0_6px_rgba(148,163,184,0.40)]',   label: 'Fiziksel' },
};

export function getElementStyle(element?: string): ElementStyle {
  return ELEMENT_STYLES[element as GameElement] ?? ELEMENT_STYLES['fiziksel'];
}
