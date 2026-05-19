import React from 'react';

export const Loader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    <p className="text-white/40 text-sm animate-pulse">Loading DApps from blockchain...</p>
  </div>
);

export const EmptyState = ({ message = "No DApps found", icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center glass rounded-3xl border-dashed border-2 border-white/5">
    {Icon && <Icon size={48} className="text-white/10 mb-4" />}
    <h3 className="text-xl font-bold text-white/60 mb-2">{message}</h3>
    <p className="text-white/30 text-sm max-w-xs">Try connecting your wallet or explore other categories.</p>
  </div>
);
