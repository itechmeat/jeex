import { useState, useEffect, FC, useRef } from 'react';
import {
  Chip,
  ChipType,
  Coordinates,
  PlayerChips,
  PlayerChipsSet,
} from '../types';
import styles from './GameBoard.module.scss';
import GameCell from '../GameCell/GameCell';
import GameChip from '../GameChip/GameChip';
import GameStat from '../GameStat/GameStat';
import { isAdjacentCell } from '../utils';

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
  isRoundActive: boolean;
  timeLeft: number;
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
  isRoundActive,
  timeLeft,
}) => {
  const [activeChip, setActiveChip] = useState<Chip | null>(null);
  const [playerChips, setPlayerChips] = useState<PlayerChipsSet>({
    attacker: null,
    runner: null,
  });
  const [boardState, setBoardState] = useState<(Chip | null)[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))
  );
  const [cellSize, setCellSize] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateCellSize = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const calculatedCellSize = gridWidth / 10;
        setCellSize(calculatedCellSize);
      }
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);

    return () => {
      window.removeEventListener('resize', calculateCellSize);
    };
  }, []);

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

  const handleChipClick = (clickedChip: Chip) => {
    if (!isRoundActive) return;
    if (
      (clickedChip.type === 'attacker' && isAttackerDone) ||
      (clickedChip.type === 'runner' && isRunnerDone)
    )
      return;

    setActiveChip(clickedChip);
  };

  const handleCellClick = (x: number, y: number) => {
    if (!isRoundActive || !activeChip) return;
    if (
      (activeChip.type === 'attacker' && isAttackerDone) ||
      (activeChip.type === 'runner' && isRunnerDone)
    )
      return;

    if (isAdjacentCell(activeChip.coordinates, { x, y }) && !boardState[y][x]) {
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
    }
  };

  const calculateChipPosition = (x: number, y: number) => {
    return {
      transform: `translate(${x * cellSize}px, ${y * cellSize}px)`,
    };
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.info}>
        <div className={styles.round}>Round {currentRound + 1}</div>
        <div className={styles.timer}>
          {timeLeft > 0
            ? `${timeLeft} seconds until the ${
                isRoundActive ? 'end' : 'start'
              } of the round`
            : 'Round is finished'}
        </div>
      </div>

      <GameStat playerChips={playerChips} />

      <div className={styles.area}>
        <div className={styles.light} />

        <div className={styles.field}>
          <div className={styles.grid} ref={gridRef}>
            {boardState.map((row, y) => (
              <div key={y} className={styles.row}>
                {row.map((_, x) => (
                  <GameCell
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
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
                    isAdjacentCell={
                      activeChip
                        ? isAdjacentCell(activeChip.coordinates, { x, y })
                        : false
                    }
                    onCellClick={() => handleCellClick(x, y)}
                  />
                ))}
              </div>
            ))}

            {cellSize > 0 &&
              chips.map((chip) => (
                <GameChip
                  key={chip.id}
                  variant={chip.type}
                  isActive={activeChip?.id === chip.id}
                  isDisabled={
                    !isRoundActive ||
                    (isRunnerDone && chip.type === 'runner') ||
                    (isAttackerDone && chip.type === 'attacker')
                  }
                  style={calculateChipPosition(
                    chip.coordinates.x,
                    chip.coordinates.y
                  )}
                  onClick={() => handleChipClick(chip)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
