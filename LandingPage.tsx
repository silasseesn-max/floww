import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Battery, Zap, Sparkles } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold tracking-tight">PLANET FLOW</span>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium text-sm backdrop-blur-sm"
        >
          Connexion
        </button>
      </nav>

      {/* Hero */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Nouveau : L'IA d'analyse énergétique
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            La productivité qui <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              comprend vos émotions
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            La 1ère app qui s'adapte à votre énergie, pas l'inverse. 
            Découvrez un workflow qui respecte votre rythme biologique.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => navigate('/onboarding')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.7)] transition-all"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Features */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-fuchsia-400" />}
            title="Matching Émotionnel"
            desc="L'UI et vos tâches s'adaptent instantanément à votre humeur du moment."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Battery className="w-8 h-8 text-blue-400" />}
            title="Système d'Énergie"
            desc="Ne faites que ce que vous pouvez. Les tâches sont filtrées par énergie requise."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-purple-400" />}
            title="Brain Dump Magique"
            desc="Videz votre tête, notre IA trie et catégorise tout automatiquement."
            delay={0.6}
          />
        </div>

        {/* Testimonials */}
        <div className="mt-40 text-center">
          <h2 className="text-3xl font-bold mb-12">Ils ont retrouvé leur flow</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-lg italic mb-6">"Je n'utilise plus Notion. L'application me comprend quand je suis fatiguée et ne me montre que ce que je peux gérer. Ça a changé ma vie."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">S</div>
                <div>
                  <div className="font-bold">Sarah M.</div>
                  <div className="text-sm text-slate-400">Designer UI</div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-lg italic mb-6">"L'assistant vocal pour vider ma tête quand je marche, c'est de la magie pure. Tout est classé tout seul."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold">M</div>
                <div>
                  <div className="font-bold">Marc D.</div>
                  <div className="text-sm text-slate-400">Développeur Freelance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
