const rawSiteUrl = process.env.SITE_URL?.trim();

function normalizeProductionUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isHttp = url.protocol === 'https:' || url.protocol === 'http:';
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';

    if (!isHttp || isLocal) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteUrl = normalizeProductionUrl(rawSiteUrl);
export const indexingEnabled = process.env.ALLOW_INDEXING === 'true' && siteUrl !== null;

export const siteConfig = {
  name: 'Pimentel Outdoor Living',
  title: 'Pimentel Outdoor Living | Landscaping & Hardscaping in Bakersfield',
  description: 'Pimentel Outdoor Living provides landscape and hardscape construction in Bakersfield and Kern County, including turf, pavers, patios, irrigation, retaining walls and landscape design.',
  openGraphDescription: 'Landscape and hardscape construction for outdoor spaces across Bakersfield and Kern County.',
  socialImage: '/images/og-pimentel.webp',
  socialImageAlt: 'Completed Pimentel Outdoor Living landscape and hardscape project in Kern County',
} as const;

export const metadataBase = new URL(siteUrl ?? 'http://localhost:3000');

