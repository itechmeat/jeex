'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
  useJeexProgram,
  useJeexProgramAccount,
} from '@/components/counter/jeex-data-access';

const GameWeb3: FC = () => {
  const { publicKey } = useWallet();
  const { setupGame, accounts, program } = useJeexProgram();

  const handleStartGame = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    const newGameKeypair = Keypair.generate();

    try {
      const latestBlockhash =
        await program.provider.connection.getLatestBlockhash();

      await setupGame.mutateAsync(newGameKeypair, {
        onSuccess: async (tx) => {
          const confirmation =
            await program.provider.connection.confirmTransaction({
              signature: tx,
              ...latestBlockhash,
            });
          if (confirmation.value.err) {
            throw new Error('Transaction failed');
          }
        },
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleStartGame}>Start New Game</button>
      {accounts.data?.map((account) => (
        <GameInstance
          key={account.publicKey.toBase58()}
          account={account.publicKey}
        />
      ))}
    </div>
  );
};

export default GameWeb3;

function GameInstance({ account }: { account: PublicKey }) {
  const { accountQuery, setScoreMutation } = useJeexProgramAccount({ account });

  const handleSetScore = async (score: number) => {
    await setScoreMutation.mutateAsync(score);
  };

  if (accountQuery.isLoading) return <div>Loading game data...</div>;
  if (accountQuery.isError) return <div>Error loading game data</div>;

  const { player, score } = accountQuery.data || {};

  if (!player || !score) return <div>No player found</div>;

  return (
    <div>
      <h2>Game: {account.toBase58()}</h2>
      <p>Player: {player.toBase58()}</p>
      <p>Score: {score}</p>
      <button onClick={() => handleSetScore(score + 1)}>Increment Score</button>
    </div>
  );
}
