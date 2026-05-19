import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSwitchChain } from 'wagmi';
import { useDAppStore } from '../hooks/useDAppStore';
import { Upload, Rocket, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFileToIPFS } from '../utils/pinata';
import { motion } from 'framer-motion';

const Publish = () => {
  const navigate = useNavigate();
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { listDApp, isWritePending, isWaitingForTransaction, isTransactionSuccess, writeError } = useDAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const SEPOLIA_ID = 1115511;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    demoLink: '',
    price: '',
    file: null as File | null
  });

  useEffect(() => {
    (window as any).onIPFSUploadProgress = (progress: number) => {
      setUploadProgress(progress);
    };
    return () => {
      (window as any).onIPFSUploadProgress = null;
    };
  }, []);

  useEffect(() => {
    if (writeError) {
      toast.dismiss('blockchain-listing');
      toast.error((writeError as any).shortMessage || writeError.message || "Transaction failed");
    }
  }, [writeError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      toast.success(`${file.name} prepared!`, { icon: '📎' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Publishing process started...");
    console.log("Current state:", { isConnected, chainId, formData });

    if (!isConnected) {
      console.warn("Wallet not connected");
      return toast.error("Please connect your wallet");
    }
    
    const isValidChain = Number(chainId) === SEPOLIA_ID || Number(chainId) === 11155111;
    
    if (!isValidChain) {
      console.warn(`Chain mismatch! Current: ${chainId}, Expected: ${SEPOLIA_ID}`);
      // Show warning but don't block, as requested by user
      toast.error("Network mismatch detected. Attempting to proceed anyway...", { icon: '⚠️' });
    }

    if (!formData.file) {
      console.warn("No file selected");
      return toast.error("Please upload the DApp source file");
    }

    if (!formData.name || !formData.price || !formData.description) {
      console.warn("Missing required fields");
      return toast.error("Please fill in all required fields (Name, Price, Description)");
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      console.log("Uploading to IPFS... File size:", formData.file.size);
      toast.loading(`Uploading ${formData.file.name} to IPFS...`, { id: 'ipfs-upload' });
      
      const ipfsHash = await uploadFileToIPFS(formData.file);
      console.log("IPFS Upload Success. Hash:", ipfsHash);
      setUploadProgress(50);
      
      toast.success("Uploaded to IPFS!", { id: 'ipfs-upload' });
      
      setIsUploading(false);
      toast.loading("Please confirm the transaction in your wallet...", { id: 'blockchain-listing' });
      
      console.log("Calling contract listDApp...");
      await listDApp(
        formData.name,
        formData.description,
        formData.demoLink,
        ipfsHash,
        formData.price
      );
    } catch (err: any) {
      console.error("Publish error caught:", err);
      setIsUploading(false);
      setUploadProgress(0);
      toast.dismiss('ipfs-upload');
      toast.dismiss('blockchain-listing');
      
      const errorMessage = err.response?.data?.error || err.shortMessage || err.message || "Failed to publish";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.dismiss('blockchain-listing');
      toast.success("DApp live on marketplace!", { icon: '🚀' });
      navigate('/explore');
    }
  }, [isTransactionSuccess, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center space-x-6 mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
            <Rocket className="text-primary" size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Launch Your DApp</h1>
            <p className="text-white/40 font-medium">Publish your decentralized application to the global marketplace</p>
          </div>
        </div>

        {!isConnected && (
          <div className="mb-10 p-6 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center space-x-4 text-orange-400">
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold">Wallet Disconnected</p>
              <p className="text-sm opacity-80">Connect your wallet to enable deployment features.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">DApp Name</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. HyperSwap Protocol"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary/50 text-sm transition-all focus:bg-white/[0.05]"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Pricing (ETH)</label>
              <input 
                type="number"
                name="price"
                step="0.0001"
                required
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.05"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary/50 text-sm transition-all focus:bg-white/[0.05]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Elevator Pitch</label>
            <textarea 
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell the community what makes your DApp special..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary/50 text-sm transition-all focus:bg-white/[0.05] resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Live Demo / Website</label>
            <input 
              type="url"
              name="demoLink"
              required
              value={formData.demoLink}
              onChange={handleInputChange}
              placeholder="https://hyper-swap.app"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary/50 text-sm transition-all focus:bg-white/[0.05]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Source Package (.zip)</label>
            <div className="relative group">
              <input 
                type="file"
                accept=".zip"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  <Upload className="text-white/20 group-hover:text-primary transition-colors" size={28} />
                </div>
                <p className="font-bold text-lg mb-1 group-hover:text-white transition-colors">
                  {formData.file ? formData.file.name : "Choose source file"}
                </p>
                <p className="text-sm text-white/30">
                  {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : "Compressed ZIP archive required"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={!isConnected || isUploading || isWritePending || isWaitingForTransaction}
              className="w-full py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:grayscale group relative overflow-hidden"
            >
              {isUploading && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              )}
              
              <div className="flex items-center space-x-3">
                {isUploading || isWritePending || isWaitingForTransaction ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>
                      {isUploading 
                        ? `Uploading to IPFS (${uploadProgress}%)` 
                        : isWritePending 
                          ? "Check Wallet..." 
                          : "Mining Transaction..."}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-lg">Publish to Marketplace</span>
                  </>
                )}
              </div>
            </button>
            <p className="text-center text-[11px] text-white/20 mt-6 font-medium uppercase tracking-widest">
              Deployment to Sepolia Testnet is irreversible
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Publish;
