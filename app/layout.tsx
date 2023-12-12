import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import '@/styles/globals.css';

const title = 'Refinr';
const description =
  'Your digital Business Analyst, here to help you refine your tickets. Powered by AI.';

export const metadata: Metadata = {
  metadataBase: new URL('https://refinr'),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
