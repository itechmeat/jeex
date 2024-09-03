import React from 'react';
import { PlayerChips, Chip } from '../types';

interface GameLeaderBoardProps {
  players: PlayerChips[];
  realPlayer: {
    attacker: Chip;
    runner: Chip;
  };
}

const GameLeaderBoard: React.FC<GameLeaderBoardProps> = ({
  players,
  realPlayer,
}) => {
  const allPlayers = [
    {
      player_id: 'You',
      attacker_points: realPlayer.attacker.score,
      runner_points: realPlayer.runner.score,
    },
    ...players,
  ];

  const sortedPlayers = allPlayers.sort(
    (a, b) =>
      b.attacker_points +
      b.runner_points -
      (a.attacker_points + a.runner_points)
  );

  const playerRank =
    sortedPlayers.findIndex((player) => player.player_id === 'You') + 1;
  const totalPlayers = sortedPlayers.length;

  return (
    <div>
      <h2>Game Over - LeaderBoard</h2>
      <p>
        Your final position: {playerRank} out of {totalPlayers}
      </p>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player ID</th>
            <th>Attacker Points</th>
            <th>Runner Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr
              key={player.player_id}
              style={player.player_id === 'You' ? { fontWeight: 'bold' } : {}}
            >
              <td>{index + 1}</td>
              <td>{player.player_id}</td>
              <td>{player.attacker_points.toFixed(2)}</td>
              <td>{player.runner_points.toFixed(2)}</td>
              <td>
                {(player.attacker_points + player.runner_points).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameLeaderBoard;
