'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from '@/features/game/GameBoard/GameBoard';
import { ApiGame, Chip, Coordinates, PlayerChips } from '@/features/game/types';
import {
  convertCoordToXY,
  convertXYToCoord,
  generateGameInitialPlayers,
  recalculateScores,
  updatePlayerPositions,
} from '../utils';
import { useGameState } from '../hooks/useGameState';
import { useGameTimer } from '../hooks/useGameTimer';

const ROUND_DURATION = 10000;
const ROUND_BREAK_DURATION = 2000;
const TOTAL_ROUNDS = 10;
const GAMERS_COUNT = 99;

interface GameWrapperProps {
  game: ApiGame;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ game }) => {
  const [players, setPlayers] = useState<PlayerChips[]>(() =>
    generateGameInitialPlayers(GAMERS_COUNT)
  );

  const {
    chips,
    setChips,
    isAttackerDone,
    setIsAttackerDone,
    isRunnerDone,
    setIsRunnerDone,
    currentRound,
    setCurrentRound,
    isGameActive,
    setIsGameActive,
  } = useGameState();

  const {
    roundStartTime,
    roundEndTime,
    isRoundActive,
    timeLeft,
    // startNextRound,
  } = useGameTimer({
    currentRound,
    setCurrentRound,
    isGameActive,
    setIsGameActive,
    setIsAttackerDone,
    setIsRunnerDone,
    ROUND_DURATION,
    ROUND_BREAK_DURATION,
    TOTAL_ROUNDS,
  });

  useEffect(() => {
    if (currentRound > 0) {
      // Update positions only for generated players
      const updatedPlayers = players.map((player, index) =>
        index >= 2 ? updatePlayerPositions([player])[0] : player
      );
      const recalculatedPlayers = recalculateScores(updatedPlayers);
      setPlayers(recalculatedPlayers);

      // Update chips for the main player
      setChips((prevChips) =>
        prevChips.map((chip) => {
          const playerIndex = chip.type === 'attacker' ? 0 : 1;
          return {
            ...chip,
            score:
              chip.type === 'attacker'
                ? recalculatedPlayers[playerIndex].attacker_points
                : recalculatedPlayers[playerIndex].runner_points,
          };
        })
      );
    }
  }, [currentRound]);

  useEffect(() => {
    if (currentRound === 0 && chips.length === 0) {
      const initialChips = players.slice(0, 2).map(
        (player, index) =>
          ({
            id: `player-${index === 0 ? 'attacker' : 'runner'}`,
            type: index === 0 ? 'attacker' : 'runner',
            coordinates: convertCoordToXY(
              index === 0 ? player.attacker_coord : player.runner_coord
            ),
            score: index === 0 ? player.attacker_points : player.runner_points,
          } as Chip)
      );
      setChips(initialChips);
    }
  }, [currentRound, chips, players, setChips]);

  const handleMoveMade = useCallback(
    (
      attackerCoords: Coordinates,
      runnerCoords: Coordinates,
      moving: Chip['type']
    ) => {
      // Update chip positions
      setChips((prevChips) =>
        prevChips.map((chip) =>
          chip.type === 'attacker'
            ? { ...chip, coordinates: attackerCoords }
            : chip.type === 'runner'
            ? { ...chip, coordinates: runnerCoords }
            : chip
        )
      );

      // Mark the moved chip as done
      if (moving === 'attacker') {
        setIsAttackerDone(true);
      }
      if (moving === 'runner') {
        setIsRunnerDone(true);
      }

      // Update player positions and recalculate scores
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player, index) =>
          index < 2
            ? {
                ...player,
                attacker_coord: convertXYToCoord(attackerCoords),
                runner_coord: convertXYToCoord(runnerCoords),
              }
            : player
        );
        return recalculateScores(updatedPlayers);
      });
    },
    [setChips, setIsAttackerDone, setIsRunnerDone]
  );

  const handleInitialPlacement = useCallback(
    (attackerChip: Chip, runnerChip: Chip) => {
      setChips([attackerChip, runnerChip]);
    },
    [setChips]
  );

  useEffect(() => {
    if (isRoundActive) {
      setIsAttackerDone(false);
      setIsRunnerDone(false);
    }
  }, [isRoundActive, setIsAttackerDone, setIsRunnerDone]);

  if (!isGameActive) {
    return <div>Game over!</div>;
  }

  return (
    <div>
      <GameBoard
        chips={chips}
        roundStartTime={roundStartTime}
        roundEndTime={roundEndTime}
        currentRound={currentRound}
        isAttackerDone={isAttackerDone}
        isRunnerDone={isRunnerDone}
        players={players}
        onMoveMade={handleMoveMade}
        onInitialPlacement={handleInitialPlacement}
        isRoundActive={isRoundActive}
        timeLeft={timeLeft}
      />
    </div>
  );
};

export default GameWrapper;
