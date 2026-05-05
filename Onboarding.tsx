import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const goalsList = [
  { id: 'prod', label: 'Être plus productif', icon: '🚀' },
  { id: 'crea', label: 'Libérer ma créativité', icon: '🎨' },
  { id: 'zen', label: 'Trouver mon équilibre', icon: '⚖️' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { setUser, setIsOnboarded } = useStore();
  const [step, setStep] = useState(1);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState<string>('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setUser({ name, email, domain: 'Non spécifié', goals: [goal], integrations: [] });
      setIsOnboarded(true);
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-800 w-full fixed top-0">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: '33%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center mb-12">
                  <h2 className="text-4xl font-bold">Faisons connaissance 👋</h2>
                  <p className="text-slate-400">Comment doit-on t'appeler ?</p>
                </div>

                <div className="space-y-6 flex flex-col items-center">
                  <div className="w-full relative">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl text-slate-500">Je m'appelle</span>
                    <input
                      type="text"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-3xl pl-40 pr-8 py-6 focus:ring-4 focus:ring-purple-500 outline-none transition-all text-2xl font-bold text-center"
                      placeholder="Alex"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center mb-12">
                  <h2 className="text-4xl font-bold">Ton objectif ? 🎯</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {goalsList.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => { setGoal(g.id); handleNext(); }}
                      className={cn(
                        "p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-6",
                        goal === g.id
                          ? "border-purple-500 bg-purple-500/20" 
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <span className="text-5xl">{g.icon}</span>
                      <span className="text-2xl font-bold">{g.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center mb-12">
                  <h2 className="text-4xl font-bold">Crée ton compte rapide ⚡</h2>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-500 outline-none text-xl"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-500 outline-none text-xl"
                    placeholder="Mot de passe"
                  />
                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500">OU</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                  </div>
                  <button onClick={handleNext} className="w-full p-4 rounded-2xl bg-white text-slate-900 font-bold text-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-3">
                    Continuer avec Google (Simulé)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
              className="text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>

            {step !== 2 && (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !name) || (step === 3 && (!email || !password))}
                className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 ? "C'est parti" : "Suivant"}
                {step < 3 && <ArrowRight className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
