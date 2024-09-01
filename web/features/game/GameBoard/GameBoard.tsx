import { useState, useEffect, FC } from 'react';
import { Chip, ChipType, Coordinates, PlayerChips } from '../types';
import styles from './GameBoard.module.scss';
import GameCell from '../GameCell/GameCell';

interface GameBoardProps {
  chips: Chip[];
  roundStartTime: number;
  roundEndTime: number;
  currentRound: number;
  isAttackerDone: boolean;
  isRunnerDone: boolean;
  players: PlayerChips[];
  onMoveMade: (
    attackerCoords: Coordinates,
    runnerCoords: Coordinates,
    moving: Chip['type']
  ) => void;
  onInitialPlacement: (attackerChip: Chip, runnerChip: Chip) => void;
}

const GameBoard: FC<GameBoardProps> = ({
  chips,
  roundStartTime,
  roundEndTime,
  currentRound,
  isAttackerDone,
  isRunnerDone,
  players,
  onMoveMade,
  onInitialPlacement,
}) => {
  // const attackers = players.map((player) => {

  // });

  const [activeChip, setActiveChip] = useState<Chip | null>(null);
  const [playerChips, setPlayerChips] = useState<{
    attacker: Chip | null;
    runner: Chip | null;
  }>({
    attacker: null,
    runner: null,
  });
  const [boardState, setBoardState] = useState<(Chip | null)[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRoundActive, setIsRoundActive] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now < roundStartTime) {
        setTimeLeft(Math.ceil((roundStartTime - now) / 1000));
        setIsRoundActive(false);
        setActiveChip(null);
      } else if (now < roundEndTime) {
        setTimeLeft(Math.ceil((roundEndTime - now) / 1000));
        setIsRoundActive(true);
      } else {
        setTimeLeft(0);
        setIsRoundActive(false);
        setActiveChip(null);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [roundStartTime, roundEndTime]);

  useEffect(() => {
    const newBoardState = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    let newAttackerChip: Chip | null = null;
    let newRunnerChip: Chip | null = null;

    if (currentRound === 0 && !playerChips.attacker && !playerChips.runner) {
      const attackerPos = getRandomEmptyPosition(newBoardState);
      const runnerPos = getRandomEmptyPosition(newBoardState, [attackerPos]);

      newAttackerChip = {
        id: 'player-attacker',
        type: 'attacker' as ChipType,
        coordinates: attackerPos,
        score: 0,
      };
      newRunnerChip = {
        id: 'player-runner',
        type: 'runner' as ChipType,
        coordinates: runnerPos,
        score: chips.length,
      };

      newBoardState[attackerPos.y][attackerPos.x] = newAttackerChip;
      newBoardState[runnerPos.y][runnerPos.x] = newRunnerChip;

      onInitialPlacement(newAttackerChip, newRunnerChip);
    } else {
      chips.forEach((chip) => {
        const { x, y } = chip.coordinates;
        newBoardState[y][x] = chip;
        if (chip.type === 'attacker') {
          newAttackerChip = chip;
        } else if (chip.type === 'runner') {
          newRunnerChip = chip;
        }
      });
    }

    setPlayerChips({ attacker: newAttackerChip, runner: newRunnerChip });
    setBoardState(newBoardState);
  }, [
    chips,
    currentRound,
    onInitialPlacement,
    playerChips.attacker,
    playerChips.runner,
  ]);

  const getRandomEmptyPosition = (
    board: (Chip | null)[][],
    exclude: Coordinates[] = []
  ): Coordinates => {
    let x: number, y: number;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (
      board[y][x] !== null ||
      exclude.some((pos) => pos.x === x && pos.y === y)
    );
    return { x, y };
  };

  const handleCellClick = (x: number, y: number) => {
    if (!isRoundActive) return;
    console.log('🚀 ~ handleCellClick ~ activeChip:', activeChip);
    if (
      (activeChip?.type === 'attacker' && isAttackerDone) ||
      (activeChip?.type === 'runner' && isRunnerDone)
    )
      return;

    if (
      activeChip &&
      isAdjacentCell(activeChip.coordinates, { x, y }) &&
      !boardState[y][x]
    ) {
      const updatedChip: Chip = { ...activeChip, coordinates: { x, y } };
      const newBoardState = boardState.map((row) => [...row]);
      newBoardState[activeChip.coordinates.y][activeChip.coordinates.x] = null;
      newBoardState[y][x] = updatedChip;

      setBoardState(newBoardState);

      const newPlayerChips = {
        ...playerChips,
        [activeChip.type]: updatedChip,
      };
      setPlayerChips(newPlayerChips);

      if (newPlayerChips.attacker && newPlayerChips.runner) {
        onMoveMade(
          newPlayerChips.attacker.coordinates,
          newPlayerChips.runner.coordinates,
          activeChip.type
        );
      }

      setActiveChip(null);
    } else {
      const clickedChip = boardState[y][x];
      if (
        clickedChip &&
        ((clickedChip.type === 'attacker' && !isAttackerDone) ||
          (clickedChip.type === 'runner' && !isRunnerDone))
      ) {
        setActiveChip(clickedChip);
      } else {
        setActiveChip(null);
      }
    }
  };

  const isAdjacentCell = (
    coord1: Coordinates,
    coord2: Coordinates
  ): boolean => {
    const dx = Math.abs(coord1.x - coord2.x);
    const dy = Math.abs(coord1.y - coord2.y);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.info}>
        <div className={styles.round}>Round: {currentRound + 1}</div>
        <div className={styles.timer}>
          {timeLeft > 0
            ? `${timeLeft} seconds until the ${
                isRoundActive ? 'end' : 'start'
              } of the round`
            : 'Round is finished'}
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.grid}>
          {boardState.map((row, y) => (
            <div key={y} className={styles.row}>
              {row.map((cell, x) => (
                <GameCell
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  cell={cell}
                  attackers={
                    players.filter(
                      (player) =>
                        player.attacker_coord ===
                        `${String.fromCharCode(65 + y)}${x + 1}`
                    ).length
                  }
                  runners={
                    players.filter(
                      (player) =>
                        player.runner_coord ===
                        `${String.fromCharCode(65 + y)}${x + 1}`
                    ).length
                  }
                  activeChip={activeChip}
                  isRoundActive={isRoundActive}
                  isAttackerDone={isAttackerDone}
                  isRunnerDone={isRunnerDone}
                  isAdjacentCell={
                    activeChip
                      ? isAdjacentCell(activeChip.coordinates, { x, y })
                      : false
                  }
                  onCellClick={handleCellClick}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.light} />
      </div>
    </div>
  );
};

export default GameBoard;
