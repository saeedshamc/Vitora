import { useState, useMemo } from 'react';
import {
  Search, Plus, X, Check, Coffee, Utensils, Apple, Droplet, Bot, Heart,
  ChevronDown, Calendar, BarChart3, Sparkles, Flame,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { RingChart, SearchInput, Chip, Modal, WaterBottle } from './vitoraUI';
import { FOODS, MEAL_PLANS, todayStr, daysAgo, type UserProfile, type AppState, type Food } from './vitoraCore';

interface NutritionProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  toast: (text: string, type?: string) => void;
  addXp: (amount: number, reason: string) => void;
}

type Tab = 'log' | 'daily' | 'plans' | 'analytics' | 'water';

export function Nutrition({ profile, state, update, toast, addXp }: NutritionProps) {
  const [tab, setTab] = useState<Tab>('log');

  const calorieTarget = useMemo(() => {
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.gender === 'male' ? 5 : -161);
    const factors: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
    const mult: Record<string, number> = { lose: 0.8, build: 1.1, endurance: 1.0, healthy: 1.0, flexibility: 0.95 };
    return Math.round(bmr * (factors[profile.activity] || 1.2) * (mult[profile.goal] || 1.0));
  }, [profile]);

  const macros = { protein: Math.round((calorieTarget * 0.3) / 4), carbs: Math.round((calorieTarget * 0.4) / 4), fat: Math.round((calorieTarget * 0.3) / 9) };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nutrition</h1>
        <button onClick={() => toast('AI meal suggestions would connect to Claude API', 'info')}
          className="flex items-center gap-1.5 bg-violet-600 text-white px-3 py-2 rounded-xl text-sm font-medium press">
          <Bot className="w-4 h-4" /> AI Suggest
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {([['log', 'Food Log', <Apple className="w-4 h-4" />], ['daily', 'Daily', <Utensils className="w-4 h-4" />], ['plans', 'Meal Plans', <Calendar className="w-4 h-4" />], ['water', 'Water', <Droplet className="w-4 h-4" />], ['analytics', 'Analytics', <BarChart3 className="w-4 h-4" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${tab === key ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === 'log' && <FoodLogger state={state} update={update} toast={toast} addXp={addXp} />}
      {tab === 'daily' && <DailyNutrition state={state} calorieTarget={calorieTarget} macros={macros} />}
      {tab === 'plans' && <MealPlans state={state} update={update} toast={toast} />}
      {tab === 'water' && <WaterTracker profile={profile} state={state} update={update} toast={toast} addXp={addXp} />}
      {tab === 'analytics' && <NutritionAnalytics state={state} calorieTarget={calorieTarget} profile={profile} />}
    </div>
  );
}

// ============ FOOD LOGGER ============
function FoodLogger({ state, update, toast, addXp }: { state: AppState; update: any; toast: any; addXp: any }) {
  const [search, setSearch] = useState('');
  const [meal, setMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [showCustom, setShowCustom] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcode, setBarcode] = useState('');
  const today = todayStr();

  // Custom food form
  const [cName, setCName] = useState(''); const [cCal, setCCal] = useState(0); const [cPro, setCPro] = useState(0); const [cCarb, setCCarb] = useState(0); const [cFat, setCFat] = useState(0);

  const filtered = useMemo(() => FOODS.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30), [search]);
  const todayFoods = (state.foodLogs || []).filter(f => f.date === today);
  const recentIds = useMemo(() => { const seen = new Set<string>(); return (state.foodLogs || []).sort((a, b) => b.date.localeCompare(a.date)).filter(f => { if (seen.has(f.foodId)) return false; seen.add(f.foodId); return true; }).slice(0, 10); }, [state.foodLogs]);

  const logFood = (food: Food, servings = 1) => {
    const log = {
      id: Math.random().toString(36).slice(2), date: today, meal, foodId: food.id,
      name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
      fiber: food.fiber || 0, sugar: food.sugar || 0, sodium: food.sodium || 0, servings,
    };
    update((prev: any) => ({ foodLogs: [...(prev.foodLogs || []), log], recentFoods: [...new Set([food.id, ...(prev.recentFoods || [])])].slice(0, 10) }));
    toast(`${food.name} added to ${meal}`, 'success');
  };

  const logCustom = () => {
    if (!cName) return;
    const log = { id: Math.random().toString(36).slice(2), date: today, meal, foodId: 'custom_' + cName, name: cName, calories: cCal, protein: cPro, carbs: cCarb, fat: cFat, fiber: 0, sugar: 0, sodium: 0, servings: 1 };
    update((prev: any) => ({ foodLogs: [...(prev.foodLogs || []), log] }));
    toast('Custom food added', 'success');
    setCName(''); setCCal(0); setCPro(0); setCCarb(0); setCFat(0); setShowCustom(false);
  };

  const scanBarcode = () => {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    logFood(food);
    toast(`Scanned: ${food.name}`, 'success');
    setBarcode(''); setShowBarcode(false);
  };

  const removeLog = (id: string) => update((prev: any) => ({ foodLogs: (prev.foodLogs || []).filter((f: any) => f.id !== id) }));

  const toggleFav = (id: string) => {
    const favs = state.favoriteFoods || [];
    update({ favoriteFoods: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
  };

  const meals: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snacks')[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="space-y-3">
      {/* Meal selector */}
      <div className="flex gap-2">
        {meals.map(m => (
          <Chip key={m} active={meal === m} onClick={() => setMeal(m)}>{m}</Chip>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <button onClick={() => setShowBarcode(true)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-medium press flex items-center justify-center gap-1.5">
          <Search className="w-4 h-4" /> Scan
        </button>
        <button onClick={() => setShowCustom(true)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-medium press flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" /> Custom
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search 200+ foods..." />

      {/* Recent */}
      {!search && recentIds.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">Recent</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {recentIds.map(r => { const food = FOODS.find(f => f.id === r.foodId); if (!food) return null; return (
              <button key={r.id} onClick={() => logFood(food)} className="flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-sm press">
                {food.name}
              </button>
            ); })}
          </div>
        </div>
      )}

      {/* Food list */}
      <div className="space-y-1">
        {filtered.map(food => (
          <div key={food.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex-1" onClick={() => logFood(food)}>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{food.name}</p>
              <p className="text-xs text-slate-500">{food.serving} · {food.calories} kcal · P{food.protein} C{food.carbs} F{food.fat}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleFav(food.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Heart className={`w-4 h-4 ${(state.favoriteFoods || []).includes(food.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              </button>
              <button onClick={() => logFood(food)} className="p-1.5 bg-brand-500 text-white rounded-lg press"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Today's log */}
      {todayFoods.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Today's Log</h3>
          <div className="space-y-1">
            {todayFoods.map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">{f.name} <span className="text-xs text-slate-400">· {f.meal}</span></p>
                  <p className="text-xs text-slate-500">{Math.round(f.calories * f.servings)} kcal</p>
                </div>
                <button onClick={() => removeLog(f.id)} className="text-red-400 text-xs">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom food modal */}
      <Modal open={showCustom} onClose={() => setShowCustom(false)} title="Add Custom Food">
        <div className="space-y-3">
          <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Food name" className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 outline-none text-slate-900 dark:text-white" />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-slate-500">Calories <input type="number" value={cCal} onChange={e => setCCal(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
            <label className="text-sm text-slate-500">Protein <input type="number" value={cPro} onChange={e => setCCal(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
            <label className="text-sm text-slate-500">Carbs <input type="number" value={cCarb} onChange={e => setCCarb(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
            <label className="text-sm text-slate-500">Fat <input type="number" value={cFat} onChange={e => setCFat(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
          </div>
          <button onClick={logCustom} className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium press">Add Food</button>
        </div>
      </Modal>

      {/* Barcode modal */}
      <Modal open={showBarcode} onClose={() => setShowBarcode(false)} title="Barcode Scanner">
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Enter any barcode number to scan:</p>
          <input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="e.g. 123456789" className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 outline-none text-slate-900 dark:text-white" />
          <button onClick={scanBarcode} className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium press">Scan</button>
        </div>
      </Modal>
    </div>
  );
}

// ============ DAILY NUTRITION ============
function DailyNutrition({ state, calorieTarget, macros }: { state: AppState; calorieTarget: number; macros: any }) {
  const today = todayStr();
  const todayFoods = (state.foodLogs || []).filter(f => f.date === today);
  const consumed = todayFoods.reduce((s, f) => s + f.calories * f.servings, 0);
  const protein = todayFoods.reduce((s, f) => s + f.protein * f.servings, 0);
  const carbs = todayFoods.reduce((s, f) => s + f.carbs * f.servings, 0);
  const fat = todayFoods.reduce((s, f) => s + f.fat * f.servings, 0);
  const fiber = todayFoods.reduce((s, f) => s + (f.fiber || 0) * f.servings, 0);
  const sugar = todayFoods.reduce((s, f) => s + (f.sugar || 0) * f.servings, 0);
  const sodium = todayFoods.reduce((s, f) => s + (f.sodium || 0) * f.servings, 0);

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
  const [openMeal, setOpenMeal] = useState<string | null>(null);

  const macroData = [
    { name: 'Protein', value: protein, target: macros.protein, color: '#10b981' },
    { name: 'Carbs', value: carbs, target: macros.carbs, color: '#f59e0b' },
    { name: 'Fat', value: fat, target: macros.fat, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-3">
      {/* Calorie ring */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <RingChart value={consumed} max={calorieTarget} size={100} stroke={9} color="#10b981" label={`${Math.round(consumed)}`} sublabel={`/${calorieTarget}`} />
        <div className="flex-1">
          <p className="text-sm text-slate-500">Calories</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(consumed)} <span className="text-sm text-slate-400">/ {calorieTarget}</span></p>
          <p className="text-sm text-brand-500 font-medium">{Math.max(0, calorieTarget - Math.round(consumed))} kcal remaining</p>
        </div>
      </div>

      {/* Macro rings */}
      <div className="grid grid-cols-3 gap-3">
        {macroData.map(m => (
          <div key={m.name} className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <RingChart value={m.value} max={m.target} size={70} stroke={7} color={m.color} label={`${Math.round(m.value)}`} sublabel={`${m.target}g`} />
            <p className="text-xs text-slate-500 mt-1">{m.name}</p>
          </div>
        ))}
      </div>

      {/* Micronutrients */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Micronutrients</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center"><p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(fiber)}g</p><p className="text-xs text-slate-500">Fiber</p></div>
          <div className="text-center"><p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(sugar)}g</p><p className="text-xs text-slate-500">Sugar</p></div>
          <div className="text-center"><p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(sodium)}mg</p><p className="text-xs text-slate-500">Sodium</p></div>
        </div>
      </div>

      {/* Meal breakdown */}
      <div className="space-y-2">
        {meals.map(m => {
          const mealFoods = todayFoods.filter(f => f.meal === m);
          const mealCals = mealFoods.reduce((s, f) => s + f.calories * f.servings, 0);
          return (
            <div key={m} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
              <button onClick={() => setOpenMeal(openMeal === m ? null : m)} className="w-full flex items-center justify-between p-4">
                <span className="font-medium text-slate-900 dark:text-white">{m}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{Math.round(mealCals)} kcal</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openMeal === m ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {openMeal === m && mealFoods.length > 0 && (
                <div className="px-4 pb-3 space-y-1">
                  {mealFoods.map(f => (
                    <div key={f.id} className="flex justify-between text-sm py-1.5 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-slate-700 dark:text-slate-200">{f.name}</span>
                      <span className="text-slate-500">P{Math.round(f.protein * f.servings)} C{Math.round(f.carbs * f.servings)} F{Math.round(f.fat * f.servings)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ MEAL PLANS ============
function MealPlans({ state, update, toast }: { state: AppState; update: any; toast: any }) {
  const [selected, setSelected] = useState<string | null>(null);
  const plan = MEAL_PLANS.find(p => p.id === selected);

  const addAllToLog = (day: any) => {
    const logs = day.meals.flatMap((meal: any) => meal.foods.map((id: string) => {
      const food = FOODS.find(f => f.id === id);
      if (!food) return null;
      return { id: Math.random().toString(36).slice(2), date: todayStr(), meal: meal.name, foodId: food.id, name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, fiber: food.fiber || 0, sugar: food.sugar || 0, sodium: food.sodium || 0, servings: 1 };
    }).filter(Boolean));
    update((prev: any) => ({ foodLogs: [...(prev.foodLogs || []), ...logs] }));
    toast('Added all meals to today\'s log!', 'success');
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MEAL_PLANS.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover cursor-pointer ${selected === p.id ? 'ring-2 ring-brand-500' : ''}`}>
            <h3 className="font-bold text-slate-900 dark:text-white">{p.name}</h3>
            <p className="text-sm text-slate-500">{p.description}</p>
            <p className="text-xs text-brand-500 mt-1">{p.dailyCalories} kcal/day · {p.type}</p>
          </div>
        ))}
      </div>

      {plan && (
        <div className="space-y-3">
          {plan.days.map((day, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">{day.day}</h3>
                <button onClick={() => addAllToLog(day)} className="bg-brand-500 text-white px-3 py-1.5 rounded-lg text-sm press">Add all to today</button>
              </div>
              <div className="space-y-2">
                {day.meals.map((meal, mIdx) => (
                  <div key={mIdx} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{meal.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {meal.foods.map(id => { const food = FOODS.find(f => f.id === id); return food ? <span key={id} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{food.name}</span> : null; })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ WATER TRACKER ============
function WaterTracker({ profile, state, update, toast, addXp }: { profile: UserProfile; state: AppState; update: any; toast: any; addXp: any }) {
  const today = todayStr();
  const goal = Math.round((profile.weight * 35) / 240);
  const todayCups = (state.waterLogs || []).find(w => w.date === today)?.cups || 0;

  const addCup = () => {
    const newCups = todayCups + 1;
    update((prev: any) => {
      const logs = [...(prev.waterLogs || [])];
      const idx = logs.findIndex(w => w.date === today);
      if (idx >= 0) logs[idx].cups = newCups;
      else logs.push({ date: today, cups: newCups });
      return { waterLogs: logs };
    });
    if (newCups === goal) { addXp(20, 'Water goal'); toast('Water goal reached! +20 XP', 'success'); }
  };

  const removeCup = () => {
    if (todayCups <= 0) return;
    const newCups = todayCups - 1;
    update((prev: any) => { const logs = [...(prev.waterLogs || [])]; const idx = logs.findIndex(w => w.date === today); if (idx >= 0) logs[idx].cups = newCups; return { waterLogs: logs }; });
  };

  // 7-day history
  const weekData = useMemo(() => {
    const data: { day: string; cups: number }[] = [];
    for (let i = 6; i >= 0; i--) { const d = daysAgo(i); const cups = (state.waterLogs || []).find(w => w.date === d)?.cups || 0; data.push({ day: d.slice(5), cups }); }
    return data;
  }, [state.waterLogs]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <WaterBottle cups={todayCups} goal={goal} size={160} />
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{todayCups} <span className="text-lg text-slate-400">/ {goal} cups</span></p>
        <p className="text-sm text-slate-500 mb-4">{Math.round((todayCups / goal) * 100)}% of daily goal</p>
        <div className="flex gap-3">
          <button onClick={removeCup} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 press flex items-center justify-center text-xl">-</button>
          <button onClick={addCup} className="w-16 h-16 rounded-full bg-sky-500 text-white press flex items-center justify-center"><Droplet className="w-7 h-7" /></button>
          <button onClick={addCup} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 press flex items-center justify-center text-xl">+</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">7-Day Hydration</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="cups" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============ NUTRITION ANALYTICS ============
function NutritionAnalytics({ state, calorieTarget, profile }: { state: AppState; calorieTarget: number; profile: UserProfile }) {
  const weekData = useMemo(() => {
    const data: { day: string; calories: number; target: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const cals = (state.foodLogs || []).filter(f => f.date === d).reduce((s, f) => s + f.calories * f.servings, 0);
      data.push({ day: d.slice(5), calories: Math.round(cals), target: calorieTarget });
    }
    return data;
  }, [state.foodLogs, calorieTarget]);

  const avgCal = Math.round(weekData.reduce((s, d) => s + d.calories, 0) / 7);
  const bestDay = weekData.reduce((best, d) => Math.abs(d.calories - calorieTarget) < Math.abs(best.calories - calorieTarget) ? d : best, weekData[0]);
  const worstDay = weekData.reduce((worst, d) => Math.abs(d.calories - calorieTarget) > Math.abs(worst.calories - calorieTarget) ? d : worst, weekData[0]);

  const proteinPerKg = useMemo(() => {
    const todayProtein = (state.foodLogs || []).filter(f => f.date === todayStr()).reduce((s, f) => s + f.protein * f.servings, 0);
    return (todayProtein / profile.weight).toFixed(1);
  }, [state.foodLogs, profile.weight]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-500">Weekly Avg</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgCal}</p>
          <p className="text-xs text-slate-500">kcal/day</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-500">Protein/kg</p>
          <p className="text-2xl font-bold text-brand-500">{proteinPerKg}g</p>
          <p className="text-xs text-slate-500">today</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Weekly Calories vs Target</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-brand-500/10 rounded-2xl p-4">
          <p className="text-xs text-brand-600 dark:text-brand-400">Best Day</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{bestDay?.day}</p>
          <p className="text-xs text-slate-500">{bestDay?.calories} kcal</p>
        </div>
        <div className="bg-amber-500/10 rounded-2xl p-4">
          <p className="text-xs text-amber-600 dark:text-amber-400">Worst Day</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{worstDay?.day}</p>
          <p className="text-xs text-slate-500">{worstDay?.calories} kcal</p>
        </div>
      </div>
    </div>
  );
}
