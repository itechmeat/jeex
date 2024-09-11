import React from 'react';
import { LogEntry } from '../types';
import styles from './GameLog.module.scss';
import cn from 'classnames';

interface GameLogProps {
  logEntries: LogEntry[];
  playersCount: number;
  currentRound?: number;
  isFinished?: boolean;
}

const GameLog: React.FC<GameLogProps> = ({ logEntries, playersCount }) => {
  const Position = ({
    currentPosition,
    index,
  }: {
    currentPosition: number;
    index: number;
  }) => {
    const previousPositions = logEntries[index - 1]?.position ?? 0;

    if (index === 0) {
      return (
        <div>
          {currentPosition}, -{playersCount - currentPosition}
        </div>
      );
    }

    if (previousPositions > currentPosition) {
      return (
        <div>
          <span>{currentPosition}</span>
          <span>+</span>
          <span>{previousPositions - currentPosition}</span>
        </div>
      );
    }

    if (previousPositions < currentPosition) {
      return (
        <div>
          <span>{previousPositions}</span>
          <span>-</span>
          <span>{currentPosition - previousPositions}</span>
        </div>
      );
    }

    return <div>{currentPosition}</div>;
  };

  const Stat = ({
    attackers,
    runners,
    points,
  }: {
    attackers: number;
    runners: number;
    points: number;
  }) => {
    return (
      <div className={styles.stat}>
        <span className={styles.runner}>{runners}</span>
        <span className={styles.attacker}>{attackers}</span>
        {points === 0 ? (
          <span className={styles.points}>0</span>
        ) : (
          <span
            className={cn(
              styles.points,
              styles[points > 0 ? 'positive' : 'negative']
            )}
          >
            {points > 0 ? '+' : ''}
            {Math.abs(points).toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  if (!logEntries.length) return null;

  return null;

  return (
    <div className={styles.log}>
      <h2 className={styles.title}>Game Log</h2>
      <table className={styles.entries}>
        <thead>
          <tr>
            <th>Round</th>
            <th>Position</th>
            <th>Score</th>
            <th>Attack</th>
            <th>Run</th>
          </tr>
        </thead>

        <tbody>
          {logEntries.map((entry, index) => (
            <tr key={index} className={styles.row}>
              <td>
                <strong>{entry.round}</strong>
              </td>

              <td>
                <Position currentPosition={entry.position} index={index} />
              </td>

              <td>{entry.totalScore.toFixed(2)}</td>

              <td
                title={`You attacked a cell with ${
                  entry.attackerMove.runners
                } runners and ${
                  entry.attackerMove.attackers - 1
                } other attackers. Your attacker gained ${entry.attackerMove.pointsGained.toFixed(
                  2
                )} points here.`}
              >
                <Stat
                  attackers={entry.attackerMove.attackers}
                  runners={entry.attackerMove.runners}
                  points={entry.attackerMove.pointsGained}
                />
              </td>
              <td
                title={`Your runner moved to a cell with ${
                  entry.runnerMove.runners - 1
                } other runners and ${
                  entry.runnerMove.attackers
                } attackers, where it lost ${Math.abs(
                  entry.runnerMove.pointsLost
                ).toFixed(2)} points.`}
              >
                <Stat
                  attackers={entry.runnerMove.attackers}
                  runners={entry.runnerMove.runners}
                  points={-entry.runnerMove.pointsLost}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameLog;
