import { useState, useMemo, useRef } from 'react';
import {
  Scale, Plus, X, Camera, TrendingUp, TrendingDown, Activity, Heart,
  BarChart3, Image as ImageIcon, Eye, Gauge, Brain,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import { RingChart, Modal, StatCard } from './vitoraUI';
import { todayStr, daysAgo, type UserProfile, type AppState } from './vitoraCore';

interface BodyProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  toast: (text: string, type?: string) => void;
  addXp: (amount: number, reason: string) => void;
}

type Tab = 'measure' | 'charts' | 'photos' | 'analysis';

export function BodyMetrics({ profile, state, update, toast, addXp }: BodyProps) {
  const [tab, setTab] = useState<Tab>('measure');

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Body Metrics</h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {([['measure', 'Measurements', <Scale className="w-4 h-4" />], ['charts', 'Charts', <BarChart3 className="w-4 h-4" />], ['photos', 'Photos', <Camera className="w-4 h-4" />], ['analysis', 'Analysis', <Brain className="w-4 h-4" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${tab === key ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === 'measure' && <Measurements profile={profile} state={state} update={update} toast={toast} addXp={addXp} />}
      {tab === 'charts' && <ProgressCharts profile={profile} state={state} />}
      {tab === 'photos' && <ProgressPhotos state={state} update={update} toast={toast} />}
      {tab === 'analysis' && <BodyAnalysis profile={profile} state={state} />}
    </div>
  );
}

// ============ MEASUREMENTS ============
function Measurements({ profile, state, update, toast, addXp }: any) {
  const [show, setShow] = useState(false);
  const [weight, setWeight] = useState(profile.weight);
  const [bodyFat, setBodyFat] = useState(20);
  const [chest, setChest] = useState(100); const [waist, setWaist] = useState(80); const [hips, setHips] = useState(95);
  const [arms, setArms] = useState(35); const [thighs, setThighs] = useState(55); const [calves, setCalves] = useState(38);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    const muscleMass = weight * (1 - bodyFat / 100);
    const entry = {
      id: Math.random().toString(36).slice(2), date: todayStr(), weight, bodyFat, muscleMass,
      chest, waist, hips, arms, thighs, calves, photo,
    };
    update((prev: any) => ({ bodyMeasurements: [...(prev.bodyMeasurements || []), entry], weightLogs: [...(prev.weightLogs || []), { date: todayStr(), weight }] }));
    addXp(10, 'Weight logged');
    toast('Measurements saved! +10 XP', 'success');
    setShow(false);
  };

  const latest = (state.bodyMeasurements || []).slice(-1)[0];

  return (
    <div className="space-y-3">
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Scale className="w-5 h-5" />} label="Weight" value={`${latest.weight}kg`} color="#10b981" />
          <StatCard icon={<Activity className="w-5 h-5" />} label="Body Fat" value={`${latest.bodyFat}%`} color="#f59e0b" />
          <StatCard icon={<Heart className="w-5 h-5" />} label="Muscle" value={`${latest.muscleMass.toFixed(1)}kg`} color="#7c3aed" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="BMI" value={calcBMI(latest.weight, profile.height).toFixed(1)} color="#3b82f6" />
        </div>
      )}

      <button onClick={() => setShow(true)} className="w-full py-3 bg-brand-500 text-white rounded-2xl font-medium press flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Log Measurements
      </button>

      {/* History */}
      {(state.bodyMeasurements || []).length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">History</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {[...(state.bodyMeasurements || [])].reverse().map((m: any) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-200">{m.date}</span>
                <span className="text-sm text-slate-500">{m.weight}kg · {m.bodyFat}% BF · {m.waist}cm waist</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Log Measurements">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-slate-500">Weight (kg) <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
            <label className="text-sm text-slate-500">Body Fat (%) <input type="number" value={bodyFat} onChange={e => setBodyFat(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" /></label>
          </div>
          <p className="text-xs text-slate-500">Measurements (cm)</p>
          <div className="grid grid-cols-3 gap-2">
            {[['Chest', chest, setChest], ['Waist', waist, setWaist], ['Hips', hips, setHips], ['Arms', arms, setArms], ['Thighs', thighs, setThighs], ['Calves', calves, setCalves]].map(([label, val, set]: any) => (
              <label key={label} className="text-xs text-slate-500">{label} <input type="number" value={val} onChange={e => set(+e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl px-2 py-1.5 text-slate-900 dark:text-white" /></label>
            ))}
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-sm text-brand-500">
              <Camera className="w-4 h-4" /> {photo ? 'Photo added' : 'Add progress photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            {photo && <img src={photo} alt="progress" className="mt-2 w-full rounded-xl max-h-40 object-cover" />}
          </div>
          <button onClick={save} className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium press">Save</button>
        </div>
      </Modal>
    </div>
  );
}

function calcBMI(weight: number, height: number) { const m = height / 100; return weight / (m * m); }

// ============ PROGRESS CHARTS ============
function ProgressCharts({ profile, state }: any) {
  const weightData = useMemo(() => {
    return [...(state.weightLogs || [])].sort((a: any, b: any) => a.date.localeCompare(b.date)).map((w: any) => ({ date: w.date.slice(5), weight: w.weight }));
  }, [state.weightLogs]);

  const bfData = useMemo(() => {
    return [...(state.bodyMeasurements || [])].sort((a: any, b: any) => a.date.localeCompare(b.date)).map((m: any) => ({ date: m.date.slice(5), bf: m.bodyFat }));
  }, [state.bodyMeasurements]);

  const bmiData = useMemo(() => {
    return [...(state.weightLogs || [])].sort((a: any, b: any) => a.date.localeCompare(b.date)).map((w: any) => ({ date: w.date.slice(5), bmi: calcBMI(w.weight, profile.height) }));
  }, [state.weightLogs, profile.height]);

  const latest = (state.bodyMeasurements || []).slice(-1)[0];
  const compositionData = latest ? [
    { name: 'Muscle', value: latest.muscleMass, color: '#10b981' },
    { name: 'Fat', value: latest.weight * latest.bodyFat / 100, color: '#f59e0b' },
    { name: 'Other', value: latest.weight - latest.muscleMass - (latest.weight * latest.bodyFat / 100), color: '#3b82f6' },
  ] : [];

  return (
    <div className="space-y-3">
      {weightData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weightData}>
              <defs><linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
              {profile.targetWeight && <ReferenceLine y={profile.targetWeight} stroke="#f59e0b" strokeDasharray="5 5" />}
              <Area type="monotone" dataKey="weight" stroke="#10b981" fill="url(#wGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {bfData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Body Fat %</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={bfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="bf" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {bmiData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">BMI History</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={bmiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <YAxis tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.5)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {compositionData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Body Composition</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={compositionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {compositionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {weightData.length === 0 && <p className="text-center text-slate-500 py-8">Log measurements to see charts</p>}
    </div>
  );
}

// ============ PROGRESS PHOTOS ============
function ProgressPhotos({ state, update, toast }: any) {
  const [showCompare, setShowCompare] = useState(false);
  const [photo1, setPhoto1] = useState<number | null>(null);
  const [photo2, setPhoto2] = useState<number | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const fileRef = useRef<HTMLInputElement>(null);

  const photos = (state.bodyMeasurements || []).filter((m: any) => m.photo);

  const upload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const entry = { id: Math.random().toString(36).slice(2), date: todayStr(), weight: profile_weight(state), bodyFat: 20, muscleMass: 50, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, photo: reader.result as string };
      update((prev: any) => ({ bodyMeasurements: [...(prev.bodyMeasurements || []), entry] }));
      toast('Photo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <button onClick={() => fileRef.current?.click()} className="w-full py-3 bg-brand-500 text-white rounded-2xl font-medium press flex items-center justify-center gap-2">
        <Camera className="w-4 h-4" /> Upload Photo
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />

      {photos.length >= 2 && (
        <button onClick={() => { setPhoto1(0); setPhoto2(photos.length - 1); setShowCompare(true); }}
          className="w-full py-3 bg-violet-600 text-white rounded-2xl font-medium press flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" /> Compare Photos
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((p: any, idx: number) => (
          <div key={p.id} className="relative rounded-xl overflow-hidden group">
            <img src={p.photo} alt="progress" className="w-full aspect-square object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs text-white">{p.date}</p>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && <p className="text-center text-slate-500 py-8">Upload photos to track your visual progress</p>}

      <Modal open={showCompare} onClose={() => setShowCompare(false)} title="Before / After" maxWidth="max-w-2xl">
        {photo1 !== null && photo2 !== null && photos[photo1] && photos[photo2] && (
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden select-none">
              <img src={photos[photo2].photo} alt="after" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                <img src={photos[photo1].photo} alt="before" className="absolute inset-0 h-full object-cover" style={{ width: `${100 / (sliderPos / 100)}%` }} />
              </div>
              <input type="range" min="0" max="100" value={sliderPos} onChange={e => setSliderPos(+e.target.value)} className="absolute top-1/2 -translate-y-1/2 w-full h-full opacity-0 cursor-ew-resize" />
              <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-full bg-white" style={{ left: `${sliderPos}%` }} />
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>{photos[photo1].date}</span>
              <span>{photos[photo2].date}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function profile_weight(state: any) { return state.weightLogs?.slice(-1)[0]?.weight || 75; }

// ============ BODY ANALYSIS ============
function BodyAnalysis({ profile, state }: any) {
  const latest = (state.bodyMeasurements || []).slice(-1)[0];
  const weight = latest?.weight || profile.weight;
  const bmi = calcBMI(weight, profile.height);
  const bmiCat = bmiCategory(bmi);
  const ideal = idealWeight(profile.height, profile.gender);
  const bfCat = bodyFatCategory(latest?.bodyFat || 20, profile.gender);

  const [restingHr, setRestingHr] = useState(60);
  const vo2max = useMemo(() => {
    return Math.round(15.3 * (220 - profile.age - restingHr) / restingHr);
  }, [profile.age, restingHr]);

  const metabolicAge = useMemo(() => {
    const bmr = 10 * weight + 6.25 * profile.height - 5 * profile.age + (profile.gender === 'male' ? 5 : -161);
    return Math.round(profile.age + (1500 - bmr) / 30);
  }, [weight, profile]);

  return (
    <div className="space-y-3">
      {/* BMI */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 dark:text-white">BMI</h3>
          <span className="text-2xl font-bold" style={{ color: bmiCat.color }}>{bmi.toFixed(1)}</span>
        </div>
        <div className="relative h-3 bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-red-500 rounded-full">
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-slate-400" style={{ left: `${Math.min(100, (bmi / 40) * 100)}%`, transform: 'translate(-50%, -50%)' }} />
        </div>
        <p className="text-sm mt-2" style={{ color: bmiCat.color }}>{bmiCat.label}</p>
        <p className="text-xs text-slate-500">Healthy range: 18.5 - 24.9</p>
      </div>

      {/* Ideal weight */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Ideal Weight Range</h3>
        <p className="text-2xl font-bold text-brand-500">{ideal.min} - {ideal.max} kg</p>
        <p className="text-xs text-slate-500">Based on Devine formula</p>
      </div>

      {/* Body fat */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 dark:text-white">Body Fat</h3>
          <span className="text-2xl font-bold" style={{ color: bfCat.color }}>{latest?.bodyFat || 20}%</span>
        </div>
        <p className="text-sm" style={{ color: bfCat.color }}>{bfCat.label}</p>
      </div>

      {/* VO2 Max */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Gauge className="w-4 h-4" /> VO2 Max Estimate</h3>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-slate-500">Resting HR:</label>
          <input type="number" value={restingHr} onChange={e => setRestingHr(+e.target.value)} className="w-20 bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
          <span className="text-sm text-slate-500">bpm</span>
        </div>
        <p className="text-2xl font-bold text-violet-500">{vo2max} <span className="text-sm text-slate-500">ml/kg/min</span></p>
      </div>

      {/* Metabolic age */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Metabolic Age</h3>
        <p className="text-2xl font-bold text-amber-500">{metabolicAge} <span className="text-sm text-slate-500">years</span></p>
        <p className="text-xs text-slate-500">Your actual age: {profile.age}</p>
      </div>
    </div>
  );
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Healthy', color: '#10b981' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
  return { label: 'Obese', color: '#ef4444' };
}
function idealWeight(height: number, gender: string) {
  const inches = height / 2.54; const base = gender === 'male' ? 50 : 45.5;
  const kg = base + 2.3 * Math.max(0, inches - 60);
  return { min: Math.round(kg * 0.9), max: Math.round(kg * 1.1) };
}
function bodyFatCategory(bf: number, gender: string) {
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
