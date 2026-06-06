import { motion } from 'motion/react';
import { Trophy, Star, TrendingUp, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface AssessmentResultsProps {
  userName: string;
  score: number;
  totalQuestions: number;
  onContinue: () => void;
}

export function AssessmentResults({ userName, score, totalQuestions, onContinue }: AssessmentResultsProps) {
  const percentage = (score / totalQuestions) * 100;

  const getLevel = () => {
    if (percentage >= 80) return { name: 'Advanced', color: 'text-red-600', emoji: '🚀' };
    if (percentage >= 60) return { name: 'Intermediate', color: 'text-yellow-600', emoji: '⭐' };
    return { name: 'Beginner', color: 'text-green-600', emoji: '🌱' };
  };

  const level = getLevel();

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl p-8 text-white text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block p-6 bg-white/20 rounded-full mb-6"
          >
            <Trophy className="w-16 h-16" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-4">Assessment Complete!</h1>
            <p className="text-xl mb-2">Great job, {userName}!</p>
          </motion.div>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-secondary/50 rounded-xl p-6 text-center"
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-chart-1" />
              <div className="text-3xl mb-1">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-secondary/50 rounded-xl p-6 text-center"
            >
              <Star className="w-8 h-8 mx-auto mb-3 text-chart-2" />
              <div className="text-3xl mb-1">{percentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-secondary/50 rounded-xl p-6 text-center"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-chart-3" />
              <div className={`text-3xl mb-1 ${level.color}`}>
                {level.emoji} {level.name}
              </div>
              <div className="text-sm text-muted-foreground">Your Level</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-xl p-6 mb-8"
          >
            <h3 className="mb-3">What This Means</h3>
            <p className="text-muted-foreground mb-4">
              Based on your assessment, we've placed you at the <strong className={level.color}>{level.name}</strong> level.
              This means:
            </p>
            <ul className="space-y-2 text-sm">
              {level.name === 'Advanced' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>You have a strong foundation in mathematics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>You're ready for challenging topics like calculus and advanced algebra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>We'll recommend advanced problems to keep you engaged</span>
                  </li>
                </>
              )}
              {level.name === 'Intermediate' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>You have a good grasp of fundamental concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>You're ready to tackle algebra and geometry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>We'll help you build on your existing knowledge</span>
                  </li>
                </>
              )}
              {level.name === 'Beginner' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>You're building a strong foundation in mathematics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>We'll start with fundamental concepts and build gradually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1">•</span>
                    <span>Practice makes perfect - you'll improve with every lesson!</span>
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 transition-all"
          >
            Start Learning
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
