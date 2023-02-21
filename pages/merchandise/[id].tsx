import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionPage from "../../components/MerchandisePages/Creator/[id]";
import FanCollectionPage from "../../components/MerchandisePages/Fan/[id]";
import WordToggle from "../../components/Toggle/WordToggle";

const CollectionPage = () => {
  const [isCreator, setIsCreator] = useState(false);

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

          {isCreator ? <CreatorCollectionPage /> : <FanCollectionPage />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionPage;
