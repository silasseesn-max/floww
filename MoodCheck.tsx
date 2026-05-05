import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, Mood } from '../store/useStore';
import { cn } from '../utils/cn';

const moods: { id: Mood; emoji: string; label: string; color: string }[] = [
  { id: 'frustré', emoji: '😤', label: 'Frustré', color: 'hover:bg-red-500/20 hover:border-red-500' },
  { id: 'fatigué', emoji: '😴', label: 'Fatigué', color: 'hover:bg-slate-500/20 hover:border-slate-500' },
  { id: 'énergique', emoji: '💪', label: 'Énergique', color: 'hover:bg-blue-500/20 hover:border-blue-500' },
  { id: 'zen', emoji: '🧘', label: 'Zen', color: 'hover:bg-emerald-500/20 hover:border-emerald-500' },
  { id: 'créatif', emoji: '🎨', label: 'Créatif', color: 'hover:bg-fuchsia-500/20 hover:border-fuchsia-500' },
];

export function MoodCheck() {
  const { setMood, setEnergy, user } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [energyVal, setEnergyVal] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setEnergy(energyVal);
      setMood(selectedMood);
    }, 800); // Wait for transition
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
        >
          Adaptation de ton espace...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow based on selected mood */}
      {selectedMood && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className={cn(
            "absolute inset-0 blur-[150px] transition-colors duration-1000 -z-10",
            selectedMood === 'frustré' && "bg-red-600",
            selectedMood === 'fatigué' && "bg-slate-600",
            selectedMood === 'énergique' && "bg-blue-600",
            selectedMood === 'zen' && "bg-emerald-600",
            selectedMood === 'créatif' && "bg-fuchsia-600",
          )}
        />
      )}

      <div className="max-w-2xl w-full space-y-16">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Bonjour {user?.name || ''}, comment te sens-tu ?
          </h1>
          <p className="text-xl text-slate-400">Pour adapter ton espace de travail aujourd'hui.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {moods.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(m.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300",
                selectedMood === m.id 
                  ? "border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
                  : `border-slate-800 bg-slate-800/50 ${m.color}`
              )}
            >
              <span className="text-6xl">{m.emoji}</span>
              <span className="font-medium text-lg">{m.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedMood ? 1 : 0 }}
          className="space-y-6 bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10"
        >
          <div className="flex justify-between items-end">
            <label className="text-xl font-medium">Niveau d'énergie</label>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              {energyVal}/10
            </span>
          </div>
          
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={energyVal}
            onChange={(e) => setEnergyVal(Number(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-slate-400">
            <span>Batterie faible</span>
            <span>À fond !</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedMood ? 1 : 0 }}
          className="flex justify-center"
        >
          <button
            onClick={handleSubmit}
            className="px-12 py-4 rounded-full bg-white text-slate-900 font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Commencer ma journée
          </button>
        </motion.div>
      </div>
    </div>
  );
}
