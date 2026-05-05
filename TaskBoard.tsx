import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Task } from '../store/useStore';
import { Clock, Zap, Plus, Play } from 'lucide-react';
import { cn } from '../utils/cn';

type Zone = 'green' | 'orange' | 'red';

export function TaskBoard() {
  const { tasks, currentEnergy, updateTask, addTask } = useStore();
  const [isFocusMode, setIsFocusMode] = useState<Task | null>(null);

  // Calculate default zone based on energy
  const getTaskZone = (task: Task): Zone => {
    if (task.zoneOverride) return task.zoneOverride;
    const diff = task.energyRequired - currentEnergy;
    if (diff <= 0) return 'green';
    if (diff <= 2) return 'orange';
    return 'red';
  };

  const tasksByZone = useMemo(() => {
    const grouped: Record<Zone, Task[]> = { green: [], orange: [], red: [] };
    tasks.forEach(t => grouped[getTaskZone(t)].push(t));
    return grouped;
  }, [tasks, currentEnergy]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, zone: Zone) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { zoneOverride: zone });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isFocusMode) {
    return <FocusMode task={isFocusMode} onClose={() => setIsFocusMode(null)} />;
  }

  const { appMode } = useStore();

  if (appMode === 'simple') {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">À faire maintenant</h2>
        
        <div className="w-full space-y-4 mb-8">
          <AnimatePresence>
            {tasksByZone.green.slice(0, 3).map((task: Task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 p-6 rounded-3xl border border-white/20 shadow-lg backdrop-blur-md flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xl mb-1">{task.title}</h4>
                  <div className="flex items-center gap-3 text-sm opacity-70">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {task.timeEstimate}m</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-md">{task.tag}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFocusMode(task)}
                  className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 ml-1" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {tasksByZone.green.length === 0 && (
            <p className="text-center text-slate-400 py-8">Rien d'urgent pour cette énergie !</p>
          )}
        </div>

        <button 
          onClick={() => {
            const title = prompt('Nouvelle tâche ?');
            if (title) addTask({ title, description: '', timeEstimate: 30, energyRequired: 5, tag: 'Nouveau' });
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Ton espace de Flow</h2>
          <p className="opacity-70">Les tâches sont filtrées selon ton énergie actuelle ({currentEnergy}/10).</p>
        </div>
        <button 
          onClick={() => {
            const title = prompt('Nouvelle tâche ?');
            if (title) {
              addTask({ title, description: '', timeEstimate: 30, energyRequired: 5, tag: 'Nouveau' });
            }
          }}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors backdrop-blur-md"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        <ZoneColumn 
          title="Parfait pour maintenant" 
          zone="green" 
          color="border-emerald-500/30 bg-emerald-500/10" 
          tasks={tasksByZone.green} 
          onDrop={(e) => handleDrop(e, 'green')}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onFocus={(t) => setIsFocusMode(t)}
        />
        <ZoneColumn 
          title="Possible" 
          zone="orange" 
          color="border-amber-500/30 bg-amber-500/10" 
          tasks={tasksByZone.orange} 
          onDrop={(e) => handleDrop(e, 'orange')}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onFocus={(t) => setIsFocusMode(t)}
        />
        <ZoneColumn 
          title="À reporter" 
          zone="red" 
          color="border-rose-500/30 bg-rose-500/10" 
          tasks={tasksByZone.red} 
          onDrop={(e) => handleDrop(e, 'red')}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onFocus={(t) => setIsFocusMode(t)}
        />
      </div>
    </div>
  );
}

interface ZoneColumnProps {
  title: string;
  zone?: string;
  color: string;
  tasks: Task[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: any, taskId: string) => void;
  onFocus: (task: Task) => void;
}

function ZoneColumn({ title, color, tasks, onDrop, onDragOver, onDragStart, onFocus }: ZoneColumnProps) {
  return (
    <div 
      className={cn("rounded-3xl border-2 flex flex-col overflow-hidden backdrop-blur-sm", color)}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="p-4 border-b border-white/10 font-bold flex justify-between items-center bg-black/10">
        <h3>{title}</h3>
        <span className="px-2 py-1 bg-white/20 rounded-lg text-sm">{tasks.length}</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task: Task) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="bg-white/10 p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:bg-white/20 transition-colors border border-white/5 shadow-lg group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded-md">
                  {task.tag}
                </span>
                <button 
                  onClick={() => onFocus(task)}
                  className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <h4 className="font-bold text-lg leading-tight mb-1">{task.title}</h4>
              <p className="text-sm opacity-70 mb-4 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center gap-4 text-xs opacity-80">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.timeEstimate} min
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  {task.energyRequired}/10
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FocusMode({ task, onClose }: { task: Task; onClose: () => void }) {
  const [timeLeft] = useState(task.timeEstimate * 60);

  // Simple visual timer logic here
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Animated abstract background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-purple-900/40 to-blue-900/40 blur-[100px] rounded-full -z-10"
      />

      <div className="max-w-2xl text-center space-y-8 z-10">
        <button onClick={onClose} className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
          Quitter le mode focus
        </button>

        <h1 className="text-5xl font-bold">{task.title}</h1>
        <p className="text-xl text-slate-400">{task.description}</p>

        <div className="text-9xl font-extrabold tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <button className="w-24 h-24 mx-auto rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]">
          <Play className="w-10 h-10 ml-2" />
        </button>
      </div>
    </motion.div>
  );
}
