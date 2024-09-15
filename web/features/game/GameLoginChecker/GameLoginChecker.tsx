/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import { FC, PropsWithChildren } from 'react';
import { WalletButton } from '@/components/solana/solana-provider';
import { useWallet } from '@solana/wallet-adapter-react';
import GameWrapper from '../GameWrapper/GameWrapper';
import styles from './GameLoginChecker.module.scss';

const GameLoginChecker: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useWallet();

  // if (!wallet.publicKey)
  //   return (
  //     <div className={styles.WalletButtonWrapper}>
  //       <p>Please log in to play</p>
  //       <WalletButton />
  //     </div>
  //   );

  return <GameWrapper />;
};

export default GameLoginChecker;
