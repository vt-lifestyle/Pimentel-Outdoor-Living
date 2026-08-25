import type { MetadataRoute } from 'next';
import { indexingEnabled, siteUrl } from './site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled || !siteUrl) return [];

  return [{
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }];
}

