import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { useDAppStore } from '../hooks/useDAppStore';
import { DAPP_STORE_ADDRESS } from '../constants';
import DAppStoreABI from '../abi/DAppStore.json';
import { formatEther, shortenAddress } from '../utils/helpers';
import { Loader } from '../components/Common';
import { ExternalLink, Download, ShieldCheck, User, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getIPFSUrl } from '../utils/ipfsGateway';

const DAppDetails = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const { dapps, isDAppsLoading, purchaseDApp, isWritePending, isWaitingForTransaction, isTransactionSuccess } = useDAppStore();

  const dapp = dapps?.find(d => d.id.toString() === id);

  // Check if purchased
  const { data: isPurchased } = useReadContract({
    address: DAPP_STORE_ADDRESS,
    abi: DAppStoreABI,
    functionName: 'hasPurchased',
    args: [BigInt(id || 0), address],
    query: { enabled: !!address && !!id },
  });

  const handlePurchase = async () => {
    if (!isConnected) return toast.error("Please connect your wallet");
    if (!dapp) return;
    
    try {
      await purchaseDApp(id, formatEther(dapp.price));
    } catch (err) {
      toast.error("Transaction failed");
    }
  };

  const handleDownload = () => {
    if (!dapp?.ipfsHash) return toast.error("No IPFS hash found for this DApp");
    
    const downloadUrl = getIPFSUrl(dapp.ipfsHash);
    console.log("Downloading from:", downloadUrl);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    // The download attribute helps force a download in some browsers
    link.setAttribute('download', `${dapp.name.replace(/\s+/g, '_')}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started!");
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("Purchase successful! You can now download the DApp.");
    }
  }, [isTransactionSuccess]);

  if (isDAppsLoading) return <Loader />;
  if (!dapp) return <div className="py-20 text-center text-white/40">DApp not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video glass rounded-3xl overflow-hidden relative group">
            <iframe 
              src={dapp.demoLink}
              className="w-full h-full border-none"
              title="DApp Demo"
            />
            <div className="absolute inset-0 bg-dark/20 pointer-events-none group-hover:opacity-0 transition-opacity flex items-center justify-center">
              <p className="text-white/40 text-sm font-medium">Interactive Preview</p>
            </div>
          </div>

          <div className="glass p-10 rounded-3xl">
            <h1 className="text-4xl font-extrabold mb-6">{dapp.name}</h1>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <User size={16} className="text-primary" />
                <span className="text-xs text-white/60">Owner: {shortenAddress(dapp.owner)}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Globe size={16} className="text-primary" />
                <a href={dapp.demoLink} target="_blank" className="text-xs text-white/60 hover:text-white">Live Demo</a>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <ShieldCheck size={16} className="text-green-400" />
                <span className="text-xs text-white/60">Verified License</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">About this DApp</h3>
              <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
                {dapp.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl sticky top-28">
            <div className="mb-8">
              <span className="text-white/40 text-sm font-medium">Listing Price</span>
              <div className="text-4xl font-black text-white mt-1 flex items-baseline">
                {formatEther(dapp.price)}
                <span className="text-lg font-bold text-primary ml-2 italic">ETH</span>
              </div>
            </div>

            <div className="space-y-4">
              {isPurchased ? (
                <button 
                  onClick={handleDownload}
                  className="w-full py-5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-green-500/20"
                >
                  <Download size={20} />
                  <span>Download Package</span>
                </button>
              ) : (
                <button 
                  onClick={handlePurchase}
                  disabled={isWritePending || isWaitingForTransaction}
                  className="w-full py-5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/20"
                >
                  {isWritePending || isWaitingForTransaction ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Purchase License</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                  <span>Smart Contract</span>
                  <span className="font-mono">{shortenAddress(DAPP_STORE_ADDRESS)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>Platform Fee</span>
                  <span>2%</span>
                </div>
              </div>
            </div>

            {(isWritePending || isWaitingForTransaction) && (
              <div className="mt-6 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-start space-x-3">
                <AlertCircle size={18} className="text-primary mt-0.5 shrink-0" />
                <div className="text-[11px] text-primary/80 leading-relaxed">
                  Transaction is pending on the network. Please wait for confirmation.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAppDetails;
