/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import GameBoard from '@/features/game/GameBoard/GameBoard';
import {
  ApiGame,
  Chip,
  Coordinates,
  PlayerChips,
  ChipType,
} from '@/features/game/types';
import {
  convertCoordToXY,
  convertXYToCoord,
  generateGameInitialPlayers,
  recalculateScores,
  updatePlayerPositions,
} from '../utils';
import { useGameTimer } from '../hooks/useGameTimer';
import GameLeaderBoard from '../GameLeaderBoard/GameLeaderBoard';

const ROUND_DURATION = 10000;
const ROUND_BREAK_DURATION = 2000;
const TOTAL_ROUNDS = 10;
const GAMERS_COUNT = 100;

interface GameState {
  playerChips: Chip[];
  otherPlayers: PlayerChips[];
  isAttackerDone: boolean;
  isRunnerDone: boolean;
  currentRound: number;
  isGameActive: boolean;
}

type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'MOVE_CHIP'; payload: { type: ChipType; coordinates: Coordinates } }
  | { type: 'END_ROUND' }
  | { type: 'END_GAME' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INIT_GAME': {
      const initialPlayerChips = [
        {
          id: 'player-attacker',
          type: 'attacker' as ChipType,
          coordinates: convertCoordToXY(generateRandomCoord()),
          score: 0,
        },
        {
          id: 'player-runner',
          type: 'runner' as ChipType,
          coordinates: convertCoordToXY(generateRandomCoord()),
          score: GAMERS_COUNT,
        },
      ];
      return {
        ...state,
        playerChips: initialPlayerChips,
        otherPlayers: generateGameInitialPlayers(GAMERS_COUNT - 1),
        currentRound: 0,
        isGameActive: true,
      };
    }
    case 'MOVE_CHIP':
      return {
        ...state,
        playerChips: state.playerChips.map((chip) =>
          chip.type === action.payload.type
            ? { ...chip, coordinates: action.payload.coordinates }
            : chip
        ),
        isAttackerDone:
          action.payload.type === 'attacker' ? true : state.isAttackerDone,
        isRunnerDone:
          action.payload.type === 'runner' ? true : state.isRunnerDone,
      };
    case 'END_ROUND': {
      const updatedOtherPlayers = state.otherPlayers.map(
        (player) => updatePlayerPositions([player])[0]
      );
      const allPlayers = [
        ...updatedOtherPlayers,
        convertChipsToPlayerChips(state.playerChips),
      ];
      const recalculatedPlayers = recalculateScores(allPlayers);
      const updatedPlayerChips = state.playerChips.map((chip) => ({
        ...chip,
        score:
          chip.type === 'attacker'
            ? recalculatedPlayers[recalculatedPlayers.length - 1]
                .attacker_points
            : recalculatedPlayers[recalculatedPlayers.length - 1].runner_points,
      }));
      return {
        ...state,
        playerChips: updatedPlayerChips,
        otherPlayers: recalculatedPlayers.slice(0, -1),
        isAttackerDone: false,
        isRunnerDone: false,
        currentRound: state.currentRound + 1,
      };
    }
    case 'END_GAME':
      return {
        ...state,
        isGameActive: false,
      };
    default:
      return state;
  }
};

const generateRandomCoord = (): string => {
  const row = String.fromCharCode(65 + Math.floor(Math.random() * 10));
  const col = Math.floor(Math.random() * 10) + 1;
  return `${row}${col}`;
};

const convertChipsToPlayerChips = (chips: Chip[]): PlayerChips => {
  const attacker = chips.find((chip) => chip.type === 'attacker')!;
  const runner = chips.find((chip) => chip.type === 'runner')!;
  return {
    player_id: 0,
    attacker_coord: convertXYToCoord(attacker.coordinates),
    attacker_points: attacker.score,
    runner_coord: convertXYToCoord(runner.coordinates),
    runner_points: runner.score,
  };
};

interface GameWrapperProps {
  game: ApiGame;
}

const GameWrapper: FC<GameWrapperProps> = ({ game }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    playerChips: [],
    otherPlayers: [],
    isAttackerDone: false,
    isRunnerDone: false,
    currentRound: 0,
    isGameActive: true,
  });

  const { roundStartTime, roundEndTime, isRoundActive, timeLeft } =
    useGameTimer({
      currentRound: state.currentRound,
      setCurrentRound: useCallback(
        (action: React.SetStateAction<number>) => {
          if (typeof action === 'function') {
            const newRound = action(state.currentRound);
            if (newRound >= TOTAL_ROUNDS) {
              dispatch({ type: 'END_GAME' });
            } else {
              dispatch({ type: 'END_ROUND' });
            }
          }
        },
        [state.currentRound]
      ),
      isGameActive: state.isGameActive,
      setIsGameActive: useCallback(
        (action: React.SetStateAction<boolean>) => {
          if (typeof action === 'function') {
            const shouldEndGame = !action(state.isGameActive);
            if (shouldEndGame) {
              dispatch({ type: 'END_GAME' });
            }
          } else if (!action) {
            dispatch({ type: 'END_GAME' });
          }
        },
        [state.isGameActive]
      ),
      setIsAttackerDone: useCallback(() => {
        /* No-op */
      }, []),
      setIsRunnerDone: useCallback(() => {
        /* No-op */
      }, []),
      ROUND_DURATION,
      ROUND_BREAK_DURATION,
      TOTAL_ROUNDS,
    });

  useEffect(() => {
    dispatch({ type: 'INIT_GAME' });
  }, []);

  const handleMoveMade = useCallback(
    (
      attackerCoords: Coordinates,
      runnerCoords: Coordinates,
      moving: Chip['type']
    ) => {
      dispatch({
        type: 'MOVE_CHIP',
        payload: {
          type: moving,
          coordinates: moving === 'attacker' ? attackerCoords : runnerCoords,
        },
      });
    },
    []
  );

  if (!state.isGameActive) {
    const realPlayerChips = convertChipsToPlayerChips(state.playerChips);
    return (
      <GameLeaderBoard
        players={state.otherPlayers}
        realPlayer={realPlayerChips}
      />
    );
  }

  return (
    <div>
      <GameBoard
        playerChips={state.playerChips}
        otherPlayers={state.otherPlayers}
        roundStartTime={roundStartTime}
        roundEndTime={roundEndTime}
        currentRound={state.currentRound}
        isAttackerDone={state.isAttackerDone}
        isRunnerDone={state.isRunnerDone}
        onMoveMade={handleMoveMade}
        isRoundActive={isRoundActive}
        timeLeft={timeLeft}
      />
    </div>
  );
};

export default GameWrapper;
