import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Jeex } from '../target/types/jeex';
import { expect } from 'chai';

describe('jeex', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Jeex as Program<Jeex>;

  async function setupGame(program: Program<Jeex>, player) {
    const gameKeypair = anchor.web3.Keypair.generate();

    // Create the game account manually
    const lamports =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        8 + 32 + 4 // Size of the Game struct
      );
    const tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: player.publicKey,
        newAccountPubkey: gameKeypair.publicKey,
        space: 8 + 32 + 4,
        lamports,
        programId: program.programId,
      })
    );
    await anchor.web3.sendAndConfirmTransaction(
      program.provider.connection,
      tx,
      [player.payer, gameKeypair]
    );

    // analyze the game state
    await program.methods
      .setupGame()
      .accounts({
        game: gameKeypair.publicKey,
        player: player.publicKey,
      })
      .rpc();

    return gameKeypair;
  }

  it('setup game and set score', async () => {
    const player = (program.provider as anchor.AnchorProvider).wallet;
    const gameKeypair = await setupGame(program, player);

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.player.toString()).to.eql(player.publicKey.toString());
    expect(gameState.score).to.equal(0);

    const score = 1000;
    await program.methods
      .setScore(score)
      .accounts({
        game: gameKeypair.publicKey,
        player: player.publicKey,
      })
      .rpc();

    gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.score).to.equal(score);
  });
});
