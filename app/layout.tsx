import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import '../styles/globals.css';

const title = 'InstaBio AI';
const description = 'Generate bios for your Instagram profile or business.';

export const metadata: Metadata = {
  metadataBase: new URL('https://instabioai'),
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
