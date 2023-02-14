// import styles from "../styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import Button from "./Button";
import { signIn } from "next-auth/react";

const Home = () => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(
    null
  );
  const [connectWeb3Loading, setConnectWeb3Loading] = useState(false);

  // console.log("account -> ", account);
  // console.log("smartAccount -> ", smartAccount);
  // console.log("scwAddress -> ", scwAddress);
  // console.log("socialLoginSDK -> ", socialLoginSDK);

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;
    console.log("socialLoginSDK ->", socialLoginSDK);

    setConnectWeb3Loading(true);

    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);
      signIn("credentials", { redirect: false, walletAddress: accounts[0] });

      return;
    }

    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      setConnectWeb3Loading(false);
      return socialLoginSDK;
    }

    const sdk = new SocialLogin();
    await sdk.init({
      chainId: ethers.utils.hexValue(80001),
    });
    setSocialLoginSDK(sdk);
    sdk.showWallet();

    setConnectWeb3Loading(false);

    return socialLoginSDK;
  }, [socialLoginSDK]);

  useEffect(() => {
    connectWeb3();
  }, []);

  // if wallet already connected close widget
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  // after metamask login -> get provider event
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
    setScwAddress("");
  };

  useEffect(() => {
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const smartAccount = new SmartAccount(provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);
      setScwLoading(false);
    }
    if (!!provider && !!account) {
      setupSmartAccount();
      console.log("Provider...", provider);
    }
  }, [account, provider]);

  return (
    <div className="">
      <main className="mt-4 flex flex-col rounded-2xl bg-white p-20">
        <h1 className="py-4">Biconomy SDK | Next.js | Web3Auth</h1>
        <button
          className="btn-outline btn"
          onClick={!account ? connectWeb3 : disconnectWeb3}
        >
          {!account ? "Login" : "Logout"}
        </button>
    <div className="mt-96 p-10">
      <h1 className="py-4 text-center font-semibold">
        Biconomy SDK | Next.js | Web3Auth
      </h1>

      <div className="flex justify-center">
        <Button
          variant="outlined"
          size="md"
          onClick={!account ? connectWeb3 : disconnectWeb3}
        >
          {!account ? "Login" : "Logout"}
        </Button>
      </div>

        {connectWeb3Loading && !socialLoginSDK && (
          <div className="bg-blue-300 p-8">connect web3 loading...</div>
        )}

        {account && (
          <div>
            <h2>EOA Address</h2>
            <p>{account}</p>
          </div>
        )}

        {scwLoading && (
          <h2 className="bg-red-300 p-8">Loading Smart Account...</h2>
        )}

        {scwAddress && (
          <div>
            <h2>Smart Account Address</h2>
            <p>{scwAddress}</p>
          </div>
        )}
      </main>
        <div className="p-2">
          <h2 className="font-semibold">Smart Account Address:</h2>
          {scwLoading && (
            <h2 className="bg-red-300 p-2">Loading Smart Account...</h2>
          )}
          {scwAddress ? <p>{scwAddress}</p> : <p>- nil -</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
