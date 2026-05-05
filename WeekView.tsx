import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export function WeekView() {
  const { tasks } = useStore();

  // Mock data for weekly view
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0 = Lun

  const tasksByDay = useMemo(() => {
    // In a real app, this would group tasks by task.createdAt or task.scheduledFor
    // Here we'll just mock distribution for visual representation
    return days.map((_, index) => {
      if (index > todayIndex) return []; // Future days are empty
      // Mock tasks for past/current days
      return tasks.slice(0, index + 1).map(t => ({
        ...t,
        status: Math.random() > 0.3 ? 'done' : 'todo'
      }));
    });
  }, [tasks]);

  const totalTasks = tasksByDay.flat().length;
  const completedTasks = tasksByDay.flat().filter(t => t.status === 'done').length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getMotivationMessage = (rate: number) => {
    if (rate < 30) return "Chaque petit pas compte 🌱";
    if (rate < 60) return "Tu progresses bien ! Continue 💪";
    if (rate < 90) return "Excellente dynamique ! 🔥";
    return "Semaine légendaire ! 🏆";
  };

  return (
    <div className="h-full p-4 md:p-8 max-w-6xl mx-auto overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Ma Semaine</h2>
        <p className="text-xl text-slate-400">Suis ton évolution et ton énergie.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Motivation Meter */}
        <div className="col-span-1 lg:col-span-3 flex flex-col md:flex-row items-center justify-between p-8 rounded-[2rem] bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10">
          <div className="flex items-center gap-8 mb-6 md:mb-0">
            {/* Circular Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-white/10" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-purple-500 transition-all duration-1000 ease-out" 
                  strokeWidth="8" fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * completionRate) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{completionRate}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {getMotivationMessage(completionRate)}
              </h3>
              <p className="text-slate-400">{completedTasks} tâches terminées sur {totalTasks}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center">
              <Flame className="w-6 h-6 text-orange-500 mb-1" />
              <span className="font-bold text-xl">3</span>
              <span className="text-xs text-slate-400">Jours de suite</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center">
              <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
              <span className="font-bold text-xl">12</span>
              <span className="text-xs text-slate-400">Objectifs</span>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {days.map((day, i) => (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "p-4 rounded-2xl border flex flex-col",
                i === todayIndex ? "bg-white/10 border-purple-500" : "bg-white/5 border-white/5",
                i > todayIndex ? "opacity-50" : ""
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{day}</span>
                {i <= todayIndex && <span className="text-xl">⚡</span>}
              </div>
              
              <div className="space-y-2 mt-auto">
                {i <= todayIndex ? (
                  <>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full" 
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 text-center">{tasksByDay[i].length} tâches</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center italic">À venir</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Recap */}
        <div className="col-span-1 lg:col-span-3 bg-white/5 rounded-[2rem] p-6 md:p-8 mt-4">
          <h3 className="text-2xl font-bold mb-6">Récapitulatif d'aujourd'hui</h3>
          <div className="space-y-3">
            {tasksByDay[todayIndex]?.length > 0 ? (
              tasksByDay[todayIndex].map((task: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="text-emerald-500 w-6 h-6 flex-shrink-0" />
                    ) : (
                      <Circle className="text-slate-500 w-6 h-6 flex-shrink-0" />
                    )}
                    <span className={cn("font-medium", task.status === 'done' && "line-through opacity-50")}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-md whitespace-nowrap hidden md:block">
                    {task.tag}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Rien pour aujourd'hui !</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}