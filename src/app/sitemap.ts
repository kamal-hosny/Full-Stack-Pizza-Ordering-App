import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const staticPaths = ['', 'menu', 'about', 'contact'].flatMap((p) =>
    i18n.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${p}`.replace(/\/$/, ''),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, `${baseUrl}/${l}/${p}`.replace(/\/$/, '')])
        ),
      },
    }))
  );

  return staticPaths;
}


