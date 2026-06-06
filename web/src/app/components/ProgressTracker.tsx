import { motion } from 'motion/react';
import { Trophy, Star } from 'lucide-react';

interface ProgressTrackerProps {
  totalProblems: number;
  completedProblems: number;
  correctAnswers: number;
}

export function ProgressTracker({
  totalProblems,
  completedProblems,
  correctAnswers
}: ProgressTrackerProps) {
  const percentage = (completedProblems / totalProblems) * 100;
  const accuracy = completedProblems > 0 ? (correctAnswers / completedProblems) * 100 : 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-chart-1" />
          Progress
        </h3>
        <div className="text-sm text-muted-foreground">
          {completedProblems} / {totalProblems}
        </div>
      </div>

      <div className="w-full bg-secondary rounded-full h-3 mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-chart-1" />
            <span>{accuracy.toFixed(0)}%</span>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Correct</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{correctAnswers}</span>
            <span className="text-sm text-muted-foreground">/ {completedProblems}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
