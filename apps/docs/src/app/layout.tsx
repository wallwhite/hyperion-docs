import '@/styles/globals.css';
import '@/styles/react-flow.css';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ModalProvider } from '@/components/modal-launcher';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Hyperion - Documentation',
  description: 'Developer-first docs with diagrams-as-code and more',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.className, 'dark')}>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <ModalProvider>{children}</ModalProvider>
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
