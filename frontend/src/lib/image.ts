const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/images/placeholder.png';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return `${BACKEND_URL}${imageUrl}`;
  return imageUrl;
}
