import { useState } from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import { gradeOptions } from '../data/curriculum';

interface UserInfoFormProps {
  onComplete: (info: { name: string; age: number; grade: string }) => void;
}

export function UserInfoForm({ onComplete }: UserInfoFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age && grade) {
      onComplete({
        name,
        age: parseInt(age),
        grade
      });
    }
  };

  const isValid = name.trim() !== '' && age !== '' && grade !== '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-center mb-2">Welcome to MathGenius!</h2>
          <p className="text-center text-muted-foreground mb-8">
            Let's get to know you better to personalize your learning experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm">
                <Calendar className="w-4 h-4" />
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="5"
                max="100"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm">
                <GraduationCap className="w-4 h-4" />
                Current Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                required
              >
                <option value="">Select your grade</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue to Assessment
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Next, you'll take a quick assessment to determine your skill level
        </p>
      </motion.div>
    </div>
  );
}
