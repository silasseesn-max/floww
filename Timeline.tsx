import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export function Timeline() {
  const { tasks, currentEnergy } = useStore();

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6h to 23h

  // Mock energy curve: bell curve around noon/2pm
  const getExpectedEnergy = (hour: number) => {
    if (hour < 8) return currentEnergy - 2;
    if (hour < 12) return currentEnergy;
    if (hour < 15) return currentEnergy + 2;
    if (hour < 18) return currentEnergy - 1;
    return currentEnergy - 3;
  };

  const getEnergyColor = (e: number) => {
    if (e >= 8) return 'bg-blue-500/20 border-blue-500/50';
    if (e >= 5) return 'bg-emerald-500/20 border-emerald-500/50';
    if (e >= 3) return 'bg-amber-500/20 border-amber-500/50';
    return 'bg-rose-500/20 border-rose-500/50';
  };

  return (
    <div className="h-full p-8 flex flex-col max-w-6xl mx-auto overflow-hidden">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Timeline d'Énergie ⚡</h2>
        <p className="opacity-70">Visualise tes pics d'énergie prévus pour la journée et planifie en conséquence.</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden relative pb-10 custom-scrollbar">
        <div className="min-w-[1200px] h-full flex flex-col justify-end pt-12 relative">
          
          {/* Timeline track */}
          <div className="absolute bottom-10 left-0 right-0 h-1 bg-white/10" />

          {/* Hours and Energy Bars */}
          <div className="flex h-full items-end justify-between px-4 pb-12 gap-2">
            {hours.map((hour, i) => {
              const expectedE = Math.max(1, Math.min(10, getExpectedEnergy(hour)));
              const heightStr = `${expectedE * 10}%`;

              return (
                <div key={hour} className="flex-1 flex flex-col items-center justify-end relative group h-full">
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: heightStr, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.5, type: 'spring' }}
                    className={`w-full rounded-t-lg border-t-2 border-x-2 ${getEnergyColor(expectedE)} transition-all group-hover:bg-opacity-40`}
                  />
                  
                  {/* Tooltip for exact energy */}
                  <div className="absolute top-0 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none border border-white/10 shadow-xl">
                    Énergie: {expectedE}/10
                  </div>

                  {/* Hour Label */}
                  <span className="absolute -bottom-8 text-sm font-medium opacity-50">{hour}h</span>
                </div>
              );
            })}
          </div>

          {/* Dummy tasks placed loosely */}
          <div className="absolute inset-0 pointer-events-none px-4 pt-12">
            {tasks.slice(0, 3).map((task, i) => {
              const leftPos = 15 + (i * 25);
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={task.id}
                  className="absolute p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg w-48 z-10 pointer-events-auto cursor-grab"
                  style={{ left: `${leftPos}%`, top: '40%' }}
                >
                  <h4 className="font-bold text-sm mb-1 truncate">{task.title}</h4>
                  <div className="text-xs opacity-70 flex justify-between">
                    <span>{task.timeEstimate}m</span>
                    <span>⚡ {task.energyRequired}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
