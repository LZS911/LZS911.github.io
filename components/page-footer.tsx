const PageFooter = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-center text-xs opacity-50 py-4">
      © 2022,{" "}
      <a
        rel="noopener"
        className="hover:underline hover:bg-indigo"
        href="https://github.com/LZS911"
        target="_blank"
      >
        LZS_911
      </a>
      , built with{" "}
      <a
        rel="noopener"
        className="underline hover:bg-indigo"
        href="https://nextjs.org/"
        target="_blank"
      >
        Next.js
      </a>{" "}
      and{" "}
      <a
        rel="noopener"
        className="underline hover:bg-indigo"
        href="https://vercel.com/docs"
        target="_blank"
      >
        vercel
      </a>
    </footer>
  );
};

export default PageFooter;
