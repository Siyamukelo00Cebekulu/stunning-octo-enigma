import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface MathProblemProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visual?: React.ReactNode;
  onComplete: (correct: boolean) => void;
}

export function MathProblem({
  question,
  options,
  correctAnswer,
  explanation,
  visual,
  onComplete
}: MathProblemProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === correctAnswer;
    onComplete(isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
        <h3 className="mb-6">{question}</h3>

        {visual && (
          <div className="mb-8 bg-secondary/30 rounded-xl p-6 flex items-center justify-center">
            {visual}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === correctAnswer;
            const showResult = selectedAnswer !== null;

            return (
              <motion.button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  !showResult
                    ? 'bg-secondary hover:bg-secondary/80 border-2 border-transparent'
                    : isSelected && isCorrectOption
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : isSelected && !isCorrectOption
                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                    : isCorrectOption
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : 'bg-secondary/50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isSelected && (
                    isCorrectOption ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {!showExplanation && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <Lightbulb className="w-5 h-5" />
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}

        {showHint && !showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-accent/50 rounded-xl p-4 mb-4"
          >
            <p className="text-sm text-muted-foreground">Think about the relationship between the numbers...</p>
          </motion.div>
        )}

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <h4 className="mb-3">{isCorrect ? '🎉 Correct!' : 'Not quite...'}</h4>
            <p className="text-sm">{explanation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
