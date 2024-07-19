import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserContextProvider } from '@/contexts/user-context/user-context-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
        <AlertsContextProvider>
          <UserContextProvider>
            <Header />
            {children}
            <Footer />
          </UserContextProvider>
        </AlertsContextProvider>
      </body>
    </html>
  );
}
