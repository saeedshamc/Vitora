import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Dumbbell, Apple, Scale, Bot, BarChart3, Flame, Bell,
  Moon, Sun, Droplet, Plus, X, Check, Activity, Settings, Sparkles,
} from 'lucide-react';
import {
  useAppState, useConfetti, useToast, Onboarding,
  type UserProfile, type AppState,
} from './vitoraCore';
import { ToastContainer, Modal, RingChart } from './vitoraUI';
import { Dashboard } from './vitoraDashboard';
import { Workout } from './vitoraWorkout';
import { Nutrition } from './vitoraNutrition';
import { BodyMetrics } from './vitoraBody';
import { AICoach } from './vitoraAI';
import { Insights } from './vitoraInsights';
import { getLevel, todayStr, FOODS } from './vitoraData';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'workout', label: 'Workout', icon: Dumbbell },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'body', label: 'Body', icon: Scale },
  { key: 'ai', label: 'AI Coach', icon: Bot },
  { key: 'insights', label: 'Insights', icon: BarChart3 },
] as const;

type ModuleKey = typeof MODULES[number]['key'];

export default function App() {
  const { state, update } = useAppState();
  const { canvasRef, fire } = useConfetti();
  const { toasts, show } = useToast();
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [quickLog, setQuickLog] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [slideDir, setSlideDir] = useState(1);

  const profile = state.profile as UserProfile | null;
  const isDark = state.theme !== 'light';

  // Theme effect
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // XP helper
  const addXp = useCallback((amount: number, reason: string) => {
    update((prev: any) => ({ xp: (prev.xp || 0) + amount }));
    show(`+${amount} XP — ${reason}`, 'success');
  }, [update, show]);

  // Onboarding
  if (!profile?.onboarded) {
    return (
      <Onboarding onComplete={(p) => { update({ profile: p }); show(`Welcome to Vitora, ${p.name}!`, 'success'); }} />
    );
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'w') setActiveModule('workout');
      if (e.key === 'n') setActiveModule('nutrition');
      if (e.key === 'd') setActiveModule('dashboard');
      if (e.key === 'a') setActiveModule('ai');
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') { e.preventDefault(); setQuickLog('menu'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Water reminder simulation
  useEffect(() => {
    const interval = setInterval(() => {
      show('Time to drink water!', 'info');
    }, 2 * 60 * 60 * 1000); // 2 hours
    return () => clearInterval(interval);
  }, []);

  const navigate = (m: string) => {
    const idx = MODULES.findIndex(mod => mod.key === activeModule);
    const newIdx = MODULES.findIndex(mod => mod.key === m);
    setSlideDir(newIdx > idx ? 1 : -1);
    setActiveModule(m as ModuleKey);
  };

  const level = getLevel(state.xp || 0);
  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const has = (state.workoutLogs?.some(w => w.date === ds) || false) || (state.foodLogs?.some(f => f.date === ds) || false);
      if (has) s++; else if (i > 0) break;
    }
    return s;
  }, [state.workoutLogs, state.foodLogs]);

  const notifications = state.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />
      <ToastContainer toasts={toasts} />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col p-4 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Vitora</span>
        </div>
        <nav className="flex-1 space-y-1">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.key} onClick={() => navigate(m.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeModule === m.key ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <Icon className="w-5 h-5" /> {m.label}
              </button>
            );
          })}
        </nav>
        <button onClick={() => update({ theme: isDark ? 'light' : 'dark' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Streak */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-orange-500/10 px-2.5 py-1.5 rounded-xl">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-500">{streak}</span>
              </div>
            </div>

            {/* XP bar */}
            <div className="flex-1 mx-4 max-w-xs hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Lv{level.level}</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700" style={{ width: `${level.progress * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500">{state.xp || 0}</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <button onClick={() => update({ theme: isDark ? 'light' : 'dark' })} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden">
                {isDark ? <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              </button>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: profile.avatarColor }}>
                {profile.name[0]?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Notifications dropdown */}
          {showNotifs && (
            <div className="absolute right-4 top-14 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 animate-scale-in">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No notifications</p>
              ) : (
                notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                    <p className="text-xs text-slate-400">{n.date}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </header>

        {/* Module content */}
        <main className="p-4 max-w-4xl mx-auto">
          <div key={activeModule} className="module-enter">
            {activeModule === 'dashboard' && <Dashboard profile={profile} state={state as AppState} update={update} onNavigate={navigate} onQuickLog={setQuickLog} toast={show} />}
            {activeModule === 'workout' && <Workout profile={profile} state={state as AppState} update={update} toast={show} fireConfetti={fire} addXp={addXp} />}
            {activeModule === 'nutrition' && <Nutrition profile={profile} state={state as AppState} update={update} toast={show} addXp={addXp} />}
            {activeModule === 'body' && <BodyMetrics profile={profile} state={state as AppState} update={update} toast={show} addXp={addXp} />}
            {activeModule === 'ai' && <AICoach profile={profile} state={state as AppState} update={update} toast={show} />}
            {activeModule === 'insights' && <Insights profile={profile} state={state as AppState} update={update} toast={show} fireConfetti={fire} addXp={addXp} />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30">
        <div className="flex justify-around items-center py-2">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.key} onClick={() => navigate(m.key)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${activeModule === m.key ? 'text-brand-500' : 'text-slate-400'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick log modal */}
      <QuickLogModal type={quickLog} onClose={() => setQuickLog(null)} state={state} update={update} toast={show} addXp={addXp} profile={profile} />
    </div>
  );
}

// ============ QUICK LOG MODAL ============
function QuickLogModal({ type, onClose, state, update, toast, addXp, profile }: any) {
  if (!type) return null;

  // Menu (when triggered by Cmd+L)
  if (type === 'menu') {
    return (
      <Modal open={true} onClose={onClose} title="Quick Log">
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'water', label: 'Water', icon: Droplet, color: '#0ea5e9' },
            { key: 'meal', label: 'Meal', icon: Apple, color: '#10b981' },
            { key: 'workout', label: 'Workout', icon: Dumbbell, color: '#7c3aed' },
            { key: 'weight', label: 'Weight', icon: Scale, color: '#f59e0b' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={() => { onClose(); setTimeout(() => { /* re-open with specific type */ }, 100); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 press">
                <Icon className="w-6 h-6" style={{ color: item.color }} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    );
  }

  return <SpecificQuickLog type={type} onClose={onClose} state={state} update={update} toast={toast} addXp={addXp} profile={profile} />;
}

function SpecificQuickLog({ type, onClose, state, update, toast, addXp, profile }: any) {
  const [weight, setWeight] = useState(profile.weight);
  const [steps, setSteps] = useState(0);
  const [activeMin, setActiveMin] = useState(0);
  const [foodSearch, setFoodSearch] = useState('');
  const today = todayStr();

  const logWater = () => {
    const newCups = ((state.waterLogs || []).find((w: any) => w.date === today)?.cups || 0) + 1;
    update((prev: any) => {
      const logs = [...(prev.waterLogs || [])];
      const idx = logs.findIndex(w => w.date === today);
      if (idx >= 0) logs[idx].cups = newCups; else logs.push({ date: today, cups: newCups });
      return { waterLogs: logs };
    });
    toast('+1 cup water', 'success');
    onClose();
  };

  const logWeight = () => {
    update((prev: any) => ({ weightLogs: [...(prev.weightLogs || []), { date: today, weight }] }));
    addXp(10, 'Weight logged');
    onClose();
  };

  const logSteps = () => {
    update((prev: any) => {
      const logs = [...(prev.steps || [])];
      const idx = logs.findIndex(s => s.date === today);
      if (idx >= 0) logs[idx].count = steps; else logs.push({ date: today, count: steps });
      return { steps: logs };
    });
    toast('Steps logged', 'success');
    onClose();
  };

  const logActive = () => {
    update((prev: any) => {
      const logs = [...(prev.activeMinutes || [])];
      const idx = logs.findIndex(a => a.date === today);
      if (idx >= 0) logs[idx].count = activeMin; else logs.push({ date: today, count: activeMin });
      return { activeMinutes: logs };
    });
    toast('Active minutes logged', 'success');
    onClose();
  };

  const logFood = (food: any) => {
    const log = { id: Math.random().toString(36).slice(2), date: today, meal: 'Snacks', foodId: food.id, name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, fiber: food.fiber || 0, sugar: food.sugar || 0, sodium: food.sodium || 0, servings: 1 };
    update((prev: any) => ({ foodLogs: [...(prev.foodLogs || []), log] }));
    toast(`${food.name} added`, 'success');
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title={`Quick Log: ${type}`}>
      {type === 'water' && (
        <div className="text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-300">Add a cup of water?</p>
          <button onClick={logWater} className="w-full py-3 bg-sky-500 text-white rounded-xl font-medium press flex items-center justify-center gap-2">
            <Droplet className="w-5 h-5" /> +1 Cup
          </button>
        </div>
      )}
      {type === 'weight' && (
        <div className="space-y-3">
          <label className="text-sm text-slate-500">Weight (kg) <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white" /></label>
          <button onClick={logWeight} className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium press">Log Weight</button>
        </div>
      )}
      {type === 'steps' && (
        <div className="space-y-3">
          <label className="text-sm text-slate-500">Steps <input type="number" value={steps} onChange={e => setSteps(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white" /></label>
          <button onClick={logSteps} className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium press">Log Steps</button>
        </div>
      )}
      {type === 'activity' && (
        <div className="space-y-3">
          <label className="text-sm text-slate-500">Active Minutes <input type="number" value={activeMin} onChange={e => setActiveMin(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white" /></label>
          <button onClick={logActive} className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium press">Log Activity</button>
        </div>
      )}
      {type === 'meal' && (
        <div className="space-y-3">
          <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="Search foods..." className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none" />
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {FOODS.filter(f => !foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 15).map(food => (
              <button key={food.id} onClick={() => logFood(food)} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-between">
                <span className="text-sm text-slate-900 dark:text-white">{food.name}</span>
                <span className="text-xs text-slate-500">{food.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {type === 'workout' && (
        <div className="text-center space-y-3">
          <p className="text-slate-600 dark:text-slate-300">Head to the Workout module to start a session!</p>
          <button onClick={onClose} className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium press">Go to Workouts</button>
        </div>
      )}
    </Modal>
  );
}
