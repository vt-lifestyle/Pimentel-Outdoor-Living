import type { Metadata } from 'next';
import './globals.css';
import { indexingEnabled, metadataBase, siteConfig, siteUrl } from './site-config';

export const metadata: Metadata = {
  metadataBase,
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  robots: {
    index: indexingEnabled,
    follow: indexingEnabled,
    googleBot: { index: indexingEnabled, follow: indexingEnabled },
  },
  icons: { icon: '/images/favicon.jpg' },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.openGraphDescription,
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    url: siteUrl ?? undefined,
    images: [{ url: siteConfig.socialImage, width: 680, height: 510, alt: siteConfig.socialImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.openGraphDescription,
    images: [siteConfig.socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
