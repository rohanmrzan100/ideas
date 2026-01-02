import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import QueryProvider from '@/providers/QueryProviders';

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
