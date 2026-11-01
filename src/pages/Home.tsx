
import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
    LayoutGrid,
    Rocket,
    ShieldCheck,
    Zap,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import { useDAppStore } from "../hooks/useDAppStore";
import DAppCard from "../components/DAppCard";
import { EmptyState } from "../components/Common";

const FEATURE_ITEMS = [
    {
        icon: ShieldCheck,
        iconClass: "text-green-400",
        title: "On-Chain Verified",
        description:
            "Every listing is audited and tied to a unique NFT license on Sepolia.",
    },
    {
        icon: Rocket,
        iconClass: "text-primary",
        title: "Instant Delivery",
        description:
            "Automated IPFS retrieval ensures you get your code immediately after purchase.",
    },
    {
        icon: Zap,
        iconClass: "text-yellow-400",
        title: "Zero Hassle",
        description:
            "Connect your wallet and start exploring the best of Web3 in seconds.",
    },
];

const SKELETON_ITEMS = [1, 2, 3, 4];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const Home = memo(function Home() {
    const { dapps, isDAppsLoading } = useDAppStore();
    const shouldReduceMotion = useReducedMotion();

    const latestDApps = useMemo(() => {
        if (!Array.isArray(dapps)) return [];

        return dapps
            .filter((dapp) => dapp?.isActive)
            .slice()
            .reverse()
            .slice(0, 4);
    }, [dapps]);

    const motionContainer = shouldReduceMotion
        ? {}
        : {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.15 },
          };

    const motionItem = shouldReduceMotion
        ? {}
        : {
              variants: itemVariants,
          };

    return (
        <main className="space-y-32 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 mx-auto max-w-6xl overflow-hidden"
                >
                    <div className="absolute -top-[10%] -left-[10%] h-1/2 w-1/2 rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />

                    <div className="absolute bottom-0 -right-[10%] h-1/2 w-1/2 rounded-full bg-blue-600/10 blur-[120px] animate-pulse-slow" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 text-center">
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                    >
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                            <Sparkles size={14} aria-hidden="true" />
                            <span>The Next Evolution of DApps</span>
                        </div>

                        <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-8xl">
                            Curated
                            <br />
                            <span className="bg-gradient-to-r from-primary via-white to-blue-400 bg-clip-text text-transparent">
                                Web3 Excellence
                            </span>
                        </h1>

                        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/40 md:text-xl">
                            Discover, purchase, and deploy verified decentralized
                            applications. Secure transactions, instant IPFS delivery,
                            and NFT-backed licensing.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Link
                                to="/explore"
                                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-5 font-bold text-white shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-[1.03] hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
                            >
                                Browse Marketplace
                                <ArrowRight
                                    size={20}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/publish"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-5 font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                            >
                                List your DApp
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-6">
                <motion.div
                    {...motionContainer}
                    className="grid gap-8 md:grid-cols-3"
                >
                    {FEATURE_ITEMS.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <motion.article
                                key={feature.title}
                                {...motionItem}
                                className="glass group relative overflow-hidden rounded-[2.5rem] border border-white/5 p-10 transition-all duration-500 hover:border-primary/30"
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-colors duration-500 group-hover:bg-primary/10"
                                />

                                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-transform duration-500 group-hover:scale-110">
                                    <Icon
                                        size={26}
                                        className={feature.iconClass}
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="mb-4 text-2xl font-bold">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-white/40">
                                    {feature.description}
                                </p>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </section>

            {/* Latest DApps */}
            <section className="mx-auto max-w-7xl px-6 pb-12">
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                            <span
                                aria-hidden="true"
                                className="h-[2px] w-8 bg-primary"
                            />
                            New Arrivals
                        </div>

                        <h2 className="text-4xl font-black">
                            Latest Listings
                        </h2>
                    </div>

                    <Link
                        to="/explore"
                        className="group flex items-center gap-2 font-bold text-white/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        View full marketplace
                        <ArrowRight
                            size={18}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {isDAppsLoading ? (
                    <div
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                        aria-label="Loading latest listings"
                        aria-busy="true"
                    >
                        {SKELETON_ITEMS.map((item) => (
                            <div
                                key={item}
                                className="glass aspect-[4/5] animate-pulse-slow rounded-3xl border border-white/5"
                            />
                        ))}
                    </div>
                ) : latestDApps.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {latestDApps.map((dapp) => (
                            <DAppCard
                                key={dapp.id.toString()}
                                dapp={dapp}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={LayoutGrid}
                        message="Marketplace is coming soon"
                    />
                )}
            </section>
        </main>
    );
});

export default Home;
