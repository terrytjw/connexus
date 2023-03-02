import React, { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import WordToggle from "../../components/Toggle/WordToggle";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Merchandise } from "@prisma/client";

type CollectionsPageProps = {
  userData: any;
  updatedMerchandise: any;
  collectionsData: any;
};
const CollectionsPage = ({
  userData,
  updatedMerchandise,
  collectionsData,
}: CollectionsPageProps) => {
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
            <CreatorCollectionsPage />
          ) : (
            <FanCollectionsPage
              merchandise={updatedMerchandise}
              collections={collectionsData}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  // use axios GET method to fetch data
  const { data: userData } = await axios.get(
    `http://localhost:3000/api/users/${userId}`
  );

  const { data: collectionsData } = await axios.get(
    `http://localhost:3000/api/collections`
  );

  const { merchandise } = userData;

  const userMerchandise = merchandise as Merchandise[];
  const updatedMerchandise = await Promise.all(
    userMerchandise.map(async (item: Merchandise) => {
      const { collectionName } = (
        await axios.get(
          `http://localhost:3000/api/collections/${item.collectionId}`
        )
      ).data;
      return { ...item, collectionName: collectionName };
    })
  );

  return {
    props: {
      userData,
      updatedMerchandise,
      collectionsData,
    },
  };
};

export default CollectionsPage;
