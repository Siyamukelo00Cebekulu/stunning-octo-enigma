import { useState } from 'react';
import { motion } from 'motion/react';

interface InteractiveVisualProps {
  type: 'geometry' | 'algebra' | 'counting';
  value?: number;
}

export function InteractiveVisual({ type, value = 0 }: InteractiveVisualProps) {
  const [hover, setHover] = useState(false);

  if (type === 'geometry') {
    return (
      <div className="relative w-64 h-64">
        <motion.svg viewBox="0 0 200 200" className="w-full h-full">
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.line
            x1="100"
            y1="100"
            x2="160"
            y2="100"
            stroke="currentColor"
            strokeWidth="2"
            className="text-chart-1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <text x="130" y="95" className="fill-current text-sm">r</text>
        </motion.svg>
      </div>
    );
  }

  if (type === 'counting') {
    return (
      <div className="flex flex-wrap gap-3 max-w-md">
        {Array.from({ length: value }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.2 }}
            className="w-12 h-12 bg-chart-1 rounded-lg shadow-md"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="p-6 bg-primary text-primary-foreground rounded-xl"
      >
        <span className="text-3xl">x + {value} = 10</span>
      </motion.div>
    </div>
  );
}
