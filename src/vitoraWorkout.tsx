import { useState, useMemo, useRef } from 'react';
import {
  Search, Filter, Heart, Plus, X, Check, Play, Pause, RotateCcw, Dumbbell,
  Clock, Timer, ChevronRight, Save, Trash2, ArrowLeft, ArrowRight, Zap,
  Trophy, Sparkles, Calendar, BarChart3, Bot, Wrench, ListChecks,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MuscleDiagram, SearchInput, Chip, Modal } from './vitoraUI';
import { EXERCISES, WORKOUT_PLANS, todayStr, daysAgo, type UserProfile, type AppState, type Exercise } from './vitoraCore';

interface WorkoutProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  toast: (text: string, type?: string) => void;
  fireConfetti: () => void;
  addXp: (amount: number, reason: string) => void;
}

type Tab = 'library' | 'builder' | 'session' | 'plans' | 'history';

export function Workout({ profile, state, update, toast, fireConfetti, addXp }: WorkoutProps) {
  const [tab, setTab] = useState<Tab>('library');
  const [activeSession, setActiveSession] = useState<any>(null);

  const startSession = (workout: any) => {
    const session = {
      id: Math.random().toString(36).slice(2),
      name: workout.name,
      type: workout.type || 'strength',
      exercises: workout.exercises.map((ex: any) => {
        const exercise = EXERCISES.find(e => e.id === ex.exerciseId);
        return {
          exerciseId: ex.exerciseId,
          name: exercise?.name || 'Exercise',
          instructions: exercise?.instructions || '',
          sets: Array.from({ length: ex.sets || 3 }, () => ({ weight: ex.weight || 0, reps: ex.reps || 10, completed: false })),
          notes: '',
        };
      }),
      currentExercise: 0,
      startTime: Date.now(),
      restTimer: 60,
    };
    setActiveSession(session);
    setTab('session');
  };

  if (tab === 'session' && activeSession) {
    return <ActiveSession session={activeSession} setSession={setActiveSession} onEnd={(summary) => {
      const log = {
        id: activeSession.id,
        date: todayStr(),
        name: activeSession.name,
        type: activeSession.type,
        duration: Math.round((Date.now() - activeSession.startTime) / 60000),
        caloriesBurned: summary.calories,
        volume: summary.volume,
        exercises: activeSession.exercises.map((ex: any) => ({ exerciseId: ex.exerciseId, name: ex.name, sets: ex.sets })),
        xpEarned: summary.xp,
        completed: true,
      };
      update((prev: any) => ({ workoutLogs: [...(prev.workoutLogs || []), log] }));
      addXp(summary.xp, 'Workout completed');
      fireConfetti();
      toast(`Workout complete! +${summary.xp} XP`, 'success');
      setActiveSession(null);
      setTab('history');
    }} toast={toast} />;
  }

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workout</h1>
        <button onClick={() => { update({}); toast('AI workout generation would connect to Claude API', 'info'); }}
          className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-xl text-sm font-medium press">
          <Bot className="w-4 h-4" /> AI Generate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {([['library', 'Library', <Dumbbell className="w-4 h-4" />], ['builder', 'Builder', <Wrench className="w-4 h-4" />], ['plans', 'Plans', <ListChecks className="w-4 h-4" />], ['history', 'History', <BarChart3 className="w-4 h-4" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === key ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === 'library' && <ExerciseLibrary state={state} update={update} toast={toast} />}
      {tab === 'builder' && <WorkoutBuilder state={state} update={update} toast={toast} onStart={startSession} />}
      {tab === 'plans' && <WorkoutPlans state={state} update={update} toast={toast} onStart={startSession} />}
      {tab === 'history' && <WorkoutHistory state={state} />}
    </div>
  );
}

// ============ EXERCISE LIBRARY ============
function ExerciseLibrary({ state, update, toast }: { state: AppState; update: any; toast: any }) {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('');
  const [diffFilter, setDiffFilter] = useState<string>('');
  const [selected, setSelected] = useState<Exercise | null>(null);

  const allMuscles = useMemo(() => {
    const set = new Set<string>();
    EXERCISES.forEach(e => e.primary.forEach(m => set.add(m)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return EXERCISES.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (muscleFilter && !e.primary.includes(muscleFilter) && !e.secondary.includes(muscleFilter)) return false;
      if (diffFilter && e.difficulty !== diffFilter) return false;
      return true;
    });
  }, [search, muscleFilter, diffFilter]);

  const toggleFav = (id: string) => {
    const favs = state.favoriteExercises || [];
    update({ favoriteExercises: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
  };

  return (
    <div className="space-y-3">
      <SearchInput value={search} onChange={setSearch} placeholder="Search 120+ exercises..." />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip active={!muscleFilter} onClick={() => setMuscleFilter('')}>All</Chip>
        {allMuscles.map(m => <Chip key={m} active={muscleFilter === m} onClick={() => setMuscleFilter(m)}>{m}</Chip>)}
      </div>
      <div className="flex gap-2">
        {['Beginner', 'Intermediate', 'Advanced'].map(d => (
          <Chip key={d} active={diffFilter === d} onClick={() => setDiffFilter(diffFilter === d ? '' : d)}>{d}</Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(ex => {
          const isFav = (state.favoriteExercises || []).includes(ex.id);
          return (
            <div key={ex.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => setSelected(ex)}>
                  <h3 className="font-bold text-slate-900 dark:text-white">{ex.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ex.primary.join(', ')} · {ex.equipment} · {ex.difficulty}</p>
                </div>
                <button onClick={() => toggleFav(ex.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex justify-center"><MuscleDiagram muscles={[...selected.primary, ...selected.secondary]} size={100} /></div>
            <div className="flex flex-wrap gap-2">
              {selected.primary.map(m => <span key={m} className="px-2 py-1 bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs">{m}</span>)}
              {selected.secondary.map(m => <span key={m} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs">{m}</span>)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Instructions</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selected.instructions}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Pro Tip</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selected.tips}</p>
            </div>
            <p className="text-xs text-slate-500">Equipment: {selected.equipment} · Difficulty: {selected.difficulty}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ WORKOUT BUILDER ============
function WorkoutBuilder({ state, update, toast, onStart }: { state: AppState; update: any; toast: any; onStart: (w: any) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('strength');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [restTimer, setRestTimer] = useState(60);

  const filteredEx = useMemo(() => EXERCISES.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase())), [search]);

  const addExercise = (ex: Exercise) => {
    setExercises(prev => [...prev, { exerciseId: ex.id, name: ex.name, sets: 3, reps: 10, weight: 0, duration: 0 }]);
    setShowAdd(false);
  };

  const removeEx = (idx: number) => setExercises(prev => prev.filter((_, i) => i !== idx));
  const moveEx = (idx: number, dir: number) => {
    setExercises(prev => {
      const next = [...prev];
      const t = idx + dir;
      if (t < 0 || t >= next.length) return prev;
      [next[idx], next[t]] = [next[t], next[idx]];
      return next;
    });
  };

  const save = () => {
    if (!name || exercises.length === 0) { toast('Add a name and exercises', 'info'); return; }
    const workout = { id: Math.random().toString(36).slice(2), name, type, exercises };
    update((prev: any) => ({ customWorkouts: [...(prev.customWorkouts || []), workout] }));
    toast('Workout saved!', 'success');
    setName(''); setExercises([]);
  };

  const start = () => {
    if (exercises.length === 0) { toast('Add exercises first', 'info'); return; }
    onStart({ name: name || 'Custom Workout', type, exercises });
  };

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Workout name"
          className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-brand-500 text-slate-900 dark:text-white" />
        <div className="flex gap-2">
          {['strength', 'cardio', 'hiit', 'flexibility'].map(t => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Rest:</span>
          {[30, 60, 90, 120].map(t => (
            <Chip key={t} active={restTimer === t} onClick={() => setRestTimer(t)}>{t}s</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {exercises.map((ex, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveEx(idx, -1)} className="text-slate-400 hover:text-brand-500"><ArrowLeft className="w-3 h-3" /></button>
              <button onClick={() => moveEx(idx, 1)} className="text-slate-400 hover:text-brand-500"><ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-900 dark:text-white">{ex.name}</p>
              <div className="flex gap-2 mt-1">
                <label className="text-xs text-slate-500">Sets <input type="number" value={ex.sets} onChange={e => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, sets: +e.target.value } : x))} className="w-12 bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 text-slate-900 dark:text-white" /></label>
                <label className="text-xs text-slate-500">Reps <input type="number" value={ex.reps} onChange={e => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, reps: +e.target.value } : x))} className="w-12 bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 text-slate-900 dark:text-white" /></label>
                <label className="text-xs text-slate-500">kg <input type="number" value={ex.weight} onChange={e => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, weight: +e.target.value } : x))} className="w-12 bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 text-slate-900 dark:text-white" /></label>
              </div>
            </div>
            <button onClick={() => removeEx(idx)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 hover:border-brand-500 hover:text-brand-500 press flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Exercise
      </button>

      <div className="flex gap-2">
        <button onClick={save} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium press flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Save Template
        </button>
        <button onClick={start} className="flex-1 py-3 bg-brand-500 text-white rounded-xl font-medium press flex items-center justify-center gap-2">
          <Play className="w-4 h-4" /> Start
        </button>
      </div>

      {/* Saved workouts */}
      {(state.customWorkouts || []).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Saved Workouts</p>
          {(state.customWorkouts || []).map((w: any) => (
            <div key={w.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-white">{w.name}</p>
                <p className="text-xs text-slate-500">{w.exercises.length} exercises · {w.type}</p>
              </div>
              <button onClick={() => onStart(w)} className="bg-brand-500 text-white px-3 py-1.5 rounded-lg text-sm press">Start</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Exercise">
        <SearchInput value={search} onChange={setSearch} placeholder="Search exercises..." />
        <div className="mt-3 space-y-1 max-h-80 overflow-y-auto">
          {filteredEx.map(ex => (
            <button key={ex.id} onClick={() => addExercise(ex)} className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{ex.name}</p>
                <p className="text-xs text-slate-500">{ex.primary.join(', ')}</p>
              </div>
              <Plus className="w-4 h-4 text-brand-500" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ============ ACTIVE SESSION ============
function ActiveSession({ session, setSession, onEnd, toast }: { session: any; setSession: any; onEnd: (s: any) => void; toast: any }) {
  const [restActive, setRestActive] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restTotal, setRestTotal] = useState(60);
  const timerRef = useRef<any>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [swapIdx, setSwapIdx] = useState<number | null>(null);

  const currentEx = session.exercises[session.currentExercise];
  const completedCount = session.exercises.filter((ex: any) => ex.sets.every((s: any) => s.completed)).length;
  const progress = (completedCount / session.exercises.length) * 100;

  const toggleSet = (setIdx: number) => {
    setSession((prev: any) => {
      const exs = [...prev.exercises];
      exs[prev.currentExercise].sets[setIdx].completed = !exs[prev.currentExercise].sets[setIdx].completed;
      return { ...prev, exercises: exs };
    });
  };

  const startRest = () => {
    setRestTotal(session.restTimer || 60);
    setRestTime(session.restTimer || 60);
    setRestActive(true);
    timerRef.current = setInterval(() => {
      setRestTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRestActive(false);
          try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==').play(); } catch {}
          toast('Rest complete!', 'success');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const nextExercise = () => {
    if (session.currentExercise < session.exercises.length - 1) {
      setSession((prev: any) => ({ ...prev, currentExercise: prev.currentExercise + 1 }));
      startRest();
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    const volume = session.exercises.reduce((s: number, ex: any) => s + ex.sets.reduce((ss: number, set: any) => ss + (set.completed ? set.weight * set.reps : 0), 0), 0);
    const duration = Math.round((Date.now() - session.startTime) / 60000);
    const calories = Math.round(duration * 6);
    const allComplete = session.exercises.every((ex: any) => ex.sets.every((s: any) => s.completed));
    const xp = 50 + (allComplete ? 25 : 0);
    setShowSummary(true);
    setTimeout(() => onEnd({ volume, duration, calories, xp }), 2500);
  };

  if (showSummary) {
    const volume = session.exercises.reduce((s: number, ex: any) => s + ex.sets.reduce((ss: number, set: any) => ss + (set.completed ? set.weight * set.reps : 0), 0), 0);
    const duration = Math.round((Date.now() - session.startTime) / 60000);
    const calories = Math.round(duration * 6);
    const xp = 50 + (session.exercises.every((ex: any) => ex.sets.every((s: any) => s.completed)) ? 25 : 0);
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Workout Complete!</h2>
          <p className="text-slate-400 mb-6">{session.name}</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="bg-slate-800 rounded-2xl p-4"><p className="text-2xl font-bold text-brand-400">{volume}kg</p><p className="text-xs text-slate-400">Total Volume</p></div>
            <div className="bg-slate-800 rounded-2xl p-4"><p className="text-2xl font-bold text-blue-400">{duration}m</p><p className="text-xs text-slate-400">Duration</p></div>
            <div className="bg-slate-800 rounded-2xl p-4"><p className="text-2xl font-bold text-orange-400">{calories}</p><p className="text-xs text-slate-400">Calories</p></div>
            <div className="bg-slate-800 rounded-2xl p-4"><p className="text-2xl font-bold text-amber-400">+{xp}</p><p className="text-xs text-slate-400">XP Earned</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">{session.name}</h2>
          <button onClick={finishWorkout} className="text-sm text-red-400">End</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-slate-400">{completedCount}/{session.exercises.length}</span>
        </div>
      </div>

      {/* Current exercise */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm text-slate-400 mb-1">Exercise {session.currentExercise + 1} of {session.exercises.length}</p>
        <h1 className="text-3xl font-bold mb-3">{currentEx?.name}</h1>
        <p className="text-sm text-slate-400 mb-4">{currentEx?.instructions}</p>

        {/* Sets */}
        <div className="space-y-2 mb-4">
          {currentEx?.sets.map((set: any, idx: number) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${set.completed ? 'bg-brand-500/20' : 'bg-slate-800'}`}>
              <button onClick={() => toggleSet(idx)} className={`w-8 h-8 rounded-full flex items-center justify-center ${set.completed ? 'bg-brand-500' : 'bg-slate-700'}`}>
                {set.completed && <Check className="w-4 h-4" />}
              </button>
              <span className="text-sm text-slate-400">Set {idx + 1}</span>
              <input type="number" value={set.weight} onChange={e => setSession((prev: any) => { const exs = [...prev.exercises]; exs[prev.currentExercise].sets[idx].weight = +e.target.value; return { ...prev, exercises: exs }; })}
                className="w-16 bg-slate-700 rounded-lg px-2 py-1 text-sm text-center" />
              <span className="text-xs text-slate-500">kg ×</span>
              <input type="number" value={set.reps} onChange={e => setSession((prev: any) => { const exs = [...prev.exercises]; exs[prev.currentExercise].sets[idx].reps = +e.target.value; return { ...prev, exercises: exs }; })}
                className="w-16 bg-slate-700 rounded-lg px-2 py-1 text-sm text-center" />
              <span className="text-xs text-slate-500">reps</span>
            </div>
          ))}
        </div>

        <textarea value={currentEx?.notes || ''} onChange={e => setSession((prev: any) => { const exs = [...prev.exercises]; exs[prev.currentExercise].notes = e.target.value; return { ...prev, exercises: exs }; })}
          placeholder="Notes..." className="w-full bg-slate-800 rounded-xl p-3 text-sm outline-none resize-none" rows={2} />

        <button onClick={() => setSwapIdx(session.currentExercise)} className="mt-3 text-sm text-violet-400 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Swap exercise
        </button>
      </div>

      {/* Rest timer overlay */}
      {restActive && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => { clearInterval(timerRef.current); setRestActive(false); }}>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Rest</p>
            <p className="text-7xl font-bold text-brand-400">{restTime}</p>
            <p className="text-sm text-slate-400 mt-2">Tap to skip</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="p-4 border-t border-slate-800 flex gap-2">
        <button onClick={startRest} className="flex-1 py-3 bg-slate-800 rounded-xl font-medium press flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" /> Rest
        </button>
        <button onClick={nextExercise} className="flex-1 py-3 bg-brand-500 rounded-xl font-medium press flex items-center justify-center gap-2">
          {session.currentExercise < session.exercises.length - 1 ? 'Next' : 'Finish'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Swap modal */}
      <Modal open={swapIdx !== null} onClose={() => setSwapIdx(null)} title="Swap Exercise">
        <p className="text-sm text-slate-500 mb-3">Alternative exercises:</p>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {EXERCISES.filter(e => e.id !== currentEx?.exerciseId).slice(0, 20).map(ex => (
            <button key={ex.id} onClick={() => {
              setSession((prev: any) => { const exs = [...prev.exercises]; exs[swapIdx!] = { ...exs[swapIdx!], exerciseId: ex.id, name: ex.name, instructions: ex.instructions }; return { ...prev, exercises: exs }; });
              setSwapIdx(null);
            }} className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{ex.name}</p>
              <p className="text-xs text-slate-500">{ex.primary.join(', ')}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ============ WORKOUT PLANS ============
function WorkoutPlans({ state, update, toast, onStart }: { state: AppState; update: any; toast: any; onStart: (w: any) => void }) {
  const [selected, setSelected] = useState<string | null>(state.activePlan || null);

  const activatePlan = (plan: any) => {
    setSelected(plan.id);
    update({ activePlan: plan.id, planWeek: 1 });
    toast(`${plan.name} plan activated!`, 'success');
  };

  const plan = WORKOUT_PLANS.find(p => p.id === selected);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WORKOUT_PLANS.map(p => (
          <div key={p.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover cursor-pointer ${selected === p.id ? 'ring-2 ring-brand-500' : ''}`} onClick={() => setSelected(p.id)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <span className="text-xs text-slate-500">{p.days} days</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">{p.description}</p>
            {selected === p.id ? (
              <button onClick={(e) => { e.stopPropagation(); activatePlan(p); }} className="w-full py-2 bg-brand-500 text-white rounded-xl text-sm font-medium press">Active</button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); activatePlan(p); }} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium press">Activate</button>
            )}
          </div>
        ))}
      </div>

      {plan && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">{plan.name} — Week {state.planWeek || 1}</h3>
          <div className="space-y-2">
            {plan.split.map((day, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{day.day}</p>
                    <p className="text-xs text-slate-500">{day.focus}</p>
                  </div>
                  <button onClick={() => onStart({ name: `${plan.name} - ${day.day}`, type: 'strength', exercises: day.exercises.map((id: string) => { const ex = EXERCISES.find(e => e.id === id); return { exerciseId: id, sets: 3, reps: 10, weight: 0, duration: 0 }; }) })}
                    className="bg-brand-500 text-white px-3 py-1.5 rounded-lg text-sm press flex items-center gap-1">
                    <Play className="w-3 h-3" /> Start
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {day.exercises.map(id => { const ex = EXERCISES.find(e => e.id === id); return ex ? <span key={id} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{ex.name}</span> : null; })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ WORKOUT HISTORY ============
function WorkoutHistory({ state }: { state: AppState }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Heatmap data (90 days)
  const heatmap = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = daysAgo(i);
      const count = (state.workoutLogs || []).filter(w => w.date === d).length;
      days.push({ date: d, count });
    }
    return days;
  }, [state.workoutLogs]);

  // Monthly volume
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    (state.workoutLogs || []).forEach(w => {
      const m = w.date.slice(0, 7);
      months[m] = (months[m] || 0) + (w.volume || 0);
    });
    return Object.entries(months).map(([month, vol]) => ({ month: month.slice(5), volume: vol })).slice(-6);
  }, [state.workoutLogs]);

  // PRs
  const prs = useMemo(() => {
    const records: Record<string, { weight: number; reps: number; date: string }> = {};
    (state.workoutLogs || []).forEach(w => {
      w.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed && s.weight > 0) {
            const key = ex.name;
            if (!records[key] || s.weight > records[key].weight) {
              records[key] = { weight: s.weight, reps: s.reps, date: w.date };
            }
          }
        });
      });
    });
    return Object.entries(records).map(([name, data]) => ({ name, ...data }));
  }, [state.workoutLogs]);

  const selectedWorkouts = selectedDate ? (state.workoutLogs || []).filter(w => w.date === selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Heatmap */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Activity (90 days)</h3>
        <div className="grid grid-cols-[repeat(15,1fr)] gap-1">
          {heatmap.map(d => (
            <button key={d.date} onClick={() => setSelectedDate(d.date)}
              className={`aspect-square rounded-sm transition-all ${d.count > 0 ? 'bg-brand-500 hover:scale-110' : 'bg-slate-200 dark:bg-slate-700'}`}
              style={{ opacity: d.count > 0 ? Math.min(1, 0.4 + d.count * 0.3) : 1 }}
              title={`${d.date}: ${d.count} workouts`} />
          ))}
        </div>
      </div>

      {/* Monthly volume */}
      {monthlyData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Monthly Volume (kg)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(148,163,184,0.5)" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* PRs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Personal Records</h3>
        {prs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No PRs yet. Complete a workout to start tracking!</p>
        ) : (
          <div className="space-y-1">
            {prs.map(pr => (
              <div key={pr.name} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-200">{pr.name}</span>
                <span className="text-sm font-bold text-amber-500">{pr.weight}kg × {pr.reps}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected date workouts */}
      <Modal open={!!selectedDate} onClose={() => setSelectedDate(null)} title={selectedDate || ''}>
        {selectedWorkouts.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No workouts on this day</p>
        ) : (
          <div className="space-y-2">
            {selectedWorkouts.map(w => (
              <div key={w.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <p className="font-medium text-slate-900 dark:text-white">{w.name}</p>
                <p className="text-xs text-slate-500">{w.duration}m · {w.caloriesBurned} kcal · {w.volume}kg volume</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
