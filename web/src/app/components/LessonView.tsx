import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MathProblem } from './MathProblem';
import { InteractiveVisual } from './InteractiveVisual';
import { ProgressTracker } from './ProgressTracker';

export interface Problem {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType?: 'geometry' | 'algebra' | 'counting';
  visualValue?: number;
}

interface LessonViewProps {
  title: string;
  problems: Problem[];
  onBack: () => void;
}

export function LessonView({ title, problems, onBack }: LessonViewProps) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [canProgress, setCanProgress] = useState(false);

  const handleComplete = (correct: boolean) => {
    const newResults = [...results];
    newResults[currentProblem] = correct;
    setResults(newResults);
    setCanProgress(true);
  };

  const handleNext = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setCanProgress(false);
    }
  };

  const handlePrevious = () => {
    if (currentProblem > 0) {
      setCurrentProblem(currentProblem - 1);
      setCanProgress(results[currentProblem - 1] !== undefined);
    }
  };

  const correctAnswers = results.filter(r => r).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to topics
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h1 className="mb-2">{title}</h1>
            <p className="text-muted-foreground">
              Problem {currentProblem + 1} of {problems.length}
            </p>
          </div>

          <ProgressTracker
            totalProblems={problems.length}
            completedProblems={results.filter(r => r !== undefined).length}
            correctAnswers={correctAnswers}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProblem}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MathProblem
              {...problems[currentProblem]}
              visual={
                problems[currentProblem].visualType ? (
                  <InteractiveVisual
                    type={problems[currentProblem].visualType!}
                    value={problems[currentProblem].visualValue}
                  />
                ) : undefined
              }
              onComplete={handleComplete}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 max-w-3xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentProblem === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProgress || currentProblem === problems.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {currentProblem === problems.length - 1 && canProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-chart-1 to-chart-2 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="mb-2">🎉 Lesson Complete!</h2>
            <p className="text-lg">
              You got {correctAnswers} out of {problems.length} correct
              ({((correctAnswers / problems.length) * 100).toFixed(0)}%)
            </p>
            <button
              onClick={onBack}
              className="mt-6 px-8 py-3 bg-white text-primary rounded-xl hover:shadow-lg transition-shadow"
            >
              Choose Another Topic
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
