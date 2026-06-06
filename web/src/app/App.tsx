import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Calculator, Grid3x3, TrendingUp, Award, BookOpen, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lightbulb, Trophy, Star, User, BarChart3, Map, LogOut, Menu, X as CloseIcon, Moon, Sun, FileText, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthScreen } from './components/AuthScreen';
import { UserInfoForm } from './components/UserInfoForm';
import { AssessmentTest } from './components/AssessmentTest';
import { AssessmentResults } from './components/AssessmentResults';
import { ProfileManagement } from './components/ProfileManagement';
import { LearningPath } from './components/LearningPath';
import { LessonsScreen } from './components/LessonsScreen';
import { ChatbotMascot } from './components/ChatbotMascot';
import { AnalyticsFeedback } from './components/AnalyticsFeedback';
import { PastPapersScreen } from './components/PastPapersScreen';
import {
  curriculumTracks,
  getGradeNumber,
  getTopicsForGrade,
  paperDefinitions,
  type PaperId
} from './data/curriculum';

// Types
interface Problem {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType?: 'geometry' | 'algebra' | 'counting';
  visualValue?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

interface UserProfile {
  name: string;
  email: string;
  age: number;
  grade: string;
  assessmentScore: number;
  assessmentLevel: 'beginner' | 'intermediate' | 'advanced';
  completedAssessment: boolean;
}

type Screen = 'dashboard' | 'lessons' | 'learning-path' | 'past-papers' | 'analytics' | 'profile';
type Theme = 'light' | 'dark';

// Data
const topics: Topic[] = [
  {
    id: 'algebra',
    title: 'Algebra Fundamentals',
    description: 'Master equations, variables, and algebraic thinking',
    icon: Calculator,
    difficulty: 'beginner',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    id: 'geometry',
    title: 'Geometry & Shapes',
    description: 'Explore angles, areas, and spatial reasoning',
    icon: Grid3x3,
    difficulty: 'beginner',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    id: 'calculus',
    title: 'Introduction to Calculus',
    description: 'Understand limits, derivatives, and rates of change',
    icon: TrendingUp,
    difficulty: 'advanced',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  },
  {
    id: 'logic',
    title: 'Logic & Problem Solving',
    description: 'Develop critical thinking and logical reasoning',
    icon: Brain,
    difficulty: 'intermediate',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  }
];

const lessonProblems: Record<string, Problem[]> = {
  algebra: [
    {
      question: 'If x + 5 = 12, what is the value of x?',
      options: ['5', '7', '12', '17'],
      correctAnswer: 1,
      explanation: 'To solve for x, subtract 5 from both sides: x = 12 - 5 = 7',
      visualType: 'algebra',
      visualValue: 5
    },
    {
      question: 'Simplify: 3x + 2x',
      options: ['5x', '6x', '5x²', 'x⁵'],
      correctAnswer: 0,
      explanation: 'When adding like terms, add the coefficients: 3x + 2x = (3 + 2)x = 5x',
      visualType: 'counting',
      visualValue: 5
    },
    {
      question: 'If 2x = 16, what is x?',
      options: ['4', '6', '8', '14'],
      correctAnswer: 2,
      explanation: 'Divide both sides by 2: x = 16 ÷ 2 = 8',
      visualType: 'algebra',
      visualValue: 2
    },
    {
      question: 'What is the value of 3(x + 2) when x = 4?',
      options: ['14', '18', '20', '24'],
      correctAnswer: 1,
      explanation: 'First substitute x = 4: 3(4 + 2) = 3(6) = 18',
      visualType: 'algebra',
      visualValue: 4
    }
  ],
  geometry: [
    {
      question: 'What is the area of a circle with radius 5?',
      options: ['25π', '10π', '5π', '100π'],
      correctAnswer: 0,
      explanation: 'Area = πr². With r = 5, Area = π(5)² = 25π',
      visualType: 'geometry'
    },
    {
      question: 'How many degrees are in a triangle?',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      explanation: 'The sum of all angles in any triangle always equals 180 degrees.'
    },
    {
      question: 'What is the perimeter of a square with side length 7?',
      options: ['14', '21', '28', '49'],
      correctAnswer: 2,
      explanation: 'Perimeter = 4 × side length = 4 × 7 = 28',
      visualType: 'counting',
      visualValue: 4
    }
  ],
  calculus: [
    {
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswer: 1,
      explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x'
    },
    {
      question: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
      options: ['0', '1', '2', 'undefined'],
      correctAnswer: 2,
      explanation: 'Factor: (x - 1)(x + 1)/(x - 1) = x + 1. As x → 1, the limit is 2',
      visualType: 'algebra',
      visualValue: 1
    },
    {
      question: 'If f(x) = 3x³, what is f\'(x)?',
      options: ['3x²', '9x²', '3x', '9x³'],
      correctAnswer: 1,
      explanation: 'Using the power rule: d/dx(3x³) = 3 × 3x² = 9x²'
    }
  ],
  logic: [
    {
      question: 'If all roses are flowers, and some flowers fade quickly, which must be true?',
      options: [
        'All roses fade quickly',
        'Some roses might fade quickly',
        'No roses fade quickly',
        'All flowers are roses'
      ],
      correctAnswer: 1,
      explanation: 'Since roses are flowers and some flowers fade quickly, it\'s possible (but not certain) that some roses fade quickly.',
      visualType: 'counting',
      visualValue: 6
    },
    {
      question: 'Complete the pattern: 2, 4, 8, 16, ?',
      options: ['20', '24', '32', '48'],
      correctAnswer: 2,
      explanation: 'Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32'
    },
    {
      question: 'If A is true OR B is true, and A is false, what must be true?',
      options: ['B is false', 'B is true', 'B could be either', 'Neither A nor B'],
      correctAnswer: 1,
      explanation: 'In an OR statement, if one part is false, the other must be true for the whole statement to be true.'
    }
  ]
};

// Component: Interactive Visual
function InteractiveVisual({ type, value = 0 }: { type: 'geometry' | 'algebra' | 'counting'; value?: number }) {
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
      <div className="flex flex-wrap gap-3 max-w-md justify-center">
        {Array.from({ length: value }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.2 }}
            className="w-12 h-12 bg-chart-1 rounded-lg shadow-md"
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

// Component: Math Problem
function MathProblem({ problem, onComplete }: { problem: Problem; onComplete: (correct: boolean) => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === problem.correctAnswer;
    onComplete(isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const isCorrect = selectedAnswer === problem.correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
        <h3 className="mb-6">{problem.question}</h3>

        {problem.visualType && (
          <div className="mb-8 bg-secondary/30 rounded-xl p-6 flex items-center justify-center">
            <InteractiveVisual type={problem.visualType} value={problem.visualValue} />
          </div>
        )}

        <div className="space-y-3 mb-6">
          {problem.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === problem.correctAnswer;
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
            <p className="text-sm">{problem.explanation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Component: Progress Tracker
function ProgressTracker({ totalProblems, completedProblems, correctAnswers }: { totalProblems: number; completedProblems: number; correctAnswers: number }) {
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

// Component: Lesson View
function LessonView({ title, problems, onBack }: { title: string; problems: Problem[]; onBack: () => void }) {
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
            <MathProblem problem={problems[currentProblem]} onComplete={handleComplete} />
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

// Component: Topic Card
function TopicCard({ topic, onClick }: { topic: Topic; onClick: () => void }) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  const Icon = topic.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-card rounded-2xl p-6 shadow-lg border border-border text-left hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${topic.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${difficultyColors[topic.difficulty]}`}>
          {topic.difficulty}
        </span>
      </div>

      <h3 className="mb-2">{topic.title}</h3>
      <p className="text-sm text-muted-foreground">{topic.description}</p>
    </motion.button>
  );
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = localStorage.getItem('mathGeniusTheme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle({ theme, onToggle, compact = false }: { theme: Theme; onToggle: () => void; compact?: boolean }) {
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors ${
        compact ? 'w-full px-4 py-3' : 'px-3 py-2'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className={compact ? '' : 'hidden lg:inline'}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

// Main App
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<'info' | 'assessment' | 'results' | 'complete'>('info');
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [assessmentTotal, setAssessmentTotal] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Load authentication and user profile from localStorage on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('mathGeniusAuth');
    const savedProfile = localStorage.getItem('mathGeniusProfile');

    if (authStatus === 'true' && savedProfile) {
      setIsAuthenticated(true);
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      if (profile.completedAssessment) {
        setOnboardingStep('complete');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('mathGeniusTheme', theme);
  }, [theme]);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('mathGeniusProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleLogin = (email: string, password: string) => {
    localStorage.setItem('mathGeniusAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleSignup = (email: string, password: string, name: string) => {
    localStorage.setItem('mathGeniusAuth', 'true');
    setIsAuthenticated(true);
    setUserProfile({
      name,
      email,
      age: 0,
      grade: '',
      assessmentScore: 0,
      assessmentLevel: 'beginner',
      completedAssessment: false
    });
    setOnboardingStep('info');
  };

  const handleLogout = () => {
    localStorage.removeItem('mathGeniusAuth');
    localStorage.removeItem('mathGeniusProfile');
    setIsAuthenticated(false);
    setUserProfile(null);
    setOnboardingStep('info');
    setCurrentScreen('dashboard');
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleUserInfoComplete = (info: { name: string; age: number; grade: string }) => {
    setUserProfile(prev => ({
      name: info.name,
      email: prev?.email || '',
      age: info.age,
      grade: info.grade,
      assessmentScore: 0,
      assessmentLevel: 'beginner',
      completedAssessment: false
    }));
    setOnboardingStep('assessment');
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleRetakeAssessment = () => {
    setCurrentScreen('dashboard');
    setOnboardingStep('assessment');
  };

  const handleResetProgress = () => {
    setUserProfile(prev => prev ? {
      ...prev,
      assessmentScore: 0,
      assessmentLevel: 'beginner',
      completedAssessment: false
    } : null);
    setCurrentScreen('dashboard');
    setOnboardingStep('assessment');
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Delete this demo account and local progress?')) return;
    localStorage.removeItem('mathGeniusAuth');
    localStorage.removeItem('mathGeniusProfile');
    setIsAuthenticated(false);
    setUserProfile(null);
    setOnboardingStep('info');
    setCurrentScreen('dashboard');
  };

  const handleAssessmentComplete = (score: number, total: number) => {
    setAssessmentScore(score);
    setAssessmentTotal(total);
    setOnboardingStep('results');
  };

  const handleResultsContinue = () => {
    const percentage = (assessmentScore / assessmentTotal) * 100;
    const level: 'beginner' | 'intermediate' | 'advanced' =
      percentage >= 80 ? 'advanced' : percentage >= 60 ? 'intermediate' : 'beginner';

    setUserProfile(prev => prev ? {
      ...prev,
      assessmentScore: assessmentScore,
      assessmentLevel: level,
      completedAssessment: true
    } : null);
    setOnboardingStep('complete');
  };

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // Show onboarding flow if user hasn't completed it
  if (onboardingStep === 'info') {
    return (
      <>
        <UserInfoForm onComplete={handleUserInfoComplete} />
        <ChatbotMascot />
      </>
    );
  }

  if (onboardingStep === 'assessment' && userProfile) {
    return (
      <>
        <AssessmentTest userName={userProfile.name} onComplete={handleAssessmentComplete} />
        <ChatbotMascot />
      </>
    );
  }

  if (onboardingStep === 'results' && userProfile) {
    return (
      <>
        <AssessmentResults
          userName={userProfile.name}
          score={assessmentScore}
          totalQuestions={assessmentTotal}
          onContinue={handleResultsContinue}
        />
        <ChatbotMascot />
      </>
    );
  }

  // Show different screens based on navigation
  if (currentScreen === 'lessons') {
    return (
      <>
        <LessonsScreen
          userGrade={userProfile?.grade}
          onBack={() => setCurrentScreen('dashboard')}
          onSelectLesson={(lessonId) => {
            console.log('Selected lesson:', lessonId);
          }}
        />
        <ChatbotMascot />
      </>
    );
  }

  if (currentScreen === 'profile' && userProfile) {
    return (
      <>
        <ProfileManagement
          profile={userProfile}
          onUpdate={handleProfileUpdate}
          onBack={() => setCurrentScreen('dashboard')}
          onRetakeAssessment={handleRetakeAssessment}
          onResetProgress={handleResetProgress}
          onDeleteAccount={handleDeleteAccount}
        />
        <ChatbotMascot />
      </>
    );
  }

  if (currentScreen === 'learning-path' && userProfile) {
    return (
      <>
        <LearningPath
          userLevel={userProfile.assessmentLevel}
          userGrade={userProfile.grade}
          onBack={() => setCurrentScreen('dashboard')}
          onSelectNode={(nodeId) => {
            console.log('Selected node:', nodeId);
          }}
        />
        <ChatbotMascot />
      </>
    );
  }

  if (currentScreen === 'past-papers') {
    return (
      <>
        <PastPapersScreen onBack={() => setCurrentScreen('dashboard')} />
        <ChatbotMascot />
      </>
    );
  }

  if (currentScreen === 'analytics' && userProfile) {
    return (
      <>
        <AnalyticsFeedback
          userName={userProfile.name}
          onBack={() => setCurrentScreen('dashboard')}
        />
        <ChatbotMascot />
      </>
    );
  }

  // Main app (after onboarding complete)
  if (currentLesson && lessonProblems[currentLesson]) {
    const topic = topics.find(t => t.id === currentLesson);
    return (
      <>
        <LessonView
          title={topic?.title || ''}
          problems={lessonProblems[currentLesson]}
          onBack={() => setCurrentLesson(null)}
        />
        <ChatbotMascot />
      </>
    );
  }

  const userGradeNumber = getGradeNumber(userProfile?.grade);
  const curriculumTopics = getTopicsForGrade(userProfile?.grade);
  const recommendedCurriculumTopics = curriculumTopics.slice(
    0,
    userProfile?.assessmentLevel === 'advanced' ? 6 : 4
  );
  const paperOrder: PaperId[] = ['paper1', 'paper2'];

  const quickActions: Array<{
    id: Screen;
    label: string;
    description: string;
    icon: LucideIcon;
    primary?: boolean;
  }> = [
    {
      id: 'lessons',
      label: 'Browse Lessons',
      description: `Grade ${userGradeNumber} modules by paper`,
      icon: Brain,
      primary: true
    },
    {
      id: 'learning-path',
      label: 'Learning Path',
      description: 'Follow your Paper 1 or Paper 2 roadmap',
      icon: Map
    },
    {
      id: 'past-papers',
      label: 'Past Papers',
      description: 'Grade 12 papers and memos',
      icon: FileText
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      description: 'Review accuracy, streaks, and focus areas',
      icon: BarChart3
    }
  ];

  const navigationItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: BookOpen },
    { id: 'lessons' as Screen, label: 'Lessons', icon: Brain },
    { id: 'learning-path' as Screen, label: 'Learning Path', icon: Map },
    { id: 'past-papers' as Screen, label: 'Past Papers', icon: FileText },
    { id: 'analytics' as Screen, label: 'Analytics', icon: BarChart3 },
    { id: 'profile' as Screen, label: 'Profile', icon: User }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-chart-1 to-chart-2 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent text-xl">
                  MathGenius
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        currentScreen === item.id
                          ? 'bg-gradient-to-r from-chart-1 to-chart-2 text-white'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-xl hover:bg-secondary"
                  aria-label="Toggle navigation menu"
                >
                  {showMobileMenu ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-4 space-y-2"
              >
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentScreen(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                        currentScreen === item.id
                          ? 'bg-gradient-to-r from-chart-1 to-chart-2 text-white'
                          : 'hover:bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              MathGenius
            </h1>
          </div>
          {userProfile && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
              Welcome back, {userProfile.name}!
            </p>
          )}
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master South African mathematics through CAPS, IEB, and Cambridge-aligned practice.
          </p>
          {userProfile && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm">
              <Trophy className="w-4 h-4 text-chart-1" />
              <span>
                {userProfile.grade || `Grade ${userGradeNumber}`} | Level:{' '}
                <strong className="capitalize">{userProfile.assessmentLevel}</strong> | Score:{' '}
                <strong>{userProfile.assessmentScore}</strong>
              </span>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentScreen(action.id)}
                className={`rounded-xl p-6 text-left shadow-lg transition-shadow ${
                  action.primary
                    ? 'bg-gradient-to-r from-chart-1 to-chart-2 text-white'
                    : 'bg-card border border-border hover:shadow-xl'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${action.primary ? '' : 'text-chart-2'}`} />
                <h3 className="mb-2">{action.label}</h3>
                <p className={`text-sm ${action.primary ? 'opacity-90' : 'text-muted-foreground'}`}>
                  {action.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-chart-1" />
            <h2>South African Curriculum</h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-6">
            MathGenius organizes Grades 4-12 around Paper 1 and Paper 2 so learners can move from classwork to matric-style preparation without changing study systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {curriculumTracks.map((track, index) => (
              <motion.article
                key={track.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-xs">
                    {track.name}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-base mb-2">{track.focus}</h3>
                <p className="text-sm text-muted-foreground">{track.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-6 h-6 text-chart-2" />
            <h2>Paper 1 & Paper 2 Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paperOrder.map((paper, index) => {
              const definition = paperDefinitions[paper];
              const paperTopics = curriculumTopics.filter((topic) => topic.paper === paper);

              return (
                <motion.article
                  key={paper}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="text-sm text-chart-1">{definition.subtitle}</span>
                      <h3>{definition.label}</h3>
                      <p className="text-sm text-muted-foreground">{definition.description}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary text-xs">
                      Grade {userGradeNumber}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {paperTopics.map((topic) => (
                      <div key={topic.id} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-chart-1 flex-shrink-0" />
                        <div>
                          <h4>{topic.title}</h4>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-chart-1" />
              <h2>
                {userProfile?.assessmentLevel === 'beginner'
                  ? `Grade ${userGradeNumber} Starting Points`
                  : userProfile?.assessmentLevel === 'intermediate'
                  ? `Grade ${userGradeNumber} Continue Learning`
                  : `Grade ${userGradeNumber} Challenge Topics`}
              </h2>
            </div>
            {userProfile && userProfile.assessmentLevel !== 'advanced' && (
              <button
                onClick={() => setOnboardingStep('info')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Retake Assessment
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCurriculumTopics.map((topic, index) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentScreen('lessons')}
                className="bg-card rounded-xl p-6 border border-border text-left shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-chart-2/10 text-chart-2">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary text-xs">
                    {paperDefinitions[topic.paper].shortLabel}
                  </span>
                </div>
                <h3 className="mb-2">{topic.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{topic.duration}</span>
                  <span className="capitalize">{topic.difficulty}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-xl p-8 border border-border"
        >
          <h3 className="mb-4">Study Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chart-1 text-white flex items-center justify-center">
                1
              </div>
              <div>
                <h4 className="mb-1">Choose a Paper</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between Paper 1 algebra and analysis or Paper 2 geometry and statistics.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chart-2 text-white flex items-center justify-center">
                2
              </div>
              <div>
                <h4 className="mb-1">Follow the Roadmap</h4>
                <p className="text-sm text-muted-foreground">
                  Move through grade-appropriate modules with progress and unlock states.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chart-3 text-white flex items-center justify-center">
                3
              </div>
              <div>
                <h4 className="mb-1">Prepare for Exams</h4>
                <p className="text-sm text-muted-foreground">
                  Use analytics and Grade 12 past papers to sharpen exam readiness.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
      <ChatbotMascot />
    </>
  );
}
