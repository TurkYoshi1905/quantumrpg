import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BattleLogProps {
  logs: string[];
}

export function BattleLog({ logs }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="h-32 mb-6 bg-black/60 border border-white/10 rounded-xl p-4 overflow-y-auto font-mono text-sm flex flex-col gap-2 shadow-inner"
    >
      {logs.map((log, i) => (
        <motion.div 
          key={`${i}-${log.length}`} 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className={`${i === logs.length - 1 ? 'text-white' : 'text-muted-foreground'}`}
        >
          {`> `}{log}
        </motion.div>
      ))}
    </div>
  );
}
