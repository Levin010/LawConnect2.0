import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/components/providers/StoreProvider';
import AuthHydrator from '@/components/providers/AuthHydrator';

export const metadata: Metadata = {
  title: 'LawConnect - Connect with Advocates',
  description: 'Connecting clients with qualified advocates for legal assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthHydrator />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
