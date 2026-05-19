import React, { useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { DAPP_STORE_ADDRESS } from '../constants';
import DAppStoreABI from '../abi/DAppStore.json';
import { useDAppStore } from '../hooks/useDAppStore';
import DAppCard from '../components/DAppCard';
import { Loader, EmptyState } from '../components/Common';
import { ShoppingBag } from 'lucide-react';

const Purchases = () => {
  const { address, isConnected } = useAccount();
  const { dapps, isDAppsLoading } = useDAppStore();

  // Create contract calls for each DApp to check if the current user has purchased it
  const contracts = useMemo(() => {
    if (!dapps || !address) return [];
    return dapps.map((dapp) => ({
      address: DAPP_STORE_ADDRESS,
      abi: DAppStoreABI,
      functionName: 'hasPurchased',
      args: [dapp.id, address],
    }));
  }, [dapps, address]);

  // Execute all checks in a single multicall
  const { data: results, isLoading: isChecksLoading } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    }
  });

  // Filter dapps that have been purchased based on multicall results
  const purchasedDApps = useMemo(() => {
    if (!dapps || !results) return [];
    return dapps.filter((dapp, index) => results[index]?.result === true);
  }, [dapps, results]);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBag className="text-white/20" size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Connect your wallet</h2>
        <p className="text-white/40 max-w-sm mb-8">Please connect your wallet to view the DApps you have purchased and download your licenses.</p>
      </div>
    );
  }

  if (isDAppsLoading || isChecksLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-3">My Purchases</h1>
        <p className="text-white/40">Manage your owned DApp licenses and downloads</p>
      </div>

      {purchasedDApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {purchasedDApps.map((dapp) => (
            <DAppCard key={dapp.id.toString()} dapp={dapp} isPurchased={true} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={ShoppingBag} 
          message="No purchases found yet" 
        />
      )}
    </div>
  );
};

export default Purchases;
