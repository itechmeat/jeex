/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import React, { useReducer, useEffect, useCallback, FC, useMemo } from 'react';
import GameBoard from '@/features/game/GameBoard/GameBoard';
import {
  ApiGame,
  Chip,
  Coordinates,
  PlayerChips,
  ChipType,
  LogEntry,
} from '@/features/game/types';
import {
  convertXYToCoord,
  generateGameInitialPlayers,
  recalculateScores,
  updatePlayerPositions,
} from '../utils';
import { useGameTimer } from '../hooks/useGameTimer';
import GameLeaderBoard from '../GameLeaderBoard/GameLeaderBoard';
import GameLog from '../GameLog/GameLog';

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
  isSetupPhase: boolean;
  isRunnerPlaced: boolean;
  isPlayerEliminated: boolean;
  logEntries: LogEntry[];
}

type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'MOVE_CHIP'; payload: { type: ChipType; coordinates: Coordinates } }
  | { type: 'END_ROUND'; payload?: LogEntry }
  | { type: 'END_GAME' }
  | { type: 'PLACE_RUNNER'; payload: Coordinates }
  | { type: 'PLACE_ATTACKER'; payload: Coordinates }
  | { type: 'END_SETUP_PHASE' }
  | { type: 'ELIMINATE_PLAYER' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        playerChips: [],
        otherPlayers: generateGameInitialPlayers(GAMERS_COUNT - 1),
        currentRound: 0,
        isGameActive: true,
        logEntries: [],
        isSetupPhase: true,
        isRunnerPlaced: false,
      };
    case 'PLACE_RUNNER':
      return {
        ...state,
        playerChips: [
          ...state.playerChips,
          {
            id: 'player-runner',
            type: 'runner' as ChipType,
            coordinates: action.payload,
            score: GAMERS_COUNT,
          },
        ],
        isRunnerPlaced: true,
      };
    case 'PLACE_ATTACKER':
      return {
        ...state,
        playerChips: [
          ...state.playerChips,
          {
            id: 'player-attacker',
            type: 'attacker' as ChipType,
            coordinates: action.payload,
            score: 0,
          },
        ],
      };
    case 'END_SETUP_PHASE':
      return {
        ...state,
        isSetupPhase: false,
        isAttackerDone: true,
        isRunnerDone: true,
      };
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
      const updatedOtherPlayers = updatePlayerPositions(state.otherPlayers);
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

      const newState = {
        ...state,
        playerChips: updatedPlayerChips,
        otherPlayers: recalculatedPlayers.slice(0, -1),
        isAttackerDone: false,
        isRunnerDone: false,
        currentRound: state.currentRound + 1,
        isSetupPhase: false,
        isPlayerEliminated: !state.isAttackerDone || !state.isRunnerDone,
      };

      const newLogEntries = state.isPlayerEliminated
        ? state.logEntries
        : [...state.logEntries, createLogEntry(newState)];

      return {
        ...newState,
        logEntries: newLogEntries,
      };
    }
    case 'ELIMINATE_PLAYER':
      return {
        ...state,
        playerChips: [],
        isPlayerEliminated: true,
      };
    case 'END_GAME':
      return {
        ...state,
        isGameActive: false,
      };
    default:
      return state;
  }
};

const createLogEntry = (state: GameState): LogEntry => {
  const attackerChip = state.playerChips.find(
    (chip) => chip.type === 'attacker'
  );
  const runnerChip = state.playerChips.find((chip) => chip.type === 'runner');

  if (!attackerChip || !runnerChip) {
    return {
      round: state.currentRound,
      attackerMove: {
        coordinate: 'A1',
        runners: 0,
        attackers: 0,
        pointsGained: 0,
      },
      runnerMove: {
        coordinate: 'A1',
        runners: 0,
        attackers: 0,
        pointsLost: 0,
      },
      totalScore: 0,
      position: state.otherPlayers.length + 1,
    };
  }

  const attackerCell = convertXYToCoord(attackerChip.coordinates);
  const runnerCell = convertXYToCoord(runnerChip.coordinates);

  const attackersInAttackerCell = state.otherPlayers.filter(
    (player) => player.attacker_coord === attackerCell
  ).length;
  const runnersInAttackerCell = state.otherPlayers.filter(
    (player) => player.runner_coord === attackerCell
  ).length;

  const attackersInRunnerCell = state.otherPlayers.filter(
    (player) => player.attacker_coord === runnerCell
  ).length;
  const runnersInRunnerCell = state.otherPlayers.filter(
    (player) => player.runner_coord === runnerCell
  ).length;

  return {
    round: state.currentRound,
    attackerMove: {
      coordinate: attackerCell,
      runners: runnersInAttackerCell,
      attackers: attackersInAttackerCell,
      pointsGained: attackerChip.score,
    },
    runnerMove: {
      coordinate: runnerCell,
      runners: runnersInRunnerCell,
      attackers: attackersInRunnerCell,
      pointsLost: GAMERS_COUNT - runnerChip.score,
    },
    totalScore: attackerChip.score + runnerChip.score,
    position:
      state.otherPlayers.filter(
        (player) =>
          player.attacker_points + player.runner_points >
          attackerChip.score + runnerChip.score
      ).length + 1,
  };
};

const convertChipsToPlayerChips = (chips: Chip[]): PlayerChips => {
  if (chips.length === 0) {
    return {
      player_id: 0,
      attacker_coord: 'A1',
      attacker_points: 0,
      runner_coord: 'A1',
      runner_points: 0,
    };
  }

  const attacker = chips.find((chip) => chip.type === 'attacker');
  const runner = chips.find((chip) => chip.type === 'runner');

  return {
    player_id: 0,
    attacker_coord: attacker ? convertXYToCoord(attacker.coordinates) : 'A1',
    attacker_points: attacker ? attacker.score : 0,
    runner_coord: runner ? convertXYToCoord(runner.coordinates) : 'A1',
    runner_points: runner ? runner.score : 0,
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
    logEntries: [],
    isSetupPhase: true,
    isRunnerPlaced: false,
    isPlayerEliminated: false,
  });

  const handleEndRound = useCallback(() => {
    dispatch({ type: 'END_ROUND' });
  }, []);

  const handleEndGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, []);

  const { roundStartTime, roundEndTime, isRoundActive, timeLeft } =
    useGameTimer({
      currentRound: state.currentRound,
      setCurrentRound: useCallback(
        (action: React.SetStateAction<number>) => {
          if (typeof action === 'function') {
            const newRound = action(state.currentRound);
            if (newRound >= TOTAL_ROUNDS) {
              handleEndGame();
            } else {
              handleEndRound();
            }
          }
        },
        [state.currentRound, handleEndGame, handleEndRound]
      ),
      isGameActive: state.isGameActive,
      setIsGameActive: useCallback(
        (action: React.SetStateAction<boolean>) => {
          if (typeof action === 'function') {
            const shouldEndGame = !action(state.isGameActive);
            if (shouldEndGame) {
              handleEndGame();
            }
          } else if (!action) {
            handleEndGame();
          }
        },
        [state.isGameActive, handleEndGame]
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

  const handlePlaceChip = useCallback(
    (coordinates: Coordinates) => {
      if (!state.isRunnerPlaced) {
        dispatch({ type: 'PLACE_RUNNER', payload: coordinates });
      } else if (state.playerChips.length === 1) {
        dispatch({ type: 'PLACE_ATTACKER', payload: coordinates });
        dispatch({ type: 'END_SETUP_PHASE' });
      }
    },
    [state.isRunnerPlaced, state.playerChips.length]
  );

  const handleEndSetupPhase = useCallback(() => {
    if (state.playerChips.length !== 2) {
      dispatch({ type: 'ELIMINATE_PLAYER' });
    } else {
      dispatch({ type: 'END_SETUP_PHASE' });
    }
  }, [state.playerChips.length]);

  useEffect(() => {
    if (state.isSetupPhase && state.currentRound === 0) {
      const timer = setTimeout(() => {
        handleEndSetupPhase();
      }, ROUND_DURATION);

      return () => clearTimeout(timer);
    }
  }, [state.isSetupPhase, state.currentRound, handleEndSetupPhase]);

  const handleMoveMade = useCallback(
    (
      attackerCoords: Coordinates,
      runnerCoords: Coordinates,
      moving: Chip['type']
    ) => {
      if (state.isPlayerEliminated || state.isSetupPhase) {
        return;
      }
      dispatch({
        type: 'MOVE_CHIP',
        payload: {
          type: moving,
          coordinates: moving === 'attacker' ? attackerCoords : runnerCoords,
        },
      });
    },
    [state.isPlayerEliminated, state.isSetupPhase]
  );

  useEffect(() => {
    dispatch({ type: 'INIT_GAME' });
  }, []);

  const gameContent = useMemo(() => {
    if (!state.isGameActive) {
      const realPlayerChips = convertChipsToPlayerChips(state.playerChips);
      return (
        <>
          <GameLeaderBoard
            players={state.otherPlayers}
            realPlayer={realPlayerChips}
            isPlayerEliminated={state.isPlayerEliminated}
          />
          <GameLog
            logEntries={state.logEntries}
            playersCount={GAMERS_COUNT}
            isFinished
          />
        </>
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
          isRoundActive={isRoundActive}
          timeLeft={timeLeft}
          isSetupPhase={state.isSetupPhase}
          isRunnerPlaced={state.isRunnerPlaced}
          isPlayerEliminated={state.isPlayerEliminated}
          onPlaceChip={handlePlaceChip}
          onMoveMade={handleMoveMade}
        />
        <GameLog
          logEntries={state.logEntries}
          currentRound={state.currentRound}
          playersCount={GAMERS_COUNT}
        />
      </div>
    );
  }, [
    state,
    roundStartTime,
    roundEndTime,
    isRoundActive,
    timeLeft,
    handleMoveMade,
    handlePlaceChip,
  ]);

  return gameContent;
};

export default GameWrapper;
