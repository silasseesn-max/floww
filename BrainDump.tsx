import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export function BrainDump() {
  const { addTask } = useStore();
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleMagicSort = () => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI parsing
    setTimeout(() => {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let count = 0;

      lines.forEach(line => {
        const l = line.toLowerCase();
        let tag = 'Général';
        let energy = 5;
        let time = 30;

        if (l.includes('mail') || l.includes('facture')) { tag = 'Admin'; energy = 2; time = 15; }
        else if (l.includes('design') || l.includes('maquette')) { tag = 'Créatif'; energy = 8; time = 60; }
        else if (l.includes('call') || l.includes('réunion')) { tag = 'Réunion'; energy = 4; time = 45; }
        else if (l.includes('sport') || l.includes('courir')) { tag = 'Santé'; energy = 9; time = 60; }
        
        addTask({
          title: line.trim(),
          description: 'Généré par Brain Dump',
          timeEstimate: time,
          energyRequired: energy,
          tag
        });
        count++;
      });

      setIsProcessing(false);
      setResult(count);
      setText('');

      setTimeout(() => setResult(null), 3000);
    }, 2000);
  };

  return (
    <div className="h-full p-8 flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Videz votre esprit 🧠</h2>
        <p className="text-xl opacity-70">Notez tout ce qui vous passe par la tête en vrac. L'IA se chargera de trier, estimer et catégoriser vos tâches.</p>
      </div>

      <div className="w-full relative flex-1 max-h-[500px]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Exemple :&#10;Répondre au mail de Sarah&#10;Faire la maquette de la landing page&#10;Aller courir 30 min..."
          className="w-full h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-xl resize-none outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/20 custom-scrollbar"
          disabled={isProcessing}
        />

        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mb-4"
              >
                <Loader2 className="w-12 h-12 text-purple-400" />
              </motion.div>
              <p className="text-xl font-bold animate-pulse">Notre IA trie tes idées...</p>
            </motion.div>
          )}

          {result !== null && !isProcessing && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-emerald-50"
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4" />
              <p className="text-3xl font-bold mb-2">Magie opérée ! ✨</p>
              <p className="text-xl">{result} tâche(s) ajoutée(s) et catégorisée(s).</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleMagicSort}
        disabled={!text.trim() || isProcessing}
        className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]"
      >
        <Sparkles className="w-6 h-6" />
        Organiser par magie
      </button>
    </div>
  );
}
