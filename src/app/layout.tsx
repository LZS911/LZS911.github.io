import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/ui/fonts';
import Layout from '@/ui/components/layout';
import { WEB_TITLE } from '@/lib/constants';
import '@/styles/globals.css';
import 'highlight.js/styles/github.css';

export const metadata: Metadata = {
  title: WEB_TITLE,
  description: 'LZS Blog'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
