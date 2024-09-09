import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from '@solana/actions';
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { DEFAULT_SOL_ADDRESS } from './const';

export const GET = (req: Request) => {
  const requestUrl = new URL(req.url);

  const baseHref = new URL(`/games`, requestUrl.origin).toString();

  const payload: ActionGetResponse = {
    icon: new URL(
      '/android-chrome-512x512.png',
      new URL(req.url).origin
    ).toString(),
    title: 'Play with JEEX',
    description:
      'JEEX is a dynamic multiplayer online game in the strategy and tactics genre.',
    label: 'Start your game',
    links: {
      actions: [
        {
          label: 'Play JS game',
          href: `${baseHref}/demo`,
        },
        {
          label: 'Play WEB3 game',
          href: `${baseHref}/web3`,
        },
      ],
    },
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (error) {
      return Response.json('Invalid account provided.', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const transaction = new Transaction();

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(DEFAULT_SOL_ADDRESS),
        data: Buffer.from('JEEX game ;)', 'utf8'),
        keys: [],
      })
    );

    transaction.feePayer = account;

    const connection = new Connection(clusterApiUrl('devnet'));
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: { transaction },
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    return Response.json('An unexpected error occurred.', {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
