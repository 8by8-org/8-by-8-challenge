import { FirebaseUserContextProvider } from '@/contexts/user-context/firebase-user-context-provider';
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
        <FirebaseUserContextProvider>
          <Header />
          {children}
          <Footer />
        </FirebaseUserContextProvider>
      </body>
    </html>
  );
}
