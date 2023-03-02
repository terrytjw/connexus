import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionPage from "../../components/MerchandisePages/Creator/[id]";
import FanCollectionPage from "../../components/MerchandisePages/Fan/[id]";
import WordToggle from "../../components/Toggle/WordToggle";
import { GetServerSideProps } from "next";
import axios from "axios";

const CollectionPage = ({ collectionData }: any) => {
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

          {isCreator ? (
            <CreatorCollectionPage collection={collectionData} />
          ) : (
            <FanCollectionPage collection={collectionData} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

  const { data: collectionData } = await axios.get(
    `http://localhost:3000/api/collections/${id}`
  );

  if (collectionData && Object.keys(collectionData).length === 0) {
    return {
      redirect: {
        destination: "/merchandise",
        permanent: false,
      },
    };
  }

  return {
    props: {
      collectionData,
    },
  };
};
