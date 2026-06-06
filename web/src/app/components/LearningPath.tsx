import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Lock, Star, Target, Trophy } from 'lucide-react';
import {
  getGradeNumber,
  getTopicsForGradeAndPaper,
  paperDefinitions,
  type PaperId
} from '../data/curriculum';

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  lessons: number;
  completedLessons: number;
  requiredScore?: number;
}

interface LearningPathProps {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userGrade?: string;
  onBack: () => void;
  onSelectNode: (nodeId: string) => void;
}

const paperOrder: PaperId[] = ['paper1', 'paper2'];

export function LearningPath({ userLevel, userGrade, onBack, onSelectNode }: LearningPathProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperId>('paper1');
  const gradeNumber = getGradeNumber(userGrade);

  const pathData = useMemo<PathNode[]>(() => {
    const currentIndex = userLevel === 'beginner' ? 0 : 1;

    return getTopicsForGradeAndPaper(gradeNumber, selectedPaper).map((topic, index) => {
      const status: PathNode['status'] =
        index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'locked';

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        status,
        lessons: topic.lessonCount,
        completedLessons:
          status === 'completed'
            ? topic.lessonCount
            : status === 'current'
            ? Math.max(1, Math.round(topic.lessonCount * 0.45))
            : 0,
        requiredScore: status === 'locked' ? 75 + (index * 5) : undefined
      };
    });
  }, [gradeNumber, selectedPaper, userLevel]);

  const totalLessons = pathData.reduce((sum, node) => sum + node.lessons, 0);
  const totalCompleted = pathData.reduce((sum, node) => sum + node.completedLessons, 0);
  const overallProgress = (totalCompleted / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
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
              <h1 className="mb-2">Grade {gradeNumber} Learning Path</h1>
              <p className="text-muted-foreground">
                Follow a structured roadmap for {paperDefinitions[selectedPaper].description}.
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

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-chart-1" />
                  <span className="capitalize">{userLevel} Path</span>
                </div>
                <h3>{paperDefinitions[selectedPaper].subtitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {paperDefinitions[selectedPaper].label}: {paperDefinitions[selectedPaper].description}
                </p>
              </div>
              <div className="md:text-right text-sm text-muted-foreground">
                {totalCompleted} / {totalLessons} lessons completed
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm">{overallProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {pathData.map((node, index) => {
              const progress = (node.completedLessons / node.lessons) * 100;
              const isLocked = node.status === 'locked';
              const isCurrent = node.status === 'current';
              const isCompleted = node.status === 'completed';

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute left-0 top-6 -translate-x-1/2">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-background ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-gradient-to-r from-chart-1 to-chart-2'
                          : 'bg-secondary'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : isCurrent ? (
                        <Target className="w-8 h-8 text-white" />
                      ) : (
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="ml-24">
                    <button
                      onClick={() => !isLocked && onSelectNode(node.id)}
                      disabled={isLocked}
                      className={`w-full text-left bg-card rounded-xl p-6 border border-border shadow-lg transition-all ${
                        isLocked
                          ? 'opacity-60 cursor-not-allowed'
                          : 'hover:shadow-xl hover:scale-[1.02]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="mb-2">{node.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {node.description}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-xs">
                            In Progress
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {node.completedLessons} / {node.lessons} lessons
                          </span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>

                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-chart-1 to-chart-2 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {isLocked && node.requiredScore && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-4 h-4" />
                            <span>Requires {node.requiredScore}% on previous module</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-xl p-8 border border-border text-center">
          <h3 className="mb-3">Keep Going</h3>
          <p className="text-muted-foreground mb-4">
            Complete your current {paperDefinitions[selectedPaper].label} module to unlock the next challenge.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Trophy className="w-5 h-5 text-chart-1" />
            <span>Earn badges and certificates as you progress through Grade {gradeNumber}.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
