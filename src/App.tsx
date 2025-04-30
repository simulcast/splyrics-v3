import { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AppProvider } from '@/context/AppContext';
import './App.css';
import { AnimatePresence } from 'framer-motion';

function App() {
  // Update the document title when the component mounts
  useEffect(() => {
    document.title = 'Lyrics Assistant';
  }, []);

  return (
    <AppProvider>
      <AnimatePresence>
        <MainLayout />
      </AnimatePresence>
    </AppProvider>
  );
}

export default App;