import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import "@biconomy/web3-auth/dist/src/style.css";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { data: session, status } = useSession();
  console.log("session [LOGIN PAGE] -> ", session);
  const router = useRouter();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      router.back();
    }
  }, [router, session]);

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
      <div className="flex min-h-screen items-center justify-center">
        <Button
          variant="solid"
          size="md"
          className="mt-4"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Login
        </Button>
        <Modal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen}>
          <SocialLoginDynamic />
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
