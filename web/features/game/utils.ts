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
