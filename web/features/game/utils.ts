import { Coordinates, PlayerChips } from './types';

export const generateGameInitialPlayers = (num: number): PlayerChips[] => {
  const gameBoard = [];
  const coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let i = 0; i < num; i++) {
    const player_id = i + 1;
    let attacker_coord, runner_coord;

    do {
      attacker_coord = `${coordinates[Math.floor(Math.random() * 10)]}${
        Math.floor(Math.random() * 10) + 1
      }`;
      runner_coord = `${coordinates[Math.floor(Math.random() * 10)]}${
        Math.floor(Math.random() * 10) + 1
      }`;
    } while (attacker_coord === runner_coord);

    gameBoard.push({
      player_id,
      attacker_coord,
      attacker_points: 0,
      runner_coord,
      runner_points: num + 1,
    });
  }

  return gameBoard;
};

export const convertCoordToXY = (coord: string): Coordinates => ({
  x: parseInt(coord.slice(1)) - 1,
  y: coord.charCodeAt(0) - 65,
});

export const convertXYToCoord = (xy: Coordinates): string =>
  `${String.fromCharCode(65 + xy.y)}${xy.x + 1}`;

export function updatePlayerPositions(players: PlayerChips[]): PlayerChips[] {
  const occupiedPositions = new Set<string>();

  return players.map((player) => {
    const attackerXY = convertCoordToXY(player.attacker_coord);
    const runnerXY = convertCoordToXY(player.runner_coord);

    // Get new positions
    const newAttackerXY = getNewPosition(attackerXY, occupiedPositions);
    const newRunnerXY = getNewPosition(runnerXY, occupiedPositions);

    // Convert back to string coordinates
    const newAttackerCoord = convertXYToCoord(newAttackerXY);
    const newRunnerCoord = convertXYToCoord(newRunnerXY);

    // Add new positions to occupied set
    occupiedPositions.add(newAttackerCoord);
    occupiedPositions.add(newRunnerCoord);

    return {
      ...player,
      attacker_coord: newAttackerCoord,
      runner_coord: newRunnerCoord,
    };
  });
}

function getNewPosition(
  currentXY: Coordinates,
  occupiedPositions: Set<string>
): Coordinates {
  const possibleMoves = [
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
  ];

  const validMoves = possibleMoves
    .map((move) => ({
      x: currentXY.x + move.dx,
      y: currentXY.y + move.dy,
    }))
    .filter(
      (newXY) =>
        newXY.x >= 0 &&
        newXY.x < 10 &&
        newXY.y >= 0 &&
        newXY.y < 10 &&
        !occupiedPositions.has(convertXYToCoord(newXY))
    );

  if (validMoves.length === 0) {
    // If no valid moves, stay in place
    return currentXY;
  }

  // Choose a random valid move
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
}

export function recalculateScores(players: PlayerChips[]): PlayerChips[] {
  const board: {
    [key: string]: { attackers: PlayerChips[]; runners: PlayerChips[] };
  } = {};

  // Initialize the board
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const coord = `${String.fromCharCode(65 + y)}${x + 1}`;
      board[coord] = { attackers: [], runners: [] };
    }
  }

  // Distribute chips across the cells
  players.forEach((player) => {
    board[player.attacker_coord].attackers.push(player);
    board[player.runner_coord].runners.push(player);
  });

  // Recalculate scores
  Object.values(board).forEach((cell) => {
    const { attackers, runners } = cell;
    const R = attackers.length;
    const B = runners.length;

    if (R > 0 && B > 0) {
      if (R >= B) {
        // Attackers outnumber or equal runners
        const basePoints = 5;
        const multiplier = Math.pow(2, R - 1);
        const pointsPerRunner = basePoints * multiplier;
        const totalPoints = B * pointsPerRunner;
        const pointsPerAttacker = totalPoints / R;

        runners.forEach((runner) => {
          runner.runner_points = Math.max(
            runner.runner_points - pointsPerRunner,
            0
          );
        });
        attackers.forEach((attacker) => {
          attacker.attacker_points += pointsPerAttacker;
        });
      } else {
        // Runners outnumber attackers
        const pointsPerAttacker = B * 2;

        runners.forEach((runner) => {
          runner.runner_points = Math.max(runner.runner_points - 2, 0);
        });
        attackers.forEach((attacker) => {
          attacker.attacker_points += pointsPerAttacker;
        });
      }
    }
  });

  // Round scores to two decimal places
  return players.map((player) => ({
    ...player,
    attacker_points: Math.round(player.attacker_points * 100) / 100,
    runner_points: Math.round(player.runner_points * 100) / 100,
  }));
}

export const isAdjacentCell = (
  coord1: Coordinates,
  coord2: Coordinates
): boolean => {
  const dx = Math.abs(coord1.x - coord2.x);
  const dy = Math.abs(coord1.y - coord2.y);
  return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
};
