export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '/images/set1.png';
  if (imageUrl.startsWith('http')) return imageUrl;
  // In production behind nginx, /uploads/ is proxied directly — no need to prepend backend URL
  if (imageUrl.startsWith('/uploads/')) return imageUrl;
  return imageUrl;
}
