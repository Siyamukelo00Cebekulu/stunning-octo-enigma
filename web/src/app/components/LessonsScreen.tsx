import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Clock, Layers, Lock, Play, Star } from 'lucide-react';
import {
  getGradeNumber,
  getTopicsForGradeAndPaper,
  paperDefinitions,
  type PaperId,
  type TopicDifficulty
} from '../data/curriculum';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: TopicDifficulty;
  category: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
}

interface LessonsScreenProps {
  userGrade?: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
}

const paperOrder: PaperId[] = ['paper1', 'paper2'];

export function LessonsScreen({ userGrade, onBack, onSelectLesson }: LessonsScreenProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperId>('paper1');
  const gradeNumber = getGradeNumber(userGrade);

  const lessons = useMemo<Lesson[]>(() => {
    return getTopicsForGradeAndPaper(gradeNumber, selectedPaper).map((topic, index) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      duration: topic.duration,
      difficulty: topic.difficulty,
      category: paperDefinitions[selectedPaper].subtitle,
      status: index === 0 ? 'completed' : index === 1 ? 'in-progress' : 'locked',
      progress: index === 0 ? 100 : index === 1 ? 55 : undefined
    }));
  }, [gradeNumber, selectedPaper]);

  const getDifficultyColor = (difficulty: TopicDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-secondary';
    }
  };

  const completedCount = lessons.filter((lesson) => lesson.status === 'completed').length;
  const totalCount = lessons.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-5">
            <div>
              <h1 className="mb-2">Grade {gradeNumber} Lessons</h1>
              <p className="text-muted-foreground">
                CAPS, IEB, and Cambridge-aligned mathematics modules by examination paper.
              </p>
            </div>

            <div className="flex rounded-xl bg-secondary p-1 w-full sm:w-auto">
              {paperOrder.map((paper) => (
                <button
                  key={paper}
                  onClick={() => setSelectedPaper(paper)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                    selectedPaper === paper
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {paperDefinitions[paper].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 bg-card rounded-xl p-6 border border-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-chart-1" />
                <h3>{paperDefinitions[selectedPaper].subtitle}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {paperDefinitions[selectedPaper].description}
              </p>
            </div>
            <div className="md:text-right">
              <div className="text-sm text-muted-foreground mb-2">Overall Progress</div>
              <div className="text-sm">
                {completedCount} / {totalCount} completed
              </div>
            </div>
            <div className="md:col-span-2 w-full bg-secondary rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2">{lessons[0]?.category}</h2>
          <p className="text-sm text-muted-foreground">
            Complete lessons in order to unlock the next module.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, index) => {
            const isLocked = lesson.status === 'locked';
            const isCompleted = lesson.status === 'completed';
            const isInProgress = lesson.status === 'in-progress';

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isLocked && onSelectLesson(lesson.id)}
                disabled={isLocked}
                className={`text-left bg-card rounded-xl p-6 border border-border shadow-lg transition-all ${
                  isLocked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{lesson.title}</h3>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </p>
                  </div>
                  {isLocked && (
                    <Lock className="w-6 h-6 text-muted-foreground ml-4 flex-shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  {isInProgress && (
                    <div className="flex items-center gap-1 text-sm text-chart-1">
                      <Star className="w-4 h-4" />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>

                {(isInProgress || isCompleted) && lesson.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{lesson.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-chart-1 to-chart-2 transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!isLocked && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isCompleted ? 'Review Lesson' : isInProgress ? 'Continue' : 'Start Lesson'}
                    </span>
                    <Play className="w-5 h-5 text-chart-1" />
                  </div>
                )}

                {isLocked && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Complete previous lessons to unlock
                    </p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
