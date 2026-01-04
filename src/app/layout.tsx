import QueryProvider from '@/providers/QueryProviders';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import StoreProvider from '../store/StoreProvider';
import './globals.css';

import { Toaster } from 'sonner';

const geist = Geist({
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: 'Modern Store',
  description: 'The best products for you',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body className={`antialiased min-h-screen flex flex-col`}>
        <StoreProvider>
          <QueryProvider>
            {children} <Toaster position="top-right" richColors />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
