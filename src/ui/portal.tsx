'use client';

import Link from 'next/link';

type Props = {
  href: string;
};

export default function PracticePortal(props: Props) {
  return (
    <Link
      href={props.href}
      className="fixed right-2 top-1/2 transform -translate-y-1/2 z-50 group"
    >
      <div className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out hover:scale-110 hover:rotate-[360deg] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-opacity-80">
        <svg
          className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </Link>
  );
}
