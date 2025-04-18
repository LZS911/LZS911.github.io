import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/ui/fonts';
import Layout from '@/ui/article/layout';
import { WEB_TITLE } from '@/lib/constants';
import '@/styles/globals.css';
import Portal from '@/ui/portal';

export const metadata: Metadata = {
  title: WEB_TITLE,
  description: 'LZS Blog'
};

export default async function ArticleLayout({
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
        <Portal href="/practice" />
      </body>
    </html>
  );
}
