/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, FC, useRef, useMemo } from 'react';
import { Chip, Coordinates, PlayerChips, PlayerChipsSet } from '../types';
import styles from './GameBoard.module.scss';
import GameCell from '../GameCell/GameCell';
import GameChip from '../GameChip/GameChip';
import GameStat from '../GameStat/GameStat';
import { isAdjacentCell, convertXYToCoord } from '../utils';

interface GameBoardProps {
  playerChips: Chip[];
  otherPlayers: PlayerChips[];
  roundStartTime: number;
  roundEndTime: number;
  currentRound: number;
  isAttackerDone: boolean;
  isRunnerDone: boolean;
  onMoveMade: (
    attackerCoords: Coordinates,
    runnerCoords: Coordinates,
    moving: Chip['type']
  ) => void;
  isRoundActive: boolean;
  timeLeft: number;
  isSetupPhase: boolean;
  isRunnerPlaced: boolean;
  isPlayerEliminated: boolean;
  onPlaceChip: (coordinates: Coordinates) => void;
}

const GameBoard: FC<GameBoardProps> = ({
  playerChips,
  otherPlayers,
  roundStartTime,
  roundEndTime,
  currentRound,
  isAttackerDone,
  isRunnerDone,
  onMoveMade,
  isRoundActive,
  timeLeft,
  isSetupPhase,
  isRunnerPlaced,
  isPlayerEliminated,
  onPlaceChip,
}) => {
  const [activeChip, setActiveChip] = useState<Chip | null>(null);
  const [cellSize, setCellSize] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const playerChipsSet: PlayerChipsSet = useMemo(
    () => ({
      attacker: playerChips.find((chip) => chip.type === 'attacker') || null,
      runner: playerChips.find((chip) => chip.type === 'runner') || null,
    }),
    [playerChips]
  );

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

  const handleChipClick = (clickedChip: Chip) => {
    if (!isRoundActive || isPlayerEliminated) return;
    if (
      (clickedChip.type === 'attacker' && isAttackerDone) ||
      (clickedChip.type === 'runner' && isRunnerDone)
    )
      return;

    setActiveChip(clickedChip);
  };

  const handleCellClick = (x: number, y: number) => {
    if (isPlayerEliminated) return;
    if (isSetupPhase) {
      onPlaceChip({ x, y });
      return;
    }

    if (!isRoundActive || !activeChip) return;
    if (
      (activeChip.type === 'attacker' && isAttackerDone) ||
      (activeChip.type === 'runner' && isRunnerDone)
    )
      return;

    if (isAdjacentCell(activeChip.coordinates, { x, y })) {
      const newAttackerCoords =
        activeChip.type === 'attacker'
          ? { x, y }
          : playerChipsSet.attacker!.coordinates;
      const newRunnerCoords =
        activeChip.type === 'runner'
          ? { x, y }
          : playerChipsSet.runner!.coordinates;

      onMoveMade(newAttackerCoords, newRunnerCoords, activeChip.type);
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
        <div className={styles.round}>
          {isSetupPhase ? 'Setup Phase' : `Round ${currentRound + 1}`}
        </div>
        <div className={styles.timer}>
          {isPlayerEliminated
            ? 'You are eliminated'
            : isSetupPhase
            ? `${timeLeft} seconds to place your chips`
            : timeLeft > 0
            ? `${timeLeft} seconds until the ${
                isRoundActive ? 'end' : 'start'
              } of the round`
            : 'Round is finished'}
        </div>
      </div>

      {!isPlayerEliminated && <GameStat playerChips={playerChipsSet} />}

      <div className={styles.area}>
        <div className={styles.light} />

        <div className={styles.field}>
          <div className={styles.grid} ref={gridRef}>
            {Array(10)
              .fill(null)
              .map((_, y) => (
                <div key={y} className={styles.row}>
                  {Array(10)
                    .fill(null)
                    .map((_, x) => (
                      <GameCell
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        attackers={
                          otherPlayers.filter(
                            (player) =>
                              player.attacker_coord ===
                              convertXYToCoord({ x, y })
                          ).length
                        }
                        runners={
                          otherPlayers.filter(
                            (player) =>
                              player.runner_coord === convertXYToCoord({ x, y })
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
                        isSetupPhase={isSetupPhase}
                        isHighlighted={
                          isSetupPhase &&
                          !isPlayerEliminated &&
                          (!isRunnerPlaced ||
                            !playerChips.some(
                              (chip) =>
                                chip.coordinates.x === x &&
                                chip.coordinates.y === y
                            ))
                        }
                        highlightColor={isRunnerPlaced ? 'attacker' : 'runner'}
                      />
                    ))}
                </div>
              ))}

            {cellSize > 0 &&
              !isPlayerEliminated &&
              playerChips.map((chip) => (
                <GameChip
                  key={chip.id}
                  variant={chip.type}
                  isActive={activeChip?.id === chip.id}
                  isDisabled={
                    isPlayerEliminated ||
                    isSetupPhase ||
                    !isRoundActive ||
                    (chip.type === 'runner' && isRunnerDone) ||
                    (chip.type === 'attacker' && isAttackerDone)
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
