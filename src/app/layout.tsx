import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/ui/fonts';
import { WEB_TITLE } from '@/lib/constants';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: WEB_TITLE,
  description: 'LZS Blog'
};

export default function ArticleLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
