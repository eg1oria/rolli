const UPLOADS_HOST = process.env.NEXT_PUBLIC_API_URL === '/api' ? '' : 'http://localhost:3002';

export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/images/set1.png';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return `${UPLOADS_HOST}${imageUrl}`;
  return imageUrl;
}
