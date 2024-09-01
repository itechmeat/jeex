import GameWrapper from '@/features/game/GameWrapper/GameWrapper';
import { ApiGame } from '@/features/game/types';

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = {
    id: params.id,
    created_by: 'string',
    created_at: new Date().toISOString(),
    started_at: new Date().toISOString(),
    status: 'active',
  } as ApiGame;

  return <GameWrapper game={game} />;
}
