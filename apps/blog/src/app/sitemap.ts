import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://blog.chanoo.org',
      lastModified: new Date()
    },
    {
      url: 'https://blog.chanoo.org/post',
      lastModified: new Date()
    },
    {
      url: 'https://blog.chanoo.org/series',
      lastModified: new Date()
    }
  ];
}
