export default function sitemap() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
  ];
}
