import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/ui/fonts';
import { WEB_TITLE } from '@/lib/constants';
import '@/styles/globals.css';
import Portal from '@/ui/portal';

export const metadata: Metadata = {
  title: WEB_TITLE
};

export default function PageLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <main className="w-full">{children}</main>
        <Portal href="/" />
      </body>
    </html>
  );
}
