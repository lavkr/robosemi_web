import Head from 'next/head';
import { SEOData } from '@/utils/seo';

interface SEOHeadProps {
  seo: SEOData;
}

export function SEOHead({ seo }: SEOHeadProps) {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && (
        <meta name="keywords" content={seo.keywords.join(', ')} />
      )}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.ogTitle || seo.title} />
      <meta property="og:description" content={seo.ogDescription || seo.description} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      <meta property="og:type" content={seo.ogType || 'website'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={seo.twitterCard || 'summary'} />
      <meta name="twitter:title" content={seo.twitterTitle || seo.title} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.description} />
      {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
      
      {/* Structured Data */}
      {seo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.structuredData)
          }}
        />
      )}
    </Head>
  );
}