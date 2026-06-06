import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, GraduationCap, Trophy, ArrowLeft, Edit2, Save, Award, Star, TrendingUp } from 'lucide-react';
import { gradeOptions } from '../data/curriculum';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  grade: string;
  assessmentScore: number;
  assessmentLevel: 'beginner' | 'intermediate' | 'advanced';
  completedAssessment: boolean;
}

interface ProfileManagementProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onBack: () => void;
  onRetakeAssessment: () => void;
  onResetProgress: () => void;
  onDeleteAccount: () => void;
}

export function ProfileManagement({
  profile,
  onUpdate,
  onBack,
  onRetakeAssessment,
  onResetProgress,
  onDeleteAccount
}: ProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Assessment Score',
      value: profile.assessmentScore,
      color: 'text-chart-1'
    },
    {
      icon: Star,
      label: 'Current Level',
      value: profile.assessmentLevel,
      color: 'text-chart-2'
    },
    {
      icon: TrendingUp,
      label: 'Grade',
      value: profile.grade,
      color: 'text-chart-3'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="mb-1">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your account information</p>
                  </div>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-xl bg-secondary/50">{profile.name}</div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-secondary/50 text-muted-foreground">
                    {profile.email}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                      min="5"
                      max="100"
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-xl bg-secondary/50">{profile.age} years old</div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <GraduationCap className="w-4 h-4" />
                    Grade Level
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.grade}
                      onChange={(e) => setEditedProfile({ ...editedProfile, grade: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-3 rounded-xl bg-secondary/50">{profile.grade}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h3>Your Progress</h3>
              </div>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm opacity-90">{stat.label}</span>
                      </div>
                      <div className="text-2xl capitalize">{stat.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h4 className="mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={onRetakeAssessment}
                  className="w-full px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-left transition-colors"
                >
                  Retake Assessment
                </button>
                <button
                  onClick={onResetProgress}
                  className="w-full px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-left transition-colors"
                >
                  Reset Progress
                </button>
                <button
                  onClick={onDeleteAccount}
                  className="w-full px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-left transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
