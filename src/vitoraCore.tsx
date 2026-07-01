import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';
import {
  LayoutDashboard, Dumbbell, Apple, Scale, Bot, BarChart3, Flame, Bell,
  Moon, Sun, Droplet, Plus, X, Check, ChevronRight, ChevronLeft, Target,
  TrendingUp, TrendingDown, Activity, Heart, Award, Trophy, Zap, Star,
  Calendar, Clock, Search, Filter, Heart as HeartIcon, Settings, Edit,
  Trash2, Save, Play, Pause, RotateCcw, Coffee, Utensils, Bed, Sparkles,
  Footprints, Crown, Medal, Droplets, Sunrise, Moon as MoonIcon, Bot as BotIcon,
  Wrench, ListChecks, Scale as ScaleIcon, HeartPulse, Apple as AppleIcon,
  ChevronDown, Info, AlertCircle, CheckCircle2, Lock, ArrowRight, ArrowLeft,
  RefreshCw, Download, Camera, Image as ImageIcon, Send, MessageSquare,
  Brain, Gauge, Layers, Timer, Volume2, VolumeX, MoreVertical, Eye, EyeOff,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import {
  EXERCISES, FOODS, QUOTES, WORKOUT_PLANS, MEAL_PLANS, ACHIEVEMENTS,
  LEVELS, getLevel, MUSCLE_COLORS, todayStr, dateStr, daysAgo,
  type Exercise, type Food, type WorkoutPlan, type MealPlan, type Achievement,
} from './vitoraData';

// ============ TYPES ============
interface UserProfile {
  name: string;
  avatarColor: string;
  goal: 'lose' | 'build' | 'endurance' | 'healthy' | 'flexibility';
  age: number;
  height: number; // cm
  weight: number; // kg
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
  targetWeight: number;
  deadline: string;
  focusAreas: string[];
  gender: 'male' | 'female';
  unit: 'metric' | 'imperial';
  onboarded: boolean;
}

interface FoodLog {
  id: string;
  date: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servings: number;
}

interface WaterLog { date: string; cups: number; }
interface WeightLog { date: string; weight: number; }
interface WorkoutLog {
  id: string;
  date: string;
  name: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  volume: number;
  exercises: { exerciseId: string; name: string; sets: { weight: number; reps: number; completed: boolean }[] }[];
  xpEarned: number;
  completed: boolean;
}
interface CustomWorkout {
  id: string; name: string; type: string; exercises: { exerciseId: string; sets: number; reps: number; weight: number; duration: number }[];
}
interface SleepLog { date: string; bedtime: string; wakeTime: string; duration: number; quality: number; }
interface BodyMeasurement {
  id: string; date: string; weight: number; bodyFat: number; muscleMass: number;
  chest: number; waist: number; hips: number; arms: number; thighs: number; calves: number;
  photo?: string;
}
interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp: number; }
interface AppState {
  profile: UserProfile | null;
  foodLogs: FoodLog[];
  waterLogs: WaterLog[];
  weightLogs: WeightLog[];
  workoutLogs: WorkoutLog[];
  customWorkouts: CustomWorkout[];
  sleepLogs: SleepLog[];
  bodyMeasurements: BodyMeasurement[];
  favoriteExercises: string[];
  favoriteFoods: string[];
  recentFoods: string[];
  chatHistory: ChatMessage[];
  xp: number;
  unlockedAchievements: string[];
  activePlan: string | null;
  planWeek: number;
  steps: { date: string; count: number }[];
  activeMinutes: { date: string; count: number }[];
  theme: 'dark' | 'light';
  notifications: { id: string; text: string; read: boolean; date: string }[];
}

// ============ STORAGE HOOK ============
const STORAGE_KEY = 'vitora_state_v1';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

function useAppState() {
  const [state, setState] = useState<Partial<AppState>>(() => {
    const loaded = loadState();
    return {
      foodLogs: [], waterLogs: [], weightLogs: [], workoutLogs: [],
      customWorkouts: [], sleepLogs: [], bodyMeasurements: [],
      favoriteExercises: [], favoriteFoods: [], recentFoods: [],
      chatHistory: [], xp: 0, unlockedAchievements: [], planWeek: 1,
      steps: [], activeMinutes: [], theme: 'dark', notifications: [],
      ...loaded,
    };
  });

  const writeTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded');
        }
      }
    }, 300);
  }, [state]);

  const update = useCallback((patch: Partial<AppState> | ((prev: Partial<AppState>) => Partial<AppState>)) => {
    setState(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  return { state, update };
}

// ============ CALCULATIONS ============
function calcBMI(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Healthy', color: '#10b981' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
  return { label: 'Obese', color: '#ef4444' };
}

function calcBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9,
};

const GOAL_MULTIPLIERS: Record<string, number> = {
  lose: 0.8, build: 1.1, endurance: 1.0, healthy: 1.0, flexibility: 0.95,
};

function calcCalorieTarget(profile: UserProfile): number {
  const bmr = calcBMR(profile);
  const tdee = bmr * (ACTIVITY_FACTORS[profile.activity] || 1.2);
  return Math.round(tdee * (GOAL_MULTIPLIERS[profile.goal] || 1.0));
}

function calcMacros(calories: number, goal: string) {
  let proteinRatio = 0.3, carbRatio = 0.4, fatRatio = 0.3;
  if (goal === 'lose') { proteinRatio = 0.4; carbRatio = 0.3; fatRatio = 0.3; }
  if (goal === 'build') { proteinRatio = 0.3; carbRatio = 0.45; fatRatio = 0.25; }
  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
  };
}

function calcWaterGoal(weightKg: number): number {
  return Math.round((weightKg * 35) / 240); // cups of 240ml
}

function idealWeightRange(heightCm: number, gender: string): { min: number; max: number } {
  const inches = heightCm / 2.54;
  const base = gender === 'male' ? 50 : 45.5;
  const kg = base + 2.3 * Math.max(0, inches - 60);
  return { min: Math.round(kg * 0.9), max: Math.round(kg * 1.1) };
}

function bodyFatCategory(bf: number, gender: string): { label: string; color: string } {
  if (gender === 'male') {
    if (bf < 6) return { label: 'Essential', color: '#3b82f6' };
    if (bf < 14) return { label: 'Athlete', color: '#10b981' };
    if (bf < 18) return { label: 'Fitness', color: '#22c55e' };
    if (bf < 25) return { label: 'Average', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  }
  if (bf < 14) return { label: 'Essential', color: '#3b82f6' };
  if (bf < 21) return { label: 'Athlete', color: '#10b981' };
  if (bf < 25) return { label: 'Fitness', color: '#22c55e' };
  if (bf < 32) return { label: 'Average', color: '#f59e0b' };
  return { label: 'Obese', color: '#ef4444' };
}

// ============ CONFETTI ============
function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  const fire = useCallback(() => {
    setActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#10b981', '#7c3aed', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rot: number; vrot: number }[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, rot: Math.random() * 360, vrot: (Math.random() - 0.5) * 10,
      });
    }
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.rot += p.vrot;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(animate);
      else { setActive(false); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    };
    animate();
  }, []);

  return { canvasRef, active, fire };
}

// ============ TOAST ============
function useToast() {
  const [toasts, setToasts] = useState<{ id: string; text: string; type: string }[]>([]);
  const show = useCallback((text: string, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

// ============ AVATAR COLORS ============
const AVATAR_COLORS = [
  '#10b981', '#7c3aed', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899',
  '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

const GOAL_LABELS: Record<string, string> = {
  lose: 'Lose Weight', build: 'Build Muscle', endurance: 'Improve Endurance',
  healthy: 'Stay Healthy', flexibility: 'Flexibility',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary (little exercise)',
  light: 'Light (1-3 days/week)',
  moderate: 'Moderate (3-5 days/week)',
  active: 'Active (6-7 days/week)',
  very: 'Very Active (2x/day)',
};

const FOCUS_AREAS = ['Strength', 'Cardio', 'Flexibility', 'Nutrition', 'Sleep', 'Stress'];

// ============ ONBOARDING ============
function Onboarding({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [goal, setGoal] = useState<UserProfile['goal']>('build');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState<UserProfile['activity']>('moderate');
  const [gender, setGender] = useState<UserProfile['gender']>('male');
  const [targetWeight, setTargetWeight] = useState(70);
  const [deadline, setDeadline] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>(['Strength']);

  const steps = ['Profile', 'Goal', 'Stats', 'Target', 'Focus'];
  const bmi = calcBMI(weight, height);
  const bmiCat = bmiCategory(bmi);
  const bmr = calcBMR({ name, avatarColor, goal, age, height, weight, activity, targetWeight, deadline, focusAreas, gender, unit: 'metric', onboarded: true });
  const calorieTarget = calcCalorieTarget({ name, avatarColor, goal, age, height, weight, activity, targetWeight, deadline, focusAreas, gender, unit: 'metric', onboarded: true });
  const macros = calcMacros(calorieTarget, goal);

  const toggleFocus = (area: string) => {
    setFocusAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : prev.length < 3 ? [...prev, area] : prev);
  };

  const finish = () => {
    onComplete({ name, avatarColor, goal, age, height, weight, activity, targetWeight, deadline, focusAreas, gender, unit: 'metric', onboarded: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Vitora</span>
          </div>
          <p className="text-slate-400 text-sm">Your AI-powered health & fitness companion</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-500' : 'bg-slate-700'}`} />
              <p className={`text-xs mt-1 ${i <= step ? 'text-brand-400' : 'text-slate-500'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 animate-fade-in">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Welcome! Let's set up your profile</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                  className="w-full bg-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Avatar Color</label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} onClick={() => setAvatarColor(c)}
                      className={`w-10 h-10 rounded-full transition-all ${avatarColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Gender</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 py-3 rounded-xl capitalize transition-all ${gender === g ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">What's your primary goal?</h2>
              <div className="space-y-2">
                {Object.entries(GOAL_LABELS).map(([key, label]) => (
                  <button key={key} onClick={() => setGoal(key as UserProfile['goal'])}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${goal === key ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    <span className="font-medium">{label}</span>
                    {goal === key && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your current stats</h2>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Age</label>
                  <input type="number" value={age} onChange={e => setAge(+e.target.value)}
                    className="w-full bg-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(+e.target.value)}
                    className="w-full bg-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(+e.target.value)}
                    className="w-full bg-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Activity Level</label>
                <div className="space-y-2">
                  {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => setActivity(key as UserProfile['activity'])}
                      className={`w-full text-left p-3 rounded-xl transition-all text-sm ${activity === key ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Live calc preview */}
              <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-400">BMI</span><span style={{ color: bmiCat.color }} className="font-semibold">{bmi.toFixed(1)} · {bmiCat.label}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">BMR</span><span className="font-semibold">{bmr} kcal</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Daily Target</span><span className="font-semibold text-brand-400">{calorieTarget} kcal</span></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Set your target (optional)</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Target Weight (kg)</label>
                <input type="number" value={targetWeight} onChange={e => setTargetWeight(+e.target.value)}
                  className="w-full bg-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Deadline (optional)</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-brand-500" />
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
                <p className="text-sm text-slate-400 mb-2">Recommended Daily Macros</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-700 rounded-lg p-2"><p className="text-xs text-slate-400">Protein</p><p className="font-bold text-brand-400">{macros.protein}g</p></div>
                  <div className="bg-slate-700 rounded-lg p-2"><p className="text-xs text-slate-400">Carbs</p><p className="font-bold text-amber-400">{macros.carbs}g</p></div>
                  <div className="bg-slate-700 rounded-lg p-2"><p className="text-xs text-slate-400">Fat</p><p className="font-bold text-blue-400">{macros.fat}g</p></div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Pick 3 focus areas</h2>
              <p className="text-sm text-slate-400">Choose what matters most to you</p>
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_AREAS.map(area => (
                  <button key={area} onClick={() => toggleFocus(area)}
                    className={`p-4 rounded-xl transition-all flex items-center justify-between ${focusAreas.includes(area) ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    <span className="font-medium">{area}</span>
                    {focusAreas.includes(area) && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">{focusAreas.length}/3 selected</p>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-5 py-3 rounded-xl bg-slate-700 text-slate-300 press">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !name}
                className="flex-1 flex items-center justify-center gap-1 px-5 py-3 rounded-xl bg-brand-500 text-white font-medium press disabled:opacity-50">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finish}
                className="flex-1 flex items-center justify-center gap-1 px-5 py-3 rounded-xl bg-brand-500 text-white font-medium press">
                Start My Journey <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { type UserProfile, type AppState, type FoodLog, type WorkoutLog, type BodyMeasurement, type ChatMessage, type SleepLog, type CustomWorkout, type WaterLog, type WeightLog, type Exercise, type Food, type WorkoutPlan, type MealPlan, type Achievement };
export { useAppState, useConfetti, useToast, calcBMI, bmiCategory, calcBMR, calcCalorieTarget, calcMacros, calcWaterGoal, idealWeightRange, bodyFatCategory, AVATAR_COLORS, GOAL_LABELS, ACTIVITY_LABELS, FOCUS_AREAS, Onboarding, todayStr, daysAgo, dateStr, getLevel, EXERCISES, FOODS, QUOTES, WORKOUT_PLANS, MEAL_PLANS, ACHIEVEMENTS, LEVELS, MUSCLE_COLORS };
