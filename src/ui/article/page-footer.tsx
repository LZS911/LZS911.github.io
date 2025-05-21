const PageFooter = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-center text-xs opacity-50 py-4">
      © 2022 - {new Date().getFullYear()}
      <a
        rel="noopener noreferrer"
        className="hover:underline hover:bg-indigo"
        href="https://github.com/LZS911"
        target="_blank"
      >
        , LZS_911
      </a>
      , build with{' '}
      <a
        rel="noopener noreferrer"
        className="underline hover:bg-indigo"
        href="https://nextjs.org/"
        target="_blank"
      >
        Next.js
      </a>{' '}
      and{' '}
      <a
        rel="noopener noreferrer"
        className="underline hover:bg-indigo"
        href="https://vercel.com/"
        target="_blank"
      >
        Vercel
      </a>
    </footer>
  );
};

export default PageFooter;
