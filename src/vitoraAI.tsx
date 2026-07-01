import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Sparkles, User, RotateCcw, Bot as BotIcon } from 'lucide-react';
import { TypingIndicator } from './vitoraUI';
import { type UserProfile, type AppState, type ChatMessage } from './vitoraCore';

interface AICoachProps {
  profile: UserProfile;
  state: AppState;
  update: (patch: any) => void;
  toast: (text: string, type?: string) => void;
}

const SUGGESTED_PROMPTS = [
  'Create a workout for today',
  'Analyze my nutrition this week',
  "I'm feeling sore, what should I do?",
  'Am I on track for my goal?',
  'Suggest a high-protein meal under 500 calories',
];

export function AICoach({ profile, state, update, toast }: AICoachProps) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const history = (state.chatHistory || []).slice(-50);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, typing]);

  const buildSystemPrompt = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const recentWorkouts = (state.workoutLogs || []).slice(-5).map((w: any) => ({ name: w.name, date: w.date, duration: w.duration, volume: w.volume }));
    const todayFoods = (state.foodLogs || []).filter((f: any) => f.date === today);
    const consumed = todayFoods.reduce((s: number, f: any) => s + f.calories * f.servings, 0);
    const recentData = {
      recentWorkouts,
      todayCalories: consumed,
      calorieTarget: Math.round((10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.gender === 'male' ? 5 : -161)) * 1.55),
      weight: profile.weight,
      streak: 'calculating...',
    };
    return `You are Vitora AI, an expert personal trainer and nutritionist. User profile: ${JSON.stringify({ name: profile.name, goal: profile.goal, age: profile.age, weight: profile.weight, height: profile.height, activity: profile.activity })}. Recent data: ${JSON.stringify(recentData)}. Be concise, motivating, and specific. When generating workouts or meals, respond in JSON format.`;
  }, [profile, state]);

  const send = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || typing) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content, timestamp: Date.now() };
    const newHistory = [...history, userMsg].slice(-50);
    update({ chatHistory: newHistory });
    setTyping(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const aiContent = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

      const aiMsg: ChatMessage = { role: 'assistant', content: aiContent, timestamp: Date.now() };
      update((prev: any) => ({ chatHistory: [...(prev.chatHistory || []), aiMsg].slice(-50) }));
    } catch (err) {
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Here's a tip: Stay consistent with your workouts and nutrition — small daily habits lead to big results! (This is a fallback response when the AI API is unavailable.)",
        timestamp: Date.now(),
      };
      update((prev: any) => ({ chatHistory: [...(prev.chatHistory || []), aiMsg].slice(-50) }));
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => { update({ chatHistory: [] }); toast('Chat cleared', 'info'); };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Coach</h1>
            <p className="text-xs text-slate-500">Powered by Claude</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto space-y-3 pb-2">
        {history.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Hi {profile.name}! I'm your AI fitness coach.</p>
            <p className="text-sm text-slate-500 mt-1">Ask me anything about workouts, nutrition, or recovery.</p>
          </div>
        )}

        {history.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? '' : 'bg-gradient-to-br from-violet-500 to-violet-700'}`}
              style={msg.role === 'user' ? { backgroundColor: profile.avatarColor } : {}}>
              {msg.role === 'user' ? <span className="text-xs font-bold text-white">{profile.name[0]?.toUpperCase()}</span> : <BotIcon className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0">
              <BotIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl"><TypingIndicator /></div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {history.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTED_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-all press">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask your AI coach..." className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-violet-500 text-slate-900 dark:text-white" />
        <button onClick={() => send()} disabled={typing || !input} className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center press disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
