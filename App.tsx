import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { isOnboarded } = useStore();

  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-900 bg-slate-50 transition-colors duration-300">
        <Routes>
          <Route path="/" element={isOnboarded ? <Navigate to="/app" /> : <LandingPage />} />
          <Route path="/onboarding" element={isOnboarded ? <Navigate to="/app" /> : <Onboarding />} />
          <Route path="/app/*" element={isOnboarded ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
