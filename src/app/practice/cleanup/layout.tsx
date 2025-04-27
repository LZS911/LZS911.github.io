import type { Metadata } from 'next';
import { WEB_TITLE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${WEB_TITLE} - 清理管理`
};

export default function CleanupLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
