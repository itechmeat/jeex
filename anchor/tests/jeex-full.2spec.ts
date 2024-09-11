import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Jeex } from '../target/types/jeex';
import { expect } from 'chai';

jest.setTimeout(60000); // Увеличиваем глобальный timeout до 60 секунд

describe('jeex', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Jeex as Program<Jeex>;
  const player = anchor.web3.Keypair.generate();

  // Функция для аирдропа SOL
  async function airdropSol(address: anchor.web3.PublicKey, amount: number) {
    const signature = await provider.connection.requestAirdrop(
      address,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  }

  // Выполняем аирдроп перед каждым тестом
  beforeEach(async () => {
    await airdropSol(player.publicKey, 10);
  });

  async function setupGame(
    program: Program<Jeex>,
    player: anchor.web3.Keypair
  ) {
    const gameKeypair = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .setupGame()
        .accounts({
          game: gameKeypair.publicKey,
          player: player.publicKey,
          system_program: anchor.web3.SystemProgram.programId,
        })
        .signers([gameKeypair, player])
        .rpc();
    } catch (error) {
      console.error('Error in setupGame:', error);
      throw error;
    }

    return gameKeypair;
  }

  async function placeChips(
    program: Program<Jeex>,
    game: anchor.web3.Keypair,
    player: anchor.web3.Keypair,
    attackerTile: { row: number; column: number },
    runnerTile: { row: number; column: number }
  ) {
    console.log(`Placing chips for player ${player.publicKey.toString()}:`);
    console.log(`Attacker tile: (${attackerTile.row}, ${attackerTile.column})`);
    console.log(`Runner tile: (${runnerTile.row}, ${runnerTile.column})`);
    try {
      await program.methods
        .placeChips(attackerTile, runnerTile)
        .accounts({
          game: game.publicKey,
          player: player.publicKey,
        })
        .signers([player])
        .rpc();
      console.log('Chips placed successfully');
    } catch (error) {
      console.error('Error in placeChips:', error);
      throw error;
    }
  }

  async function play(
    program: Program<Jeex>,
    game: anchor.web3.Keypair,
    player: anchor.web3.Keypair,
    attackerMove: { row: number; column: number },
    runnerMove: { row: number; column: number }
  ) {
    try {
      await program.methods
        .play(attackerMove, runnerMove)
        .accounts({
          game: game.publicKey,
          player: player.publicKey,
        })
        .signers([player])
        .rpc();
    } catch (error) {
      console.error('Error in play:', error);
      throw error;
    }
  }

  it('setup game', async () => {
    console.log('Setting up game...');
    const gameKeypair = await setupGame(program, player);

    const gameState = await program.account.game.fetch(gameKeypair.publicKey);
    console.log('Game state after setup:', gameState);

    expect(gameState.playerCount).to.equal(1);
    expect(gameState.currentRound).to.equal(0);
    expect(gameState.state).to.equal(1); // PlacingChips
    expect(gameState.board).to.eql(new Array(200).fill(0));
  });

  it('place chips', async () => {
    console.log('Setting up game for place chips test...');
    const gameKeypair = await setupGame(program, player);

    console.log('Placing chips...');
    await placeChips(
      program,
      gameKeypair,
      player,
      { row: 0, column: 0 },
      { row: 9, column: 9 }
    );

    console.log('Fetching game state...');
    const gameState = await program.account.game.fetch(gameKeypair.publicKey);
    console.log('Game state:', gameState);

    expect(gameState.playerCount).to.equal(2);
    expect(gameState.state).to.equal(1); // PlacingChips

    // Проверяем, что фишки размещены правильно
    const attackerCell = gameState.board[0];
    const runnerCell = gameState.board[199];

    console.log('Attacker cell:', attackerCell);
    console.log('Runner cell:', runnerCell);

    expect(attackerCell).to.equal(2); // Проверяем, что второй бит установлен для атакующей фишки
    expect(runnerCell).to.equal(2); // Проверяем, что второй бит установлен для убегающей фишки
  });

  it('play game', async () => {
    jest.setTimeout(30000); // Увеличиваем timeout только для этого теста

    console.log('Setting up game...');
    const gameKeypair = await setupGame(program, player);

    console.log('Placing chips for main player...');
    await placeChips(
      program,
      gameKeypair,
      player,
      { row: 0, column: 0 },
      { row: 9, column: 9 }
    );

    console.log('Simulating placing chips for other players...');
    for (let i = 1; i < 16; i++) {
      console.log(`Placing chips for player ${i}...`);
      const otherPlayer = anchor.web3.Keypair.generate();
      await airdropSol(otherPlayer.publicKey, 1);
      const attackerTile = { row: i % 5, column: i % 5 };
      const runnerTile = { row: (i + 1) % 5, column: (i + 2) % 5 };

      try {
        await placeChips(
          program,
          gameKeypair,
          otherPlayer,
          attackerTile,
          runnerTile
        );
      } catch (error) {
        console.error(`Error placing chips for player ${i}:`, error);
        // Продолжаем выполнение цикла, даже если произошла ошибка
      }
    }

    console.log('Playing the game...');
    try {
      await play(
        program,
        gameKeypair,
        player,
        { row: 1, column: 1 },
        { row: 8, column: 8 }
      );
    } catch (error) {
      console.error('Error playing the game:', error);
      throw error;
    }

    console.log('Fetching final game state...');
    const gameState = await program.account.game.fetch(gameKeypair.publicKey);
    console.log('Final game state:', gameState);

    expect(gameState.currentRound).to.equal(2);
    expect(gameState.state).to.equal(2); // Active

    // Проверяем, что фишки переместились
    expect(gameState.board[0]).to.equal(0); // Атакующая фишка должна уйти с начальной позиции
    expect(gameState.board[199]).to.equal(0); // Убегающая фишка должна уйти с начальной позиции
    expect(gameState.board[22]).to.not.equal(0); // Новая позиция атакующей фишки
    expect(gameState.board[177]).to.not.equal(0); // Новая позиция убегающей фишки
  });

  it('invalid move: tile out of bounds', async () => {
    const gameKeypair = await setupGame(program, player);

    try {
      await placeChips(
        program,
        gameKeypair,
        player,
        { row: 10, column: 0 },
        { row: 0, column: 0 }
      );
      expect.fail("should've failed but didn't ");
    } catch (error) {
      expect(error).to.be.instanceOf(anchor.AnchorError);
      const err = error as anchor.AnchorError;
      expect(err.error.errorCode.code).to.equal('InvalidTile');
    }
  });

  it('invalid move: same tile for both chips', async () => {
    const gameKeypair = await setupGame(program, player);

    try {
      await placeChips(
        program,
        gameKeypair,
        player,
        { row: 0, column: 0 },
        { row: 0, column: 0 }
      );
      expect.fail("should've failed but didn't ");
    } catch (error) {
      expect(error).to.be.instanceOf(anchor.AnchorError);
      const err = error as anchor.AnchorError;
      expect(err.error.errorCode.code).to.equal('SameTileForBothChips');
    }
  });

  // Вспомогательные функции
  function isValidTile(tile: { row: number; column: number }): boolean {
    return (
      tile.row >= 0 && tile.row < 10 && tile.column >= 0 && tile.column < 10
    );
  }

  function areSameTiles(
    tile1: { row: number; column: number },
    tile2: { row: number; column: number }
  ): boolean {
    return tile1.row === tile2.row && tile1.column === tile2.column;
  }
});
