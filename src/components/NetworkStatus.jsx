import React from 'react';
import { useAccount, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const NetworkStatus = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400">Please connect your wallet to see status</p>
      </div>
    );
  }

  const isSepolia = chainId === sepolia.id;

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Wallet Status</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Connection Status:</span>
          <span className="text-green-400 font-medium">Connected</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Wallet Address:</span>
          <span className="font-mono text-sm bg-white/5 px-2 py-1 rounded">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Network:</span>
          {isSepolia ? (
            <span className="text-green-400 flex items-center gap-1">
              Connected to Sepolia ✅
            </span>
          ) : (
            <span className="text-red-400 font-bold animate-pulse">
              Wrong Network — Please switch to Ethereum Sepolia
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
