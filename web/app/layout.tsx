import './fonts.css';
import './global.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';

export async function generateMetadata() {
  return {
    title: 'JEEX - Every square a battlefield, every move a strategy!',
    openGraph: {
      images: ['https://jeex.org/images/jeex-cover.jpg'],
      title: 'JEEX - Every square a battlefield, every move a strategy!',
      description:
        'JEEX is a dynamic multiplayer online game in the strategy and tactics genre.',
    },
    other: {
      'dscvr:canvas:version': 'vNext',
      'twitter:site': '@techmeat',
    },
  };
}

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Counter', path: '/counter' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
