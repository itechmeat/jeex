import React from 'react';
import { PlayerChips } from '../types';
import Eliminated from '@/components/Eliminated/Eliminated';
import styles from './GameLeaderBoard.module.scss';

interface GameLeaderBoardProps {
  players: PlayerChips[];
  realPlayer: PlayerChips;
  isPlayerEliminated: boolean;
}

const GameLeaderBoard: React.FC<GameLeaderBoardProps> = ({
  players,
  realPlayer,
  isPlayerEliminated,
}) => {
  const allPlayers = [realPlayer, ...players];

  const sortedPlayers = allPlayers.sort(
    (a, b) =>
      b.attacker_points +
      b.runner_points -
      (a.attacker_points + a.runner_points)
  );

  const playerRank =
    sortedPlayers.findIndex((player) => player === realPlayer) + 1;
  const totalPlayers = sortedPlayers.length;

  return (
    <div className={styles.leaderBoard}>
      <Eliminated text="Game Over" />

      {isPlayerEliminated ? (
        <Eliminated />
      ) : (
        <p className={styles.placement}>
          Your final position: {playerRank} out of {totalPlayers}
        </p>
      )}

      <h2 className={styles.subtitle}>Leader Board</h2>

      <table className={styles.leaders}>
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
          {sortedPlayers.map(
            (player, index) =>
              index < 10 && (
                <tr
                  key={player.player_id}
                  style={player === realPlayer ? { fontWeight: 'bold' } : {}}
                >
                  <td>{index + 1}</td>
                  <td>{player === realPlayer ? 'You' : player.player_id}</td>
                  <td>{player.attacker_points.toFixed(2)}</td>
                  <td>{player.runner_points.toFixed(2)}</td>
                  <td>
                    {(player.attacker_points + player.runner_points).toFixed(2)}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GameLeaderBoard;
