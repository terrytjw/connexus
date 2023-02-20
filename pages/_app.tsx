import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useState } from "react";
import Loading from "../components/Loading";
import { Router } from "next/router";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [loading, setLoading] = useState(false);

  // for page routing loading animation
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", (url) => {
    // a hacky way to lengthen the loading animation
    setTimeout(() => {
      setLoading(false);
    }, 800);
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
