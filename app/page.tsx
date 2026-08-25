import PimentelSite from './PimentelSite';
import { business } from './content';
import { siteUrl } from './site-config';

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': siteUrl ? `${siteUrl}/#business` : undefined,
    name: business.name,
    url: siteUrl ?? undefined,
    description: 'Owner-operated landscape and hardscape construction serving Bakersfield and surrounding Kern County communities.',
    telephone: '+1-661-496-6849',
    areaServed: [{ '@type': 'City', name: 'Bakersfield, California' }, { '@type': 'AdministrativeArea', name: 'Kern County, California' }],
    sameAs: [business.instagram, business.facebook],
    additionalProperty: { '@type': 'PropertyValue', name: 'California Contractor License', value: '1144453' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Landscape and Hardscape Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Landscape Construction',
            serviceType: ['Landscape Construction', 'Artificial Turf Installation', 'Planting', 'Sod', 'Landscape Design'],
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hardscape Construction',
            serviceType: ['Hardscape Construction', 'Pavers', 'Patios', 'Concrete', 'Retaining Walls'],
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Irrigation Services',
            serviceType: ['Irrigation Installation', 'Irrigation Repair'],
          },
        },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <PimentelSite />
    </>
  );
}
