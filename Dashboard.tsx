import { useState } from 'react';
import { useStore } from '../store/useStore';
import { MoodCheck } from '../components/MoodCheck';
import { TaskBoard } from '../components/TaskBoard';
import { BrainDump } from '../components/BrainDump';
import { Timeline } from '../components/Timeline';
import { WeekView } from '../components/WeekView';
import { FlowBrain } from '../components/FlowBrain';
import { FloatingVoiceAssistant } from '../components/FloatingVoiceAssistant';
import { LayoutDashboard, Brain, Calendar, LogOut, ToggleLeft, ToggleRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

type Tab = 'board' | 'braindump' | 'timeline' | 'week' | 'ai';

export function Dashboard() {
  const { currentMood, currentEnergy, clearData, user, appMode, setAppMode } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('board');

  if (!currentMood) {
    return <MoodCheck />;
  }

  // Dynamic Theme based on mood
  const getThemeClasses = () => {
    switch (currentMood) {
      case 'énergique': return 'bg-gradient-to-br from-violet-900 to-blue-900 text-white selection:bg-white/30';
      case 'fatigué': return 'bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300';
      case 'créatif': return 'bg-gradient-to-br from-rose-900 to-orange-900 text-white';
      case 'zen': return 'bg-gradient-to-br from-emerald-900 to-teal-900 text-emerald-50';
      case 'frustré': return 'bg-gradient-to-br from-red-900 to-orange-900 text-white';
      default: return 'bg-slate-900 text-white';
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-700 ease-in-out flex", getThemeClasses())}>
      {/* Sidebar - Only visible in Advanced Mode or on desktop */}
      {appMode === 'advanced' && (
        <aside className="hidden md:flex w-64 border-r border-white/10 p-4 flex-col justify-between bg-black/20 backdrop-blur-xl z-20">
          <div>
            <div className="flex items-center gap-3 mb-12 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center font-bold shadow-lg border border-white/10">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden lg:block">
                <div className="font-semibold">{user?.name || 'User'}</div>
                <div className="text-xs opacity-60 capitalize">{currentMood} • {currentEnergy}/10 ⚡</div>
              </div>
            </div>

            <nav className="space-y-2">
              <NavButton icon={<LayoutDashboard />} label="Tâches" isActive={activeTab === 'board'} onClick={() => setActiveTab('board')} />
              <NavButton icon={<CheckCircle2 />} label="Semaine" isActive={activeTab === 'week'} onClick={() => setActiveTab('week')} />
              <NavButton icon={<Brain />} label="Brain Dump" isActive={activeTab === 'braindump'} onClick={() => setActiveTab('braindump')} />
              <NavButton icon={<Calendar />} label="Timeline" isActive={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
              <NavButton icon={<Sparkles />} label="FlowBrain IA" isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
            </nav>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setAppMode('simple')}
              className="w-full flex items-center gap-3 px-3 py-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ToggleRight className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Mode Simple</span>
            </button>
            <button onClick={clearData} className="w-full flex items-center gap-3 px-3 py-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        {appMode === 'simple' && (
          <header className="p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {user?.name?.[0]}
              </div>
              <div>
                <div className="font-bold">{user?.name}</div>
                <div className="text-xs opacity-70">Mode Simple</div>
              </div>
            </div>
            <button 
              onClick={() => setAppMode('advanced')}
              className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full text-sm hover:bg-black/40 transition-colors"
            >
              <ToggleLeft className="w-4 h-4" />
              Mode Avancé
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto">
          {appMode === 'simple' && activeTab !== 'week' && activeTab !== 'ai' ? (
            <div className="h-full"><TaskBoard /></div>
          ) : (
            <>
              {activeTab === 'board' && <TaskBoard />}
              {activeTab === 'braindump' && <BrainDump />}
              {activeTab === 'timeline' && <Timeline />}
              {activeTab === 'week' && <WeekView />}
              {activeTab === 'ai' && <FlowBrain />}
            </>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="flex md:hidden justify-around items-center p-4 bg-black/20 backdrop-blur-xl border-t border-white/10 z-20 pb-safe">
          <BottomNavBtn icon={<LayoutDashboard />} label="Auj." isActive={activeTab === 'board'} onClick={() => setActiveTab('board')} />
          <BottomNavBtn icon={<CheckCircle2 />} label="Semaine" isActive={activeTab === 'week'} onClick={() => setActiveTab('week')} />
          <button 
            onClick={() => setActiveTab('braindump')}
            className="w-14 h-14 -mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
          >
             <Brain className="w-6 h-6 text-white" />
          </button>
          <BottomNavBtn icon={<Sparkles />} label="IA" isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <BottomNavBtn icon={<LogOut />} label="Profil" isActive={false} onClick={clearData} />
        </nav>
      </main>

      <FloatingVoiceAssistant />
    </div>
  );
}

function BottomNavBtn({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1", isActive ? "text-white" : "text-white/50")}>
      <div className={cn("w-6 h-6", isActive && "text-purple-400")}>{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
        isActive 
          ? "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
          : "text-white/60 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon}
      <span className="hidden lg:block font-medium">{label}</span>
    </button>
  );
}
