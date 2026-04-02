import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROLLI — Доставка роллов в Оренбурге',
  description: 'Доставка вкусных роллов и суши по Оренбургу. Готовим из свежих ингредиентов, доставляем за 60 минут.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
