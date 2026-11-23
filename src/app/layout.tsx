import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JARVIS Command Center',
  description: 'A private command center for projects, opportunities, and approvals.',
  applicationName: 'JARVIS Command Center'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
