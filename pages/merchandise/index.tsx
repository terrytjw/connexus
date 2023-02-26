import React, { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import WordToggle from "../../components/Toggle/WordToggle";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { swrFetcher } from "../../lib/swrFetcher";
import Loading from "../../components/Loading";

const CollectionsPage = () => {
  const [isCreator, setIsCreator] = useState(false);
  const { data: session, status } = useSession();

  console.log("session -> ", session?.user.userId);

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(
    `http://localhost:3000/api/users/${session?.user.userId}`,
    swrFetcher
  );

  console.log("user's merchandise -> ", userData?.merchandise);

  if (isLoading) return <Loading />;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          <WordToggle
            leftWord="Fan"
            rightWord="Creator"
            isChecked={isCreator}
            setIsChecked={setIsCreator}
          />

          {isCreator ? (
            <CreatorCollectionsPage />
          ) : (
            <FanCollectionsPage merchandise={userData.merchandise} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionsPage;
