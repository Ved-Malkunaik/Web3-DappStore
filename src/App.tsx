import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import DAppDetails from './pages/DAppDetails';
import Publish from './pages/Publish';
import Purchases from './pages/Purchases';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30">
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
            },
          }}
        />
        
        <Navbar />
        
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dapp/:id" element={<DAppDetails />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/purchases" element={<Purchases />} />
          </Routes>
        </main>

        <footer className="py-12 border-t border-white/5 text-center text-white/20 text-xs">
          <p>© 2026 Web3 DApp Marketplace. Built for Ethereum Sepolia.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
