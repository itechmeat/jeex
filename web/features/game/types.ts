export type ChipType = 'attacker' | 'runner' | 'enemy';
export interface Coordinates {
  x: number;
  y: number;
}

export interface ApiGame {
  id: string;
  created_by: string; // UUID
  created_at: string; // DATE
  started_at: string; // DATE
  status: 'waiting' | 'active' | 'finished';
}

export interface Chip {
  id: string;
  type: ChipType;
  coordinates: Coordinates;
  score: number;
}

export interface PlayerChips {
  player_id: number;
  attacker_coord: string;
  attacker_points: number;
  runner_coord: string;
  runner_points: number;
}

export interface PlayerChipsSet {
  attacker: Chip | null;
  runner: Chip | null;
}

export interface LogEntry {
  round: number;
  attackerMove: {
    coordinate: string;
    runners: number;
    attackers: number;
    pointsGained: number;
  };
  runnerMove: {
    coordinate: string;
    runners: number;
    attackers: number;
    pointsLost: number;
  };
  totalScore: number;
  position: number;
}
