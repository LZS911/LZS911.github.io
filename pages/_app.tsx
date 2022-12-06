import { AppProps } from "next/app";
import { useEffect } from "react";
import generateMouseEffect from "mouse-animation-effect";
import "mouse-animation-effect/dist/index.css";
import "../styles/index.css";

const { initMouseEffect, removeMouseEffect } = generateMouseEffect({});

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMouseEffect();

    return () => {
      removeMouseEffect();
    };
  }, []);
  return <Component {...pageProps} />;
}
