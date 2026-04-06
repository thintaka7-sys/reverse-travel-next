import { MetadataRoute } from 'next';
import destinations from '@/data/destinations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tabi-sagashi.netlify.app';

  // 目的地ページを全件生成
  const destinationPages = destinations.map((dest) => ({
    url: `${baseUrl}/destination/${dest.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...destinationPages,
  ];
}
