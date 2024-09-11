import GameLoginChecker from '@/features/game/GameLoginChecker/GameLoginChecker';
import { ApiGame } from '@/features/game/types';

export const metadata = {
  title: 'New game on JEEX',
};

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = {
    id: params.id,
    created_by: 'string',
    created_at: new Date().toISOString(),
    started_at: new Date().toISOString(),
    status: 'active',
  } as ApiGame;

  return <GameLoginChecker />;
}
