'use client';

import dynamic from 'next/dynamic';

const GasTracker = dynamic(() => import('~/components/GasTracker'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <GasTracker />
    </main>
  );
}