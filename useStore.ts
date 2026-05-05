import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Mood = 'frustré' | 'fatigué' | 'énergique' | 'zen' | 'créatif' | null;

export interface Task {
  id: string;
  title: string;
  description: string;
  timeEstimate: number;
  energyRequired: number;
  tag: string;
  status: 'todo' | 'doing' | 'done';
  zoneOverride?: 'green' | 'orange' | 'red';
  createdAt?: number;
  completedAt?: number;
}

interface AppState {
  user: {
    name: string;
    email?: string;
    domain: string;
    goals: string[];
    integrations: string[];
  } | null;
  setUser: (user: AppState['user']) => void;
  
  appMode: 'simple' | 'advanced';
  setAppMode: (mode: 'simple' | 'advanced') => void;

  currentMood: Mood;
  setMood: (mood: Mood) => void;
  
  currentEnergy: number;
  setEnergy: (energy: number) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  
  clearData: () => void;
}

const demoTasks: Task[] = [
  { id: uuidv4(), title: 'Brainstorming Campagne Q3', description: 'Trouver 5 idées créatives', timeEstimate: 45, energyRequired: 8, tag: 'Créatif', status: 'todo' },
  { id: uuidv4(), title: 'Trier les emails', description: 'Nettoyer la boite de réception', timeEstimate: 15, energyRequired: 2, tag: 'Admin', status: 'todo' },
  { id: uuidv4(), title: 'Réunion d\'équipe', description: 'Point hebdo', timeEstimate: 60, energyRequired: 5, tag: 'Réunion', status: 'todo' },
  { id: uuidv4(), title: 'Rédiger rapport', description: 'Synthèse du mois dernier', timeEstimate: 90, energyRequired: 6, tag: 'Concentration', status: 'todo' },
  { id: uuidv4(), title: 'Séance de Yoga', description: 'Étirements et respiration', timeEstimate: 20, energyRequired: 3, tag: 'Bien-être', status: 'todo' },
  { id: uuidv4(), title: 'Mise à jour CRM', description: 'Entrer les nouveaux leads', timeEstimate: 30, energyRequired: 4, tag: 'Admin', status: 'todo' },
  { id: uuidv4(), title: 'Design Landing Page', description: 'Maquettes Figma', timeEstimate: 120, energyRequired: 9, tag: 'Créatif', status: 'todo' }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      currentMood: null,
      setMood: (mood) => set({ currentMood: mood }),
      
      currentEnergy: 5,
      setEnergy: (energy) => set({ currentEnergy: energy }),
      
      tasks: demoTasks,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: uuidv4(), status: 'todo' }] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      
      appMode: 'simple',
      setAppMode: (mode) => set({ appMode: mode }),

      isOnboarded: false,
      setIsOnboarded: (val) => set({ isOnboarded: val }),
      
      clearData: () => set({ user: null, currentMood: null, tasks: demoTasks, isOnboarded: false, currentEnergy: 5, appMode: 'simple' })
    }),
    {
      name: 'planet-flow-storage'
    }
  )
);
