import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export function FloatingVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const { addTask, setMood, setAppMode } = useStore();
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        handleProcessCommand(transcript);
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transcript]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const handleProcessCommand = (text: string) => {
    if (!text) return;
    const lower = text.toLowerCase();
    
    setTimeout(() => {
      let reply = "Je n'ai pas compris, mais je suis toujours en apprentissage !";
      
      if (lower.includes('ajoute') || lower.includes('créer')) {
        addTask({
          title: text.replace(/ajoute|créer/i, '').trim(),
          description: 'Créé via commande vocale',
          timeEstimate: 30,
          energyRequired: 5,
          tag: 'Vocal'
        });
        reply = "Tâche ajoutée avec succès !";
      } else if (lower.includes('fatigué')) {
        setMood('fatigué');
        reply = "Je passe ton espace en mode fatigué. Repose-toi bien.";
      } else if (lower.includes('mode simple')) {
        setAppMode('simple');
        reply = "Mode simple activé.";
      } else if (lower.includes('quoi faire')) {
        reply = "Je te suggère de regarder la colonne 'Parfait pour maintenant'.";
      }

      setResponse(reply);
      speak(reply);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-110 transition-transform z-50 group"
      >
        <Mic className="w-7 h-7 group-hover:animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 animate-ping" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900/80 border border-white/10 p-8 rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10 relative">
                  {isListening && (
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-purple-500"
                    />
                  )}
                  <Sparkles className={`w-10 h-10 ${isListening ? 'text-purple-400' : 'text-slate-400'}`} />
                </div>

                <div className="h-24 flex items-center justify-center flex-col">
                  {isListening ? (
                    <p className="text-2xl font-medium animate-pulse">{transcript || "Je t'écoute..."}</p>
                  ) : response ? (
                    <p className="text-xl text-purple-300">{response}</p>
                  ) : (
                    <p className="text-xl text-slate-400">Appuie pour parler</p>
                  )}
                </div>

                <button 
                  onClick={toggleListen}
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-white text-slate-900 hover:scale-105'
                  }`}
                >
                  {isListening ? <div className="w-6 h-6 bg-white rounded-sm" /> : <Mic className="w-8 h-8" />}
                </button>

                <div className="pt-8 grid grid-cols-2 gap-2 text-sm text-slate-400">
                  <div className="bg-white/5 rounded-xl p-3">"Ajoute réunion demain 14h"</div>
                  <div className="bg-white/5 rounded-xl p-3">"Je suis fatigué"</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}