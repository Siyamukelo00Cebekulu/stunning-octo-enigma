import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import { assessmentQuestions } from '../data/assessmentQuestions';

interface AssessmentTestProps {
  userName: string;
  onComplete: (score: number, totalQuestions: number) => void;
}

export function AssessmentTest({ userName, onComplete }: AssessmentTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(assessmentQuestions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);

  const question = assessmentQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1;
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const correctCount = answers.reduce((count, answer, index) => {
        if (answer === assessmentQuestions[index].correctAnswer) {
          return count + 1;
        }
        return count;
      }, 0);
      onComplete(correctCount, assessmentQuestions.length);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(false);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="mb-1">Placement Assessment</h2>
              <p className="text-muted-foreground">Hello {userName}! Let's see what you know.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-chart-1" />
                <span>
                  {currentQuestion + 1} / {assessmentQuestions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="flex-1">{question.question}</h3>
              {question.difficulty && (
                <span
                  className={`px-3 py-1 rounded-full text-xs ml-4 ${
                    question.difficulty === 'easy'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : question.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {question.difficulty}
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === question.correctAnswer;
                const showResult = selectedAnswer !== null;

                return (
                  <motion.button
                    key={index}
                    onClick={() => !showExplanation && handleAnswer(index)}
                    disabled={showExplanation}
                    whileHover={!showExplanation ? { scale: 1.01 } : {}}
                    whileTap={!showExplanation ? { scale: 0.99 } : {}}
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

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <h4 className="mb-2">{isCorrect ? '✓ Correct!' : 'Not quite'}</h4>
                <p className="text-sm">{question.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end">
          <motion.button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            whileHover={selectedAnswer !== null ? { scale: 1.02 } : {}}
            whileTap={selectedAnswer !== null ? { scale: 0.98 } : {}}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
