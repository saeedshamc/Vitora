import { useState, useMemo } from 'react';
import {
  Flame, Droplet, Footprints, Activity, Plus, Apple, Dumbbell, Scale,
  TrendingUp, Clock, Heart, Coffee, Utensils, Target, Sparkles, ChevronRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { RingChart, WaterBottle, StatCard, Modal } from './vitoraUI';
import { QUOTES, todayStr, daysAgo, type UserProfile, type AppState } from './vitoraCore';

interface DashboardProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  onNavigate: (m: string) => void;
  onQuickLog: (type: string) => void;
  toast: (text: string, type?: string) => void;
}

export function Dashboard({ profile, state, update, onNavigate, onQuickLog, toast }: DashboardProps) {
  const today = todayStr();
  const calorieTarget = useMemo(() => {
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.gender === 'male' ? 5 : -161);
    const factors: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
    const mult: Record<string, number> = { lose: 0.8, build: 1.1, endurance: 1.0, healthy: 1.0, flexibility: 0.95 };
    return Math.round(bmr * (factors[profile.activity] || 1.2) * (mult[profile.goal] || 1.0));
  }, [profile]);

  const todayFoods = state.foodLogs?.filter(f => f.date === today) || [];
  const consumed = todayFoods.reduce((s, f) => s + f.calories * f.servings, 0);
  const protein = todayFoods.reduce((s, f) => s + f.protein * f.servings, 0);
  const carbs = todayFoods.reduce((s, f) => s + f.carbs * f.servings, 0);
  const fat = todayFoods.reduce((s, f) => s + f.fat * f.servings, 0);

  const waterGoal = Math.round((profile.weight * 35) / 240);
  const todayWater = state.waterLogs?.find(w => w.date === today)?.cups || 0;

  const todaySteps = state.steps?.find(s => s.date === today)?.count || 0;
  const todayActive = state.activeMinutes?.find(a => a.date === today)?.count || 0;

  // Streak calculation
  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = daysAgo(i);
      const hasActivity = (state.workoutLogs?.some(w => w.date === d) || false) ||
        (state.foodLogs?.some(f => f.date === d) || false) ||
        (state.waterLogs?.some(w => w.date === d && w.cups > 0) || false);
      if (hasActivity) s++;
      else if (i > 0) break;
    }
    return s;
  }, [state.workoutLogs, state.foodLogs, state.waterLogs]);

  // Weekly XP
  const weekAgo = daysAgo(7);
  const weeklyXp = useMemo(() => {
    return (state.workoutLogs?.filter(w => w.date >= weekAgo).reduce((s, w) => s + (w.xpEarned || 0), 0) || 0) + 50;
  }, [state.workoutLogs]);

  // Weight trend 14 days
  const weightData = useMemo(() => {
    const data: { date: string; weight: number | null }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = daysAgo(i);
      const log = state.weightLogs?.filter(w => w.date <= d).sort((a, b) => b.date.localeCompare(a.date))[0];
      data.push({ date: d.slice(5), weight: log?.weight || null });
    }
    return data;
  }, [state.weightLogs]);

  // Daily quote
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  // Recovery status
  const lastWorkout = state.workoutLogs?.filter(w => w.completed).sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastSleep = state.sleepLogs?.[state.sleepLogs.length - 1];
  const recoveryScore = useMemo(() => {
    let score = 70;
    if (lastSleep) {
      score = (lastSleep.duration / 8) * 40 + (lastSleep.quality / 5) * 30;
    }
    if (lastWorkout) {
      const daysSince = Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / 86400000);
      if (daysSince < 1) score -= 15;
      if (daysSince > 2) score += 10;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
  }, [lastWorkout, lastSleep]);

  const remaining = Math.max(0, calorieTarget - consumed);
  const macros = { protein: Math.round((calorieTarget * 0.3) / 4), carbs: Math.round((calorieTarget * 0.4) / 4), fat: Math.round((calorieTarget * 0.3) / 9) };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hi, {profile.name}!</h1>
          <p className="text-sm text-slate-500">Let's make today count</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Recovery</p>
          <p className={`text-lg font-bold ${recoveryScore > 70 ? 'text-brand-500' : recoveryScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>{recoveryScore}%</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover flex flex-col items-center">
          <RingChart value={consumed} max={calorieTarget} size={90} stroke={8} color="#10b981"
            label={`${Math.round(consumed)}`} sublabel={`${calorieTarget} kcal`} />
          <p className="text-xs text-slate-500 mt-1">Calories</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover flex flex-col items-center justify-center">
          <WaterBottle cups={todayWater} goal={waterGoal} size={70} />
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{todayWater}/{waterGoal}</p>
          <p className="text-xs text-slate-500">Water</p>
        </div>
        <StatCard icon={<Footprints className="w-5 h-5" />} label="Steps" value={todaySteps.toLocaleString()} sub="Goal: 10,000" color="#3b82f6" onClick={() => onQuickLog('steps')} />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Active min" value={todayActive} sub="Goal: 30" color="#f59e0b" onClick={() => onQuickLog('activity')} />
      </div>

      {/* Streak + XP row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5" />
            <span className="text-sm opacity-90">Current Streak</span>
          </div>
          <p className="text-3xl font-bold">{streak} <span className="text-lg font-normal">days</span></p>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm opacity-90">Weekly XP</span>
          </div>
          <p className="text-3xl font-bold">+{weeklyXp}</p>
        </div>
      </div>

      {/* Quick log bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <QuickLogBtn icon={<Droplet className="w-4 h-4" />} label="+Water" color="#0ea5e9" onClick={() => onQuickLog('water')} />
          <QuickLogBtn icon={<Utensils className="w-4 h-4" />} label="+Meal" color="#10b981" onClick={() => onQuickLog('meal')} />
          <QuickLogBtn icon={<Dumbbell className="w-4 h-4" />} label="+Workout" color="#7c3aed" onClick={() => onQuickLog('workout')} />
          <QuickLogBtn icon={<Scale className="w-4 h-4" />} label="+Weight" color="#f59e0b" onClick={() => onQuickLog('weight')} />
        </div>
      </div>

      {/* Today's plan + meal suggestions */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white">Today's Workout</h3>
            <button onClick={() => onNavigate('workout')} className="text-xs text-brand-500 flex items-center">View <ChevronRight className="w-3 h-3" /></button>
          </div>
          {state.activePlan ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">{state.activePlan} plan · Week {state.planWeek}</p>
              <button onClick={() => onNavigate('workout')} className="w-full bg-brand-500 text-white py-2.5 rounded-xl font-medium press flex items-center justify-center gap-2">
                <Dumbbell className="w-4 h-4" /> Start Workout
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-3">No plan selected yet</p>
              <button onClick={() => onNavigate('workout')} className="bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium press">Choose a Plan</button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Meal Suggestions</h3>
          <p className="text-xs text-slate-500 mb-2">{remaining} kcal remaining</p>
          <div className="space-y-1.5">
            {remaining > 200 ? (
              <>
                <MealSuggestion name="Grilled Chicken Salad" cals="320" />
                <MealSuggestion name="Greek Yogurt & Berries" cals="180" />
                <MealSuggestion name="Protein Smoothie" cals="250" />
              </>
            ) : (
              <p className="text-sm text-slate-500">You've hit your calorie target! Great job.</p>
            )}
          </div>
        </div>
      </div>

      {/* Weight trend mini chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 dark:text-white">Weight Trend (14 days)</h3>
          <button onClick={() => onNavigate('body')} className="text-xs text-brand-500 flex items-center">Details <ChevronRight className="w-3 h-3" /></button>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            {profile.targetWeight && <ReferenceLine y={profile.targetWeight} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Goal', fontSize: 10, fill: '#f59e0b' }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm italic leading-relaxed">"{quote}"</p>
            <p className="text-xs opacity-75 mt-2">Daily Motivation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLogBtn({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 press whitespace-nowrap">
      <span style={{ color }}>{icon}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    </button>
  );
}

function MealSuggestion({ name, cals }: { name: string; cals: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <span className="text-sm text-slate-700 dark:text-slate-200">{name}</span>
      <span className="text-xs text-slate-500">{cals} kcal</span>
    </div>
  );
}
