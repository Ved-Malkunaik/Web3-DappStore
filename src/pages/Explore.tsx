import React, { useState, useEffect } from 'react';
import { useDAppStore } from '../hooks/useDAppStore';
import DAppCard from '../components/DAppCard';
import { Loader, EmptyState } from '../components/Common';
import { Search, Compass, Sparkles } from 'lucide-react';
import { useWatchContractEvent } from 'wagmi';
import { DAPP_STORE_ADDRESS } from '../constants';
import DAppStoreABI from '../abi/DAppStore.json';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Explore = () => {
  const { dapps, isDAppsLoading, refetchDApps } = useDAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // PRO LEVEL: Listen to contract events for real-time updates
  useWatchContractEvent({
    address: DAPP_STORE_ADDRESS as `0x${string}`,
    abi: DAppStoreABI,
    eventName: 'DAppUnpublished',
    onLogs(logs) {
      console.log('DApp Unpublished Event Detected!', logs);
      refetchDApps();
      // Optional: show a toast if someone else unpublishes a DApp
      // toast('Marketplace updated', { icon: '🔄' });
    },
  });

  useWatchContractEvent({
    address: DAPP_STORE_ADDRESS as `0x${string}`,
    abi: DAppStoreABI,
    eventName: 'DAppListed',
    onLogs() {
      refetchDApps();
    },
  });

  const filteredDApps = [...(dapps || [])]
    .filter(dapp => dapp.isActive) // Contract might already filter, but extra safety
    .reverse()
    .filter(dapp => 
      dapp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dapp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 space-y-8 md:space-y-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-primary mb-2 font-semibold text-sm uppercase tracking-widest">
            <Sparkles size={16} />
            <span>Marketplace</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">DApps</span>
          </h1>
          <p className="text-white/40 max-w-md">
            Discover and purchase the next generation of decentralized applications and tools.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-full md:w-[400px]"
        >
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] text-sm transition-all backdrop-blur-xl shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {isDAppsLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="glass rounded-3xl aspect-[4/5] animate-pulse-slow border border-white/5" />
            ))}
          </motion.div>
        ) : filteredDApps.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredDApps.map((dapp) => (
              <DAppCard key={dapp.id.toString()} dapp={dapp} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <EmptyState 
              icon={Compass} 
              message={searchQuery ? "No results found" : "Marketplace is currently empty"} 
              submessage={searchQuery ? `We couldn't find any DApps matching "${searchQuery}"` : "Be the first one to publish a DApp!"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
