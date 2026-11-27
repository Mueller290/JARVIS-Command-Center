import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'JARVIS Command Center',
    short_name: 'JARVIS',
    description: 'Your private command center for projects, opportunities, and approvals.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#080d18',
    theme_color: '#080d18',
    icons: [
      { src: '/jarvis-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ]
  };
}
