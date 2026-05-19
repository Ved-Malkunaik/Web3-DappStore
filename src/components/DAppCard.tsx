import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Info, Download, Tag, X, ShieldCheck } from 'lucide-react';
import { useAccount, useSwitchChain } from 'wagmi';
import { formatEther, shortenAddress } from '../utils/helpers';
import { getIPFSUrl } from '../utils/ipfsGateway';
import { useUnpublishDApp } from '../hooks/useUnpublishDApp';
import ConfirmUnpublishModal from './ConfirmUnpublishModal';
import { motion } from 'framer-motion';

interface DApp {
  id: bigint;
  owner: string;
  name: string;
  description: string;
  demoLink: string;
  ipfsHash: string;
  price: bigint;
  downloadCount: bigint;
  isActive: boolean;
}

interface DAppCardProps {
  dapp: DApp;
  isPurchased?: boolean;
}

const DAppCard: React.FC<DAppCardProps> = ({ dapp, isPurchased = false }) => {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { unpublishDApp, isPending } = useUnpublishDApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // SEPOLIA CHAIN ID is 1115511
  const SEPOLIA_ID = 1115511;
  const isOwner = address && dapp.owner.toLowerCase() === address.toLowerCase();

  const handleUnpublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (chainId !== SEPOLIA_ID) {
      toast.error("Please switch to Sepolia network");
      switchChain?.({ chainId: SEPOLIA_ID });
      return;
    }
    
    console.log("Unpublish clicked for DApp:", dapp.id, dapp.name);
    setIsModalOpen(true);
    console.log("isModalOpen set to true");
  };

  const handleConfirmUnpublish = async () => {
    try {
      await unpublishDApp(dapp.id);
      setIsModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (!dapp.isActive && !isPurchased) return null;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass group rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 flex flex-col h-full relative"
    >

      {/* Image / Identicon Section */}
      <div className="relative aspect-[16/10] bg-dark-lighter flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80 z-10" />
        <img 
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${dapp.name}`} 
          alt={dapp.name}
          className="w-32 h-32 group-hover:scale-110 transition-transform duration-700 ease-out opacity-80"
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {isPurchased && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Owned
            </div>
          )}
          {!dapp.isActive && isPurchased && (
            <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
              Unpublished by developer
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/20">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {dapp.name}
          </h3>
          <div className="flex items-center text-primary font-mono text-sm font-bold bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
            <Tag size={14} className="mr-1.5" />
            {formatEther(dapp.price)} ETH
          </div>
        </div>

        <p className="text-white/40 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {dapp.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-[11px] text-white/30 bg-white/5 px-3 py-1.5 rounded-full">
            <span className="font-mono">Dev: {shortenAddress(dapp.owner)}</span>
          </div>
          <div className="text-[11px] text-white/30">
            {dapp.downloadCount.toString()} installs
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to={`/dapp/${dapp.id}`}
            className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3.5 rounded-2xl transition-all border border-white/5"
          >
            <Info size={16} />
            <span>View Details</span>
          </Link>
          
          <a 
            href={dapp.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl transition-all border border-primary/10"
            title="Live Demo"
          >
            <ExternalLink size={18} />
          </a>

          {isPurchased && (
            <button 
              onClick={() => {
                const downloadUrl = getIPFSUrl(dapp.ipfsHash);
                window.open(downloadUrl, '_blank');
              }}
              className="p-3.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-2xl transition-all border border-green-500/10"
              title="Download Source"
            >
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Unpublish Button Overlay - Moved to end for Z-index priority */}
      {isOwner && dapp.isActive && (
        <button 
          onClick={handleUnpublishClick}
          disabled={isPending}
          className="absolute top-4 right-4 z-[100] bg-red-600 border-2 border-white/20 text-white p-3 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto flex items-center justify-center"
          style={{ cursor: 'pointer' }}
          title="Remove from marketplace"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <X size={20} strokeWidth={3} />
          )}
        </button>
      )}

      <ConfirmUnpublishModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUnpublish}
        isPending={isPending}
        dappName={dapp.name}
      />
    </motion.div>
  );
};

export default DAppCard;
