import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Trophy, Star, Flame, Zap, Award, Crown, Medal, Sparkles, Lock,
  TrendingUp, TrendingDown, Calendar, Target, Bed, HeartPulse, Bot,
  Footprints, Droplet, Droplets, Dumbbell, Apple, Moon, Sunrise, Wrench, ListChecks,
  Scale, Bot as BotIcon, Heart, CheckCircle2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Modal } from './vitoraUI';
import { ACHIEVEMENTS, getLevel, todayStr, daysAgo, type UserProfile, type AppState } from './vitoraCore';

interface InsightsProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  toast: (text: string, type?: string) => void;
  fireConfetti: () => void;
  addXp: (amount: number, reason: string) => void;
}

type Tab = 'gamification' | 'achievements' | 'analytics' | 'sleep';

export function Insights({ profile, state, update, toast, fireConfetti, addXp }: InsightsProps) {
  const [tab, setTab] = useState<Tab>('gamification');
  const [showLevelUp, setShowLevelUp] = useState<{ level: number; name: string } | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);

  // Check for level up
  const prevLevel = useRef(1);
  const currentLevel = getLevel(state.xp || 0);
  useEffect(() => {
    if (currentLevel.level > prevLevel.current) {
      setShowLevelUp({ level: currentLevel.level, name: currentLevel.levelName });
      fireConfetti();
      setTimeout(() => setShowLevelUp(null), 4000);
    }
    prevLevel.current = currentLevel.level;
  }, [currentLevel.level]);

  // Check achievements
  const unlocked = state.unlockedAchievements || [];
  const newlyUnlocked = useMemo(() => {
    const newOnes: string[] = [];
    const workoutCount = (state.workoutLogs || []).length;
    const prCount = (state.workoutLogs || []).reduce((s: number, w: any) => s + w.exercises.reduce((ss: number, ex: any) => ss + ex.sets.filter((set: any) => set.completed && set.weight > 0).length, 0), 0);
    const xp = state.xp || 0;

    const checks: Record<string, boolean> = {
      a1: workoutCount >= 1, a2: workoutCount >= 5, a3: workoutCount >= 10, a4: workoutCount >= 25, a5: workoutCount >= 100,
      a12: prCount >= 1, a11: prCount >= 10,
      a17: currentLevel.level >= 5, a18: currentLevel.level >= 10, a19: currentLevel.level >= 15, a20: currentLevel.level >= 20,
      a21: xp >= 1000, a22: xp >= 5000,
      a25: (state.customWorkouts || []).length > 0,
      a27: (state.chatHistory || []).length >= 10,
      a28: (state.sleepLogs || []).length >= 7,
    };

    Object.entries(checks).forEach(([id, met]) => { if (met && !unlocked.includes(id)) newOnes.push(id); });
    return newOnes;
  }, [state, currentLevel.level, unlocked]);

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      update((prev: any) => ({ unlockedAchievements: [...(prev.unlockedAchievements || []), ...newlyUnlocked] }));
      const ach = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
      if (ach) { setUnlockedAchievement(ach); fireConfetti(); setTimeout(() => setUnlockedAchievement(null), 4000); }
    }
  }, [newlyUnlocked]);

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {([['gamification', 'Level', <Zap className="w-4 h-4" />], ['achievements', 'Achievements', <Trophy className="w-4 h-4" />], ['analytics', 'Analytics', <TrendingUp className="w-4 h-4" />], ['sleep', 'Sleep', <Bed className="w-4 h-4" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${tab === key ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === 'gamification' && <Gamification state={state} currentLevel={currentLevel} />}
      {tab === 'achievements' && <Achievements state={state} />}
      {tab === 'analytics' && <AnalyticsDashboard profile={profile} state={state} />}
      {tab === 'sleep' && <SleepTracker state={state} update={update} toast={toast} addXp={addXp} />}

      {/* Level up modal */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 radial-burst">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Level Up!</h2>
            <p className="text-xl text-amber-400 mt-1">Level {showLevelUp.level} — {showLevelUp.name}</p>
          </div>
        </div>
      )}

      {/* Achievement unlock modal */}
      {unlockedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 radial-burst">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Achievement Unlocked!</h2>
            <p className="text-xl text-amber-400 mt-1">{unlockedAchievement.name}</p>
            <p className="text-sm text-slate-300 mt-1">{unlockedAchievement.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ GAMIFICATION ============
function Gamification({ state, currentLevel }: any) {
  const xp = state.xp || 0;
  const level = currentLevel;

  return (
    <div className="space-y-3">
      {/* Level card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-3xl font-bold">Level {level.level}</p>
            <p className="text-sm opacity-90">{level.levelName}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Crown className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{xp} XP</span>
            <span>{level.nextMin} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${level.progress * 100}%` }} />
          </div>
          <p className="text-xs opacity-75">{level.nextMin - xp} XP to next level</p>
        </div>
      </div>

      {/* XP breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">XP Earning</h3>
        <div className="space-y-2">
          {[
            { action: 'Log workout', xp: 50, icon: <Dumbbell className="w-4 h-4" /> },
            { action: 'Complete all sets', xp: 25, icon: <CheckCircle2 className="w-4 h-4" /> },
            { action: 'Log all meals', xp: 30, icon: <Apple className="w-4 h-4" /> },
            { action: 'Hit water goal', xp: 20, icon: <Droplet className="w-4 h-4" /> },
            { action: 'Log weight', xp: 10, icon: <Scale className="w-4 h-4" /> },
            { action: '7-day streak bonus', xp: 100, icon: <Flame className="w-4 h-4" /> },
          ].map(item => (
            <div key={item.action} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="text-brand-500">{item.icon}</span>
                <span className="text-sm">{item.action}</span>
              </div>
              <span className="text-sm font-bold text-amber-500">+{item.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level ladder */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Level Ladder</h3>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => {
            const lvl = i + 1;
            const isCurrent = lvl === level.level;
            const isPast = lvl < level.level;
            return (
              <div key={lvl} className={`flex items-center justify-between p-2 rounded-lg ${isCurrent ? 'bg-amber-500/20' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isPast ? 'bg-brand-500 text-white' : isCurrent ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{lvl}</span>
                  <span className={`text-sm ${isCurrent ? 'font-bold text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>{LEVEL_NAMES[i]}</span>
                </div>
                <span className="text-xs text-slate-400">{LEVEL_MIN_XP[i]} XP</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const LEVEL_NAMES = ['Beginner', 'Novice', 'Apprentice', 'Adept', 'Warrior', 'Athlete', 'Competitor', 'Fighter', 'Champion', 'Expert', 'Master', 'Veteran', 'Elite', 'Pro', 'All-Star', 'Superstar', 'Hero', 'Icon', 'Legend', 'Mythic'];
const LEVEL_MIN_XP = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];

// ============ ACHIEVEMENTS ============
function Achievements({ state }: any) {
  const unlocked = state.unlockedAchievements || [];
  const iconMap: Record<string, any> = {
    Footprints, TrendingUp, Calendar, Dumbbell, Trophy, Flame, Zap, Crown,
    Droplet, Droplets, Medal, Award, Target, Apple, Sunrise, Moon, Star,
    Sparkles, Scale, TrendingDown, Wrench, ListChecks, Bot, Bed, HeartPulse, Heart,
  };
  const tierColors: Record<string, string> = {
    bronze: 'from-amber-700 to-amber-900', silver: 'from-slate-400 to-slate-600',
    gold: 'from-amber-400 to-yellow-600', platinum: 'from-cyan-300 to-blue-500',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4">
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{unlocked.length}<span className="text-lg text-slate-400">/{ACHIEVEMENTS.length}</span></p>
          <p className="text-xs text-slate-500">Achievements Unlocked</p>
        </div>
        <Trophy className="w-8 h-8 text-amber-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlocked.includes(ach.id);
          const Icon = iconMap[ach.icon] || Star;
          return (
            <div key={ach.id} className={`rounded-2xl p-4 text-center ${isUnlocked ? `bg-gradient-to-br ${tierColors[ach.tier]} text-white` : 'bg-slate-100 dark:bg-slate-800'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isUnlocked ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {isUnlocked ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 text-slate-400" />}
              </div>
              <p className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</p>
              <p className={`text-xs mt-0.5 ${isUnlocked ? 'text-white/80' : 'text-slate-400'}`}>{ach.description}</p>
              {isUnlocked && <p className="text-xs text-white/60 mt-1 capitalize">{ach.tier}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ ANALYTICS DASHBOARD ============
function AnalyticsDashboard({ profile, state }: any) {
  const weekData = useMemo(() => {
    const thisWeek: { day: string; workouts: number; calories: number; water: number }[] = [];
    const lastWeek: { day: string; workouts: number; calories: number; water: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i); const dLast = daysAgo(i + 7);
      thisWeek.push({
        day: d.slice(5),
        workouts: (state.workoutLogs || []).filter((w: any) => w.date === d).length,
        calories: Math.round((state.foodLogs || []).filter((f: any) => f.date === d).reduce((s: number, f: any) => s + f.calories * f.servings, 0)),
        water: (state.waterLogs || []).find((w: any) => w.date === d)?.cups || 0,
      });
      lastWeek.push({
        day: dLast.slice(5),
        workouts: (state.workoutLogs || []).filter((w: any) => w.date === dLast).length,
        calories: Math.round((state.foodLogs || []).filter((f: any) => f.date === dLast).reduce((s: number, f: any) => s + f.calories * f.servings, 0)),
        water: (state.waterLogs || []).find((w: any) => w.date === dLast)?.cups || 0,
      });
    }
    return { thisWeek, lastWeek };
  }, [state]);

  const consistencyScore = useMemo(() => {
    let active = 0;
    for (let i = 0; i < 30; i++) {
      const d = daysAgo(i);
      if ((state.workoutLogs || []).some((w: any) => w.date === d) || (state.foodLogs || []).some((f: any) => f.date === d)) active++;
    }
    return Math.round((active / 30) * 100);
  }, [state]);

  const weightChange = useMemo(() => {
    const logs = [...(state.weightLogs || [])].sort((a: any, b: any) => a.date.localeCompare(b.date));
    if (logs.length < 2) return 0;
    return logs[logs.length - 1].weight - logs[0].weight;
  }, [state.weightLogs]);

  const totalWorkouts = (state.workoutLogs || []).length;
  const totalXp = state.xp || 0;
  const avgCal = Math.round(weekData.thisWeek.reduce((s, d) => s + d.calories, 0) / 7);
  const avgWater = Math.round(weekData.thisWeek.reduce((s, d) => s + d.water, 0) / 7);

  const compareData = weekData.thisWeek.map((tw, i) => ({
    day: tw.day, 'This Week': tw.workouts, 'Last Week': weekData.lastWeek[i].workouts,
  }));

  return (
    <div className="space-y-3">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <Dumbbell className="w-5 h-5 text-brand-500 mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalWorkouts}</p>
          <p className="text-xs text-slate-500">Total Workouts</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgCal}</p>
          <p className="text-xs text-slate-500">Avg kcal/day</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <Droplet className="w-5 h-5 text-sky-500 mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgWater}</p>
          <p className="text-xs text-slate-500">Avg water/day</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalXp}</p>
          <p className="text-xs text-slate-500">Total XP</p>
        </div>
      </div>

      {/* Consistency score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 dark:text-white">Consistency Score</h3>
          <span className={`text-2xl font-bold ${consistencyScore > 70 ? 'text-brand-500' : consistencyScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>{consistencyScore}</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${consistencyScore > 70 ? 'bg-brand-500' : consistencyScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${consistencyScore}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-1">Based on 30-day activity</p>
      </div>

      {/* Weight change */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Body Transformation</h3>
        <div className="flex items-center gap-2">
          {weightChange < 0 ? <TrendingDown className="w-5 h-5 text-brand-500" /> : <TrendingUp className="w-5 h-5 text-amber-500" />}
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg</p>
          <span className="text-sm text-slate-500">since start</span>
        </div>
      </div>

      {/* Week comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">This Week vs Last Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={compareData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="This Week" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Last Week" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============ SLEEP TRACKER ============
function SleepTracker({ state, update, toast, addXp }: any) {
  const [show, setShow] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(4);

  const save = () => {
    const bed = new Date(`2000-01-01T${bedtime}`);
    const wake = new Date(`2000-01-02T${wakeTime}`);
    const duration = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    const log = { date: todayStr(), bedtime, wakeTime, duration: Math.round(duration * 10) / 10, quality };
    update((prev: any) => ({ sleepLogs: [...(prev.sleepLogs || []), log] }));
    addXp(10, 'Sleep logged');
    toast('Sleep logged! +10 XP', 'success');
    setShow(false);
  };

  const sleepData = useMemo(() => {
    return [...(state.sleepLogs || [])].slice(-14).map((s: any) => ({
      date: s.date.slice(5), hours: s.duration, quality: s.quality,
    }));
  }, [state.sleepLogs]);

  const lastSleep = (state.sleepLogs || []).slice(-1)[0];
  const recoveryScore = lastSleep ? Math.round((lastSleep.duration / 8) * 50 + (lastSleep.quality / 5) * 50) : 0;

  const recoveryRec = recoveryScore > 75 ? 'Full workout OK' : recoveryScore > 50 ? 'Light activity recommended' : 'Rest day recommended';

  return (
    <div className="space-y-3">
      {lastSleep && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Recovery Score</h3>
            <span className={`text-2xl font-bold ${recoveryScore > 75 ? 'text-brand-500' : recoveryScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>{recoveryScore}</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${recoveryScore > 75 ? 'bg-brand-500' : recoveryScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${recoveryScore}%` }} />
          </div>
          <p className="text-sm text-slate-500 mt-2">{recoveryRec}</p>
        </div>
      )}

      <button onClick={() => setShow(true)} className="w-full py-3 bg-brand-500 text-white rounded-2xl font-medium press flex items-center justify-center gap-2">
        <Bed className="w-4 h-4" /> Log Sleep
      </button>

      {sleepData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">14-Day Sleep</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {sleepData.map((d, i) => <Cell key={i} fill={d.quality >= 4 ? '#10b981' : d.quality >= 3 ? '#f59e0b' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Log Sleep">
        <div className="space-y-3">
          <label className="text-sm text-slate-500">Bedtime <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
          <label className="text-sm text-slate-500">Wake Time <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
          <div>
            <p className="text-sm text-slate-500 mb-2">Quality</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(q => (
                <button key={q} onClick={() => setQuality(q)} className={`flex-1 py-2 rounded-xl ${quality === q ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  {q}★
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium press">Save</button>
        </div>
      </Modal>
    </div>
  );
}
