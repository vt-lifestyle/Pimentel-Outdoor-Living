import type { MetadataRoute } from 'next';
import { indexingEnabled, siteUrl } from './site-config';

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled || !siteUrl) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

