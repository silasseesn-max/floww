import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Zap, Target } from 'lucide-react';
import { useStore } from '../store/useStore';

export function FlowBrain() {
  const { currentMood, currentEnergy } = useStore();

  return (
    <div className="h-full p-8 max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-bold">FlowBrain IA</h2>
          <p className="text-xl text-slate-400">Ton assistant de productivité intelligent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Main suggestion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-3 text-purple-400 mb-4 font-medium">
            <Sparkles className="w-5 h-5" />
            Suggestion du moment
          </div>
          <p className="text-2xl md:text-3xl leading-tight mb-8 max-w-3xl">
            "D'après ton mood actuel (<span className="text-white capitalize">{currentMood || 'neutre'}</span>) et ton énergie ({currentEnergy}/10), je te conseille de te concentrer sur des tâches <span className="font-bold text-white">Créatives</span> et de repousser l'administratif."
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-full font-bold transition-colors shadow-lg shadow-purple-500/20">
              Appliquer les filtres
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors">
              Ignorer
            </button>
          </div>
        </motion.div>

        {/* Energy Prediction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-[2rem] bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Zap className="text-yellow-400" /> Prédiction d'Énergie</h3>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">Prochaines 4h</span>
          </div>
          <div className="h-40 flex items-end gap-2 justify-between px-2">
            {[4, 6, 8, 9, 7, 5, 3].map((val, i) => (
              <div key={i} className="w-full relative group">
                <div 
                  className="w-full bg-gradient-to-t from-yellow-600/50 to-yellow-400 rounded-t-sm transition-all"
                  style={{ height: `${val * 10}%` }}
                />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">Pic prévu à 14h00</p>
        </motion.div>

        {/* Pattern Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-[2rem] bg-white/5 border border-white/10"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><TrendingUp className="text-emerald-400" /> Tes Patterns</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="mt-1"><Target className="w-5 h-5 text-blue-400" /></div>
              <div>
                <p className="font-medium">Créatif le matin</p>
                <p className="text-sm text-slate-400">78% de tes tâches créatives sont faites avant 11h.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className="mt-1"><Target className="w-5 h-5 text-rose-400" /></div>
              <div>
                <p className="font-medium">Baisse le vendredi</p>
                <p className="text-sm text-slate-400">Ton énergie chute de 40% le vendredi aprem.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}