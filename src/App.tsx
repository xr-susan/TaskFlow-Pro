/**
 * App root component
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTaskStore } from './stores/taskStore';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const App = () => {
  const { darkMode } = useTaskStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-app transition-colors duration-200">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
