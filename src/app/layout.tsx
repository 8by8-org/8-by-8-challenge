import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { RewardsContextProvider } from '@/contexts/rewards-context/rewards-context';
import { IDBUserContextProvider } from '@/contexts/user-context/idb-user-context-provider';
import { bebasNeue } from '@/fonts/bebas-neue';
import { lato } from '@/fonts/lato';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/main.scss';

interface RootLayoutProps {
  children?: ReactNode;
}

export const metadata: Metadata = {
  title: '8by8 Challenge',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${lato.variable}`}>
        <IDBUserContextProvider>
          <RewardsContextProvider>
            <Header />
            {children}
            <Footer />
          </RewardsContextProvider>
        </IDBUserContextProvider>
      </body>
    </html>
  );
}
