import { PlayerChips } from './types';

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
