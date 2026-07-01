import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Check, Search } from 'lucide-react';

// ============ MUSCLE DIAGRAM SVG ============
const MUSCLE_PATHS: Record<string, { front: string; back: string }> = {
  Chest: { front: 'M65 85 Q75 80 85 85 L82 105 Q75 108 68 105 Z', back: '' },
  Shoulders: { front: 'M55 78 Q60 72 68 75 L65 85 Q58 85 55 82 Z M95 78 Q90 72 82 75 L85 85 Q92 85 95 82 Z', back: 'M55 78 Q60 72 68 75 L65 85 Q58 85 55 82 Z M95 78 Q90 72 82 75 L85 85 Q92 85 95 82 Z' },
  Back: { front: '', back: 'M65 85 L85 85 L83 120 L67 120 Z' },
  Biceps: { front: 'M52 90 Q50 100 52 110 L58 108 Q56 98 58 92 Z', back: '' },
  Triceps: { front: 'M98 90 Q100 100 98 110 L92 108 Q94 98 92 92 Z', back: 'M52 90 Q50 100 52 110 L58 108 Q56 98 58 92 Z M98 90 Q100 100 98 110 L92 108 Q94 98 92 92 Z' },
  Quads: { front: 'M62 140 Q60 155 62 170 L70 168 Q68 155 70 145 Z M88 140 Q90 155 88 170 L80 168 Q82 155 80 145 Z', back: '' },
  Hamstrings: { front: '', back: 'M62 140 Q60 155 62 170 L70 168 Q68 155 70 145 Z M88 140 Q90 155 88 170 L80 168 Q82 155 80 145 Z' },
  Glutes: { front: '', back: 'M62 125 Q75 120 88 125 L85 140 Q75 143 65 140 Z' },
  Calves: { front: 'M64 185 Q62 195 64 205 L70 203 Q68 195 70 188 Z M86 185 Q88 195 86 205 L80 203 Q82 195 80 188 Z', back: 'M64 185 Q62 195 64 205 L70 203 Q68 195 70 188 Z M86 185 Q88 195 86 205 L80 203 Q82 195 80 188 Z' },
  Core: { front: 'M68 110 L82 110 L80 135 Q75 138 70 135 Z', back: '' },
  Forearms: { front: 'M45 115 Q43 125 45 135 L52 133 Q50 125 52 118 Z M105 115 Q107 125 105 135 L98 133 Q100 125 98 118 Z', back: 'M45 115 Q43 125 45 135 L52 133 Q50 125 52 118 Z M105 115 Q107 125 105 135 L98 133 Q100 125 98 118 Z' },
  Traps: { front: 'M68 72 Q75 68 82 72 L80 80 Q75 82 70 80 Z', back: 'M68 72 Q75 68 82 72 L80 80 Q75 82 70 80 Z' },
};

export function MuscleDiagram({ muscles, size = 120 }: { muscles: string[]; size?: number }) {
  const [view, setView] = useState<'front' | 'back'>('front');
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 2.1} viewBox="0 0 150 320" className="overflow-visible">
        {/* Body silhouette */}
        <path d="M75 30 Q65 28 60 35 Q55 45 55 55 Q50 60 48 70 L45 85 Q43 95 45 105 L48 115 Q45 125 45 135 L50 140 Q48 150 50 160 L55 165 Q52 175 55 185 L60 195 Q58 205 60 215 L65 225 Q62 235 65 245 L70 250 L72 280 Q70 290 72 300 L75 305 L78 300 Q80 290 78 280 L80 250 L85 245 Q88 235 85 225 L90 215 Q92 205 90 195 L95 185 Q98 175 95 165 L100 160 Q102 150 100 140 L105 135 Q105 125 102 115 L105 105 Q107 95 105 85 L102 70 Q100 60 95 55 Q95 45 90 35 Q85 28 75 30 Z"
          fill="rgba(148,163,184,0.15)" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
        {/* Head */}
        <circle cx="75" cy="20" r="12" fill="rgba(148,163,184,0.15)" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
        {/* Highlighted muscles */}
        {muscles.map(m => {
          const paths = MUSCLE_PATHS[m];
          if (!paths) return null;
          const d = view === 'front' ? paths.front : paths.back;
          if (!d) return null;
          return <path key={m} d={d} fill="#10b981" opacity="0.7" className="animate-pulse" style={{ animationDuration: '2s' }} />;
        })}
      </svg>
      <div className="flex gap-1 mt-1">
        <button onClick={() => setView('front')} className={`text-xs px-2 py-0.5 rounded ${view === 'front' ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Front</button>
        <button onClick={() => setView('back')} className={`text-xs px-2 py-0.5 rounded ${view === 'back' ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Back</button>
      </div>
    </div>
  );
}

// ============ RING CHART ============
export function RingChart({ value, max, size = 120, stroke = 10, color = '#10b981', label, sublabel }: {
  value: number; max: number; size?: number; stroke?: number; color?: string; label?: string; sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, max > 0 ? value / max : 0);
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  const offset = circ - animated * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-200 dark:text-slate-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-lg font-bold">{label}</span>}
        {sublabel && <span className="text-xs text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}

// ============ WATER BOTTLE ============
export function WaterBottle({ cups, goal, size = 120 }: { cups: number; goal: number; size?: number }) {
  const pct = Math.min(1, goal > 0 ? cups / goal : 0);
  const fillHeight = pct * (size - 20);
  return (
    <div className="relative" style={{ width: size * 0.6, height: size }}>
      <div className="absolute inset-0 rounded-2xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="absolute bottom-0 left-0 right-0 water-wave transition-all duration-700"
          style={{ height: fillHeight, background: 'linear-gradient(180deg, #38bdf8, #0ea5e9)' }}>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[200%] h-4 bg-sky-400 rounded-full opacity-60" />
        </div>
      </div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-300 dark:bg-slate-600 rounded-t-md" />
    </div>
  );
}

// ============ MODAL ============
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 press">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// ============ SEARCH INPUT ============
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 ring-brand-500 text-sm" />
    </div>
  );
}

// ============ CHIPS ============
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all press ${active ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
      {children}
    </button>
  );
}

// ============ STAT CARD ============
export function StatCard({ icon, label, value, sub, color = '#10b981', onClick }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string; onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 card-hover ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20', color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ============ TOAST CONTAINER ============
export function ToastContainer({ toasts }: { toasts: { id: string; text: string; type: string }[] }) {
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map(t => (
        <div key={t.id} className="animate-slide-up bg-slate-900 dark:bg-slate-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm">
          {t.type === 'success' && <Check className="w-4 h-4 text-brand-400" />}
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ============ TYPING INDICATOR ============
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
      <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
      <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
    </div>
  );
}
