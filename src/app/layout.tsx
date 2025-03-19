import type { Metadata } from 'next';

import '~/app/globals.css';
import { Providers } from '~/app/providers';

export const metadata: Metadata = {
  title: 'Gas Tracker',
  description: 'Gas tracker for base and mainnet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}