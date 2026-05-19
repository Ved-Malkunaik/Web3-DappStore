import { useEffect } from 'react';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { DAPP_STORE_ADDRESS } from '../constants';
import DAppStoreABI from '../abi/DAppStore.json';

export const useDAppStore = () => {
  const { address } = useAccount();
  const { writeContractAsync, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  const { isLoading: isWaitingForTransaction, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: dapps, isLoading: isDAppsLoading, refetch: refetchDApps, error: readError } = useReadContract({
    address: DAPP_STORE_ADDRESS,
    abi: DAppStoreABI,
    functionName: 'getAllDApps',
  });

  // Automatically refetch after any successful transaction (listing or purchase)
  useEffect(() => {
    if (isTransactionSuccess) {
      console.log("Transaction confirmed! Refetching DApps...");
      refetchDApps();
    }
  }, [isTransactionSuccess, refetchDApps]);

  // Log transaction hash for debugging
  useEffect(() => {
    if (hash) console.log("Transaction Hash:", hash);
    if (readError) console.error("Contract Read Error:", readError);
  }, [hash, readError]);

  // List a DApp (Publish)
  const listDApp = async (name, description, demoLink, ipfsHash, price) => {
    try {
      console.log("Calling listDApp with:", { name, description, demoLink, ipfsHash, price });
      await writeContractAsync({
        address: DAPP_STORE_ADDRESS,
        abi: DAppStoreABI,
        functionName: 'listDApp',
        args: [name, description, demoLink, ipfsHash, parseEther(price.toString())],
      });
    } catch (err) {
      console.error("List error:", err);
      throw err; // Re-throw to handle in the component
    }
  };

  // Purchase a DApp (Buy)
  const purchaseDApp = async (id, price) => {
    try {
      await writeContractAsync({
        address: DAPP_STORE_ADDRESS,
        abi: DAppStoreABI,
        functionName: 'purchaseDApp',
        args: [BigInt(id)],
        value: parseEther(price.toString()),
      });
    } catch (err) {
      console.error("Purchase error:", err);
      throw err;
    }
  };

  // Unpublish a DApp
  const unpublishDApp = async (id) => {
    try {
      await writeContractAsync({
        address: DAPP_STORE_ADDRESS,
        abi: DAppStoreABI,
        functionName: 'unpublishDApp',
        args: [BigInt(id)],
      });
    } catch (err) {
      console.error("Unpublish error:", err);
      throw err;
    }
  };

  const filteredDApps = dapps ? dapps.filter(d => d.price !== parseEther('0.007')) : dapps;

  return {
    dapps: filteredDApps,
    isDAppsLoading,
    readError,
    refetchDApps,
    listDApp,
    purchaseDApp,
    unpublishDApp,
    isWritePending,
    isWaitingForTransaction,
    isTransactionSuccess,
    writeError,
  };
};

