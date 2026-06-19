import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RoboSemi - Premium Automation & Electronics Components',
  description: 'Transform your projects with cutting-edge IoT and robotics technology. Premium automation and electronics components for professionals and innovators.',
  keywords: 'automation, electronics, IoT, robotics, arduino, raspberry pi, sensors, actuators, premium components',
  authors: [{ name: 'RoboSemi' }],
  creator: 'RoboSemi',
  publisher: 'RoboSemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}