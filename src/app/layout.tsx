import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JARVIS Command Center',
  description: 'A private command center for projects, opportunities, and approvals.',
  applicationName: 'JARVIS Command Center',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JARVIS'
  },
  icons: {
    icon: '/jarvis-icon.svg',
    apple: '/jarvis-icon.svg'
  }
};

export const viewport: Viewport = {
  themeColor: '#080d18',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
