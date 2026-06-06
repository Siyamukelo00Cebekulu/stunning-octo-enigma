import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface TopicCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  onClick: () => void;
}

export function TopicCard({
  title,
  description,
  icon: Icon,
  difficulty,
  color,
  onClick
}: TopicCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-card rounded-2xl p-6 shadow-lg border border-border text-left hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.button>
  );
}
