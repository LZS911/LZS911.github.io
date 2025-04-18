'use client';

import { useEffect } from 'react';

interface ThemeLoaderProps {
  theme: string;
}

export function ThemeLoader({ theme }: ThemeLoaderProps) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `/theme/${theme}.min.css`;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [theme]);

  return null;
}
