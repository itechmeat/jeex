import React from 'react';
import { LogEntry } from '../types';

interface GameLogProps {
  logEntries: LogEntry[];
}

const GameLog: React.FC<GameLogProps> = ({ logEntries }) => {
  return (
    <div className="game-log">
      <h3>Game Log</h3>
      <div className="log-entries">
        {logEntries.map((entry, index) => (
          <div key={index} className="log-entry">
            <p>
              <strong>Round {entry.round}:</strong> You attacked a cell with{' '}
              {entry.attackerMove.runners} runners and{' '}
              {entry.attackerMove.attackers} other attackers. Each attacker
              gained {entry.attackerMove.pointsGained.toFixed(2)} points here.
              You also retreated to a cell with {entry.runnerMove.runners}{' '}
              runners and {entry.runnerMove.attackers} attackers, where each
              runner lost {entry.runnerMove.pointsLost.toFixed(2)} points. After
              this round, your game position is {entry.position} with a total of{' '}
              {entry.totalScore.toFixed(2)} points.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLog;
