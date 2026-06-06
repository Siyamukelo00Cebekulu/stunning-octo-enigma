import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, TrendingDown, Target, Award, Calendar, BarChart3, PieChart, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RePieChart, Pie, Cell } from 'recharts';

interface AnalyticsFeedbackProps {
  userName: string;
  onBack: () => void;
}

export function AnalyticsFeedback({ userName, onBack }: AnalyticsFeedbackProps) {
  const weeklyProgress = [
    { id: 'mon', day: 'Mon', problems: 12, timeSpent: 25 },
    { id: 'tue', day: 'Tue', problems: 15, timeSpent: 32 },
    { id: 'wed', day: 'Wed', problems: 8, timeSpent: 18 },
    { id: 'thu', day: 'Thu', problems: 18, timeSpent: 40 },
    { id: 'fri', day: 'Fri', problems: 22, timeSpent: 45 },
    { id: 'sat', day: 'Sat', problems: 10, timeSpent: 22 },
    { id: 'sun', day: 'Sun', problems: 14, timeSpent: 28 }
  ];

  const topicDistribution = [
    { id: 'algebra', name: 'Algebra', value: 35, color: '#6366f1' },
    { id: 'geometry', name: 'Geometry', value: 25, color: '#8b5cf6' },
    { id: 'calculus', name: 'Calculus', value: 20, color: '#ec4899' },
    { id: 'logic', name: 'Logic', value: 20, color: '#10b981' }
  ];

  const accuracyTrend = [
    { id: 'week1', week: 'Week 1', accuracy: 65 },
    { id: 'week2', week: 'Week 2', accuracy: 72 },
    { id: 'week3', week: 'Week 3', accuracy: 78 },
    { id: 'week4', week: 'Week 4', accuracy: 85 }
  ];

  const stats = [
    {
      label: 'Problems Solved',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-chart-1'
    },
    {
      label: 'Average Accuracy',
      value: '85%',
      change: '+7%',
      trend: 'up',
      icon: Award,
      color: 'text-chart-2'
    },
    {
      label: 'Study Streak',
      value: '12 days',
      change: 'Best: 18',
      trend: 'up',
      icon: Calendar,
      color: 'text-chart-3'
    },
    {
      label: 'Time This Week',
      value: '3.5 hrs',
      change: '-0.5 hrs',
      trend: 'down',
      icon: Clock,
      color: 'text-chart-4'
    }
  ];

  const strengths = [
    { topic: 'Linear Equations', accuracy: 92 },
    { topic: 'Basic Geometry', accuracy: 88 },
    { topic: 'Fractions', accuracy: 85 }
  ];

  const improvements = [
    { topic: 'Quadratic Equations', accuracy: 58 },
    { topic: 'Word Problems', accuracy: 62 },
    { topic: 'Complex Fractions', accuracy: 65 }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="mb-2">Learning Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement, {userName}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-chart-1" />
              <h3>Weekly Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyProgress} id="weekly-activity-chart">
                <defs>
                  <linearGradient id="barColorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="problems" fill="url(#barColorGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Topic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-chart-2" />
              <h3>Topic Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart id="topic-distribution-chart">
                <Pie
                  data={topicDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicDistribution.map((entry) => (
                    <Cell key={`topic-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Accuracy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-6 border border-border mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-chart-3" />
            <h3>Accuracy Improvement</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={accuracyTrend} id="accuracy-trend-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              Your Strengths
            </h3>
            <div className="space-y-4">
              {strengths.map((item) => (
                <div key={item.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{item.topic}</span>
                    <span className="text-sm text-green-600">{item.accuracy}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-yellow-600" />
              Focus Areas
            </h3>
            <div className="space-y-4">
              {improvements.map((item) => (
                <div key={item.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{item.topic}</span>
                    <span className="text-sm text-yellow-600">{item.accuracy}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-2xl p-8 border border-border"
        >
          <h3 className="mb-4">Personalized Recommendations</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-chart-1 mt-2" />
              <p>Focus on <strong>quadratic equations</strong> - spend 15 minutes daily on practice problems</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-chart-2 mt-2" />
              <p>Your study streak is great! Try to maintain consistency for better retention</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-chart-3 mt-2" />
              <p>You excel at <strong>linear equations</strong> - consider moving to advanced topics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
