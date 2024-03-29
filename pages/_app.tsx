import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useState } from "react";
import Loading from "../components/Loading";
import { Router } from "next/router";
import { SessionProvider } from "next-auth/react";
import { UserRoleProvider } from "../contexts/UserRoleProvider";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [loading, setLoading] = useState(false);

  // for page routing loading animation
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", (url) => {
    // a hacky way to lengthen the loading animation
    // setTimeout(() => {
    //   setLoading(false);
    // }, 500);
    setLoading(false);
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <SessionProvider session={session}>
      <UserRoleProvider>
        <Component {...pageProps} />
      </UserRoleProvider>
    </SessionProvider>
  );
}

export default MyApp;
