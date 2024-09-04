/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { AppHero } from '../ui/ui-layout';

export default function DashboardFeature() {
  return (
    <div>
      <AppHero
        title={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="/images/logo.png" width="300" alt="Jeex" />
          </div>
        }
        subtitle="Every square a battlefield, every move a strategy!"
      />

      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <p>
            Embark on a thrilling journey where every move is a calculated risk.
            Balance offense and defense to maximize your rewards in this
            exhilarating game
          </p>

          <div className="py-6">
            <Link href="/games/demo" className="btn rounded-btn btnPrimary">
              Start the Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
