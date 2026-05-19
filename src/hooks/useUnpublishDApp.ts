import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { DAPP_STORE_ADDRESS } from '../constants';
import DAppStoreABI from '../abi/DAppStore.json';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useUnpublishDApp = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isWaitingForTransaction, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const unpublishDApp = async (id: number | bigint) => {
    try {
      const promise = writeContractAsync({
        address: DAPP_STORE_ADDRESS as `0x${string}`,
        abi: DAppStoreABI,
        functionName: 'unpublishDApp',
        args: [BigInt(id)],
      });

      toast.promise(promise, {
        loading: 'Confirming in wallet...',
        success: 'Transaction submitted!',
        error: (err: any) => err?.shortMessage || 'Transaction failed',
      });

      return await promise;
    } catch (err: any) {
      console.error('Unpublish error:', err);
      if (err?.name === 'UserRejectedRequestError') {
        toast.error('Transaction rejected');
      } else {
        toast.error(err?.shortMessage || 'Failed to unpublish');
      }
      throw err;
    }
  };

  useEffect(() => {
    if (isWaitingForTransaction) {
      toast.loading('Unpublishing DApp from marketplace...', { id: 'unpublish-status' });
    }
    if (isTransactionSuccess) {
      toast.success('DApp removed from marketplace', { id: 'unpublish-status' });
      // Invalidate queries to refetch data
      queryClient.invalidateQueries();
    }
  }, [isWaitingForTransaction, isTransactionSuccess, queryClient]);

  return {
    unpublishDApp,
    isPending: isWritePending || isWaitingForTransaction,
    isTransactionSuccess,
    writeError,
    hash,
  };
};
