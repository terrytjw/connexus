import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import "@biconomy/web3-auth/dist/src/style.css";
import Loading from "../components/Loading";

const LoginPage = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
      loading: () => <Loading />,
    }
  );

  return (
    <div>
      <Head>
        <title>Login | Connexus</title>
      </Head>
      <main className="flex items-center justify-center">
        <SocialLoginDynamic />
      </main>
    </div>
  );
};

export default LoginPage;
