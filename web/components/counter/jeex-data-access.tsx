'use client';

import { getJeexProgram, getJeexProgramId } from '@frenzy-tag-next/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  Cluster,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useJeexProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getJeexProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getJeexProgram(provider);

  const accounts = useQuery({
    queryKey: ['jeex', 'all', { cluster }],
    queryFn: () => program.account.game.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const setupGame = useMutation({
    mutationKey: ['jeex', 'setupGame', { cluster }],
    mutationFn: async (keypair: Keypair) => {
      const lamports = await connection.getMinimumBalanceForRentExemption(
        8 + 32 + 4 // размер структуры Game
      );
      const tx = SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: 8 + 32 + 4,
        lamports,
        programId,
      });
      const transaction = new Transaction().add(tx);
      await provider.sendAndConfirm(transaction, [keypair]);

      return program.methods
        .setupGame()
        .accounts({
          game: keypair.publicKey,
          player: provider.wallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to setup game'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    setupGame,
  };
}

export function useJeexProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useJeexProgram();

  const accountQuery = useQuery({
    queryKey: ['jeex', 'fetch', { cluster, account }],
    queryFn: () => program.account.game.fetch(account),
  });

  const setScoreMutation = useMutation({
    mutationKey: ['jeex', 'setScore', { cluster, account }],
    mutationFn: (score: number) =>
      program.methods
        .setScore(score)
        .accounts({ game: account, player: program.provider.publicKey })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    setScoreMutation,
  };
}
