import { AppProps } from 'next/app';
import { useEffect } from 'react';
import hljs from 'highlight.js';
import generateMouseEffect from 'mouse-animation-effect';
import 'mouse-animation-effect/dist/index.css';
import '../styles/index.css';
import 'highlight.js/styles/github.css';

const { initMouseEffect, removeMouseEffect } = generateMouseEffect({});

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMouseEffect();

    return () => {
      removeMouseEffect();
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }, []);
  return <Component {...pageProps} />;
}
