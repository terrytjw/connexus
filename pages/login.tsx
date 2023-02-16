import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import "@biconomy/web3-auth/dist/src/style.css";

const LoginPage = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
      loading: () => <ConnectButtonLoading />,
    }
  );

  const ConnectButtonLoading = () => (
    <div className="mt-96 flex items-center justify-center">
      <span className="bg-green-300 p-8">Connect wallet button loading...</span>
    </div>
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
