import React, { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import WordToggle from "../../components/Toggle/WordToggle";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";

const CollectionsPage = () => {
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

          {isCreator ? <CreatorCollectionsPage /> : <FanCollectionsPage />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionsPage;
