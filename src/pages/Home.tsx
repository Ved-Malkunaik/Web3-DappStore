import React from 'react';
import { Link } from 'react-router-dom';
import { useDAppStore } from '../hooks/useDAppStore';
import DAppCard from '../components/DAppCard';
import { Loader, EmptyState } from '../components/Common';
import { LayoutGrid, Rocket, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { dapps, isDAppsLoading } = useDAppStore();

  const latestDApps = dapps 
    ? [...dapps].filter(d => d.isActive).reverse().slice(0, 4) 
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <Sparkles size={14} />
              <span>The Next Evolution of DApps</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              Curated <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-blue-400">
                Web3 Excellence
              </span>
            </h1>
            
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover, purchase, and deploy verified decentralized applications. Secure transactions, instant IPFS delivery, and NFT-backed licensing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/explore"
                className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-2xl shadow-primary/40 hover:scale-105 flex items-center justify-center gap-2"
              >
                Browse Marketplace
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/publish"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-md hover:scale-105"
              >
                List your DApp
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: <ShieldCheck className="text-green-400" />, title: "On-Chain Verified", desc: "Every listing is audited and tied to a unique NFT license on Sepolia." },
            { icon: <Rocket className="text-primary" />, title: "Instant Delivery", desc: "Automated IPFS retrieval ensures you get your code immediately after purchase." },
            { icon: <Zap className="text-yellow-400" />, title: "Zero Hassle", desc: "Connect your wallet and start exploring the best of Web3 in seconds." }
          ].map((f, i) => (
            <motion.div key={i} variants={itemVariants} className="glass p-10 rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Latest DApps */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-primary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <div className="w-8 h-[2px] bg-primary" />
              New Arrivals
            </div>
            <h2 className="text-4xl font-black">Latest Listings</h2>
          </div>
          <Link to="/explore" className="group flex items-center gap-2 text-white/60 hover:text-primary font-bold transition-colors">
            View full marketplace
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isDAppsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass rounded-3xl aspect-[4/5] animate-pulse-slow border border-white/5" />
            ))}
          </div>
        ) : latestDApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestDApps.map((dapp) => (
              <DAppCard key={dapp.id.toString()} dapp={dapp} />
            ))}
          </div>
        ) : (
          <EmptyState icon={LayoutGrid} message="Marketplace is coming soon" />
        )}
      </section>
    </div>
  );
};

export default Home;
