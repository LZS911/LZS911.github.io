import Link from 'next/link';
import clsx from 'clsx';

interface TagListProps {
  tags: string[];
  className?: string;
  variant?: 'default' | 'small' | 'large';
}

export default function TagList({
  tags,
  className,
  variant = 'default'
}: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className={clsx(
            'inline-block rounded transition-colors',
            {
              'px-3 py-1 text-sm': variant === 'default',
              'px-2 py-0.5 text-xs': variant === 'small',
              'px-4 py-1.5 text-base': variant === 'large'
            },
            'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
          )}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
