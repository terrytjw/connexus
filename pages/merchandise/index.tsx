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

type CollectionsPageProps = {
  userData: any;
};
const CollectionsPage = ({ userData }: CollectionsPageProps) => {
  const [isCreator, setIsCreator] = useState(false);

  const { merchandise } = userData;

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
            <FanCollectionsPage merchandise={merchandise} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionsPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  // use axios GET method to fetch data
  const { data: userData } = await axios.get(
    `http://localhost:3000/api/users/${userId}`
  );

  return {
    props: {
      userData,
    },
  };
};
